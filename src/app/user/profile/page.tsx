"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import UserHeader from "@/components/header/UserHeader"; // Đảm bảo path đúng
import Link from "next/link";
import { useRouter } from "next/navigation"; // Không cần thiết nếu chỉ link
import { userGetProfile } from "@/services/api"; // API lấy thông tin
import { PencilSquareIcon } from '@heroicons/react/24/outline'; // Icon cho nút sửa

const userImagePlaceholder = "/images/user-placeholder.jpg"; // Thay thế bằng avatar thật nếu có

export default function ProfilePage() {
    const [userData, setUserData] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const USER_HEADER_HEIGHT = '5rem'; // Chiều cao UserHeader
    const PAGE_TITLE_BANNER_HEIGHT = '4.5rem'; // Chiều cao banner tiêu đề "THÔNG TIN CÁ NHÂN"

    // Định nghĩa fetchProfile ở ngoài để dùng được ở nhiều nơi
    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await userGetProfile();
            setUserData(data);
        } catch (err: any) {
            setError(err.message || "Không thể tải thông tin hồ sơ.");
            console.error("Lỗi fetch profile:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

     // useEffect để cập nhật khi thông tin được sửa từ trang updateProfile
     useEffect(() => {
        const handleProfileUpdated = () => {
            const storedData = localStorage.getItem("profileUpdateStatus");
            if (storedData === "success") {
                fetchProfile(); // Fetch lại dữ liệu
                localStorage.removeItem("profileUpdateStatus");
            }
        };
        window.addEventListener('storage', handleProfileUpdated); // Lắng nghe nếu tab khác update
        handleProfileUpdated(); // Kiểm tra ngay khi mount nếu vừa redirect về

        return () => {
            window.removeEventListener('storage', handleProfileUpdated);
        };
    }, []);


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <UserHeader />
                <div className="flex-1 flex justify-center items-center" style={{paddingTop: USER_HEADER_HEIGHT}}>
                    <div role="status" className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    <span className="ml-3 text-gray-600">Đang tải thông tin...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <UserHeader />
                <div className="flex-1 flex justify-center items-center" style={{paddingTop: USER_HEADER_HEIGHT}}>
                    <p className="text-lg text-red-500 bg-red-100 p-4 rounded-md shadow">{error}</p>
                </div>
            </div>
        );
    }

    if (!userData) {
         return (
            <div className="min-h-screen bg-gray-50">
                <UserHeader />
                 <div className="flex-1 flex justify-center items-center" style={{paddingTop: USER_HEADER_HEIGHT}}>
                     <p className="text-lg text-gray-500">Không tìm thấy thông tin người dùng.</p>
                </div>
            </div>
        );
    }

    const profileDetails = [
        { label: "Họ và tên", value: userData.tenND },
        { label: "Ngày sinh", value: userData.ngaySinh ? new Date(userData.ngaySinh).toLocaleDateString('vi-VN') : null },
        { label: "Địa chỉ", value: userData.diaChi },
        { label: "Số CCCD/CMND", value: userData.cccd },
        { label: "Số điện thoại", value: userData.sdt },
        { label: "Email", value: userData.email },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-100"> {/* Nền xám nhạt cho body */}
            <UserHeader />

            {/* Container cho toàn bộ nội dung bên dưới UserHeader */}
            <div 
                className="flex-1 flex flex-col overflow-y-auto"
                style={{ paddingTop: USER_HEADER_HEIGHT }}
            >
                {/* Banner Tiêu đề Trang */}
                <div className="w-full bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB] shadow-md flex-shrink-0">
                    <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
                            THÔNG TIN CÁ NHÂN
                        </h1>
                    </div>
                </div>

                {/* Content */}
                <div className="w-full max-w-5xl lg:max-w-6xl mx-auto flex flex-col lg:flex-row p-4 sm:p-6 lg:p-8 gap-6 lg:gap-8 items-start">
                    {/* Cột Trái - Thông tin tóm tắt */}
                    <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-xl flex flex-col items-center text-center sticky top-[calc(5rem+3.5rem)]"> {/* 5rem header + ~3.5rem banner title */}
                        <Image
                            src={userImagePlaceholder} // Thay bằng userData.avatarUrl nếu có
                            alt="User Avatar"
                            width={128} // To hơn một chút
                            height={128}
                            className="rounded-full border-4 border-pink-200 shadow-lg mb-5"
                        />
                        <h2 className="text-2xl font-bold text-pink-600">{userData.tenND || 'Chưa cập nhật'}</h2>
                        <p className="text-md text-gray-600 mt-1">{userData.email}</p>
                        {userData.sdt && <p className="text-sm text-gray-500 mt-1">SĐT: {userData.sdt}</p>}
                        <span className={`mt-4 px-3 py-1 text-xs font-semibold rounded-full ${
                            userData.vaiTro === "ADMIN" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                        }`}>
                            {userData.vaiTro}
                        </span>
                    </div>

                    {/* Cột Phải - Chi tiết thông tin và nút cập nhật */}
                    <div className="w-full lg:w-2/3 bg-white p-6 sm:p-8 rounded-xl shadow-xl">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-700">Thông tin chi tiết</h3>
                            <Link href="/user/profile/updateprofile" legacyBehavior>
                                <a className="inline-flex items-center bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors shadow-md hover:shadow-lg active:scale-95">
                                    <PencilSquareIcon className="h-5 w-5 mr-2" />
                                    Chỉnh sửa
                                </a>
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {profileDetails.map((item) => (
                                item.value ? ( // Chỉ hiển thị nếu có giá trị
                                    <div
                                        key={item.label}
                                        className="flex flex-col sm:flex-row py-3 border-b border-gray-200 last:border-b-0"
                                    >
                                        <span className="w-full sm:w-2/5 md:w-1/3 text-sm font-medium text-gray-500">{item.label}:</span>
                                        <span className="w-full sm:w-3/5 md:w-2/3 text-sm text-gray-800 mt-1 sm:mt-0">{item.value}</span>
                                    </div>
                                ) : null
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`/* ... css cho scrollbar nếu cần ... */`}</style>
        </div>
    );
}