"use client";

import AdminHeader from '@/components/AdminHeader';
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
  Chart,
  ChartType,
  TooltipItem,
  Scale,
  CoreScaleOptions,
} from 'chart.js';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Plugin để đặt màu nền cho biểu đồ
const backgroundColorPlugin = {
  id: 'customBackground',
  beforeDraw: (chart: Chart) => {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    ctx.save();
    ctx.fillStyle = '#FFD6E7'; // Màu nền biểu đồ
    ctx.fillRect(
      chartArea.left,
      chartArea.top,
      chartArea.right - chartArea.left,
      chartArea.bottom - chartArea.top
    );
    ctx.restore();
  },
};

// Đăng ký plugin với Chart.js
ChartJS.register(backgroundColorPlugin);

// Component RevenueDashboard
function RevenueDashboard() {
  // Dữ liệu mẫu
  const users = [
    { name: "Phạm Hà Anh Thư", saving: "My Saving 1", amount: 1000000 },
    { name: "Huỳnh Quốc Sang", saving: "Sang's Savings", amount: 1000000 },
    { name: "Nguyễn Thanh Bình", saving: "Bình's Savings", amount: 1000000 },
    { name: "Nguyễn Hoàng Minh", saving: "Minh's Savings", amount: 1000000 },
    { name: "Đặng Văn Vý", saving: "Vý's Savings", amount: 1000000 },
  ];

  // Tính tổng
  const total = users.reduce((sum, user) => sum + user.amount, 0);

  return (
    <div>
      <AdminHeader />
      <main className="px-4 py-10 mt-6 flex flex-col items-center">
        {/* Tiêu đề REVENUE DASHBOARD */}
        <h1
          className="w-full text-center text-4xl font-bold text-white py-6 mb-6 rounded-lg"
          style={{
            background: "linear-gradient(90deg, #FF086A 0%, #FB5D5D 50%, #F19BDB 100%)",
          }}
        >
          REVENUE DASHBOARD
        </h1>

        {/* Bộ lọc */}
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Find an user..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          <div className="flex gap-4">
            <select className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300">
              <option>Sort from...</option>
            </select>
            <select className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300">
              <option>To...</option>
            </select>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="w-full max-w-5xl bg-white rounded-lg">
          {users.map((user, index) => (
            <div
              key={index}
              className={`flex items-center py-4 px-6 ${
                index < users.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              {/* Tên người dùng */}
              <div className="flex-1">
                <p className="font-bold text-black">{user.name}</p>
              </div>
              {/* Tên tài khoản tiết kiệm */}
              <div className="flex-1">
                <p className="text-black">{user.saving}</p>
              </div>
              {/* Số tiền */}
              <div className="flex-1 text-right">
                <p className="text-black">{user.amount.toLocaleString()} VND</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tổng cộng */}
        <div className="w-full max-w-5xl flex justify-end mt-4">
          <p className="font-bold text-lg" style={{ color: "#FF086A" }}>
            TOTAL: {total.toLocaleString()} VND
          </p>
        </div>
      </main>
    </div>
  );
}

// Component Dashboard
export default function Dashboard() {
  const chartRef1 = useRef<ChartJS<'bar'>>(null);
  const chartRef2 = useRef<ChartJS<'bar'>>(null);
  const chartRef3 = useRef<ChartJS<'bar'>>(null);
  const [showRevenueDashboard, setShowRevenueDashboard] = useState(false); // State để chuyển đổi giao diện

  // Hàm tạo gradient cho cột
  const createGradient = (chart: ChartJS<ChartType>) => {
    const { ctx, chartArea } = chart;
    if (!chartArea) return null;
    const gradient = ctx.createLinearGradient(
      chartArea.left,
      chartArea.bottom,
      chartArea.right,
      chartArea.top
    );
    gradient.addColorStop(0, '#FB5D5D');
    gradient.addColorStop(1, '#F19BDB');
    return gradient;
  };

  // Cập nhật gradient cho biểu đồ 1
  useEffect(() => {
    const chart = chartRef1.current;
    if (chart) {
      const gradient = createGradient(chart);
      if (gradient) {
        chart.data.datasets[0].backgroundColor = gradient;
        chart.data.datasets[0].hoverBackgroundColor = '#FF7F7F';
        chart.data.datasets[0].borderColor = '#FFF5B5';
        chart.update();
      }
    }
  }, []);

  // Cập nhật gradient cho biểu đồ 2
  useEffect(() => {
    const chart = chartRef2.current;
    if (chart) {
      const gradient = createGradient(chart);
      if (gradient) {
        chart.data.datasets[0].backgroundColor = gradient;
        chart.data.datasets[0].hoverBackgroundColor = '#FF7F7F';
        chart.data.datasets[0].borderColor = '#FFF5B5';
        chart.update();
      }
    }
  }, []);

  // Cập nhật gradient cho biểu đồ 3
  useEffect(() => {
    const chart = chartRef3.current;
    if (chart) {
      const gradient = createGradient(chart);
      if (gradient) {
        chart.data.datasets.forEach((dataset) => {
          dataset.backgroundColor = gradient;
          dataset.hoverBackgroundColor = '#FF7F7F';
          dataset.borderColor = '#FFF5B5';
        });
        chart.update();
      }
    }
  }, []);

  // Dữ liệu cho Card 1: Today Revenue
  const todayRevenueData: ChartData<'bar'> = {
    labels: ['Today'],
    datasets: [
      {
        label: 'Revenue (VND)',
        data: [1000000],
        borderColor: '#FFF5B5',
        borderWidth: 2,
        backgroundColor: '#FF4500',
        hoverBackgroundColor: '#FF7F7F',
      },
    ],
  };

  const todayRevenueOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Today Revenue',
        color: '#C93030',
        font: { size: 20, weight: 'bold' as const },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>) => 
            `${context.dataset.label}: ${context.raw?.toLocaleString()} VND`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#C93030',
          stepSize: 200000,
          font: { size: 14 },
          callback: function(this: Scale<CoreScaleOptions>, value: number | string) {
            return `${Number(value).toLocaleString()} VND`;
          },
        },
        grid: { color: 'rgba(255, 255, 255, 0.2)' },
      },
      x: {
        ticks: { color: '#C93030', font: { size: 14 } },
        grid: { display: false },
      },
    },
  };

  // Dữ liệu cho Card 2: Today Users
  const todayUsersData: ChartData<'bar'> = {
    labels: ['Today'],
    datasets: [
      {
        label: 'Users',
        data: [10],
        borderColor: '#FFF5B5',
        borderWidth: 2,
        backgroundColor: '#60A5FA',
        hoverBackgroundColor: '#FF7F7F',
      },
    ],
  };

  const todayUsersOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Users Opened Savings Account Today',
        color: '#C93030',
        font: { size: 20, weight: 'bold' as const },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>) => 
            `${context.dataset.label}: ${context.raw} users`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#C93030',
          stepSize: 2,
          font: { size: 14 },
          callback: function(this: Scale<CoreScaleOptions>, value: number | string) {
            return `${value} users`;
          },
        },
        grid: { color: 'rgba(255, 255, 255, 0.2)' },
      },
      x: {
        ticks: { color: '#C93030', font: { size: 14 } },
        grid: { display: false },
      },
    },
  };

  // Dữ liệu cho Card 3: This Month
  const thisMonthData: ChartData<'bar'> = {
    labels: ['This Month'],
    datasets: [
      {
        label: 'Revenue (VND)',
        data: [500000000],
        borderColor: '#FFF5B5',
        borderWidth: 2,
        backgroundColor: '#FF4500',
        hoverBackgroundColor: '#FF7F7F',
      },
      {
        label: 'Savings Accounts',
        data: [100],
        borderColor: '#FFF5B5',
        borderWidth: 2,
        backgroundColor: '#34D399',
        hoverBackgroundColor: '#FF7F7F',
      },
    ],
  };

  const thisMonthOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#C93030', font: { size: 16 } },
      },
      title: {
        display: true,
        text: 'This Month Overview',
        color: '#C93030',
        font: { size: 20, weight: 'bold' as const },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>) => {
            if (context.dataset.label === 'Revenue (VND)') {
              return `${context.dataset.label}: ${context.raw?.toLocaleString()} VND`;
            }
            return `${context.dataset.label}: ${context.raw} accounts`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#C93030',
          stepSize: 100000000,
          font: { size: 14 },
          callback: function(this: Scale<CoreScaleOptions>, value: number | string) {
            return `${Number(value).toLocaleString()}`;
          },
        },
        grid: { color: 'rgba(255, 255, 255, 0.2)' },
      },
      x: {
        ticks: { color: '#C93030', font: { size: 14 } },
        grid: { display: false },
      },
    },
  };

  return (
    <div
      className="min-h-screen text-black"
      style={{
        background: "#F3F4F6",
      }}
    >
      <AnimatePresence mode="wait">
        {!showRevenueDashboard ? (
          <motion.div
            key="dashboard"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <AdminHeader />
            <main className="px-0 py-10 mt-6 flex flex-col items-center">
              <h1
                className="w-full text-center text-4xl font-bold text-white py-6 mb-6 rounded-lg"
                style={{
                  background: "linear-gradient(90deg, #FF086A 0%, #FB5D5D 50%, #F19BDB 100%)",
                }}
              >
                REVENUE DASHBOARD
              </h1>
              <div className="flex flex-col md:flex-row gap-10 mb-10 w-full max-w-5xl">
                {/* Card: Today Revenue */}
                <div
                  className="rounded-lg p-8 flex-1 flex flex-col items-center justify-center h-80 border-2 border-gray-200 transition-transform hover:scale-105"
                  style={{ backgroundColor: "#FFD6E7" }}
                >
                  <Bar ref={chartRef1} data={todayRevenueData} options={todayRevenueOptions} />
                </div>
                {/* Card: Today Users */}
                <div
                  className="rounded-xl p-8 flex-1 flex flex-col items-center justify-center h-80 border-2 border-gray-200 transition-transform hover:scale-105"
                  style={{ backgroundColor: "#FFD6E7" }}
                >
                  <Bar ref={chartRef2} data={todayUsersData} options={todayUsersOptions} />
                </div>
              </div>
              {/* Card: This Month */}
              <div
                className="rounded-xl p-8 w-full max-w-6xl flex flex-col items-center border-2 border-gray-200 transition-transform hover:scale-105"
                style={{ backgroundColor: "#FFD6E7" }}
              >
                <Bar ref={chartRef3} data={thisMonthData} options={thisMonthOptions} />
              </div>
              {/* Arrow to trigger transition to RevenueDashboard */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowRevenueDashboard(true)}
                  className="w-18 h-18 bg-[#FF086A] rounded-full flex items-center justify-center hover:bg-[#FB5D5D] transition-colors"
                >
                  <span className="text-white text-3xl">▼</span>
                </button>
              </div>
            </main>
          </motion.div>
        ) : (
          <motion.div
            key="revenue-dashboard"
            initial={{ y: '100%' }}
            animate={{ y: 2 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.75, ease: 'easeInOut' }}
          >
            <RevenueDashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}