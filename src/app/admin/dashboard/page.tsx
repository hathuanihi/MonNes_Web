"use client";

import AdminHeader from '@/components/header/AdminHeader';
import { useEffect, useState } from 'react';
import { adminGetSystemStatistics, adminGetAllSystemTransactions } from '@/services/api';
import ProtectedRoute, { Role } from '@/components/ProtectedRoute';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  TooltipItem
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Component Dashboard chính
export default function DashboardPage() {
    const [stats, setStats] = useState<ThongKeDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [monthlyRevenueData, setMonthlyRevenueData] = useState<ChartData<'bar'> | null>(null);

    const ADMIN_HEADER_HEIGHT_CSS_VAR = 'var(--admin-header-height, 5rem)'; 

    // Function để xử lý dữ liệu giao dịch thành biểu đồ tháng
    const processTransactionsToMonthlyChart = (transactions: GiaoDichDTO[]): ChartData<'bar'> => {
        console.log('Bắt đầu xử lý dữ liệu giao dịch:', transactions.length);
        
        // Tạo 12 tháng gần nhất với kiểu dữ liệu rõ ràng
        const months: Array<{
            label: string;
            key: string;
            totalRevenue: number;
        }> = [];
        
        const currentDate = new Date();
        
        for (let i = 11; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            months.push({
                label: date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' }),
                key: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
                totalRevenue: 0
            });
        }

        // Xử lý từng giao dịch - cộng tất cả số tiền giao dịch
        let processedCount = 0;
        transactions.forEach((transaction: GiaoDichDTO) => {
            // Ưu tiên sử dụng ngayThucHien từ backend, fallback về ngayGD nếu cần
            const dateField = (transaction as any).ngayThucHien || transaction.ngayGD;
            if (!dateField) {
                console.warn('Transaction missing date field:', transaction);
                return;
            }
            
            const transactionDate = new Date(dateField);
            const monthKey = `${transactionDate.getFullYear()}-${(transactionDate.getMonth() + 1).toString().padStart(2, '0')}`;
            
            const monthData = months.find(m => m.key === monthKey);
            if (monthData) {
                if (transaction.loaiGiaoDich === 'DEPOSIT') { 
                    monthData.totalRevenue += transaction.soTien; 
                }
                else if (transaction.loaiGiaoDich === 'INTEREST') {
                    monthData.totalRevenue -= transaction.soTien ; 
                }
            }
        });

        console.log(`Đã xử lý ${processedCount}/${transactions.length} giao dịch`);
        console.log('Dữ liệu biểu đồ theo tháng:', months);

        return {
            labels: months.map(m => m.label),
            datasets: [
                {
                    label: 'Tổng doanh thu',
                    data: months.map(m => m.totalRevenue),
                    backgroundColor: (context) => {
                        const chart = context.chart;
                        const {ctx, chartArea} = chart;
                        if (!chartArea) return 'rgba(34, 197, 94, 0.8)';
                        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.8)');
                        gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.8)');
                        gradient.addColorStop(1, 'rgba(147, 51, 234, 0.8)');
                        return gradient;
                    },
                    borderColor: (context) => {
                        const chart = context.chart;
                        const {ctx, chartArea} = chart;
                        if (!chartArea) return 'rgb(34, 197, 94)';
                        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                        gradient.addColorStop(0, 'rgb(34, 197, 94)');
                        gradient.addColorStop(0.5, 'rgb(59, 130, 246)');
                        gradient.addColorStop(1, 'rgb(147, 51, 234)');
                        return gradient;
                    },
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }
            ]
        };
    }; 

    useEffect(() => {
        const fetchData = async () => { 
            try {
                setLoading(true); 
                setError(null);
                
                // Fetch thống kê hệ thống
                const statsData = await adminGetSystemStatistics();
                setStats(statsData);

                // Fetch dữ liệu giao dịch để tạo biểu đồ
                // Sử dụng page size lớn hơn để giảm số lần request
                console.log('Bắt đầu fetch dữ liệu giao dịch...');
                const pageSize = 500; // Tăng page size để giảm số request
                const firstPageTransactions = await adminGetAllSystemTransactions(0, pageSize, 'ngayThucHien,DESC');
                let allTransactions: GiaoDichDTO[] = [...firstPageTransactions.content];
                
                console.log(`Trang đầu: ${firstPageTransactions.content.length} giao dịch, tổng ${firstPageTransactions.totalElements} giao dịch`);
                
                // Nếu có nhiều trang, fetch tất cả các trang còn lại
                if (firstPageTransactions.totalPages > 1) {
                    const fetchPromises = [];
                    for (let page = 1; page < firstPageTransactions.totalPages; page++) {
                        fetchPromises.push(adminGetAllSystemTransactions(page, pageSize, 'ngayThucHien,DESC'));
                    }
                    
                    console.log(`Đang fetch ${fetchPromises.length} trang còn lại...`);
                    const remainingPages = await Promise.all(fetchPromises);
                    remainingPages.forEach(pageData => {
                        allTransactions = allTransactions.concat(pageData.content);
                    });
                }

                console.log(`Đã fetch tổng cộng ${allTransactions.length} giao dịch`);
                
                // Xử lý dữ liệu thành biểu đồ tháng
                const chartData = processTransactionsToMonthlyChart(allTransactions);
                setMonthlyRevenueData(chartData);

                console.log('Hoàn thành tạo biểu đồ doanh thu theo tháng');
                
            } catch (err: any) {
                setError(err.message || "Không thể tải dữ liệu thống kê.");
                console.error("Error fetching stats:", err);
            } finally { 
                setLoading(false); 
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="min-h-screen flex flex-col"><AdminHeader /><div className="flex-1 flex justify-center items-center" style={{paddingTop: ADMIN_HEADER_HEIGHT_CSS_VAR}}><p className="text-lg text-gray-600">Đang tải dữ liệu...</p></div></div>;
    if (error) return <div className="min-h-screen flex flex-col"><AdminHeader /><div className="flex-1 flex justify-center items-center" style={{paddingTop: ADMIN_HEADER_HEIGHT_CSS_VAR}}><p className="mt-5 text-red-600 bg-red-100 p-4 rounded-md shadow-md">{error}</p></div></div>;
    if (!stats) return <div className="min-h-screen flex flex-col"><AdminHeader /><div className="flex-1 flex justify-center items-center" style={{paddingTop: ADMIN_HEADER_HEIGHT_CSS_VAR}}><p className="mt-5 text-gray-600">Không có dữ liệu thống kê để hiển thị.</p></div></div>;

    const monthlyRevenueChartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1200, easing: 'easeOutQuart' },
        interaction: {
            intersect: false,
            mode: 'index',
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'TỔNG DOANH THU THEO THÁNG (12 THÁNG GẦN NHẤT)',
                color: '#374151',
                font: { size: 18, weight: 'bold', family: 'Inter, sans-serif' },
                align: 'center',
                padding: { top: 5, bottom: 25 },
            },
            tooltip: {
                enabled: true,
                backgroundColor: '#1F2937',
                titleColor: '#F9FAFB',
                bodyColor: '#F9FAFB',
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 12 },
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                boxPadding: 4,
                caretSize: 8,
                callbacks: {
                    title: (context) => `Tháng ${context[0].label}`,
                    label: (ctx: TooltipItem<'bar'>) => `Tổng doanh thu: ${Number(ctx.parsed.y).toLocaleString('vi-VN')} VND`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#6B7280',
                    font: { size: 12 },
                    callback: (value) => {
                        const num = Number(value);
                        if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
                        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
                        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
                        return num.toLocaleString('vi-VN');
                    }
                },
                grid: {
                    color: '#E5E7EB',
                    // @ts-ignore
                    borderDash: [5, 5],
                },
            },
            x: {
                ticks: { 
                    color: '#6B7280', 
                    font: { size: 11 },
                    maxRotation: 45,
                    minRotation: 45
                },
                grid: {
                    display: false,
                },
            },
        },
    };

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
                    TỔNG QUAN
                </h1>
            </div>
            <div 
                className="flex-1 flex flex-col"
            >
                <main className="px-4 md:px-6 lg:px-8 py-8 flex flex-col items-center">
                    {/* Thống kê tổng quan */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 w-full max-w-6xl mt-0">
                        {[
                            { title: "Doanh thu hôm nay", value: `${(stats.doanhThuHomNay || 0).toLocaleString()} VND`, color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-300", shadow: "hover:shadow-pink-300/50", gradient: "bg-gradient-to-br from-pink-100 via-white to-pink-50" },
                            { title: "Lượt truy cập hôm nay", value: (stats.luotTruyCapHomNay || 0).toLocaleString(), color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-300", shadow: "hover:shadow-blue-300/50", gradient: "bg-gradient-to-br from-blue-100 via-white to-blue-50" },
                            { title: "Tổng số người dùng", value: (stats.tongSoNguoiDung || 0).toLocaleString(), color: "text-green-600", bg: "bg-green-50", border: "border-green-300", shadow: "hover:shadow-green-300/50", gradient: "bg-gradient-to-br from-green-100 via-white to-green-50" },
                            { title: "Sổ đang hoạt động", value: (stats.tongSoTaiKhoanTietKiemDangHoatDong || 0).toLocaleString(), color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-300", shadow: "hover:shadow-purple-300/50", gradient: "bg-gradient-to-br from-purple-100 via-white to-purple-50" },
                            { title: "Doanh thu tháng này", value: `${(stats.doanhThuThangNay || 0).toLocaleString()} VND`, color: "text-pink-700", bg: "bg-pink-100", border: "border-pink-400", shadow: "hover:shadow-pink-400/50", gradient: "bg-gradient-to-br from-pink-200 via-white to-pink-100" },
                            { title: "Truy cập tháng này", value: (stats.luotTruyCapThangNay || 0).toLocaleString(), color: "text-blue-700", bg: "bg-blue-100", border: "border-blue-400", shadow: "hover:shadow-blue-400/50", gradient: "bg-gradient-to-br from-blue-200 via-white to-blue-100" },
                            { title: "Tổng dư toàn hệ thống", value: `${(stats.tongSoDuToanHeThong || 0).toLocaleString()} VND`, color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-400", shadow: "hover:shadow-teal-400/50", gradient: "bg-gradient-to-br from-teal-100 via-white to-teal-50" },
                        ].map(item => (
                            <div key={item.title} className={`p-5 rounded-xl shadow-lg text-center transition-all duration-300 transform hover:scale-[1.06] ${item.bg} ${item.color} ${item.border} border-2 ${item.gradient} ${item.shadow}`}> 
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider drop-shadow-sm">{item.title}</h3>
                                <p className={`text-2xl font-bold ${item.color} mt-1 drop-shadow`}>{item.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Biểu đồ doanh thu theo tháng */}
                    <div className="w-full max-w-6xl mt-8">
                        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 lg:p-8 border border-gray-200/80">
                            <div className="h-[350px] md:h-[400px]">
                                {monthlyRevenueData ? (
                                    <Bar data={monthlyRevenueData} options={monthlyRevenueChartOptions} />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-gray-500">Đang tải dữ liệu biểu đồ...</p>
                                    </div>
                                )}
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
            `}</style>
        </div>
        </ProtectedRoute>
    );
}