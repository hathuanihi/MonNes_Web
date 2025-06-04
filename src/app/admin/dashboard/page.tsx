"use client";

import AdminHeader from '@/components/header/AdminHeader';
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
    ChartType, // Đảm bảo ChartType được import
    TooltipItem
    // Scale, CoreScaleOptions, ScriptableContext, Color // Bỏ nếu không dùng trực tiếp
} from 'chart.js';
import { useEffect, useRef, useState } from 'react';
// Bỏ AnimatePresence và motion nếu không còn chuyển đổi view trong trang này
// import { motion, AnimatePresence } from 'framer-motion'; 
import { adminGetSystemStatistics } from '@/services/api';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// (Plugin backgroundColor có thể giữ lại hoặc bỏ nếu không dùng)

// Component Dashboard chính
export default function DashboardPage() {
    const chartRefTodayRevenue = useRef<ChartJS<'bar', number[], string>>(null);
    const chartRefAccessToday = useRef<ChartJS<'bar', number[], string>>(null);
    const chartRefThisMonth = useRef<ChartJS<'bar', number[], string>>(null);
    
    // Bỏ state showTransactionDetails
    // const [showTransactionDetails, setShowTransactionDetails] = useState(false); 

    const [stats, setStats] = useState<ThongKeDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const initialChartData: ChartData<'bar'> = { labels: [], datasets: [] };
    const [todayRevenueChartData, setTodayRevenueChartData] = useState<ChartData<'bar'>>(initialChartData);
    const [accessTodayChartData, setAccessTodayChartData] = useState<ChartData<'bar'>>(initialChartData);
    const [thisMonthChartData, setThisMonthChartData] = useState<ChartData<'bar'>>(initialChartData);

    const ADMIN_HEADER_HEIGHT_CSS_VAR = 'var(--admin-header-height, 5rem)'; 

    // Hàm tạo gradient (giữ nguyên)
    const createGradient = (chartInstance: ChartJS<ChartType, number[], string>, colorStops: {offset: number, color: string}[]) => {
        const { ctx, chartArea } = chartInstance;
        if (!chartArea || !ctx) return undefined;
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        colorStops.forEach(stop => gradient.addColorStop(stop.offset, stop.color));
        return gradient;
    };
    
    // useEffects để áp dụng gradient (giữ nguyên logic)
    useEffect(() => { 
        const chartInstance = chartRefTodayRevenue.current;
        if (chartInstance?.data?.datasets?.[0]?.data?.length) {
            // Gradient màu hồng cho doanh thu hôm nay
            const gradient = createGradient(chartInstance, [
                {offset: 0, color: '#FBB6CE'}, // hồng nhạt
                {offset: 0.5, color: '#FB5D5D'}, // hồng đậm
                {offset: 1, color: '#FF086A'} // hồng tươi
            ]);
            if (gradient && chartInstance.data.datasets[0]) chartInstance.data.datasets[0].backgroundColor = gradient;
            if (chartInstance.data.datasets[0]) chartInstance.data.datasets[0].borderColor = '#FF086A';
            if (chartInstance.data.datasets[0]) chartInstance.data.datasets[0].borderWidth = 2;
            chartInstance.update('none');
        }
    }, [todayRevenueChartData]);
    useEffect(() => { 
        const chartInstance = chartRefAccessToday.current;
        if (chartInstance?.data?.datasets?.[0]?.data?.length) {
            // Gradient xanh cho lượt truy cập hôm nay
            const gradient = createGradient(chartInstance, [
                {offset: 0, color: '#BFDBFE'}, // xanh nhạt
                {offset: 0.5, color: '#3B82F6'}, // xanh vừa
                {offset: 1, color: '#1E40AF'} // xanh đậm
            ]);
            if (gradient && chartInstance.data.datasets[0]) chartInstance.data.datasets[0].backgroundColor = gradient;
            if (chartInstance.data.datasets[0]) chartInstance.data.datasets[0].borderColor = '#1E40AF';
            if (chartInstance.data.datasets[0]) chartInstance.data.datasets[0].borderWidth = 2;
            chartInstance.update('none');
        }
    }, [accessTodayChartData]);
    useEffect(() => { 
        const chartInstance = chartRefThisMonth.current;
        if (chartInstance?.data?.datasets?.length) {
            // Gradient cam cho doanh thu tháng này
            const gradientRevenue = createGradient(chartInstance, [
                {offset: 0, color: '#FED7AA'}, // cam nhạt
                {offset: 0.5, color: '#FB923C'}, // cam vừa
                {offset: 1, color: '#EA580C'} // cam đậm
            ]);
            // Gradient teal cho sổ hoạt động
            const gradientAccounts = createGradient(chartInstance, [
                {offset: 0, color: '#A7F3D0'}, // teal nhạt
                {offset: 0.5, color: '#2DD4BF'}, // teal vừa
                {offset: 1, color: '#0D9488'} // teal đậm
            ]);
            // Gradient tím cho lưu lượng dữ liệu (nếu có dataset thứ 2 hoặc 3)
            const gradientDataTraffic = createGradient(chartInstance, [
                {offset: 0, color: '#E0E7FF'}, // tím nhạt
                {offset: 0.5, color: '#A78BFA'}, // tím vừa
                {offset: 1, color: '#7C3AED'} // tím đậm
            ]);
            if (chartInstance.data.datasets[0]) {
                if(gradientRevenue) chartInstance.data.datasets[0].backgroundColor = gradientRevenue;
                chartInstance.data.datasets[0].borderColor = '#EA580C';
                chartInstance.data.datasets[0].borderWidth = 2;
            }
            if (chartInstance.data.datasets[1]) {
                if(gradientAccounts) chartInstance.data.datasets[1].backgroundColor = gradientAccounts;
                chartInstance.data.datasets[1].borderColor = '#0D9488';
                chartInstance.data.datasets[1].borderWidth = 2;
            }
            if (chartInstance.data.datasets[2]) {
                if(gradientDataTraffic) chartInstance.data.datasets[2].backgroundColor = gradientDataTraffic;
                chartInstance.data.datasets[2].borderColor = '#7C3AED';
                chartInstance.data.datasets[2].borderWidth = 2;
            }
            chartInstance.update('none');
        }
    }, [thisMonthChartData]);

    useEffect(() => {
        const fetchData = async () => { 
            try {
                setLoading(true); setError(null);
                const statsData = await adminGetSystemStatistics();
                setStats(statsData);

                setTodayRevenueChartData({
                    labels: ['Hôm nay'],
                    datasets: [{ label: 'Doanh thu (VND)', data: [statsData.doanhThuHomNay || 0] }],
                });
                setAccessTodayChartData({
                    labels: ['Hôm nay'],
                    datasets: [{ label: 'Lượt truy cập', data: [statsData.luotTruyCapHomNay || 0] }],
                });
                setThisMonthChartData({
                    labels: ['Tháng này'],
                    datasets: [
                        { label: 'Doanh thu (VND)', data: [statsData.doanhThuThangNay || 0] },
                        { label: 'Sổ đang hoạt động', data: [statsData.tongSoTaiKhoanTietKiemDangHoatDong || 0] }
                    ],
                });
            } catch (err: any) {
                setError(err.message || "Không thể tải dữ liệu thống kê.");
                console.error("Error fetching stats:", err);
            } finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const commonChartOptions: ChartOptions<'bar'> = { /* ... (giữ nguyên) ... */ 
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top', labels:{color: '#4B5563', font: {size: 12}} },
            title: { display: false },
            tooltip: { callbacks: { label: (context: TooltipItem<'bar'>): string => {
                let label = context.dataset.label || '';
                if (label) { label += ': '; }
                if (context.parsed.y !== null) { label += Number(context.parsed.y).toLocaleString() + (context.dataset.label?.includes('VND') ? ' VND' : (context.dataset.label === 'Lượt truy cập' || context.dataset.label === 'Sổ đang hoạt động' ? '' : '')); }
                return label;
            }}}
        },
        scales: {
            y: { beginAtZero: true, ticks: { color: '#6B7280', font: { size: 10 }, callback: (value) => {
                if (typeof value === 'number') {
                   if (value >= 1000000) return (value/1000000).toLocaleString() + ' Tr';
                   if (value >= 1000) return (value/1000).toLocaleString() + ' K';
                   return value.toLocaleString();
                } return value;
            }}, grid: { color: 'rgba(200, 200, 200, 0.2)' }},
            x: { ticks: { color: '#6B7280', font: { size: 12 } }, grid: { display: false } },
        },
        elements: { bar: { borderRadius: 6, borderSkipped: false, borderWidth: 1 } }
    };
    const todayRevenueOptions: ChartOptions<'bar'> = { ...commonChartOptions, plugins: { ...commonChartOptions.plugins, title: {display: true, text: "Doanh Thu Hôm Nay", color: '#D14F69', font: {size: 16, weight: 600}, padding: {top:5, bottom:15} }}};
    const accessTodayOptions: ChartOptions<'bar'> = { ...commonChartOptions, plugins: { ...commonChartOptions.plugins, title: {display: true, text: "Lượt Truy Cập Hôm Nay", color: '#3B82F6', font: {size: 16, weight: 600}, padding: {top:5, bottom:15} }}};
    const thisMonthOptions: ChartOptions<'bar'> = { ...commonChartOptions, plugins: { ...commonChartOptions.plugins, title: {display: true, text: "Tổng Quan Tháng Này", color: '#0D9488', font: {size: 16, weight: 600}, padding: {top:5, bottom:15} }}};

    if (loading) return <div className="min-h-screen flex flex-col"><AdminHeader /><div className="flex-1 flex justify-center items-center" style={{paddingTop: ADMIN_HEADER_HEIGHT_CSS_VAR}}><p className="text-lg text-gray-600">Đang tải dữ liệu...</p></div></div>;
    if (error) return <div className="min-h-screen flex flex-col"><AdminHeader /><div className="flex-1 flex justify-center items-center" style={{paddingTop: ADMIN_HEADER_HEIGHT_CSS_VAR}}><p className="mt-5 text-red-600 bg-red-100 p-4 rounded-md shadow-md">{error}</p></div></div>;
    if (!stats) return <div className="min-h-screen flex flex-col"><AdminHeader /><div className="flex-1 flex justify-center items-center" style={{paddingTop: ADMIN_HEADER_HEIGHT_CSS_VAR}}><p className="mt-5 text-gray-600">Không có dữ liệu thống kê để hiển thị.</p></div></div>;

    return (
        <div className="flex flex-col text-gray-800 bg-gray-100">         
            <div 
                className="flex-1 flex flex-col"
            >
              <div className="w-full bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB] shadow-md max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-5 border-b border-gray-200 bg-gray-50 relative flex items-center min-h-[70px]">
                <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl font-bold text-white whitespace-nowrap">
                    Tổng Quan
                </h1>
            </div>
                {/* Chỉ hiển thị phần Dashboard chính, không có AnimatePresence và TransactionDetailView */}
                <main className="px-4 md:px-6 lg:px-8 py-8 flex flex-col items-center">
                    {/* Thống kê tổng quan sát ngay dưới tiêu đề */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 w-full max-w-6xl mt-0">
                        {[
                            { title: "Doanh thu hôm nay", value: `${(stats.doanhThuHomNay || 0).toLocaleString()} VND`, color: "text-pink-600", bg: "bg-pink-50" },
                            { title: "Lượt truy cập hôm nay", value: (stats.luotTruyCapHomNay || 0).toLocaleString(), color: "text-blue-600", bg: "bg-blue-50" },
                            { title: "Tổng số người dùng", value: (stats.tongSoNguoiDung || 0).toLocaleString(), color: "text-green-600", bg: "bg-green-50" },
                            { title: "Sổ đang hoạt động", value: (stats.tongSoTaiKhoanTietKiemDangHoatDong || 0).toLocaleString(), color: "text-purple-600", bg: "bg-purple-50" },
                            { title: "Doanh thu tháng này", value: `${(stats.doanhThuThangNay || 0).toLocaleString()} VND`, color: "text-pink-700", bg: "bg-pink-100" },
                            { title: "Truy cập tháng này", value: (stats.luotTruyCapThangNay || 0).toLocaleString(), color: "text-blue-700", bg: "bg-blue-100" },
                            { title: "Tổng dư toàn hệ thống", value: `${(stats.tongSoDuToanHeThong || 0).toLocaleString()} VND`, color: "text-teal-600", bg: "bg-teal-50" },
                        ].map(item => (
                            <div key={item.title} className={`p-5 rounded-xl shadow-lg text-center transition-shadow duration-300 ${item.bg} ${item.color} ring-2 ring-transparent`}> 
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{item.title}</h3>
                                <p className={`text-2xl font-bold ${item.color} mt-1`}>{item.value}</p>
                            </div>
                        ))}
                    </div>
                    {/* Biểu đồ */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-10 w-full max-w-6xl">
                        <div className="bg-gradient-to-br from-pink-100 via-pink-50 to-white rounded-xl shadow-lg p-4 lg:p-6 h-[350px] md:h-[400px]">
                            <Bar ref={chartRefTodayRevenue} data={todayRevenueChartData} options={todayRevenueOptions} />
                        </div>
                        <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-white rounded-xl shadow-lg p-4 lg:p-6 h-[350px] md:h-[400px]">
                            <Bar
                                ref={chartRefAccessToday}
                                data={{
                                    ...accessTodayChartData,
                                    datasets: accessTodayChartData.datasets.map(ds => ({
                                        ...ds,
                                        backgroundColor: chartRefAccessToday.current
                                            ? createGradient(
                                                chartRefAccessToday.current as ChartJS<'bar', number[], string>,
                                                [
                                                    { offset: 0, color: '#BFDBFE' },
                                                    { offset: 0.5, color: '#3B82F6' },
                                                    { offset: 1, color: '#1E40AF' }
                                                ]
                                            )
                                            : ds.backgroundColor,
                                        borderColor: '#1E40AF',
                                        borderWidth: 2
                                    }))
                                }}
                                options={accessTodayOptions}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full max-w-6xl mb-8">
                        <div className="bg-gradient-to-br from-orange-100 via-orange-50 to-white rounded-xl shadow-lg p-4 lg:p-6 h-[400px] md:h-[500px]">
                          {/* Doanh thu tháng này */}
                          <Bar
                            ref={chartRefThisMonth}
                            data={{
                              ...thisMonthChartData,
                              datasets: thisMonthChartData.datasets
                                .filter((_, i) => i === 0)
                                .map(ds => ({
                                  ...ds,
                                  backgroundColor: chartRefThisMonth.current
                                    ? createGradient(
                                      chartRefThisMonth.current as ChartJS<'bar', number[], string>,
                                      [
                                        { offset: 0, color: '#FED7AA' },
                                        { offset: 0.5, color: '#FB923C' },
                                        { offset: 1, color: '#EA580C' }
                                      ]
                                    )
                                    : ds.backgroundColor,
                                  borderColor: '#EA580C',
                                  borderWidth: 2
                                }))
                            }}
                            options={{
                              ...thisMonthOptions,
                              plugins: {
                                ...thisMonthOptions.plugins,
                                title: {
                                  display: true,
                                  text: "Doanh Thu Tháng Này",
                                  color: '#EA580C',
                                  font: { size: 16, weight: 600 },
                                  padding: { top: 5, bottom: 15 }
                                }
                              }
                            }}
                          />
                        </div>
                        <div className="bg-gradient-to-br from-teal-100 via-teal-50 to-white rounded-xl shadow-lg p-4 lg:p-6 h-[400px] md:h-[500px]">
                            {/* Sổ đang hoạt động */}
                            <Bar ref={chartRefThisMonth} data={{
                                ...thisMonthChartData,
                                datasets: thisMonthChartData.datasets.filter((d, i) => i === 1).map(ds => ({
                                    ...ds,
                                    backgroundColor: chartRefThisMonth.current
                                        ? createGradient(
                                            chartRefThisMonth.current,
                                            [
                                                {offset: 0, color: '#A7F3D0'},
                                                {offset: 0.5, color: '#2DD4BF'},
                                                {offset: 1, color: '#0D9488'}
                                            ]
                                        )
                                        : ds.backgroundColor,
                                    borderColor: '#0D9488',
                                    borderWidth: 2
                                }))
                            }} options={{
                                ...thisMonthOptions,
                                plugins: {
                                    ...thisMonthOptions.plugins,
                                    title: {display: true, text: "Sổ Đang Hoạt Động Tháng Này", color: '#0D9488', font: {size: 16, weight: 600}, padding: {top:5, bottom:15}}
                                }
                            }} />
                        </div>
                    </div>

                    {/* NÚT MŨI TÊN XUỐNG ĐÃ BỊ XÓA */}
                    {/* stats.giaoDichGanDayNhat vẫn có thể được dùng cho một phần tóm tắt nhỏ nếu muốn, 
                        nhưng danh sách chi tiết đầy đủ sẽ ở trang khác */}

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
    );
}