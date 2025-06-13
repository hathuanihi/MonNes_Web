"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { adminGetSystemStatistics } from '@/services/api';
import AdminHeader from '@/components/header/AdminHeader';
import Image from "next/image";
import SearchIcon from "@/assets/icon/Vector.png";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { vi } from 'date-fns/locale';
import { format } from 'date-fns';
import ProtectedRoute, { Role } from '@/components/ProtectedRoute';

const getTransactionDetails = (type: GiaoDichDTO['loaiGiaoDich']) => {
    switch (type) {
        case "DEPOSIT":
            return { text: "Gửi tiền", badgeClass: "bg-green-100 text-green-800", amountClass: "text-green-600" };
        case "WITHDRAW":
            return { text: "Rút tiền", badgeClass: "bg-red-100 text-red-800", amountClass: "text-red-600" };
        case "INTEREST":
            return { text: "Ghi nhận lãi", badgeClass: "bg-blue-100 text-blue-800", amountClass: "text-blue-600" };
        default:
            return { text: type, badgeClass: "bg-gray-100 text-gray-800", amountClass: "text-gray-600" };
    }
};

interface TransactionRowProps {
    transaction: GiaoDichDTO;
}

function TransactionRow({ transaction }: TransactionRowProps) {
    const details = getTransactionDetails(transaction.loaiGiaoDich);

    return (
        <tr className="hover:bg-pink-50/50 transition-colors duration-150">
            {/* Loại giao dịch */}
            <td className="px-4 py-3 whitespace-nowrap text-sm text-center align-middle">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${details.badgeClass}`}>
                    {details.text}
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
            <td className={`px-4 py-3 whitespace-nowrap text-sm text-center align-middle font-semibold ${details.amountClass}`}>
                {transaction.soTien.toLocaleString('vi-VN')} VND
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
                // Sắp xếp các giao dịch theo ngày mới nhất lên đầu
                const sortedTransactions = (stats.giaoDichGanDayNhat || []).sort((a: GiaoDichDTO, b: GiaoDichDTO) => new Date(b.ngayGD).getTime() - new Date(a.ngayGD).getTime());
                setRecentTransactions(sortedTransactions);
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
                const tranDate = format(new Date(tran.ngayGD), 'yyyy-MM-dd');
                return tranDate === filterDateStr;
            });
        }
        if (searchTerm.trim()) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(tran => {
                const transactionDetails = getTransactionDetails(tran.loaiGiaoDich);
                return (
                    (tran.tenKhachHang && tran.tenKhachHang.toLowerCase().includes(lower)) ||
                    (tran.tenSoMoTietKiem && tran.tenSoMoTietKiem.toLowerCase().includes(lower)) ||
                    (tran.tenSanPhamSoTietKiem && tran.tenSanPhamSoTietKiem.toLowerCase().includes(lower)) ||
                    (tran.loaiGiaoDich && tran.loaiGiaoDich.toLowerCase().includes(lower)) ||
                    (transactionDetails.text && transactionDetails.text.toLowerCase().includes(lower)) ||
                    (tran.soTien && tran.soTien.toString().includes(lower))
                )
            });
        }
        setFilteredTransactions(filtered);
    }, [recentTransactions, dateFilter, searchTerm]);

    return (
        <ProtectedRoute requiredRole={Role.ADMIN}>
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
            <div className="w-full flex justify-center px-4 md:px-6 mt-6 mb-4">
                <div className="flex items-center bg-white border border-gray-200 rounded-lg p-2 w-full max-w-4xl shadow-sm">
                    <Image src={SearchIcon} alt="Search Icon" width={18} height={18} className="mx-2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm khách hàng, sổ, loại giao dịch, số tiền..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="outline-none w-full text-sm placeholder-gray-400 bg-transparent text-gray-700 font-medium"
                    />
                    <div className="h-8 w-px bg-gray-200 mx-2" />
                    <DatePicker
                        selected={dateFilter}
                        onChange={date => setDateFilter(date)}
                        dateFormat="dd/MM/yyyy"
                        locale={vi}
                        placeholderText="Chọn ngày"
                        className="outline-none text-sm font-medium text-gray-700 w-32 text-center bg-transparent cursor-pointer"
                        calendarClassName="!border-gray-200 !rounded-xl !shadow-lg font-sans"
                        dayClassName={date => "!rounded-full hover:!bg-pink-100"}
                        popperPlacement="bottom-end"
                        todayButton="Hôm nay"
                        isClearable
                    />
                </div>
            </div>
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-6 text-center shadow">{error}</p>}
                {loading ? (
                    <div className="text-center text-gray-500 py-10 text-lg">
                        <div role="status" className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                        <p className="mt-4 font-semibold">Đang tải dữ liệu giao dịch...</p>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="text-center text-gray-500 py-10 mt-10 bg-white p-8 rounded-xl shadow-md">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        <h3 className="mt-4 text-xl font-semibold text-gray-700">Không tìm thấy giao dịch nào.</h3>
                        <p className="mt-1 text-sm text-gray-500">Hãy thử lại với một bộ lọc khác hoặc kiểm tra lại từ khóa tìm kiếm.</p>
                    </div>
                ) : (
                    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider align-middle">Loại</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider align-middle">Ngày</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider align-middle">Khách Hàng</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider align-middle">Sổ Tiết Kiệm</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider align-middle">Sản phẩm</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider align-middle">Số Tiền (VND)</th>
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
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f9fafb; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
                .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #d1d5db #f9fafb; }
            `}</style>
        </div>
        </ProtectedRoute>
    );
}