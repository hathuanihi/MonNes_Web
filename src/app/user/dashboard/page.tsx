"use client";

import React, { useState, useRef, useEffect } from "react";
import UserHeader from "@/components/header/UserHeader";
import { FaWallet, FaArrowDown, FaArrowUp, FaMoneyBillWave, FaBars, FaChevronDown, FaChevronUp, FaPen } from "react-icons/fa";
import { MdOutlineSavings } from "react-icons/md";
import { useRouter } from "next/navigation";
import { userGetDashboardOverview } from "@/services/api";
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
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function UserDashboard() {
  const [showRevenue, setShowRevenue] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showQuickPanel, setShowQuickPanel] = useState(false);
  const [openSavings, setOpenSavings] = useState<{ [key: string]: boolean }>({});
  // Fix: define types for dashboardData
  type DashboardOverview = {
    recentTransactions: Array<{
      idGiaoDich: number;
      loaiGiaoDich: string;
      soTien: number;
      ngayGD: string;
      tenSoMoTietKiem: string;
    }>;
    accountSummary: {
      tongSoDuTrongTatCaSo: number;
      tongTienDaNapTuTruocDenNay: number;
      tongTienDaRutTuTruocDenNay: number;
    };
    activeSavingsAccounts: Array<{
      maMoSo: number;
      tenSoMo: string;
      soDuHienTai: number;
      tenNguoiDung: string;
      tenSanPhamSoTietKiem: string;
      kyHanSanPham: number;
      laiSuatApDungChoSoNay: number;
    }>;
  };
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    userGetDashboardOverview()
      .then((data: any) => setDashboardData(data as DashboardOverview))
      .catch(() => setDashboardData(null));
  }, []);

  const handleToggleSavings = (key: string) => {
    setOpenSavings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Tính dữ liệu biểu đồ tổng số dư ví theo thời gian
  let lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  if (dashboardData?.recentTransactions?.length) {
    // Gom nhóm theo ngày, tính tổng số dư cộng dồn
    const sorted = [...dashboardData.recentTransactions].sort((a, b) => new Date(a.ngayGD).getTime() - new Date(b.ngayGD).getTime());
    const dateMap: { [date: string]: number } = {};
    let currentBalance = 0;
    sorted.forEach(tx => {
      const date = tx.ngayGD;
      if (!(date in dateMap)) dateMap[date] = currentBalance;
      if (tx.loaiGiaoDich === 'Gửi tiền') currentBalance += tx.soTien;
      else if (tx.loaiGiaoDich === 'Rút tiền') currentBalance -= tx.soTien;
      dateMap[date] = currentBalance;
    });
    const labels = Object.keys(dateMap).sort();
    const data = labels.map(date => dateMap[date]);
    lineChartData = {
      labels,
      datasets: [
        {
          label: 'Tổng số dư ví',
          data,
          fill: true,
          borderColor: (ctx) => {
            const chart = ctx.chart;
            const {ctx: c, chartArea} = chart;
            if (!chartArea) return '#FF086A';
            const gradient = c.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, '#FBB6CE');
            gradient.addColorStop(0.5, '#FB5D5D');
            gradient.addColorStop(1, '#FF086A');
            return gradient;
          },
          backgroundColor: (ctx) => {
            const chart = ctx.chart;
            const {ctx: c, chartArea} = chart;
            if (!chartArea) return 'rgba(255,8,106,0.08)';
            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(255,8,106,0.18)');
            gradient.addColorStop(1, 'rgba(255,8,106,0.03)');
            return gradient;
          },
          tension: 0.35,
          pointRadius: 5,
          pointBackgroundColor: '#FF086A',
          borderWidth: 3,
        },
      ],
    };
  }
  const lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    animation: {
      duration: 1200,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: { display: true, position: 'top', labels: { color: '#4B5563', font: { size: 13, weight: 'bold' } } },
      title: { display: true, text: 'Biểu đồ thay đổi tổng số dư ví theo thời gian', color: '#FF086A', font: { size: 17, weight: 700 }, padding: { top: 5, bottom: 15 } },
      tooltip: { callbacks: { label: (ctx) => `Tổng số dư: ${Number(ctx.parsed.y).toLocaleString('vi-VN')} VND` }, backgroundColor: '#FF086A', titleColor: '#fff', bodyColor: '#fff', borderColor: '#fff', borderWidth: 1 },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: '#6B7280', font: { size: 11, weight: 'bold' }, callback: (value) => typeof value === 'number' ? value.toLocaleString('vi-VN') : value }, grid: { color: 'rgba(200, 200, 200, 0.18)' } },
      x: { ticks: { color: '#6B7280', font: { size: 12, weight: 'bold' } }, grid: { display: false } },
    },
    elements: { line: { borderWidth: 3 }, point: { radius: 5 } },
  };

  return (
    <div
      className="min-h-screen bg-white"
      ref={scrollRef}
      style={{ transition: "opacity 0.4s" }}
    >
      {/* Header */}
      {/* <div className="w-full fixed top-0 left-0 z-50"> */}
        <UserHeader />
      {/* </div> */}

      {/* Dashboard Title Bar with Hamburger */}
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
          {/* Hamburger Icon */}
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-2xl md:text-3xl hover:text-pink-200 focus:outline-none"
            onClick={() => setShowQuickPanel(true)}
            aria-label="Mở bảng thông tin nhanh"
          >
            <FaBars />
          </button>
        </div>
      </div>
      {/* Quick Info Panel */}
      {showQuickPanel && dashboardData && (
        <div className="fixed top-0 right-0 h-full w-[340px] md:w-[400px] bg-gradient-to-br from-[#FF086A]/90 via-[#FB5D5D]/90 to-[#F19BDB]/90 shadow-2xl z-[100] flex flex-col p-6 animate-slideIn">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-pink-200 focus:outline-none"
            onClick={() => setShowQuickPanel(false)}
            aria-label="Đóng bảng thông tin nhanh"
          >
            ×
          </button>
          {/* Avatar & Name */}
          <div className="flex flex-col items-center mt-8 mb-6">
            <div className="w-24 h-24 rounded-full bg-white/40 flex items-center justify-center mb-3">
              <span className="text-6xl text-white">👤</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xl font-bold text-white">{dashboardData.activeSavingsAccounts?.[0]?.tenNguoiDung || "--"}</div>
              <button
                className="text-white/80 hover:text-white text-lg p-1"
                onClick={() => { setShowQuickPanel(false); router.push('/user/profile'); }}
                aria-label="Chỉnh sửa hồ sơ"
              >
                <FaPen />
              </button>
            </div>
            {/* <div className="text-sm text-white/80 mt-1">{dashboardData.activeSavingsAccounts?.[0]?.maKhachHang || "--"}</div> */}
            {/* Có thể thêm email/sdt nếu backend trả về */}
          </div>
          {/* Savings List with Dropdown */}
          <div className="flex flex-col gap-4 mb-6">
            {dashboardData.activeSavingsAccounts?.map((s, idx) => (
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
          {/* Wallet Balance */}
          <div className="flex items-center justify-between bg-white/20 rounded-lg px-4 py-2 mb-2">
            <span className="text-white text-base font-medium">Tổng số dư các sổ</span>
            <span className="text-white text-base font-semibold">{dashboardData.accountSummary?.tongSoDuTrongTatCaSo?.toLocaleString('vi-VN') || '--'} VND</span>
          </div>
        </div>
      )}
      <div className="max-w-5xl mx-auto pt-[120px] px-4 pb-10" style={{ opacity: isTransitioning ? 0.5 : 1, transition: "opacity 0.4s" }}>
        {/* Tổng quan */}
        {showRevenue && (
          <>
            <div className="flex flex-col md:flex-row gap-12 justify-center mt-0">
              <div className="flex-1 min-w-[300px] max-w-[340px] bg-gradient-to-br from-[#FFD6E7] via-[#FFEFEC] to-[#FFF5B5] rounded-2xl p-10 flex flex-col items-center shadow-lg">
                <FaWallet className="text-4xl text-[#FF086A] mb-4" />
                <div className="text-2xl text-gray-700">Tổng số dư các sổ</div>
                <div className="text-3xl font-bold text-[#FF086A] mt-4">{dashboardData?.accountSummary?.tongSoDuTrongTatCaSo?.toLocaleString('vi-VN') || '--'} VND</div>
              </div>
              <div className="flex-1 min-w-[300px] max-w-[340px] bg-gradient-to-br from-[#FFD6E7] via-[#FFEFEC] to-[#FFF5B5] rounded-2xl p-10 flex flex-col items-center shadow-lg">
                <FaMoneyBillWave className="text-4xl text-[#FF086A] mb-4" />
                <div className="text-2xl text-gray-700">Tổng tiền đã rút</div>
                <div className="text-3xl font-bold text-[#FF086A] mt-4">{dashboardData?.accountSummary?.tongTienDaRutTuTruocDenNay?.toLocaleString('vi-VN') || '--'} VND</div>
              </div>
              <div className="flex-1 min-w-[300px] max-w-[340px] bg-gradient-to-br from-[#FFD6E7] via-[#FFEFEC] to-[#FFF5B5] rounded-2xl p-10 flex flex-col items-center shadow-lg">
                <MdOutlineSavings className="text-4xl text-[#FF086A] mb-4" />
                <div className="text-2xl text-gray-700">Tổng tiền đã nạp</div>
                <div className="text-3xl font-bold text-[#FF086A] mt-4">{dashboardData?.accountSummary?.tongTienDaNapTuTruocDenNay?.toLocaleString('vi-VN') || '--'} VND</div>
              </div>
            </div>
            {/* Biểu đồ thay đổi tổng số dư ví theo thời gian */}
            {lineChartData.labels && lineChartData.labels.length > 0 && (
              <div className="my-8 bg-gradient-to-br from-pink-50 via-white to-pink-100 rounded-xl shadow-lg p-4 lg:p-6 w-full max-w-2xl mx-auto h-[260px] md:h-[320px]"> {/* Thu nhỏ max-width và chiều cao biểu đồ */}
                <Line data={lineChartData} options={lineChartOptions} height={160} />
              </div>
            )}
            {/* Nút mũi tên xuống */}
            <div className="flex justify-center mt-4">
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
        {/* Giao dịch gần đây */}
        {!showRevenue && (
          <>
            <div className="flex flex-col items-center mt-0"> {/* Đặt margin-top = 0 để bảng giao dịch sát mép trên */}
              <div className="w-full">
                {dashboardData?.recentTransactions?.length ? (
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
                          {dashboardData.recentTransactions.map((tx) => (
                            <tr key={tx.idGiaoDich} className="hover:bg-pink-50/60 transition-colors duration-150">
                              <td className="px-6 py-4 whitespace-nowrap text-base text-center align-middle">
                                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full items-center ${tx.loaiGiaoDich === "Gửi tiền" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                  {tx.loaiGiaoDich}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-base text-center align-middle text-gray-500">
                                {new Date(tx.ngayGD).toLocaleDateString('vi-VN')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-base text-center align-middle text-gray-800 font-medium max-w-[220px] truncate" title={tx.tenSoMoTietKiem || undefined}>
                                {tx.tenSoMoTietKiem || `Sổ #${tx.idGiaoDich}`}
                              </td>
                              <td className={`px-6 py-4 whitespace-nowrap text-base text-center align-middle font-bold ${tx.loaiGiaoDich === "Gửi tiền" ? "text-green-600" : "text-red-600"}`}>
                                {tx.soTien.toLocaleString('vi-VN')} VND
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : <div className="text-center text-gray-500 py-8">Không có giao dịch gần đây.</div>}
              </div>
            </div>
            {/* Nút mũi tên lên để trở về */}
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
