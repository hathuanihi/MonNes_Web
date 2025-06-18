"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { adminGetAllSystemTransactions } from '@/services/api';
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
        <tr className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-transparent transition-all duration-200 group">
            {/* Loại giao dịch */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-center align-middle">
                <span className={`px-3 py-2 inline-flex text-xs leading-5 font-bold rounded-full items-center shadow-sm ${details.badgeClass} group-hover:shadow-md transition-shadow`}>
                    {details.text}
                </span>
            </td>
            {/* Ngày giao dịch */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-center align-middle text-gray-600 font-medium">
                {new Date(transaction.ngayGD).toLocaleDateString('vi-VN')}
            </td>
            {/* Khách hàng */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-center align-middle text-gray-800 font-semibold max-w-[160px] truncate" title={transaction.tenKhachHang || undefined}>
                {transaction.tenKhachHang || 'N/A'}
            </td>
            {/* Sổ tiết kiệm */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-center align-middle text-gray-600 max-w-[160px] truncate" title={transaction.tenSoMoTietKiem || undefined}>
                {transaction.tenSoMoTietKiem || `Sổ #${transaction.maSoMoTietKiem}`}
            </td>
            {/* Sản phẩm */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-center align-middle text-gray-600 max-w-[160px] truncate" title={transaction.tenSanPhamSoTietKiem || undefined}>
                {transaction.tenSanPhamSoTietKiem || 'N/A'}
            </td>
            {/* Số tiền */}
            <td className={`px-6 py-4 whitespace-nowrap text-sm text-center align-middle font-bold ${details.amountClass}`}>
                {transaction.soTien.toLocaleString('vi-VN')} VND
            </td>
        </tr>
    );
}

export default function AllTransactionsPage() {
    const [allTransactions, setAllTransactions] = useState<GiaoDichDTO[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<GiaoDichDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState<Date | null>(null);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(50);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                setError(null);
                  // Fetch transactions with pagination, sorted by date descending
                const response = await adminGetAllSystemTransactions(currentPage, pageSize, 'ngayThucHien,DESC');
                
                setAllTransactions(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
                setHasNextPage(!response.last);
                
            } catch (err: any) {
                setError(err.message || "Không thể tải danh sách giao dịch.");
                setAllTransactions([]);
            } finally {
                setLoading(false);
            }
        };
          fetchTransactions();
    }, [currentPage, pageSize]);

    // Reset to first page when page size changes
    useEffect(() => {
        setCurrentPage(0);
    }, [pageSize]);

    useEffect(() => {
        let filtered = allTransactions;
        if (dateFilter) {
            const filterDateStr = format(dateFilter, 'yyyy-MM-dd');
            filtered = filtered.filter((tran: GiaoDichDTO) => {
                const tranDate = format(new Date(tran.ngayGD), 'yyyy-MM-dd');
                return tranDate === filterDateStr;
            });
        }
        if (searchTerm.trim()) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter((tran: GiaoDichDTO) => {
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
    }, [allTransactions, dateFilter, searchTerm]);

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
                    }}                >
                    QUẢN LÝ GIAO DỊCH HỆ THỐNG
                </h1>
            </div>            {/* Filter & Search */}
            <div className="w-full flex justify-center px-4 md:px-6 mt-6 mb-4">
                <div className="flex items-center bg-white border border-gray-200 rounded-xl p-4 w-full max-w-4xl shadow-lg">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <Image src={SearchIcon} alt="Search Icon" width={20} height={20} className="text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm khách hàng, sổ tiết kiệm, loại giao dịch, số tiền..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="outline-none w-full text-sm placeholder-gray-400 bg-transparent text-gray-700 font-medium"
                        />
                    </div>
                    
                    <div className="h-8 w-px bg-gray-300 mx-4" />
                    
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <DatePicker
                            selected={dateFilter}
                            onChange={date => setDateFilter(date)}
                            dateFormat="dd/MM/yyyy"
                            locale={vi}
                            placeholderText="Chọn ngày giao dịch"
                            className="outline-none text-sm font-medium text-gray-700 w-40 text-center bg-transparent cursor-pointer"
                            calendarClassName="!border-gray-200 !rounded-xl !shadow-xl font-sans"
                            dayClassName={date => "!rounded-full hover:!bg-pink-100 hover:!text-pink-800"}
                            popperPlacement="bottom-end"
                            todayButton="Hôm nay"
                            isClearable
                            showYearDropdown
                            dropdownMode="select"
                        />
                        {dateFilter && (
                            <button
                                onClick={() => setDateFilter(null)}
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                title="Xóa bộ lọc ngày"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div><main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-6 text-center shadow">{error}</p>}
                  {/* Transaction Statistics */}
                {!loading && !error && (
                    <div className="mb-6 bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            {/* Statistics Cards */}
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 min-w-[140px]">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-full">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Tổng giao dịch</p>
                                            <p className="text-2xl font-bold text-blue-900">{totalElements.toLocaleString('vi-VN')}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100 min-w-[140px]">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-full">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-green-600 uppercase tracking-wider">Đang hiển thị</p>
                                            <p className="text-2xl font-bold text-green-900">
                                                {Math.min(currentPage * pageSize + 1, totalElements)} - {Math.min((currentPage + 1) * pageSize, totalElements)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 min-w-[120px]">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 rounded-full">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">Trang hiện tại</p>
                                            <p className="text-2xl font-bold text-purple-900">{currentPage + 1} / {totalPages}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Page Size Selector */}
                            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                    <label className="text-sm font-medium text-gray-700">Hiển thị:</label>
                                </div>
                                <select 
                                    value={pageSize} 
                                    onChange={(e) => setPageSize(Number(e.target.value))}
                                    className="border border-gray-300 rounded-lg text-gray-700 px-3 py-2 text-sm font-medium bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                                >
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                                <span className="text-sm font-medium text-gray-700">/ trang</span>
                            </div>
                        </div>
                    </div>
                )}                {loading ? (
                    <div className="text-center py-16">
                        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                            <div className="relative">
                                <div className="w-16 h-16 mx-auto mb-4 relative">
                                    <div className="absolute inset-0 rounded-full border-4 border-pink-200"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-800">Đang tải dữ liệu</h3>
                                    <p className="text-sm text-gray-500">Vui lòng chờ trong giây lát...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-lg mx-auto">
                            <div className="space-y-4">
                                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-gray-800">Không tìm thấy giao dịch</h3>
                                    <p className="text-sm text-gray-500">
                                        {searchTerm || dateFilter 
                                            ? "Không có giao dịch nào phù hợp với bộ lọc hiện tại. Hãy thử điều chỉnh tìm kiếm."
                                            : "Chưa có giao dịch nào trong hệ thống."}
                                    </p>
                                </div>
                                {(searchTerm || dateFilter) && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setDateFilter(null);
                                        }}
                                        className="mt-4 px-4 py-2 bg-pink-500 text-white text-sm font-medium rounded-lg hover:bg-pink-600 transition-colors"
                                    >
                                        Xóa bộ lọc
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>                ) : (
                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            <div className="flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
                                                </svg>
                                                Loại giao dịch
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            <div className="flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Ngày giao dịch
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            <div className="flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Khách hàng
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            <div className="flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Sổ tiết kiệm
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            <div className="flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                                Sản phẩm
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            <div className="flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                </svg>
                                                Số tiền (VND)
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {filteredTransactions.map((transaction, index) => (
                                        <TransactionRow key={transaction.idGiaoDich} transaction={transaction} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                  {/* Pagination Controls */}
                {!loading && !error && totalPages > 1 && (
                    <div className="mt-6 bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">                            {/* Navigation Buttons - Left */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(0)}
                                    disabled={currentPage === 0}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                    </svg>
                                    Đầu tiên
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                    disabled={currentPage === 0}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Trước
                                </button>
                            </div>
                            
                            {/* Page Numbers - Center */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNumber;
                                    if (totalPages <= 5) {
                                        pageNumber = i;
                                    } else if (currentPage < 3) {
                                        pageNumber = i;
                                    } else if (currentPage > totalPages - 4) {
                                        pageNumber = totalPages - 5 + i;
                                    } else {
                                        pageNumber = currentPage - 2 + i;
                                    }
                                    
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className={`min-w-[44px] h-11 text-sm font-medium border rounded-lg transition-all duration-200 shadow-sm ${
                                                currentPage === pageNumber
                                                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white border-pink-500 shadow-md scale-105'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
                                            }`}
                                        >
                                            {pageNumber + 1}
                                        </button>
                                    );
                                })}
                            </div>
                              {/* Navigation Buttons - Right */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                    disabled={currentPage === totalPages - 1}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 shadow-sm"
                                >
                                    Sau
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setCurrentPage(totalPages - 1)}
                                    disabled={currentPage === totalPages - 1}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 shadow-sm"
                                >
                                    Cuối cùng
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        {/* Pagination Info */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>
                                        Hiển thị <span className="font-semibold">{Math.min(currentPage * pageSize + 1, totalElements)}</span> đến{' '}
                                        <span className="font-semibold">{Math.min((currentPage + 1) * pageSize, totalElements)}</span> trong tổng số{' '}
                                        <span className="font-semibold">{totalElements.toLocaleString('vi-VN')}</span> giao dịch
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>Trang {currentPage + 1} / {totalPages}</span>
                                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { 
                    width: 8px; 
                    height: 8px; 
                }
                .custom-scrollbar::-webkit-scrollbar-track { 
                    background: #f8fafc; 
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 100%); 
                    border-radius: 4px; 
                    border: 1px solid #f1f5f9;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
                    background: linear-gradient(180deg, #cbd5e1 0%, #94a3b8 100%); 
                }
                .custom-scrollbar { 
                    scrollbar-width: thin; 
                    scrollbar-color: #cbd5e1 #f8fafc; 
                }
                
                /* Custom styles for react-datepicker */
                .react-datepicker {
                    border-radius: 12px !important;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
                    border: 1px solid #e5e7eb !important;
                }
                
                .react-datepicker__header {
                    background: linear-gradient(135deg, #ec4899 0%, #f97316 100%) !important;
                    border-bottom: none !important;
                    border-radius: 12px 12px 0 0 !important;
                }
                
                .react-datepicker__current-month,
                .react-datepicker__day-name {
                    color: white !important;
                    font-weight: 600 !important;
                }
                
                .react-datepicker__day--selected {
                    background: linear-gradient(135deg, #ec4899 0%, #f97316 100%) !important;
                    color: white !important;
                }
                
                .react-datepicker__day--keyboard-selected {
                    background: rgba(236, 72, 153, 0.2) !important;
                    color: #ec4899 !important;
                }
            `}</style>
        </div>
        </ProtectedRoute>
    );
}