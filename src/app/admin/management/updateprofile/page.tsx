"use client";

import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminHeader from "@/components/header/AdminHeader";
import { adminGetUserDetailsById, adminUpdateUserByAdmin } from "@/services/api";
import ProtectedRoute, { Role } from "@/components/ProtectedRoute";

export default function UpdateUserProfilePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');

    const [formData, setFormData] = useState<UpdateProfileDTO>({
        tenND: "",
        ngaySinh: "", 
        diaChi: "",
        cccd: "",
        sdt: "",
        email: "", 
    });

    const [userInfo, setUserInfo] = useState<UserDetailDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);    useEffect(() => {
        if (!userId) {
            setError("ID người dùng không hợp lệ.");
            setLoading(false);
            return;
        }

        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await adminGetUserDetailsById(parseInt(userId));
                setUserInfo(data);
                setFormData({
                    tenND: data.tenND || "",
                    ngaySinh: data.ngaySinh ? data.ngaySinh.split('T')[0] : "", 
                    diaChi: data.diaChi || "",
                    cccd: data.cccd || "",
                    sdt: data.sdt || "",
                    email: data.email || "", 
                });
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : "Không thể tải thông tin người dùng.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [userId]);    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError(null); 
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!formData.tenND?.trim()) { 
            setError("Họ tên không được để trống."); 
            return; 
        }
        if (formData.cccd && !/^(\d{9}|\d{12})$/.test(formData.cccd)) { 
            setError("CCCD không hợp lệ (9 hoặc 12 số)."); 
            return; 
        }
        if (formData.sdt && !/^0\d{9}$/.test(formData.sdt)) { 
            setError("Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)."); 
            return; 
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

            await adminUpdateUserByAdmin(parseInt(userId!), dataToUpdate);
            setSuccessMessage("Cập nhật thông tin người dùng thành công!");
            setTimeout(() => {
                router.push("/admin/management");
            }, 1500);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Cập nhật thông tin thất bại. Vui lòng thử lại.";
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push("/admin/management");
    };

    if (loading) {
        return (
            <ProtectedRoute requiredRole={Role.ADMIN}>
                 <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB]">
                     <div className="fixed top-0 left-0 right-0 z-[100]"><AdminHeader /></div>
                     <div className="flex-1 flex justify-center items-center pt-16">
                         <p className="text-lg text-white">Đang tải thông tin...</p>
                     </div>
                 </div>
            </ProtectedRoute>
        );
    }
    
    return (
        <ProtectedRoute requiredRole={Role.ADMIN}>
            <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB]">
                <div className="fixed top-0 left-0 right-0 z-[100]">
                    <AdminHeader />
                </div>
                <div className="flex-1 flex items-center justify-center pt-20 md:pt-24 px-4 pb-10">
                    <div className="w-full max-w-xl lg:max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 my-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-6 sm:mb-8 text-center">
                            Cập Nhật Thông Tin Người Dùng
                        </h2>
                        
                        {/* {userInfo && (
                            <div className="mb-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
                                <h3 className="text-lg font-semibold text-pink-700 mb-2">Thông tin hiện tại:</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <p><span className="font-medium text-gray-700">Email:</span> {userInfo.email}</p>
                                    <p><span className="font-medium text-gray-700">Vai trò:</span> 
                                        <span className={`ml-1 px-2 py-0.5 rounded text-xs font-semibold ${
                                            userInfo.vaiTro === "ADMIN" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                        }`}>
                                            {userInfo.vaiTro}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )} */}

                        {error && <p className="text-red-600 bg-red-100 p-3 rounded-md mb-4 text-sm text-center">{error}</p>}
                        {successMessage && <p className="text-green-600 bg-green-100 p-3 rounded-md mb-4 text-sm text-center">{successMessage}</p>}
                        
                        <form onSubmit={handleSubmit} className="space-y-4">                            {[
                                { label: "Họ và tên", name: "tenND", type: "text", placeholder: "Nhập họ và tên", required: true },
                                { label: "Ngày sinh", name: "ngaySinh", type: "date", placeholder: "Chọn ngày sinh" },
                                { label: "Địa chỉ", name: "diaChi", type: "text", placeholder: "Nhập địa chỉ" },
                                { label: "Số CCCD/CMND", name: "cccd", type: "text", placeholder: "Nhập số CCCD/CMND" },
                                { label: "Số điện thoại", name: "sdt", type: "tel", placeholder: "Nhập số điện thoại" },
                                { label: "Email", name: "email", type: "email", placeholder: "Địa chỉ email", disabled: true }, 
                            ].map(field => (
                                <div key={field.name} className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
                                    <label htmlFor={field.name} className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        id={field.name}
                                        value={(formData as any)[field.name] || ''}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        disabled={field.disabled || isSubmitting}
                                        required={field.required}
                                        className={`w-full sm:w-3/5 md:w-2/3 text-base ${
                                            field.disabled 
                                                ? 'text-gray-500 bg-gray-100 cursor-not-allowed' 
                                                : 'text-gray-800 bg-white'
                                        } border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 mt-1 sm:mt-0`}
                                    />
                                </div>
                            ))}
                            
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
                    </div>                </div>
            </div>
        </ProtectedRoute>
    );
}