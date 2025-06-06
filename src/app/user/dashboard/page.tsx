"use client";

import React, { useState, useRef, useEffect } from "react";
import UserHeader from "@/components/header/UserHeader";
import { FaWallet, FaArrowDown, FaArrowUp, FaMoneyBillWave, FaBars, FaChevronDown, FaChevronUp, FaPen } from "react-icons/fa";
import { MdOutlineSavings } from "react-icons/md";
import { useRouter } from "next/navigation";
import { userGetDashboardOverview, userGetRecentTransactions } from "@/services/api";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  TooltipItem
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// ... (Các type definition không thay đổi)
type GiaoDichDTO = {
    idGiaoDich: number;
    loaiGiaoDich: "DEPOSIT" | "WITHDRAW" | "INTEREST_ACCRUAL" | "INTEREST_PAYMENT";
    soTien: number;
    ngayGD: string; // "YYYY-MM-DD"
    maKhachHang?: number;
    tenKhachHang?: string | null;
    maSoMoTietKiem?: number;
    tenSoMoTietKiem?: string | null;
    tenSanPhamSoTietKiem?: string | null;
};

type AccountSummary = {
  tongSoDuTrongTatCaSo: number;
  tongTienDaNapTuTruocDenNay: number;
  tongTienDaRutTuTruocDenNay: number;
};

type ActiveSavingsAccount = {
  maMoSo: number;
  tenSoMo: string;
  soDuHienTai: number;
  tenNguoiDung: string;
  tenSanPhamSoTietKiem: string;
  kyHanSanPham: number;
  laiSuatApDungChoSoNay: number;
};

type OverviewData = {
    accountSummary: AccountSummary;
    activeSavingsAccounts: ActiveSavingsAccount[];
}


