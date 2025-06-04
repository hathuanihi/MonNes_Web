"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { adminGetSystemStatistics } from '@/services/api';
import AdminHeader from '@/components/header/AdminHeader';
import Image from "next/image";
import SearchIcon from "@/assets/icon/Vector.png";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { vi } from 'date-fns/locale';
import { format, parse } from 'date-fns';

// --- COMPONENT TransactionRow ---
interface TransactionRowProps {
    transaction: GiaoDichDTO;
}
function TransactionRow({ transaction }: TransactionRowProps) {
    return (
        <tr className="hover:bg-pink-50/50 transition-colors duration-150">
            {/* Loại giao dịch */}
            <td className="px-4 py-3 whitespace-nowrap text-sm text-center align-middle">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${
                    transaction.loaiGiaoDich === "Gửi tiền" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                    {transaction.loaiGiaoDich}
                </span>
            </td>
            {/* Ngày giao dịch */}
            <td className="px-4 py-3 whitespace-nowrap text-sm text-center align-middle text-gray-500">
                {new Date(transaction.ngayGD).toLocaleDateString('vi-VN')}
            </td>
            {/* Khách hàng */}
            <td className="px-4 py-3 whitespace-nowrap text-sm text-center align-middle text-gray-800 font-medium max-w-[150px] truncate" title={transaction.tenKhachHang || undefined}>
                {transaction.tenKhachHang || 'N/A'}
            </td>
            {/* Sổ tiết kiệm */}
            <td className="px-4 py-3 whitespace-nowrap text-sm text-center align-middle text-gray-500 max-w-[150px] truncate" title={transaction.tenSoMoTietKiem || undefined}>
                {transaction.tenSoMoTietKiem || `Sổ #${transaction.maSoMoTietKiem}`}
            </td>
            {/* Sản phẩm */}
            <td className="px-4 py-3 whitespace-nowrap text-sm text-center align-middle text-gray-500 max-w-[150px] truncate" title={transaction.tenSanPhamSoTietKiem || undefined}>
                {transaction.tenSanPhamSoTietKiem || 'N/A'}
            </td>
            {/* Số tiền */}
            <td className={`px-4 py-3 whitespace-nowrap text-sm text-center align-middle font-semibold ${transaction.loaiGiaoDich === "Gửi tiền" ? "text-green-600" : "text-red-600"}`}>
                {transaction.soTien.toLocaleString()} VND
            </td>
        </tr>
    );
}

export default function AllTransactionsPage() {
    const [recentTransactions, setRecentTransactions] = useState<GiaoDichDTO[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<GiaoDichDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState<Date | null>(null);

    useEffect(() => {
        const fetchRecentTransactions = async () => {
            try {
                setLoading(true);
                setError(null);
                const stats = await adminGetSystemStatistics();
                setRecentTransactions(stats.giaoDichGanDayNhat || []);
            } catch (err: any) {
                setError(err.message || "Không thể tải danh sách giao dịch gần đây.");
                setRecentTransactions([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentTransactions();
    }, []);

    useEffect(() => {
        let filtered = recentTransactions;
        if (dateFilter) {
            const filterDateStr = format(dateFilter, 'yyyy-MM-dd');
            filtered = filtered.filter(tran => {
                const tranDate = new Date(tran.ngayGD).toISOString().slice(0, 10);
                return tranDate === filterDateStr;
            });
        }
        if (searchTerm.trim()) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(tran =>
                (tran.tenKhachHang && tran.tenKhachHang.toLowerCase().includes(lower)) ||
                (tran.tenSoMoTietKiem && tran.tenSoMoTietKiem.toLowerCase().includes(lower)) ||
                (tran.tenSanPhamSoTietKiem && tran.tenSanPhamSoTietKiem.toLowerCase().includes(lower)) ||
                (tran.loaiGiaoDich && tran.loaiGiaoDich.toLowerCase().includes(lower)) ||
                (tran.soTien && tran.soTien.toString().includes(lower))
            );
        }
        setFilteredTransactions(filtered);
    }, [recentTransactions, dateFilter, searchTerm]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="fixed top-0 left-0 right-0 z-[100]">
                <AdminHeader />
            </div> 
            <div className="w-full" style={{marginTop: '5rem'}}>
                <h1 
                    className="w-full text-center text-3xl md:text-4xl font-bold text-white py-5 md:py-6 rounded-b-2xl shadow-lg"
                    style={{
                        background: "linear-gradient(90deg, #FF086A 0%, #FB5D5D 50%, #F19BDB 100%)",
                    }}
                >
                    DANH SÁCH GIAO DỊCH 
                </h1>
            </div>
            {/* Filter & Search */}
            <div className="w-full flex justify-center px-6 mt-4 mb-2">
                <div className="flex items-center bg-white border-2 border-pink-300 rounded-xl px-4 w-full max-w-5xl shadow-sm">
                    <Image src={SearchIcon} alt="Search Icon" width={15} height={15} className="mr-2 opacity-50" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm khách hàng, sổ, sản phẩm, loại giao dịch, số tiền..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="outline-none w-full text-sm placeholder-pink-400 bg-transparent text-pink-700 font-semibold"
                    />
                    <div className="h-6 w-px bg-pink-200 mx-3" />
                    <DatePicker
                        selected={dateFilter}
                        onChange={date => setDateFilter(date)}
                        dateFormat="dd/MM/yyyy"
                        locale={vi}
                        placeholderText="Chọn ngày giao dịch"
                        className="text-base text-pink-400 font-semibold px-0 py-2 min-w-[120px] md:min-w-[160px] placeholder-pink-400 calendar-pink text-center"
                        calendarClassName="!border-pink-300 !rounded-xl !shadow-lg"
                        dayClassName={date => "!rounded-full hover:!bg-pink-100 focus:!bg-pink-200"}
                        popperPlacement="bottom-end"
                        showPopperArrow={false}
                        todayButton="Hôm nay"
                        isClearable
                    />
                </div>
            </div>
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-6 text-center shadow">{error}</p>}
                {loading ? (
                    <div className="text-center text-gray-500 py-10 text-lg">
                        <div role="status" className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                        <p className="ml-3 mt-4">Đang tải dữ liệu giao dịch...</p>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="text-center text-gray-500 py-10 mt-10 bg-white p-8 rounded-xl shadow-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        <h3 className="mt-4 text-xl font-semibold text-gray-700">Không có giao dịch gần đây nào.</h3>
                    </div>
                ) : (
                    <div className="bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-pink-50">
                                    <tr>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider align-middle">Loại</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider align-middle">Ngày</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider align-middle">Khách Hàng</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider align-middle">Sổ Tiết Kiệm</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider align-middle">Tên Loại Tiết Kiệm</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider align-middle">Số Tiền (VND)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredTransactions.map((transaction) => (
                                        <TransactionRow key={transaction.idGiaoDich} transaction={transaction} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f3f4f6; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
                .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #d1d5db #f3f4f6; }
                .react-datepicker__input-container input::placeholder {
                    color: #f9a8d4;
                    opacity: 1;
                }
                .react-datepicker__input-container input:focus {
                    border-color: transparent !important;
                    outline: none !important;
                    box-shadow: none !important;
                }
                .react-datepicker__header {
                    background: #fdf2f8;
                    border-bottom: 1px solid #f9a8d4;
                }
                .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected {
                    background: #ec4899 !important;
                    color: #fff !important;
                }
                .react-datepicker__day:hover {
                    background: #f9a8d4 !important;
                    color: #fff !important;
                }
                .react-datepicker__day--today {
                    border: 1px solid #ec4899 !important;
                }
                .react-datepicker__month-container {
                    border-radius: 1rem;
                    box-shadow: 0 2px 16px 0 #f9a8d4;
                }
                .react-datepicker__triangle {
                    display: none;
                }
                .react-datepicker__close-icon::after {
                    background: #f9a8d4;
                    color: #fff;
                }
            `}</style>
        </div>
    );
}

