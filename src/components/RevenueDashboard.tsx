"use client";

import AdminHeader from '@/components/AdminHeader';
import Link from 'next/link'; // Sử dụng Link của Next.js

export default function RevenueDashboard() {
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
    <div
      className="min-h-screen text-black"
      style={{
        background: "#F3F4F6",
      }}
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