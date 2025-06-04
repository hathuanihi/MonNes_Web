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
    ChartType, 
    TooltipItem
    // Scale, CoreScaleOptions, ScriptableContext, Color 
} from 'chart.js';
import { useEffect, useRef, useState } from 'react';
import { adminGetSystemStatistics } from '@/services/api';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


// Component Dashboard chính
export default function DashboardPage() {
    const chartRefTodayRevenue = useRef<ChartJS<'bar', number[], string>>(null);
    const chartRefAccessToday = useRef<ChartJS<'bar', number[], string>>(null);
    const chartRefThisMonth = useRef<ChartJS<'bar', number[], string>>(null);
    
    // const [showTransactionDetails, setShowTransactionDetails] = useState(false); 

    const [stats, setStats] = useState<ThongKeDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const initialChartData: ChartData<'bar'> = { labels: [], datasets: [] };
    const [todayRevenueChartData, setTodayRevenueChartData] = useState<ChartData<'bar'>>(initialChartData);
    const [accessTodayChartData, setAccessTodayChartData] = useState<ChartData<'bar'>>(initialChartData);
    const [thisMonthChartData, setThisMonthChartData] = useState<ChartData<'bar'>>(initialChartData);

    const ADMIN_HEADER_HEIGHT_CSS_VAR = 'var(--admin-header-height, 5rem)'; 

    // Hàm tạo gradient 
    const createGradient = (chartInstance: ChartJS<ChartType, number[], string>, colorStops: {offset: number, color: string}[]) => {
        const { ctx, chartArea } = chartInstance;
        if (!chartArea || !ctx) return undefined;
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        colorStops.forEach(stop => gradient.addColorStop(stop.offset, stop.color));
        return gradient;
    };
    
    // useEffects để áp dụng gradient 
    useEffect(() => { 
        const chartInstance = chartRefTodayRevenue.current;
        if (chartInstance?.data?.datasets?.[0]?.data?.length) {
            // Gradient màu hồng cho doanh thu hôm nay
            const gradient = createGradient(chartInstance, [
                {offset: 0, color: '#FBB6CE'}, 
                {offset: 0.5, color: '#FB5D5D'}, 
                {offset: 1, color: '#FF086A'} 
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
            const gradient = createGradient(chartInstance, [
                {offset: 0, color: '#BFDBFE'}, 
                {offset: 0.5, color: '#3B82F6'}, 
                {offset: 1, color: '#1E40AF'} 
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
            const gradientRevenue = createGradient(chartInstance, [
                {offset: 0, color: '#FED7AA'}, 
                {offset: 0.5, color: '#FB923C'}, 
                {offset: 1, color: '#EA580C'} 
            ]);
            const gradientAccounts = createGradient(chartInstance, [
                {offset: 0, color: '#A7F3D0'}, 
                {offset: 0.5, color: '#2DD4BF'}, 
                {offset: 1, color: '#0D9488'} 
            ]);
            const gradientDataTraffic = createGradient(chartInstance, [
                {offset: 0, color: '#E0E7FF'}, 
                {offset: 0.5, color: '#A78BFA'}, 
                {offset: 1, color: '#7C3AED'} 
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

    const commonChartOptions: ChartOptions<'bar'> = { 
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top', labels:{color: '#4B5563', font: {size: 12}} },
            title: { display: false },
            tooltip: { callbacks: { label: (context: TooltipItem<'bar'>): string => {
                let label = context.dataset.label || '';
                if (label) { label += ': '; }
                if (context.parsed.y !== null) { 
                    label += Number(context.parsed.y)
                                .toLocaleString() + (context.dataset.label?.includes('VND') ? ' VND' : (context.dataset.label === 'Lượt truy cập' || context.dataset.label === 'Sổ đang hoạt động' ? '' : '')); 
                            }
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
                    {/* Biểu đồ */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-10 w-full max-w-6xl">
                        <div className="bg-gradient-to-br from-pink-200 via-pink-50 to-white rounded-xl shadow-2xl p-4 lg:p-6 h-[350px] md:h-[400px] border-2 border-pink-300 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_8px_32px_0_rgba(255,8,106,0.18)]">
                            <Bar ref={chartRefTodayRevenue} data={{
                                ...todayRevenueChartData,
                                datasets: todayRevenueChartData.datasets.map(ds => ({
                                    ...ds,
                                    backgroundColor: chartRefTodayRevenue.current
                                        ? createGradient(
                                            chartRefTodayRevenue.current,
                                            [
                                                { offset: 0, color: '#FBB6CE' },
                                                { offset: 0.5, color: '#FB5D5D' },
                                                { offset: 1, color: '#FF086A' }
                                            ]
                                        )
                                        : ds.backgroundColor,
                                    borderColor: '#FF086A',
                                    borderWidth: 3
                                }))
                            }} options={todayRevenueOptions} />
                        </div>
                        <div className="bg-gradient-to-br from-blue-200 via-blue-50 to-white rounded-xl shadow-2xl p-4 lg:p-6 h-[350px] md:h-[400px] border-2 border-blue-300 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.18)]">
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
                                        borderWidth: 3
                                    }))
                                }}
                                options={accessTodayOptions}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full max-w-6xl mb-8">
                        <div className="bg-gradient-to-br from-orange-200 via-orange-50 to-white rounded-xl shadow-2xl p-4 lg:p-6 h-[400px] md:h-[500px] border-2 border-orange-300 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_8px_32px_0_rgba(251,146,60,0.18)]">
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
                                  borderWidth: 3
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
                        <div className="bg-gradient-to-br from-purple-200 via-pink-100 to-white rounded-xl shadow-2xl p-4 lg:p-6 h-[400px] md:h-[500px] border-2 border-pink-400 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_8px_32px_0_rgba(255,8,106,0.18)]">
                            {/* Sổ đang hoạt động */}
                            <Bar ref={chartRefThisMonth} data={{
                                ...thisMonthChartData,
                                datasets: thisMonthChartData.datasets.filter((d, i) => i === 1).map(ds => ({
                                    ...ds,
                                    backgroundColor: chartRefThisMonth.current
                                        ? createGradient(
                                            chartRefThisMonth.current,
                                            [
                                                {offset: 0, color: '#FBB6CE'},
                                                {offset: 0.5, color: '#FB5D5D'},
                                                {offset: 1, color: '#FF086A'}
                                            ]
                                        )
                                        : ds.backgroundColor,
                                    borderColor: '#FF086A',
                                    borderWidth: 3
                                }))
                            }} options={{
                                ...thisMonthOptions,
                                plugins: {
                                    ...thisMonthOptions.plugins,
                                    title: {display: true, text: "Sổ Đang Hoạt Động Tháng Này", color: '#FF086A', font: {size: 16, weight: 600}, padding: {top:5, bottom:15}}
                                }
                            }} />
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
    );
}