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
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

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
    
    const openDatePicker = () => setIsDatePickerOpen(true);

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
                                value={selectedDate ? selectedDate.toLocaleDateString('vi-VN') : ''}
                                onClick={openDatePicker}
                                readOnly
                                placeholder="Chọn ngày sinh"
                                className="text-lg text-gray-800 bg-white px-4 py-2 focus:ring-2 focus:ring-pink-400  w-full cursor-pointer transition-all duration-200 "
                            />
                            <button type="button" onClick={openDatePicker} tabIndex={-1}
                                className="flex items-center justify-center px-4 bg-white focus:ring-2 focus:ring-pink-400 transition-colors">
                                <CalendarIcon />
                            </button>
                            {/* DatePicker popup */}
                            {isDatePickerOpen && (
                                <div className="absolute left-1/2 -translate-x-1/2 top-[110%] z-[120] w-[340px] max-w-[98vw]">
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => { handleDateChange(date); setIsDatePickerOpen(false); }}
                                        dateFormat="dd/MM/yyyy"
                                        inline
                                        onClickOutside={() => setIsDatePickerOpen(false)}
                                        locale="vi"
                                        calendarClassName="custom-datepicker-modal"
                                    />
                                </div>
                            )}
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
                .custom-datepicker-modal {
                    border-radius: 1.25rem !important;
                    border: 2.5px solid #FF086A !important;
                    box-shadow: 0 12px 36px 0 rgba(255,8,106,0.13), 0 6px 12px -2px #fbb6ce;
                    background: #fff;
                    font-family: inherit;
                    font-size: 1.08rem;
                    min-width: 320px;
                    padding: 0.7rem 0.7rem 0.3rem 0.7rem;
                }
                .custom-datepicker-modal .react-datepicker__header {
                    background: #FFF1F6;
                    border-bottom: 1.5px solid #FFB6D5;
                    border-radius: 1.25rem 1.25rem 0 0;
                    padding-top: 1.1rem;
                    padding-bottom: 0.7rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .custom-datepicker-modal .react-datepicker__current-month {
                    color: #FF086A;
                    font-weight: 700;
                    font-size: 1.13rem;
                    letter-spacing: 0.01em;
                    margin-bottom: 0.2rem;
                    text-align: center;
                }
                .custom-datepicker-modal .react-datepicker__day-names {
                    display: flex;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-bottom: 0.1rem;
                }
                .custom-datepicker-modal .react-datepicker__day-name {
                    color: #FF086A;
                    font-weight: 600;
                    font-size: 1.05rem;
                    min-width: 2.1rem;
                    text-align: center;
                    padding: 0.1rem 0;
                    border-radius: 0.4rem;
                    background: none;
                }
                .custom-datepicker-modal .react-datepicker__week {
                    display: flex;
                    justify-content: center;
                    gap: 0.5rem;
                }
                .custom-datepicker-modal .react-datepicker__day {
                    min-width: 2.1rem;
                    height: 2.1rem;
                    line-height: 2.1rem;
                    text-align: center;
                    margin: 0 0.05rem;
                    font-size: 1.05rem;
                    border-radius: 0.7rem;
                    transition: background 0.15s, color 0.15s;
                }
                .custom-datepicker-modal .react-datepicker__day--selected,
                .custom-datepicker-modal .react-datepicker__day--keyboard-selected {
                    background: linear-gradient(90deg, #FF086A 0%, #FB5D5D 100%);
                    color: #fff !important;
                    border-radius: 0.7rem;
                    font-weight: 700;
                    box-shadow: 0 2px 8px 0 #ffb6d5a0;
                }
                .custom-datepicker-modal .react-datepicker__day:hover {
                    background: #FFD6E7 !important;
                    color: #FF086A !important;
                    border-radius: 0.7rem;
                    font-weight: 700;
                }
                .custom-datepicker-modal .react-datepicker__navigation {
                    top: 1.1rem;
                    width: 2.4rem;
                    height: 2.4rem;
                    border-radius: 50%;
                    background: #fff0;
                    transition: background 0.2s;
                }
                .custom-datepicker-modal .react-datepicker__navigation:hover {
                    background: #FFE4F1;
                }
                .custom-datepicker-modal .react-datepicker__navigation-icon::before {
                    border-width: 0.3rem 0.3rem 0 0;
                    border-color: #FF086A;
                }
                .custom-datepicker-modal .react-datepicker__navigation--previous {
                    left: 1.1rem;
                }
                .custom-datepicker-modal .react-datepicker__navigation--next {
                    right: 1.1rem;
                }
                .custom-datepicker-modal .react-datepicker__day--today {
                    border-bottom: 2.5px solid #FF086A;
                }
            `}</style>
        </div>
    );
}