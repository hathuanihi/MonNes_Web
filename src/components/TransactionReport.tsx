"use client";

import React, { useState, useEffect } from 'react';
import { 
    adminGetTransactionReportData, 
    adminExportTransactionReportPDF, 
    adminExportTransactionReportExcel,
    userGetTransactionReportData,
    userExportTransactionReportPDF,
    userExportTransactionReportExcel
} from '@/services/api';
import { downloadFile, generateReportFilename } from '@/utils/download';

interface TransactionReportProps {
    isAdmin: boolean;
}

const getTransactionDetails = (type: string) => {
    switch (type) {
        case "Gửi tiền":
            return { text: "Gửi tiền", badgeClass: "bg-green-100 text-green-800", amountClass: "text-green-600" };
        case "Rút tiền":
            return { text: "Rút tiền", badgeClass: "bg-red-100 text-red-800", amountClass: "text-red-600" };
        case "Ghi nhận lãi":
            return { text: "Ghi nhận lãi", badgeClass: "bg-blue-100 text-blue-800", amountClass: "text-blue-600" };
        default:
            return { text: type, badgeClass: "bg-gray-100 text-gray-800", amountClass: "text-gray-600" };
    }
};

const TransactionReport: React.FC<TransactionReportProps> = ({ isAdmin }) => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [reportData, setReportData] = useState<TransactionReportDTO[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Set default dates (last 30 days)
    useEffect(() => {
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        setToDate(today.toISOString().split('T')[0]);
        setFromDate(thirtyDaysAgo.toISOString().split('T')[0]);
    }, []);

    const handleGetReportData = async () => {
        if (!fromDate || !toDate) {
            setError('Vui lòng chọn khoảng thời gian');
            return;
        }

        if (new Date(fromDate) > new Date(toDate)) {
            setError('Ngày bắt đầu không thể lớn hơn ngày kết thúc');
            return;
        }

        setLoading(true);
        setError(null);        try {
            const params: TransactionReportRequest = {
                fromDate: fromDate,
                toDate: toDate
            };

            const response = isAdmin 
                ? await adminGetTransactionReportData(params)
                : await userGetTransactionReportData(params);            // Apply client-side filtering if transaction type is selected
            let filteredData = response;
            if (transactionType) {
                console.log('Filtering by transaction type:', transactionType);
                console.log('All transactions:', response);
                filteredData = response.filter(transaction => 
                    transaction.transactionType === transactionType
                );
                console.log('Filtered transactions:', filteredData);
            }

            setReportData(filteredData);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải báo cáo';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = async () => {
        if (!fromDate || !toDate) {
            setError('Vui lòng chọn khoảng thời gian');
            return;
        }

        setLoading(true);
        setError(null);        try {
            const params: TransactionReportRequest = {
                fromDate: fromDate,
                toDate: toDate
            };

            const response = isAdmin 
                ? await adminExportTransactionReportPDF(params)
                : await userExportTransactionReportPDF(params);

            const filename = generateReportFilename('pdf', fromDate, toDate, isAdmin);
            downloadFile(response, filename);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xuất PDF';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = async () => {
        if (!fromDate || !toDate) {
            setError('Vui lòng chọn khoảng thời gian');
            return;
        }

        setLoading(true);
        setError(null);        try {
            const params: TransactionReportRequest = {
                fromDate: fromDate,
                toDate: toDate
            };

            const response = isAdmin 
                ? await adminExportTransactionReportExcel(params)
                : await userExportTransactionReportExcel(params);

            const filename = generateReportFilename('excel', fromDate, toDate, isAdmin);
            downloadFile(response, filename);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xuất Excel';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    // Calculate summary from array data
    const totalTransactions = reportData?.length || 0;
    const totalAmount = reportData?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Title Header */}
            <div className="w-full">
                <h1
                    className="w-full text-center text-3xl md:text-4xl font-bold text-white py-5 md:py-6 rounded-b-2xl shadow-lg"
                    style={{
                        background: "linear-gradient(90deg, #FF086A 0%, #FB5D5D 50%, #F19BDB 100%)",
                    }}
                >
                    {isAdmin ? 'BÁO CÁO GIAO DỊCH HỆ THỐNG' : 'BÁO CÁO GIAO DỊCH CÁ NHÂN'}
                </h1>
            </div>            {/* Filter Form */}
            <div className="w-full flex justify-center px-4 md:px-6 mt-8 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-200 rounded-xl p-6 w-full max-w-5xl shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Từ ngày
                            </label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Đến ngày
                            </label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại giao dịch
                            </label>
                            <select
                                value={transactionType}
                                onChange={(e) => setTransactionType(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                            >
                                <option value="">Tất cả loại giao dịch</option>
                                <option value="Gửi tiền">Gửi tiền</option>
                                <option value="Rút tiền">Rút tiền</option>
                                <option value="Ghi nhận lãi">Ghi nhận lãi</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>            {/* Action Buttons */}
            <div className="w-full flex justify-center px-4 md:px-6 mb-8">
                <div className="flex flex-wrap gap-4 justify-center">
                    <button
                        onClick={handleGetReportData}
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all duration-200 border border-blue-500 hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Đang tải...</span>
                            </div>
                        ) : (
                            'Xem báo cáo'
                        )}
                    </button>
                    
                    <button
                        onClick={handleExportPDF}
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all duration-200 border border-red-500 hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Đang xuất...</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                <span>Xuất PDF</span>
                            </div>
                        )}
                    </button>
                    
                    <button
                        onClick={handleExportExcel}
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all duration-200 border border-green-500 hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Đang xuất...</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                <span>Xuất Excel</span>
                            </div>
                        )}
                    </button>
                </div>
            </div>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Error Display */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md shadow">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center text-gray-500 py-10 text-lg">
                        <div role="status" className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                        <p className="mt-4 font-semibold">Đang tải dữ liệu báo cáo...</p>
                    </div>
                )}

                {/* Report Summary */}
                {reportData && !loading && (
                    <div className="mb-6">                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-blue-700 mb-1">Tổng giao dịch</h3>
                                        <p className="text-3xl font-bold text-blue-800">{totalTransactions}</p>
                                    </div>
                                    <div className="p-3 bg-blue-200 rounded-full">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-green-700 mb-1">Tổng giá trị</h3>
                                        <p className="text-3xl font-bold text-green-800">{formatCurrency(totalAmount)}</p>
                                    </div>
                                    <div className="p-3 bg-green-200 rounded-full">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-purple-700 mb-1">Khoảng thời gian</h3>
                                        <p className="text-lg font-semibold text-purple-800">
                                            {new Date(fromDate).toLocaleDateString('vi-VN')}
                                        </p>
                                        <p className="text-lg font-semibold text-purple-800">
                                            {new Date(toDate).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-purple-200 rounded-full">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Table */}
                        {reportData.length === 0 ? (
                            <div className="text-center text-gray-500 py-10 mt-10 bg-white p-8 rounded-xl shadow-md">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                                <h3 className="mt-4 text-xl font-semibold text-gray-700">Không có giao dịch nào trong khoảng thời gian này</h3>
                                <p className="mt-1 text-sm text-gray-500">Hãy thử lại với một bộ lọc khác hoặc mở rộng khoảng thời gian.</p>
                            </div>
                        ) : (
                            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider align-middle">ID</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider align-middle">Loại</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider align-middle">Ngày</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider align-middle">Số tiền (VND)</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider align-middle">Tài khoản</th>
                                                {isAdmin && (
                                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider align-middle">Khách hàng</th>
                                                )}
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider align-middle">Số dư sau (VND)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {reportData.map((transaction) => {
                                                const details = getTransactionDetails(transaction.transactionType);
                                                return (
                                                    <tr key={transaction.transactionId} className="hover:bg-pink-50/50 transition-colors duration-150">
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center align-middle text-gray-900">
                                                            {transaction.transactionId}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center align-middle">
                                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${details.badgeClass}`}>
                                                                {details.text}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center align-middle text-gray-500">
                                                            {formatDate(transaction.transactionDate)}
                                                        </td>
                                                        <td className={`px-4 py-3 whitespace-nowrap text-sm text-center align-middle font-semibold ${details.amountClass}`}>
                                                            {transaction.amount.toLocaleString('vi-VN')} VND
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center align-middle text-gray-500 max-w-[150px] truncate" title={transaction.accountName}>
                                                            {transaction.accountName}
                                                        </td>
                                                        {isAdmin && (
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-center align-middle text-gray-800 font-medium max-w-[150px] truncate" title={transaction.customerName || undefined}>
                                                                {transaction.customerName || 'N/A'}
                                                            </td>
                                                        )}
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center align-middle text-gray-500 font-medium">
                                                            {transaction.balanceAfter.toLocaleString('vi-VN')} VND
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
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
    );
};

export default TransactionReport;