export default function UserDashboard() {
  const [showRevenue, setShowRevenue] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showQuickPanel, setShowQuickPanel] = useState(false);
  const [openSavings, setOpenSavings] = useState<{ [key: string]: boolean }>({});

  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<GiaoDichDTO[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ... (useEffect và các hàm khác giữ nguyên)
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [overviewResult, transactions] = await Promise.all([
                userGetDashboardOverview(),
                userGetRecentTransactions(30)
            ]);
            const dashboardObject = overviewResult as any as OverviewData;
            if (dashboardObject && dashboardObject.accountSummary && dashboardObject.activeSavingsAccounts) {
                setOverviewData(dashboardObject);
            } else {
                console.warn("Nhận được đối tượng tổng quan rỗng hoặc không hợp lệ từ API:", dashboardObject);
                setOverviewData(null);
            }
            setRecentTransactions(transactions);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu dashboard:", error);
            setOverviewData(null);
            setRecentTransactions([]);
        }
    };
    fetchData();
  }, []);

  const getTransactionDetails = (type: GiaoDichDTO['loaiGiaoDich']) => {
    switch (type) {
      case "DEPOSIT": return { text: "Gửi tiền", badgeClass: "bg-green-100 text-green-800", amountClass: "text-green-600" };
      case "WITHDRAW": return { text: "Rút tiền", badgeClass: "bg-red-100 text-red-800", amountClass: "text-red-600" };
      case "INTEREST_PAYMENT": return { text: "Trả lãi", badgeClass: "bg-blue-100 text-blue-800", amountClass: "text-blue-600" };
      default: return { text: type, badgeClass: "bg-gray-100 text-gray-800", amountClass: "text-gray-600" };
    }
  };
  const handleToggleSavings = (key: string) => { setOpenSavings((prev) => ({ ...prev, [key]: !prev[key] })); };

  // Khối tính toán và cấu hình biểu đồ
  let lineChartData: ChartData<'line'> = { labels: [], datasets: [] };

  if (recentTransactions.length > 0 && overviewData) {
    const sorted = [...recentTransactions].sort((a, b) => new Date(a.ngayGD).getTime() - new Date(b.ngayGD).getTime());
    const netChange = sorted.reduce((acc, tx) => {
        if (tx.loaiGiaoDich === 'DEPOSIT' || tx.loaiGiaoDich === 'INTEREST_PAYMENT') return acc + tx.soTien;
        if (tx.loaiGiaoDich === 'WITHDRAW') return acc - tx.soTien;
        return acc;
    }, 0);
    let currentBalance = overviewData.accountSummary.tongSoDuTrongTatCaSo - netChange;
    const dateMap: { [date: string]: number } = {};
    const labelsSet = new Set<string>();
    sorted.forEach(tx => {
        const date = new Date(tx.ngayGD).toLocaleDateString('vi-VN');
        if (tx.loaiGiaoDich === 'DEPOSIT' || tx.loaiGiaoDich === 'INTEREST_PAYMENT') currentBalance += tx.soTien;
        else if (tx.loaiGiaoDich === 'WITHDRAW') currentBalance -= tx.soTien;
        dateMap[date] = currentBalance;
        labelsSet.add(date);
    });
    const labels = Array.from(labelsSet).sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('/').map(Number);
        const [dayB, monthB, yearB] = b.split('/').map(Number);
        return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
    });
    const data = labels.map(date => dateMap[date]);

    lineChartData = {
      labels,
      datasets: [
        {
          label: 'Tổng số dư',
          data,
          fill: true,
          // NÂNG CẤP: Tạo gradient đa sắc cho đường kẻ
          borderColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return undefined; // Fallback
            // Gradient theo chiều ngang
            const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
            gradient.addColorStop(0, 'rgba(142, 45, 226, 1)');   // Màu Tím
            gradient.addColorStop(0.5, 'rgba(255, 8, 106, 1)');   // Màu Hồng (màu chính)
            gradient.addColorStop(1, 'rgba(251, 93, 93, 1)');   // Màu Cam đỏ
            return gradient;
          },
          // NÂNG CẤP: Tinh chỉnh gradient cho vùng nền
          backgroundColor: (context) => {
            const chart = context.chart;
            const {ctx: c, chartArea} = chart;
            if (!chartArea) return 'rgba(255,8,106,0.03)';
            // Gradient theo chiều dọc
            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(255, 8, 106, 0.3)');  // Màu hồng ở trên
            gradient.addColorStop(1, 'rgba(251, 93, 93, 0.01)'); // Màu cam trong suốt ở dưới
            return gradient;
          },
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 8,
          pointBackgroundColor: '#FF086A',
          pointBorderColor: '#fff',
          pointHoverBorderWidth: 3,
          borderWidth: 3.5, // Tăng độ dày đường kẻ một chút
        },
      ],
    };
  }

  const lineChartOptions: ChartOptions<'line'> = {
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
        text: 'BIẾN ĐỘNG SỐ DƯ',
        color: '#374151',
        font: { size: 18, weight: 'bold', family: 'Inter, sans-serif' }, // Tăng cỡ chữ
        // NÂNG CẤP: Căn giữa tiêu đề
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
          title: (context) => `Ngày: ${context[0].label}`,
          label: (ctx: TooltipItem<'line'>) => `Số dư: ${Number(ctx.parsed.y).toLocaleString('vi-VN')} VND`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: { 
            color: '#6B7280', 
            font: { size: 12 },
            callback: (value) => {
                const num = Number(value);
                if (num >= 1e9) return `${(num / 1e9).toFixed(1)} tỷ`;
                if (num >= 1e6) return `${(num / 1e6).toFixed(0)} tr`;
                if (num >= 1e3) return `${(num / 1e3).toFixed(0)} k`;
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
        ticks: { color: '#6B7280', font: { size: 12 } },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      ref={scrollRef}
      style={{ transition: "opacity 0.4s" }}
    >
      <div className="fixed top-0 left-0 right-0 z-[100]">
        <UserHeader />
      </div>

      <div className="w-full" style={{marginTop: '5rem'}}>
          <div className="relative flex items-center justify-center">
              <h1
                className="w-full text-center text-3xl md:text-4xl font-bold text-white py-5 md:py-6 rounded-b-2xl"
                style={{
                background: "linear-gradient(90deg, #FF086A 0%, #FB5D5D 50%, #F19BDB 100%)",
              }}
              >
                {showRevenue ? "TỔNG QUAN SỔ TIẾT KIỆM" : "GIAO DỊCH GẦN ĐÂY"}
              </h1>
              <button
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-2xl md:text-3xl hover:text-pink-200 focus:outline-none"
                onClick={() => setShowQuickPanel(true)}
                aria-label="Mở bảng thông tin nhanh"
              >
              <FaBars />
              </button>
          </div>
      </div>
      
       {showQuickPanel && overviewData && (
        <div className="fixed top-0 right-0 h-full w-[340px] md:w-[400px] bg-gradient-to-br from-[#FF086A]/90 via-[#FB5D5D]/90 to-[#F19BDB]/90 shadow-2xl z-[100] flex flex-col p-6 animate-slideIn">
        <button
          className="absolute top-4 right-4 text-white text-2xl hover:text-pink-200 focus:outline-none"
          onClick={() => setShowQuickPanel(false)}
          aria-label="Đóng bảng thông tin nhanh"
        >
          ×
        </button>
        <div className="flex flex-col items-center mt-8 mb-6">
          <div className="w-24 h-24 rounded-full bg-white/40 flex items-center justify-center mb-3">
            <span className="text-6xl text-white">👤</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold text-white">{overviewData.activeSavingsAccounts?.[0]?.tenNguoiDung || "--"}</div>
            <button
              className="text-white/80 hover:text-white text-lg p-1"
              onClick={() => { setShowQuickPanel(false); router.push('/user/profile'); }}
              aria-label="Chỉnh sửa hồ sơ"
            >
              <FaPen />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4 mb-6">
          {overviewData.activeSavingsAccounts?.map((s) => (
            <div key={s.maMoSo} className="bg-white/20 rounded-lg px-4 pt-3 pb-2">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => handleToggleSavings(String(s.maMoSo))}>
                <span className="text-white text-base font-medium">{s.tenSoMo}</span>
                <span className="text-white text-base font-semibold">{s.soDuHienTai.toLocaleString('vi-VN')} VND</span>
                <span className="ml-2 text-white text-lg">
                  {openSavings[String(s.maMoSo)] ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              {openSavings[String(s.maMoSo)] && (
                <div className="mt-3 bg-white/30 rounded-lg p-3 text-sm text-white">
                  <div className="flex justify-between py-1 border-b border-white/30 last:border-b-0"><span>Chủ sở hữu</span><span>{s.tenNguoiDung}</span></div>
                  <div className="flex justify-between py-1 border-b border-white/30 last:border-b-0"><span>Sổ</span><span>{s.tenSanPhamSoTietKiem}</span></div>
                  <div className="flex justify-between py-1 border-b border-white/30 last:border-b-0"><span>Số dư</span><span>{s.soDuHienTai.toLocaleString('vi-VN')} VND</span></div>
                  <div className="flex justify-between py-1 border-b border-white/30 last:border-b-0"><span>Kỳ hạn</span><span>{s.kyHanSanPham ? `${s.kyHanSanPham} tháng` : 'Không kỳ hạn'}</span></div>
                  <div className="flex justify-between py-1"><span>Lãi suất</span><span>{s.laiSuatApDungChoSoNay ? `${s.laiSuatApDungChoSoNay.toFixed(2)}%/năm` : '--'}</span></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between bg-white/20 rounded-lg px-4 py-2 mb-2">
          <span className="text-white text-base font-medium">Tổng số dư các sổ</span>
          <span className="text-white text-base font-semibold">{overviewData.accountSummary?.tongSoDuTrongTatCaSo?.toLocaleString('vi-VN') || '--'} VND</span>
        </div>
      </div>
       )}

      <div className="max-w-7xl mx-auto pt-10 px-4 sm:px-6 lg:px-8" style={{ opacity: isTransitioning ? 0.5 : 1, transition: "opacity 0.4s" }}>
        {showRevenue && (
            <>
            <div className="flex flex-col md:flex-row gap-6 lg:gap-8 justify-center mt-0">
                <div className="flex-1 min-w-[280px] bg-white rounded-2xl p-6 flex flex-col items-center shadow-sm border border-gray-200/80">
                    <FaWallet className="text-3xl text-pink-500 mb-3" />
                    <div className="text-base text-gray-500">Tổng số dư các sổ</div>
                    <div className="text-2xl lg:text-3xl font-bold text-gray-800 mt-2">{overviewData?.accountSummary?.tongSoDuTrongTatCaSo?.toLocaleString('vi-VN') || '--'} VND</div>
                </div>
                <div className="flex-1 min-w-[280px] bg-white rounded-2xl p-6 flex flex-col items-center shadow-sm border border-gray-200/80">
                    <FaMoneyBillWave className="text-3xl text-red-500 mb-3" />
                    <div className="text-base text-gray-500">Tổng tiền đã rút</div>
                    <div className="text-2xl lg:text-3xl font-bold text-gray-800 mt-2">{overviewData?.accountSummary?.tongTienDaRutTuTruocDenNay?.toLocaleString('vi-VN') || '--'} VND</div>
                </div>
                <div className="flex-1 min-w-[280px] bg-white rounded-2xl p-6 flex flex-col items-center shadow-sm border border-gray-200/80">
                    <MdOutlineSavings className="text-3xl text-green-500 mb-3" />
                    <div className="text-base text-gray-500">Tổng tiền đã nạp</div>
                    <div className="text-2xl lg:text-3xl font-bold text-gray-800 mt-2">{overviewData?.accountSummary?.tongTienDaNapTuTruocDenNay?.toLocaleString('vi-VN') || '--'} VND</div>
                </div>
            </div>
            
            {recentTransactions.length > 0 && overviewData ? (
                <div className="mt-12 bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 lg:p-8 border border-gray-200/80">
                    <div className="h-[280px] md:h-[350px]">
                        <Line data={lineChartData} options={lineChartOptions} />
                    </div>
                </div>
            ) : (
                <div className="mt-12 text-center text-gray-500 py-16 bg-white rounded-2xl shadow-md">
                    Không đủ dữ liệu để vẽ biểu đồ.
                </div>
            )}
            
            <div className="flex justify-center mt-12">
              <button
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setShowRevenue(false);
                      setIsTransitioning(false);
                    }, 400);
                  }
                }}
                className="w-14 h-14 bg-[#FF086A] rounded-full flex items-center justify-center hover:bg-[#FB5D5D] transition-colors shadow-lg"
                disabled={isTransitioning}
              >
                <FaArrowDown className="text-white text-3xl" />
              </button>
            </div>
          </>
        )}

        {!showRevenue && (
         <>
           <div className="flex flex-col items-center mt-0">
             <div className="w-full">
               {recentTransactions.length > 0 ? (
                 <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
                   <div className="overflow-x-auto custom-scrollbar">
                     <table className="min-w-full divide-y divide-gray-200 text-base">
                       <thead className="bg-gray-100">
                         <tr>
                           <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider align-middle">Loại</th>
                           <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider align-middle">Ngày</th>
                           <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider align-middle">Sổ Tiết Kiệm</th>
                           <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider align-middle">Số Tiền (VND)</th>
                         </tr>
                       </thead>
                       <tbody className="bg-white divide-y divide-gray-200">
                         {recentTransactions.map((tx) => {
                           const details = getTransactionDetails(tx.loaiGiaoDich);
                           return (
                               <tr key={tx.idGiaoDich} className="hover:bg-pink-50/60 transition-colors duration-150">
                               <td className="px-6 py-4 whitespace-nowrap text-base text-center align-middle">
                                   <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full items-center ${details.badgeClass}`}>
                                   {details.text}
                                   </span>
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap text-base text-center align-middle text-gray-500">
                                   {new Date(tx.ngayGD).toLocaleDateString('vi-VN')}
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap text-base text-center align-middle text-gray-800 font-medium max-w-[220px] truncate" title={tx.tenSoMoTietKiem || undefined}>
                                   {tx.tenSoMoTietKiem || 'N/A'}
                               </td>
                               <td className={`px-6 py-4 whitespace-nowrap text-base text-center align-middle font-bold ${details.amountClass}`}>
                                   {tx.soTien.toLocaleString('vi-VN')} VND
                               </td>
                               </tr>
                           );
                         })}
                       </tbody>
                     </table>
                   </div>
                 </div>
               ) : <div className="text-center text-gray-500 py-8">Không có giao dịch gần đây.</div>}
             </div>
           </div>
           
           <div className="flex justify-center mt-10">
             <button
               onClick={() => {
                 if (!isTransitioning) {
                   setIsTransitioning(true);
                   setTimeout(() => {
                     setShowRevenue(true);
                     setIsTransitioning(false);
                   }, 400);
                 }
               }}
               className="w-14 h-14 bg-[#FF086A] rounded-full flex items-center justify-center hover:bg-[#FB5D5D] transition-colors shadow-lg"
               disabled={isTransitioning}
             >
               <FaArrowUp className="text-white text-3xl" />
             </button>
           </div>
         </>
       )}
      </div>
    </div>
  );
}