"use client";

import React, { useState } from 'react';
import ProtectedRoute, { Role } from '@/components/ProtectedRoute';
import AdminHeader from '@/components/header/AdminHeader';
import TransactionReport from '@/components/TransactionReport';
import { 
    adminGetDailyReport, 
    adminExportDailyReportPDF, 
    adminExportDailyReportExcel,
    adminGetMonthlyReport,
    adminExportMonthlyReportPDF,
    adminExportMonthlyReportExcel
} from '@/services/api';
import { format } from 'date-fns';

const AdminReportsPage = () => {
    const [activeTab, setActiveTab] = useState<'legacy' | 'daily' | 'monthly'>('legacy');
    const [loadingDaily, setLoadingDaily] = useState(false);
    const [loadingMonthly, setLoadingMonthly] = useState(false);
    const [dailyReportData, setDailyReportData] = useState<DailyReportDTO[]>([]);
    const [monthlyReportData, setMonthlyReportData] = useState<MonthlyReportDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    // Date states
    const [dailyDate, setDailyDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [monthlyFromDate, setMonthlyFromDate] = useState(format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'));
    const [monthlyToDate, setMonthlyToDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    // Fetch daily report
    const fetchDailyReport = async () => {
        try {
            setLoadingDaily(true);
            setError(null);
            const data = await adminGetDailyReport(dailyDate);
            setDailyReportData(data);
        } catch (err: any) {
            setError(`Lỗi khi tải báo cáo doanh số ngày: ${err.message}`);
        } finally {
            setLoadingDaily(false);
        }
    };

    // Fetch monthly report
    const fetchMonthlyReport = async () => {
        try {
            setLoadingMonthly(true);
            setError(null);
            const data = await adminGetMonthlyReport(monthlyFromDate, monthlyToDate);
            setMonthlyReportData(data);
        } catch (err: any) {
            setError(`Lỗi khi tải báo cáo mở/đóng sổ tháng: ${err.message}`);
        } finally {
            setLoadingMonthly(false);
        }
    };

    // Export functions
    const exportDailyPDF = async () => {
        try {
            const blob = await adminExportDailyReportPDF(dailyDate);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `daily-report_${dailyDate}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            setError(`Lỗi khi xuất PDF: ${err.message}`);
        }
    };

    const exportDailyExcel = async () => {
        try {
            const blob = await adminExportDailyReportExcel(dailyDate);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `daily-report_${dailyDate}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            setError(`Lỗi khi xuất Excel: ${err.message}`);
        }
    };

    const exportMonthlyPDF = async () => {
        try {
            const blob = await adminExportMonthlyReportPDF(monthlyFromDate, monthlyToDate);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `monthly-report_${monthlyFromDate}_to_${monthlyToDate}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            setError(`Lỗi khi xuất PDF: ${err.message}`);
        }
    };

    const exportMonthlyExcel = async () => {
        try {
            const blob = await adminExportMonthlyReportExcel(monthlyFromDate, monthlyToDate);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `monthly-report_${monthlyFromDate}_to_${monthlyToDate}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            setError(`Lỗi khi xuất Excel: ${err.message}`);
        }
    };

    return (
        <ProtectedRoute requiredRole={Role.ADMIN}>
            <div className="min-h-screen bg-gray-50">
                <div className="fixed top-0 left-0 right-0 z-[100]">
                    <AdminHeader />
                </div>                <div className="w-full" style={{marginTop: '5rem'}}>
                    <h1
                        className="w-full text-center text-3xl md:text-4xl font-bold text-white py-5 md:py-6 rounded-b-2xl shadow-lg"
                        style={{
                            background: "linear-gradient(90deg, #FF086A 0%, #FB5D5D 50%, #F19BDB 100%)",
                        }}
                    >
                        HỆ THỐNG BÁO CÁO
                    </h1>
                </div>                {/* Tab Navigation */}
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                        <div className="flex space-x-1">
                            <button
                                onClick={() => setActiveTab('legacy')}
                                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                    activeTab === 'legacy'
                                        ? 'bg-pink-500 text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                Báo Cáo Giao Dịch
                            </button>
                            <button
                                onClick={() => setActiveTab('daily')}
                                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                    activeTab === 'daily'
                                        ? 'bg-pink-500 text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                Doanh Số Ngày
                            </button>
                            <button
                                onClick={() => setActiveTab('monthly')}
                                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                    activeTab === 'monthly'
                                        ? 'bg-pink-500 text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                Mở/Đóng Sổ Tháng
                            </button>
                        </div>
                    </div>
                </div>                {/* Error Message */}
                {error && (
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    </div>
                )}                {/* Tab Content */}
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    {activeTab === 'legacy' && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <TransactionReport isAdmin={true} />
                        </div>
                    )}                    {activeTab === 'daily' && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="min-h-screen flex flex-col bg-gray-50">                                {/* Filter Form */}
                                <div className="w-full flex justify-center px-4 md:px-6 mt-8 mb-6">
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-200 rounded-xl p-6 w-full max-w-5xl shadow-md">
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Ngày báo cáo
                                                </label>
                                                <input
                                                    type="date"
                                                    value={dailyDate}
                                                    onChange={(e) => setDailyDate(e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>                                {/* Action Buttons */}
                                <div className="w-full flex justify-center px-4 md:px-6 mb-8">
                                    <div className="flex flex-wrap gap-4 justify-center">
                                        <button
                                            onClick={fetchDailyReport}
                                            disabled={loadingDaily}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all duration-200 border border-blue-500 hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            {loadingDaily ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Đang tải...</span>
                                                </div>
                                            ) : (
                                                'Xem báo cáo'
                                            )}
                                        </button>
                                        
                                        <button
                                            onClick={exportDailyPDF}
                                            disabled={dailyReportData.length === 0}
                                            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all duration-200 border border-red-500 hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                                <span>Xuất PDF</span>
                                            </div>
                                        </button>
                                        
                                        <button
                                            onClick={exportDailyExcel}
                                            disabled={dailyReportData.length === 0}
                                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all duration-200 border border-green-500 hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                                <span>Xuất Excel</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">                                    {/* Loading State */}
                                    {loadingDaily && (
                                        <div className="text-center text-gray-500 py-10 text-lg">
                                            <div role="status" className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                                            <p className="mt-4 font-semibold">Đang tải dữ liệu báo cáo...</p>
                                        </div>
                                    )}

                                    {/* Report Summary */}
                                    {dailyReportData.length > 0 && !loadingDaily && (
                                        <div className="mb-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="text-sm font-medium text-blue-700 mb-1">Tổng loại tiết kiệm</h3>
                                                            <p className="text-3xl font-bold text-blue-800">{dailyReportData.length}</p>
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
                                                            <h3 className="text-sm font-medium text-green-700 mb-1">Tổng thu</h3>
                                                            <p className="text-3xl font-bold text-green-800">
                                                                {dailyReportData.reduce((sum, item) => sum + item.tongThu, 0).toLocaleString('vi-VN')} VND
                                                            </p>
                                                        </div>
                                                        <div className="p-3 bg-green-200 rounded-full">
                                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="text-sm font-medium text-red-700 mb-1">Tổng chi</h3>
                                                            <p className="text-3xl font-bold text-red-800">
                                                                {dailyReportData.reduce((sum, item) => sum + item.tongChi, 0).toLocaleString('vi-VN')} VND
                                                            </p>
                                                        </div>
                                                        <div className="p-3 bg-red-200 rounded-full">
                                                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}                                    {/* Daily Report Table */}
                                    {dailyReportData.length > 0 && (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại Tiết Kiệm</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng Thu (VND)</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng Chi (VND)</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Chênh Lệch (VND)</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {dailyReportData.map((item) => (
                                                        <tr key={item.stt} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stt}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.loaiTietKiem}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-medium">
                                                                {item.tongThu.toLocaleString('vi-VN')}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-medium">
                                                                {item.tongChi.toLocaleString('vi-VN')}
                                                            </td>
                                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                                                                item.chenhLech >= 0 ? 'text-green-600' : 'text-red-600'
                                                            }`}>
                                                                {item.chenhLech.toLocaleString('vi-VN')}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </main>
                            </div>
                        </div>
                    )}                    {activeTab === 'monthly' && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="min-h-screen flex flex-col bg-gray-50">                                {/* Filter Form */}
                                <div className="w-full flex justify-center px-4 md:px-6 mt-8 mb-6">
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-200 rounded-xl p-6 w-full max-w-5xl shadow-md">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Từ ngày
                                                </label>
                                                <input
                                                    type="date"
                                                    value={monthlyFromDate}
                                                    onChange={(e) => setMonthlyFromDate(e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Đến ngày
                                                </label>
                                                <input
                                                    type="date"
                                                    value={monthlyToDate}
                                                    onChange={(e) => setMonthlyToDate(e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>                                {/* Action Buttons */}
                                <div className="w-full flex justify-center px-4 md:px-6 mb-8">
                                    <div className="flex flex-wrap gap-4 justify-center">
                                        <button
                                            onClick={fetchMonthlyReport}
                                            disabled={loadingMonthly}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all duration-200 border border-blue-500 hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            {loadingMonthly ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Đang tải...</span>
                                                </div>
                                            ) : (
                                                'Xem báo cáo'
                                            )}
                                        </button>
                                        
                                        <button
                                            onClick={exportMonthlyPDF}
                                            disabled={monthlyReportData.length === 0}
                                            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all duration-200 border border-red-500 hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                                <span>Xuất PDF</span>
                                            </div>
                                        </button>
                                        
                                        <button
                                            onClick={exportMonthlyExcel}
                                            disabled={monthlyReportData.length === 0}
                                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all duration-200 border border-green-500 hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                                <span>Xuất Excel</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">                                    {/* Loading State */}
                                    {loadingMonthly && (
                                        <div className="text-center text-gray-500 py-10 text-lg">
                                            <div role="status" className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                                            <p className="mt-4 font-semibold">Đang tải dữ liệu báo cáo...</p>
                                        </div>
                                    )}

                                    {/* Report Summary */}
                                    {monthlyReportData.length > 0 && !loadingMonthly && (
                                        <div className="mb-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="text-sm font-medium text-blue-700 mb-1">Tổng số ngày</h3>
                                                            <p className="text-3xl font-bold text-blue-800">{monthlyReportData.length}</p>
                                                        </div>
                                                        <div className="p-3 bg-blue-200 rounded-full">
                                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 012 0v4h4V3a1 1 0 012 0v4h3a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="text-sm font-medium text-green-700 mb-1">Tổng sổ mở</h3>
                                                            <p className="text-3xl font-bold text-green-800">
                                                                {monthlyReportData.reduce((sum, item) => sum + item.soSoMo, 0)}
                                                            </p>
                                                        </div>
                                                        <div className="p-3 bg-green-200 rounded-full">
                                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="text-sm font-medium text-orange-700 mb-1">Tổng sổ đóng</h3>
                                                            <p className="text-3xl font-bold text-orange-800">
                                                                {monthlyReportData.reduce((sum, item) => sum + item.soSoDong, 0)}
                                                            </p>
                                                        </div>
                                                        <div className="p-3 bg-orange-200 rounded-full">
                                                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}                                    {/* Monthly Report Table */}
                                    {monthlyReportData.length > 0 && (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số Sổ Mở</th>
                                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số Sổ Đóng</th>
                                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Chênh Lệch</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {monthlyReportData.map((item) => (
                                                        <tr key={item.stt} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stt}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.ngay}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-blue-600 font-medium">
                                                                {item.soSoMo}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-orange-600 font-medium">
                                                                {item.soSoDong}
                                                            </td>
                                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-center font-medium ${
                                                                item.chenhLech >= 0 ? 'text-green-600' : 'text-red-600'
                                                            }`}>
                                                                {item.chenhLech > 0 ? '+' : ''}{item.chenhLech}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </main>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default AdminReportsPage;
