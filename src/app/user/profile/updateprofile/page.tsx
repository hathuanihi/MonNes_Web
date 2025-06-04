"use client";

import React, { useState, useRef, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import UserHeader from "@/components/header/UserHeader";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { userGetProfile, userUpdateProfile } from "@/services/api";

import { vi } from 'date-fns/locale/vi'; 
registerLocale('vi', vi);
setDefaultLocale('vi');

const CalendarIcon = () => ( 
    <svg className="h-5 w-5 text-gray-500 group-hover:text-pink-600 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
);

export default function UpdateProfilePage() {
    const router = useRouter();
    const [formData, setFormData] = useState<UpdateProfileDTO>({
        tenND: "",
        ngaySinh: "", 
        diaChi: "",
        cccd: "",
        sdt: "",
        email: "", 
    });

    const parseDateString = (dateString: string | null | undefined): Date | null => {
        if (!dateString) return null;
        const partsYMD = dateString.split('-'); 
        if (partsYMD.length === 3) {
            return new Date(parseInt(partsYMD[0]), parseInt(partsYMD[1]) - 1, parseInt(partsYMD[2]));
        }
        const partsDMY = dateString.split('/');
        if (partsDMY.length === 3) {
             return new Date(parseInt(partsDMY[2]), parseInt(partsDMY[1]) - 1, parseInt(partsDMY[0]));
        }
        return null;
    };

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const datePickerRef = useRef<DatePicker | null>(null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const USER_HEADER_HEIGHT = '5rem';

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await userGetProfile();
                setFormData({
                    tenND: data.tenND || "",
                    ngaySinh: data.ngaySinh ? data.ngaySinh.split('T')[0] : "", 
                    diaChi: data.diaChi || "",
                    cccd: data.cccd || "",
                    sdt: data.sdt || "",
                    email: data.email || "", 
                });
                setSelectedDate(parseDateString(data.ngaySinh));
            } catch (err: any) {
                setError(err.message || "Không thể tải thông tin hồ sơ.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError(null); 
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        setIsDatePickerOpen(false); 
        if (date) {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            setFormData((prev) => ({ ...prev, ngaySinh: `${year}-${month}-${day}` }));
        } else {
            setFormData((prev) => ({ ...prev, ngaySinh: "" }));
        }
    };

    const toggleDatePicker = () => setIsDatePickerOpen(!isDatePickerOpen);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!formData.tenND?.trim()) { setError("Họ tên không được để trống."); return; }
        if (formData.cccd && !/^(\d{9}|\d{12})$/.test(formData.cccd)) { 
            setError("CCCD không hợp lệ (9 hoặc 12 số)."); return; 
        }
        if (formData.sdt && !/^0\d{9}$/.test(formData.sdt)) { 
            setError("Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)."); return; 
        }

        setIsSubmitting(true);
        try {
            const dataToUpdate: UpdateProfileDTO = {
                tenND: formData.tenND,
                diaChi: formData.diaChi,
                cccd: formData.cccd,
                sdt: formData.sdt,
                ngaySinh: formData.ngaySinh || undefined, 
            };
            
            await userUpdateProfile(dataToUpdate);
            setSuccessMessage("Cập nhật thông tin thành công!");
            if(typeof window !== "undefined") localStorage.setItem("profileUpdateStatus", "success");
            setTimeout(() => {
                router.push("/user/profile");
            }, 1500);

        } catch (err: any) {
            setError(err.message || "Cập nhật hồ sơ thất bại. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
             <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB]">
                <div className="fixed top-0 left-0 right-0 z-[100]"><UserHeader /></div>
                <div className="flex-1 flex justify-center items-center pt-16">
                    <p className="text-lg text-white">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    const handleCancel = () => {
        router.push("/user/profile");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB]">
            <div className="fixed top-0 left-0 right-0 z-[100]">
                <UserHeader />
            </div>

            <div className="flex-1 flex items-center justify-center pt-20 md:pt-24 px-4 pb-10">
                <div className="w-full max-w-xl lg:max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 my-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-6 sm:mb-8 text-center">
                        Cập Nhật Thông Tin Cá Nhân
                    </h2>
                    
                    {error && <p className="text-red-600 bg-red-100 p-3 rounded-md mb-4 text-sm text-center">{error}</p>}
                    {successMessage && <p className="text-green-600 bg-green-100 p-3 rounded-md mb-4 text-sm text-center">{successMessage}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {[
                            { label: "Họ và tên", name: "tenND", type: "text", placeholder: "Nhập họ và tên của bạn", required: true },
                            { label: "Địa chỉ", name: "diaChi", type: "text", placeholder: "Nhập địa chỉ" },
                            { label: "Số CCCD/CMND", name: "cccd", type: "text", placeholder: "Nhập số CCCD/CMND" },
                            { label: "Số điện thoại", name: "sdt", type: "tel", placeholder: "Nhập số điện thoại" },
                            { label: "Email", name: "email", type: "email", placeholder: "Địa chỉ email", disabled: true }, 
                        ].map(field => (
                            <div key={field.name} className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
                                <label htmlFor={field.name} className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">{field.label} {field.required && <span className="text-red-500">*</span>}</label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    id={field.name}
                                    value={(formData as any)[field.name] || ''}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    disabled={field.disabled || isSubmitting}
                                    required={field.required}
                                    // Áp dụng class chung cho input, đảm bảo text màu đen
                                    className={`w-full sm:w-3/5 md:w-2/3 text-base ${field.disabled ? 'text-gray-500 bg-gray-100 cursor-not-allowed' : 'text-gray-800 bg-white'} border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 mt-1 sm:mt-0`}
                                />
                            </div>
                        ))}
                        {/* Date of Birth */}
                        <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
                            <label className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">Ngày sinh</label>
                            <div className="w-full sm:w-3/5 md:w-2/3 mt-1 sm:mt-0 relative">
                                <div className="flex w-full">
                                    <input
                                        type="text"
                                        value={selectedDate ? selectedDate.toLocaleDateString('vi-VN') : ''}
                                        readOnly
                                        onClick={toggleDatePicker}
                                        placeholder="Chọn ngày sinh"
                                        className="flex-1 text-base text-gray-800 bg-white border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 cursor-pointer"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleDatePicker}
                                        className="flex items-center justify-center px-3 bg-white border-t border-b border-r border-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 border-l-0"
                                        tabIndex={-1}
                                    >
                                        <CalendarIcon />
                                    </button>
                                </div>
                                {isDatePickerOpen && (
                                    <div className="absolute z-50 left-0 mt-2 w-full">
                                        <DatePicker
                                            selected={selectedDate}
                                            onChange={handleDateChange}
                                            dateFormat="dd/MM/yyyy"
                                            locale="vi"
                                            showYearDropdown
                                            showMonthDropdown
                                            dropdownMode="select"
                                            peekNextMonth
                                            scrollableYearDropdown
                                            yearDropdownItemNumber={70}
                                            maxDate={new Date()}
                                            inline
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-6 pt-8">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="w-full sm:w-auto px-8 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors text-sm uppercase shadow-sm"
                            >
                                HỦY
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto px-8 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors text-sm uppercase shadow-sm disabled:opacity-70"
                            >
                                {isSubmitting ? 'ĐANG LƯU...' : 'CẬP NHẬT'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <style jsx global>{`
                 @keyframes modalShow { 
                    from { opacity: 0; transform: scale(0.95) translateY(-20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-modalShow { 
                    animation: modalShow 0.3s ease-out forwards;
                }
                .react-datepicker-popper { z-index: 150 !important; }
                .react-datepicker { 
                    font-family: inherit; font-size: 0.9rem; border-radius: 0.5rem; 
                    border: 1px solid #d1d5db; 
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); 
                }
                .react-datepicker__header { background-color: #FFF1F2; border-bottom: 1px solid #FCE7F3; }
                .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker__day-name {
                    color: #831843; font-weight: 600;
                }
                .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected,
                .react-datepicker__month-text--selected, .react-datepicker__month-text--keyboard-selected {
                    background-color: #FF086A !important; color: white !important;
                }
                .react-datepicker__day:hover, .react-datepicker__month-text:hover {
                    background-color: #FFD6E7 !important; border-radius: 0.375rem;
                }
                .react-datepicker__navigation { top: 0.6rem; }
                .react-datepicker__navigation--previous { border-right-color: #D1D5DB; }
                .react-datepicker__navigation--next { border-left-color: #D1D5DB; }
                .react-datepicker__navigation:hover *::before { border-color: #9D174D; }
            `}</style>
        </div>
    );
}