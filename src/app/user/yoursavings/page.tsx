"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import UserHeader from "@/components/header/UserHeader"; // Đảm bảo path đúng
import Link from "next/link";
import Image from "next/image"; // Cho icon search (nếu có)
import { userGetAllMySavingsAccounts } from "@/services/api"; // API lấy sổ của user
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"; // Icon search ví dụ

// Placeholder cho icon nếu bạn không có dropdownIcon thực sự cho các mục sổ
const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
);


export default function YourSavingsPage() {
    const [mySavings, setMySavings] = useState<MoSoTietKiemResponse[]>([]);
    const [filteredSavings, setFilteredSavings] = useState<MoSoTietKiemResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const USER_HEADER_HEIGHT = '5rem'; // Giả sử UserHeader cao 5rem (h-20)
    const PAGE_TITLE_BANNER_HEIGHT = '4.5rem'; // Ước tính chiều cao của banner "YOUR SAVINGS" (py-6 + text)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await userGetAllMySavingsAccounts();
                setMySavings(Array.isArray(data) ? data : []);
                setFilteredSavings(Array.isArray(data) ? data : []);
            } catch (err: any) {
                setError(err.message || "Không thể tải danh sách sổ tiết kiệm của bạn.");
                console.error("Lỗi fetch sổ tiết kiệm:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Logic filter (cơ bản, bạn có thể mở rộng)
    useEffect(() => {
        let tempSavings = [...mySavings];
        
        // Filter theo searchTerm (tên sổ)
        if (searchTerm) {
            tempSavings = tempSavings.filter(saving => 
                saving.tenSoMo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                saving.tenSanPhamSoTietKiem?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredSavings(tempSavings);
    }, [searchTerm, mySavings]);


    const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50"> {/* Nền xám nhạt cho body */}
            <div className="fixed top-0 left-0 right-0 z-[100]">
                <UserHeader />
            </div>

            {/* Banner Tiêu đề Trang - KHÔNG sticky, cho phép cuộn */}
            <div className="w-full" style={{marginTop: '5rem'}}> {/* Đẩy xuống dưới UserHeader (5rem) */}
                <h1 
                    className="w-full text-center text-3xl md:text-4xl font-bold text-white py-5 md:py-6 rounded-b-2xl shadow-lg"
                    style={{
                        background: "linear-gradient(90deg, #FF086A 0%, #FB5D5D 50%, #F19BDB 100%)",
                    }}
                >
                    CHI TIẾT SỔ TIẾT KIỆM
                </h1>
            </div>

            {/* Thanh tìm kiếm, lọc, nút tạo mới - nằm ngang, full width, ngay dưới title header */}
            <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 px-4 sm:px-6 lg:px-8 mt-4 mb-2">
                {/* Tìm kiếm */}
                <div className="flex-1 w-full md:w-auto relative">
                    <input
                        type="text"
                        placeholder="Tìm sổ tiết kiệm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 text-base border-2 border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 bg-white/80 placeholder:text-pink-400 text-pink-700 font-semibold transition shadow-sm"
                    />
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-pink-400" />
                    </span>
                </div>
                {/* Nút Tạo Mới */}
                <Link href="/user/yoursavings/newsavings">
                    <button className="bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB] hover:from-pink-600 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 text-base border-2 border-pink-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        TẠO SỔ TIẾT KIỆM MỚI
                    </button>
                </Link>
            </div>

            {/* Container chính cho nội dung, có padding top để không bị 2 header che */}
            <main 
                className="flex-1 w-full max-w-7xl mx-auto" 
                style={{ paddingTop: '2rem' }} // Chỉ padding nhỏ vì đã có marginTop cho title
            >
                <div className="w-full flex flex-col gap-6 lg:gap-8">
                    {/* Danh sách sổ tiết kiệm */}
                    <div className="w-full">
                        {/* Danh sách sổ tiết kiệm */}
                        {loading && <p className="text-center text-gray-500 py-10">Đang tải sổ tiết kiệm...</p>}
                        {error && <p className="text-center text-red-500 py-10 bg-red-50 p-4 rounded-md">{error}</p>}
                        {!loading && !error && filteredSavings.length === 0 && (
                            <div className="text-center text-gray-500 py-10 mt-10 bg-white p-8 rounded-xl shadow-lg">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21.75 17.25v-.625H17.25v.625a.75.75 0 1 1-1.5 0v-.625H13.5v.625a.75.75 0 1 1-1.5 0V12a1.5 1.5 0 0 0-1.5-1.5H3.75M21.75 8.25v.625H17.25V8.25a.75.75 0 1 0-1.5 0v.625H13.5V8.25a.75.75 0 1 0-1.5 0V12m0 0V6.75A2.25 2.25 0 0 0 9.75 4.5H7.5A2.25 2.25 0 0 0 5.25 6.75v5.25m0 0A2.25 2.25 0 0 0 7.5 15h2.25M17.25 17.25a.75.75 0 1 1-1.5 0v-5.625h1.5v5.625Z"/>
                                </svg>
                                <h3 className="mt-4 text-xl font-semibold text-gray-700">
                                    {searchTerm ? "Không tìm thấy sổ tiết kiệm nào khớp." : "Bạn chưa có sổ tiết kiệm nào."}
                                </h3>
                                {!(searchTerm) && 
                                    <p className="mt-2 text-sm text-gray-500">Hãy tạo sổ tiết kiệm mới để bắt đầu tích lũy!</p>
                                }
                            </div>
                        )}
                        {!loading && !error && filteredSavings.length > 0 && (
                            <div className="space-y-5 md:space-y-4 w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto"> {/* Tăng khoảng cách giữa các sổ */}
                                {filteredSavings.map((saving) => (
                                    <Link href={`/user/yoursavings/detail?id=${saving.maMoSo}`} key={saving.maMoSo} passHref>
                                        <div className="block bg-white p-3 sm:p-4 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                                            <div className="flex justify-between items-center gap-2">
                                                <div className="ml-10">
                                                    <h3 className="text-base md:text-lg font-semibold text-pink-600">{saving.tenSoMo || `Sổ Tiết Kiệm #${saving.maMoSo}`}</h3>
                                                    <p className="text-xs md:text-sm text-gray-500">{saving.tenSanPhamSoTietKiem}</p>
                                                </div>
                                                <div className="flex flex-row items-center gap-10 min-w-[210px] justify-end">
                                                    <div className="flex flex-col items-end text-right gap-0.5">
                                                        <p className="text-base md:text-lg font-bold text-gray-800">{(saving.soDuHienTai && saving.soDuHienTai > 0 ? saving.soDuHienTai : 0).toLocaleString()} VND</p>
                                                        <p className="text-xs text-gray-400">Lãi suất: {saving.laiSuatApDungChoSoNay?.toFixed(2)}%</p>
                                                        <p className={`text-xs font-semibold mt-1 ${saving.trangThaiMoSo === 'DANG_HOAT_DONG' ? 'text-green-600' : 'text-gray-400'}`}>{saving.trangThaiMoSo === 'DANG_HOAT_DONG' ? 'Đang mở' : 'Đã đóng'}</p>
                                                    </div>
                                                    <div className="flex items-center"><ChevronRightIcon /></div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #F9FAFB; } /* Match bg-gray-50 */
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 3px; } /* Màu xám nhạt hơn */
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
                .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #D1D5DB #F9FAFB; }
            `}</style>
        </div>
    );
}