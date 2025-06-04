// src/components/UserInfoModal.tsx
"use client";

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { adminUpdateUserByAdmin } from '@/services/api'; // Đảm bảo path đúng

// Import locale tiếng Việt cho DatePicker
import { vi } from 'date-fns/locale/vi'; 
registerLocale('vi', vi);

// Calendar Icon SVG
const CalendarIcon = () => (
    <svg className="h-5 w-5 text-gray-500 hover:text-pink-600 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
);

export interface UserInfoModalProps {
    userToEdit: UserDetailDTO;
    onUpdateSuccess: (updatedUser: UserResponse) => void;
    onClose: () => void;
}

export default function UserInfoModal({ userToEdit, onUpdateSuccess, onClose }: UserInfoModalProps) {
    const [formData, setFormData] = useState<UpdateProfileDTO>({
        tenND: userToEdit.tenND || "",
        ngaySinh: userToEdit.ngaySinh ? userToEdit.ngaySinh.split('T')[0] : "", 
        diaChi: userToEdit.diaChi || "",
        cccd: userToEdit.cccd || "",
        sdt: userToEdit.sdt || "",
        email: userToEdit.email || "",
    });

    const parseDateString = (dateString: string | null | undefined): Date | null => {
        if (!dateString) return null;
        const parts = dateString.split('-');
        if (parts.length === 3) {
            return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        }
        const slashParts = dateString.split('/');
        if (slashParts.length === 3) {
             return new Date(parseInt(slashParts[2]), parseInt(slashParts[1]) - 1, parseInt(slashParts[0]));
        }
        return null;
    };

    const [selectedDate, setSelectedDate] = useState<Date | null>(parseDateString(userToEdit.ngaySinh));
    const datePickerRef = useRef<DatePicker | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const dob = userToEdit.ngaySinh;
        setSelectedDate(parseDateString(dob));
        setFormData({
            tenND: userToEdit.tenND || "",
            ngaySinh: dob ? dob.split('T')[0] : "",
            diaChi: userToEdit.diaChi || "",
            cccd: userToEdit.cccd || "",
            sdt: userToEdit.sdt || "",
            email: userToEdit.email || "",
        });
    }, [userToEdit]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        if (date) {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            setFormData((prev) => ({ ...prev, ngaySinh: `${year}-${month}-${day}` }));
        } else {
            setFormData((prev) => ({ ...prev, ngaySinh: "" }));
        }
    };
    
    const openDatePicker = () => {
        if (datePickerRef.current) {
            datePickerRef.current.setOpen(true);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const payload: UpdateProfileDTO = {};
        // Chỉ thêm vào payload nếu giá trị thực sự thay đổi và không phải là chuỗi rỗng (trừ khi bạn muốn cho phép xóa giá trị)
        if (formData.tenND !== userToEdit.tenND) payload.tenND = formData.tenND;
        if (formData.cccd !== userToEdit.cccd) payload.cccd = formData.cccd;
        if (formData.diaChi !== userToEdit.diaChi) payload.diaChi = formData.diaChi;
        if (formData.sdt !== userToEdit.sdt) payload.sdt = formData.sdt;
        
        const currentNgaySinhDB = userToEdit.ngaySinh ? userToEdit.ngaySinh.split('T')[0] : "";
        if (formData.ngaySinh && formData.ngaySinh !== currentNgaySinhDB) payload.ngaySinh = formData.ngaySinh;
        
        if (formData.email !== userToEdit.email) payload.email = formData.email;
        
        const cleanedPayload = Object.fromEntries(
             Object.entries(payload).filter(([, value]) => value !== undefined) // Chỉ cần không phải undefined là được để cho phép gửi chuỗi rỗng nếu muốn xóa
        ) as UpdateProfileDTO;

        if (Object.keys(cleanedPayload).length === 0) {
            // setError("Không có thông tin nào thay đổi để cập nhật."); // Hoặc chỉ cần đóng modal
            setIsLoading(false);
            onClose(); 
            return;
        }
        
        if (cleanedPayload.cccd && !/^(\d{9}|\d{12})$/.test(cleanedPayload.cccd)) {
            setError("CCCD phải có 9 hoặc 12 chữ số."); setIsLoading(false); return;
        }
        if (cleanedPayload.sdt && !/^0\d{9}$/.test(cleanedPayload.sdt)) {
            setError("Số điện thoại không hợp lệ (phải có 10 chữ số, bắt đầu bằng 0)."); setIsLoading(false); return;
        }

        try {
            const updatedUser = await adminUpdateUserByAdmin(userToEdit.maND, cleanedPayload);
            onUpdateSuccess(updatedUser);
            onClose();
        } catch (err: any) {
            setError(err.message || "Lỗi khi cập nhật thông tin người dùng.");
            console.error("Update user error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4 transition-opacity duration-300">
            {/* Mở rộng modal: max-w-5xl (lớn hơn) và lg:w-[80%] */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-xl md:max-w-3xl lg:max-w-5xl xl:w-[70%] transform transition-all duration-300 scale-95 opacity-0 animate-modalShow">
                <div className="flex justify-center items-center mb-6 pb-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#FF086A]">Cập Nhật Thông Tin Cá Nhân</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    {/* Full Name */}
                    <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200">
                        <label htmlFor="tenNDModal" className="w-full sm:w-1/3 md:w-1/4 text-lg font-medium text-gray-600 mb-1 sm:mb-0">Họ và tên</label>
                        <input type="text" name="tenND" id="tenNDModal" value={formData.tenND || ''} onChange={handleChange} 
                               className="w-full sm:w-2/3 md:w-3/4 text-lg text-gray-800 bg-transparent focus:outline-none pl-0 sm:pl-2 py-1"/>
                    </div>
                    {/* Date of Birth */}
                    <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200">
                        <label htmlFor="ngaySinhDisplay" className="w-full sm:w-1/3 md:w-1/4 text-lg font-medium text-gray-600 mb-1 sm:mb-0">Ngày sinh</label>
                        <div className="w-full sm:w-2/3 md:w-3/4 relative flex items-center pl-0 sm:pl-2">
                            <input 
                                id="ngaySinhDisplay"
                                type="text" 
                                value={selectedDate ? selectedDate.toLocaleDateString('vi-VN') : 'dd/mm/yyyy'}
                                onClick={openDatePicker}
                                readOnly
                                className="text-lg text-gray-800 bg-transparent focus:outline-none w-full cursor-pointer py-1"
                            />
                            <button type="button" onClick={openDatePicker} className="ml-auto pl-2">
                                <CalendarIcon />
                            </button>
                            {/* DatePicker sẽ hiển thị như một popup khi được kích hoạt */}
                             <div className="absolute top-full left-0 z-[110] mt-1" style={{ display: datePickerRef.current?.isCalendarOpen() ? 'block' : 'none' }}>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={handleDateChange}
                                    dateFormat="dd/MM/yyyy"
                                    ref={datePickerRef}
                                    inline 
                                    onClickOutside={() => datePickerRef.current?.setOpen(false)}
                                    locale="vi"
                                />
                            </div>
                        </div>
                    </div>
                     {/* Address */}
                    <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200">
                        <label htmlFor="diaChiModal" className="w-full sm:w-1/3 md:w-1/4 text-lg font-medium text-gray-600 mb-1 sm:mb-0">Địa chỉ</label>
                        <input type="text" name="diaChi" id="diaChiModal" value={formData.diaChi || ''} onChange={handleChange}
                               className="w-full sm:w-2/3 md:w-3/4 text-lg text-gray-800 bg-transparent focus:outline-none pl-0 sm:pl-2 py-1"/>
                    </div>
                     {/* National ID Card */}
                    <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200">
                        <label htmlFor="cccdModal" className="w-full sm:w-1/3 md:w-1/4 text-lg font-medium text-gray-600 mb-1 sm:mb-0">Số CCCD/CMND</label>
                        <input type="text" name="cccd" id="cccdModal" value={formData.cccd || ''} onChange={handleChange} 
                               className="w-full sm:w-2/3 md:w-3/4 text-lg text-gray-800 bg-transparent focus:outline-none pl-0 sm:pl-2 py-1"/>
                    </div>
                     {/* Phone Number */}
                    <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200">
                        <label htmlFor="sdtModal" className="w-full sm:w-1/3 md:w-1/4 text-lg font-medium text-gray-600 mb-1 sm:mb-0">Số điện thoại</label>
                        <input type="tel" name="sdt" id="sdtModal" value={formData.sdt || ''} onChange={handleChange} 
                               className="w-full sm:w-2/3 md:w-3/4 text-lg text-gray-800 bg-transparent focus:outline-none pl-0 sm:pl-2 py-1"/>
                    </div>
                    {/* Email */}
                    <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200">
                        <label htmlFor="emailModal" className="w-full sm:w-1/3 md:w-1/4 text-lg font-medium text-gray-600 mb-1 sm:mb-0">Email</label>
                        <div className="w-full sm:w-2/3 md:w-3/4 relative flex items-center pl-0 sm:pl-2">
                            <input type="email" name="email" id="emailModal" value={formData.email || ''} onChange={handleChange} 
                                className="text-lg text-gray-800 bg-transparent focus:outline-none w-full py-1"/>
                        </div>
                    </div>
                    
                    {error && <p className="text-red-500 text-xs mt-2 text-center bg-red-50 p-2 rounded">{error}</p>}

                    <div className="pt-6 flex flex-col sm:flex-row justify-center items-center sm:space-x-4 space-y-3 sm:space-y-0">
                        <button type="button" onClick={onClose}
                                className="w-full sm:w-auto px-8 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold text-lg uppercase transition-colors">
                            HỦY
                        </button>
                        <button type="submit" disabled={isLoading}
                                className="w-full sm:w-auto px-8 py-2.5 bg-[#FF086A] text-white rounded-lg hover:bg-pink-700 disabled:opacity-60 font-semibold text-lg uppercase flex items-center justify-center transition-colors">
                            {isLoading ? 'ĐANG CẬP NHẬT...' : 'CẬP NHẬT'}
                        </button>
                    </div>
                </form>
            </div>
            {/* CSS cho animation và DatePicker */}
            <style jsx global>{`
                @keyframes modalShow {
                    from { opacity: 0; transform: scale(0.95) translateY(-20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-modalShow {
                    animation: modalShow 0.3s ease-out forwards;
                }
                .react-datepicker-popper {
                    z-index: 150 !important; 
                }
                .react-datepicker {
                    font-family: inherit; /* Kế thừa font từ trang */
                    font-size: 0.9rem;
                    border-radius: 0.5rem; /* rounded-lg */
                    border: 1px solid #d1d5db; /* border-gray-300 */
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
                }
                .react-datepicker__header {
                    background-color: #FFF1F2; /* Màu hồng rất nhạt */
                    border-bottom: 1px solid #FCE7F3; /* Màu hồng nhạt hơn */
                }
                .react-datepicker__current-month,
                .react-datepicker-time__header,
                .react-datepicker__day-name {
                    color: #9D174D; /* Màu chữ hồng đậm */
                    font-weight: 600;
                }
                .react-datepicker__day--selected,
                .react-datepicker__day--keyboard-selected,
                .react-datepicker__month-text--selected,
                .react-datepicker__month-text--keyboard-selected {
                    background-color: #FF086A !important;
                    color: white !important;
                }
                .react-datepicker__day:hover,
                .react-datepicker__month-text:hover {
                    background-color: #FFD6E7 !important;
                    border-radius: 0.375rem; /* rounded-md */
                }
                .react-datepicker__navigation {
                    top: 0.6rem;
                }
                .react-datepicker__navigation--previous {
                    border-right-color: #D1D5DB;
                }
                .react-datepicker__navigation--next {
                     border-left-color: #D1D5DB;
                }
                .react-datepicker__navigation:hover *::before {
                    border-color: #9D174D;
                }
            `}</style>
        </div>
    );
}