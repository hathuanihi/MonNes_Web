"use client";

import React, { useState, useRef } from "react";
import UserHeader from "@/components/UserHeader";
import { FaWallet, FaArrowDown, FaArrowUp, FaMoneyBillWave, FaBars, FaChevronDown, FaChevronUp, FaPen } from "react-icons/fa";
import { MdOutlineSavings } from "react-icons/md";
import { useRouter } from "next/navigation";

const transactions = [
  { amount: "+ 1,000,000 VND", saving: "My Savings 1" },
  { amount: "- 500,678 VND", saving: "My Savings 1" },
  { amount: "+ 1,000,000 VND", saving: "My Savings 1" },
  { amount: "+ 9,000,000 VND", saving: "My Savings 1" },
];

export default function UserDashboard() {
  const [showRevenue, setShowRevenue] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showQuickPanel, setShowQuickPanel] = useState(false);
  const [openSavings, setOpenSavings] = useState<{ [key: string]: boolean }>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleToggleSavings = (key: string) => {
    setOpenSavings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Xử lý cuộn chuột với delay
  const handleWheel = (e: React.WheelEvent) => {
    if (isTransitioning) return;
    if (showRevenue && e.deltaY > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setShowRevenue(false);
        setIsTransitioning(false);
      }, 400);
    } else if (!showRevenue && e.deltaY < 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setShowRevenue(true);
        setIsTransitioning(false);
      }, 400);
    }
  };

  // Xử lý vuốt trên mobile với delay
  let touchStartY = 0;
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    const touchEndY = e.changedTouches[0].clientY;
    if (showRevenue && touchStartY - touchEndY > 50) {
      setIsTransitioning(true);
      setTimeout(() => {
        setShowRevenue(false);
        setIsTransitioning(false);
      }, 400);
    } else if (!showRevenue && touchEndY - touchStartY > 50) {
      setIsTransitioning(true);
      setTimeout(() => {
        setShowRevenue(true);
        setIsTransitioning(false);
      }, 400);
    }
  };

  return (
    <div
      className="min-h-screen bg-white"
      ref={scrollRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ transition: "opacity 0.4s" }}
    >
      {/* Header */}
      <div className="w-full fixed top-0 left-0 z-50">
        <UserHeader />
      </div>
      {/* Dashboard Title Bar with Hamburger */}
      <div className="w-full sticky top-16 z-40">
        <div className="relative flex items-center justify-center">
          <h1
            className="w-full text-center text-3xl md:text-4xl font-bold text-white py-5 md:py-6 rounded-b-lg"
            style={{
              background: "linear-gradient(90deg, #FF086A 0%, #FB5D5D 50%, #F19BDB 100%)",
            }}
          >
            {showRevenue ? "REVENUE DASHBOARD" : "RECENT TRANSACTIONS"}
          </h1>
          {/* Hamburger Icon */}
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-2xl md:text-3xl hover:text-pink-200 focus:outline-none"
            onClick={() => setShowQuickPanel(true)}
            aria-label="Open quick info panel"
          >
            <FaBars />
          </button>
        </div>
      </div>
      {/* Quick Info Panel */}
      {showQuickPanel && (
        <div className="fixed top-0 right-0 h-full w-[340px] md:w-[400px] bg-gradient-to-br from-[#FF086A]/90 via-[#FB5D5D]/90 to-[#F19BDB]/90 shadow-2xl z-[100] flex flex-col p-6 animate-slideIn">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-pink-200 focus:outline-none"
            onClick={() => setShowQuickPanel(false)}
            aria-label="Close quick info panel"
          >
            ×
          </button>
          {/* Avatar & Name */}
          <div className="flex flex-col items-center mt-8 mb-6">
            <div className="w-24 h-24 rounded-full bg-white/40 flex items-center justify-center mb-3">
              <span className="text-6xl text-white">👤</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xl font-bold text-white">Phạm Hà Anh Thư</div>
              <button
                className="text-white/80 hover:text-white text-lg p-1"
                onClick={() => { setShowQuickPanel(false); router.push('/user/profile'); }}
                aria-label="Edit profile"
              >
                <FaPen />
              </button>
            </div>
            <div className="text-sm text-white/80 mt-1">email@gmail.com</div>
            <div className="text-sm text-white/80 mt-1">+84 945771105</div>
          </div>
          {/* Savings List with Dropdown */}
          <div className="flex flex-col gap-4 mb-6">
            {/* My Savings 1 */}
            <div className="bg-white/20 rounded-lg px-4 pt-3 pb-2">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => handleToggleSavings('s1')}>
                <span className="text-white text-base font-medium">My Savings 1</span>
                <span className="text-white text-base font-semibold">1,000,000 VND</span>
                <span className="ml-2 text-white text-lg">
                  {openSavings['s1'] ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              {openSavings['s1'] && (
                <div className="mt-3 bg-white/30 rounded-lg p-3 text-sm text-white">
                  <div className="flex justify-between py-1 border-b border-white/30 last:border-b-0"><span>Customer&apos;s name</span><span>Phạm Hà Thư</span></div>
                  <div className="flex justify-between py-1 border-b border-white/30 last:border-b-0"><span>National ID Card</span><span>051305000123</span></div>
                  <div className="flex justify-between py-1 border-b border-white/30 last:border-b-0"><span>Deposit Amount</span><span>500,000 VND</span></div>
                  <div className="flex justify-between py-1 border-b border-white/30 last:border-b-0"><span>Deposit Term</span><span>3 months</span></div>
                  <div className="flex justify-between py-1"><span>Interest Rate</span><span>0,2%</span></div>
                </div>
              )}
            </div>
            {/* My Savings 2 */}
            <div className="bg-white/20 rounded-lg px-4 pt-3 pb-2">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => handleToggleSavings('s2')}>
                <span className="text-white text-base font-medium">My Savings 2</span>
                <span className="text-white text-base font-semibold">10,000,000 VND</span>
                <span className="ml-2 text-white text-lg">
                  {openSavings['s2'] ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              {openSavings['s2'] && (
                <div className="mt-3 bg-white/30 rounded-lg p-3 text-sm text-white">
                  <div className="flex justify-between py-1 border-b border-white/30 last:border-b-0"><span>Customer&apos;s name</span><span>Phạm Hà Thư</span></div>
                  <div className="flex justify-between py-1 border-b border-white/30 last:border-b-0"><span>National ID Card</span><span>051305000123</span></div>
                  <div className="flex justify-between py-1 border-b border-white/30 last:border-b-0"><span>Deposit Amount</span><span>2,000,000 VND</span></div>
                  <div className="flex justify-between py-1 border-b border-white/30 last:border-b-0"><span>Deposit Term</span><span>6 months</span></div>
                  <div className="flex justify-between py-1"><span>Interest Rate</span><span>0,3%</span></div>
                </div>
              )}
            </div>
          </div>
          {/* Wallet Balance */}
          <div className="flex items-center justify-between bg-white/20 rounded-lg px-4 py-2 mb-2">
            <span className="text-white text-base font-medium">Wallet Balance</span>
            <span className="text-white text-base font-semibold">11,000,000 VND</span>
          </div>
        </div>
      )}
      <div className="max-w-5xl mx-auto pt-[120px] px-4 pb-10" style={{ opacity: isTransitioning ? 0.5 : 1, transition: "opacity 0.4s" }}>
        {showRevenue ? (
          <>
            {/* Revenue Cards */}
            <div className="flex flex-col md:flex-row gap-12 justify-center mt-16">
              <div className="flex-1 min-w-[300px] max-w-[340px] bg-gradient-to-br from-[#FFD6E7] via-[#FFEFEC] to-[#FFF5B5] rounded-2xl p-10 flex flex-col items-center shadow-lg">
                <FaWallet className="text-4xl text-[#FF086A] mb-4" />
                <div className="text-2xl text-gray-700">Wallet Balance</div>
                <div className="text-3xl font-bold text-[#FF086A] mt-4">1.500.000 VND</div>
              </div>
              <div className="flex-1 min-w-[300px] max-w-[340px] bg-gradient-to-br from-[#FFD6E7] via-[#FFEFEC] to-[#FFF5B5] rounded-2xl p-10 flex flex-col items-center shadow-lg">
                <FaMoneyBillWave className="text-4xl text-[#FF086A] mb-4" />
                <div className="text-2xl text-gray-700">Withdrawn This Month</div>
                <div className="text-3xl font-bold text-[#FF086A] mt-4">3.550.000 VND</div>
              </div>
              <div className="flex-1 min-w-[300px] max-w-[340px] bg-gradient-to-br from-[#FFD6E7] via-[#FFEFEC] to-[#FFF5B5] rounded-2xl p-10 flex flex-col items-center shadow-lg">
                <MdOutlineSavings className="text-4xl text-[#FF086A] mb-4" />
                <div className="text-2xl text-gray-700">Deposited This Month</div>
                <div className="text-3xl font-bold text-[#FF086A] mt-4">1.500.000 VND</div>
              </div>
            </div>
            {/* Arrow Down Button */}
            <div className="flex justify-center mt-10">
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
        ) : (
          <>
            {/* Recent Transactions Table */}
            <div className="flex flex-col items-center mt-8">
              <div className="w-full max-w-2xl">
                {transactions.map((tx, idx) => (
                  <div
                    key={idx}
                    className="flex items-center py-4 border-b border-gray-200 last:border-b-0"
                  >
                    <span className="text-2xl text-gray-400 mr-4">
                      <MdOutlineSavings />
                    </span>
                    <span className="flex-1 text-lg text-gray-800">{tx.amount}</span>
                    <span className="text-lg text-gray-500">{tx.saving}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Arrow Up Button */}
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
