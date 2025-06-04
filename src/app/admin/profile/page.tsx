"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import UserHeader from "@/components/header/AdminHeader"; // ĐỔI SANG ADMINHEADER
import Link from "next/link";
import { userGetProfile } from "@/services/api"; // API để lấy thông tin profile

const userPlaceholderImage = "/images/user-placeholder.jpg"; // Giữ lại hoặc dùng avatar động
const flagImage = "/images/flag-vietnam.png"; // Giữ lại nếu cần

const DropdownArrowSvg = () => ( // Giữ nguyên nếu bạn dùng để hiển thị sổ
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="dropdown-icon">
        <path d="M6.175 7.1582L10 10.9749L13.825 7.1582L15 8.3332L10 13.3332L5 8.3332L6.175 7.1582Z" fill="currentColor" /> {/* Đổi fill thành currentColor */}
    </svg>
);

// Interface cho dữ liệu sổ tiết kiệm hiển thị (nếu có)
interface SavingAccountDisplay {
    name: string;
    amount: string;
    // Thêm các trường chi tiết khác nếu cần khi mở rộng
}

export default function AdminProfilePage() { // Đổi tên component
    const [adminData, setAdminData] = useState<UserResponse | null>(null);
    const [savingsSummary, setSavingsSummary] = useState<SavingAccountDisplay[]>([]); // Sẽ lấy từ API khác nếu cần
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openSavings, setOpenSavings] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const profileData = await userGetProfile(); // API này sẽ trả về thông tin của admin đang đăng nhập
                setAdminData(profileData);

                // TODO: Nếu bạn muốn hiển thị danh sách sổ tiết kiệm của admin (nếu admin cũng có sổ)
                // hoặc các thông tin liên quan khác, bạn cần gọi API tương ứng ở đây.
                // Ví dụ: const userSavings = await userGetAllMySavingsAccounts();
                // Hoặc nếu profileData đã bao gồm thông tin này:
                // if (profileData.danhSachSoTietKiem) {
                //     const formattedSavings = profileData.danhSachSoTietKiem.map(s => ({
                //         name: s.tenSoMo || `Sổ #${s.maMoSo}`,
                //         amount: `${s.soDuHienTai.toLocaleString()} VNĐ`
                //     }));
                //     setSavingsSummary(formattedSavings);
                // }

            } catch (err: any) {
                setError(err.message || "Không thể tải thông tin cá nhân.");
                console.error("Lỗi fetch profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminProfile();
    }, []);

    const toggleSavingsDetails = (index: number) => {
        setOpenSavings((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };
    
    const ADMIN_HEADER_HEIGHT_CSS_VAR = 'var(--admin-header-height, 5rem)';


    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <UserHeader />
                <div className="flex-1 flex justify-center items-center" style={{ paddingTop: ADMIN_HEADER_HEIGHT_CSS_VAR }}>
                    <p className="text-lg text-gray-600">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <UserHeader />
                <div className="flex-1 flex justify-center items-center" style={{ paddingTop: ADMIN_HEADER_HEIGHT_CSS_VAR }}>
                    <p className="text-red-500 bg-red-100 p-4 rounded-md shadow">Lỗi: {error}</p>
                </div>
            </div>
        );
    }

    if (!adminData) {
        return (
            <div className="min-h-screen flex flex-col">
                <UserHeader />
                <div className="flex-1 flex justify-center items-center" style={{ paddingTop: ADMIN_HEADER_HEIGHT_CSS_VAR }}>
                    <p className="text-gray-600">Không tìm thấy thông tin người dùng.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50"> {/* Nền xám nhạt cho toàn trang */}
            <div className="w-full bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB] shadow-md max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-5 border-b border-gray-200 bg-gray-50 relative flex items-center min-h-[70px]">
                <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl font-bold text-white whitespace-nowrap">
                    Thông Tin Cá Nhân
                </h1>
            </div>

            {/* Container cho nội dung bên dưới AdminHeader */}
            <div className="flex-1 flex flex-col" >

                {/* Content */}
                <main className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar">
                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
                        {/* Left Column - Thông tin tóm tắt và sổ (nếu có) */}
                        <div className="w-full lg:w-1/3 flex-shrink-0">
                            <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center">
                                <Image
                                    src={userPlaceholderImage} // Thay bằng adminData.avatarUrl nếu có
                                    alt={adminData.tenND || "Admin Avatar"}
                                    width={120} // Tăng kích thước avatar
                                    height={120}
                                    className="rounded-full border-4 border-pink-300 shadow-lg"
                                />
                                <h2 className="text-2xl font-bold text-pink-600 mt-5">{adminData.tenND || "Chưa cập nhật"}</h2>
                                <p className="text-md text-gray-600">{adminData.email}</p>
                                <div className="flex items-center justify-center mt-2 text-gray-500">
                                    <p className="text-sm mr-2">{adminData.sdt || "Chưa có SĐT"}</p>
                                    {/* <Image src={flagImage} alt="Flag" width={20} height={20} /> */}
                                </div>

                                {/* Nút chỉnh sửa hồ sơ (có thể đặt ở đây hoặc ở cột phải) */}
                                <Link href="/admin/profile/update" className="mt-6">
                                     <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg px-6 py-2.5 transition-colors duration-150">
                                        Chỉnh Sửa Hồ Sơ
                                    </button>
                                </Link>
                                
                                {/* Phần hiển thị sổ tiết kiệm nếu Admin cũng có sổ - Tạm thời ẩn đi nếu không cần */}
                                {/* {savingsSummary.length > 0 && (
                                    <div className="mt-8 w-full border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Sổ Tiết Kiệm Của Bạn</h3>
                                        <div className="space-y-3">
                                            {savingsSummary.map((saving, index) => (
                                                <div key={index} className="bg-pink-50 rounded-lg px-4 py-3">
                                                    <div className="flex items-center justify-between w-full cursor-pointer" onClick={() => toggleSavingsDetails(index)}>
                                                        <span className="text-sm font-medium text-pink-700">{saving.name}</span>
                                                        <div className="flex items-center">
                                                            <span className="text-sm text-pink-700 mr-2">{saving.amount}</span>
                                                            <button className={`transform transition-transform duration-200 ${openSavings[index] ? "rotate-180" : ""}`}>
                                                                <DropdownArrowSvg />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {openSavings[index] && (
                                                        <div className="mt-2 text-xs text-pink-600 pl-1">
                                                            Chi tiết sổ đang được cập nhật...
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )} */}
                            </div>
                        </div>

                        {/* Right Column - Thông tin chi tiết */}
                        <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-xl p-6 md:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-700">Thông Tin Chi Tiết</h3>
                                {/* Nút Update Profile có thể đặt ở đây thay vì cột trái */}
                                {/* <Link href="/admin/profile/update">
                                    <button className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-lg px-5 py-2 transition-colors">
                                        Chỉnh Sửa
                                    </button>
                                </Link> */}
                            </div>

                            <div className="space-y-4">
                                {[
                                    { label: "Họ và tên", value: adminData.tenND },
                                    { label: "Ngày sinh", value: adminData.ngaySinh ? new Date(adminData.ngaySinh + "T00:00:00Z").toLocaleDateString('vi-VN') : null },
                                    { label: "Địa chỉ", value: adminData.diaChi },
                                    { label: "Số CCCD/CMND", value: adminData.cccd },
                                    { label: "Số điện thoại", value: adminData.sdt },
                                    { label: "Email", value: adminData.email },
                                    { label: "Vai trò", value: adminData.vaiTro },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col sm:flex-row py-3 border-b border-gray-200 last:border-b-0"
                                    >
                                        <span className="w-full sm:w-1/3 text-sm font-medium text-gray-500 mb-1 sm:mb-0">{item.label}:</span>
                                        <span className="w-full sm:w-2/3 text-sm text-gray-800">{item.value || <span className="italic text-gray-400">Chưa cập nhật</span>}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f3f4f6; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
                .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #d1d5db #f3f4f6; }
                .dropdown-icon path { fill: #EC4899; } /* Màu cho icon dropdown */
                button:hover .dropdown-icon path { fill: #DB2777; }
            `}</style>
        </div>
    );
}