"use client";

import React, { useState } from "react";
import UserHeader from "@/components/UserHeader";

export default function WithdrawalPage() {
  const [withdrawAmount, setWithdrawAmount] = useState("300,000 VND");
  // Fake API data
  const availableBalance = "1,000,000 VND";
  const interestRate = "0,5%";

  const handleCancel = () => {
    window.history.back();
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý rút tiền ở đây
    alert("Withdraw submitted: " + withdrawAmount);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB]">
      {/* Header */}
      <div className="w-full fixed top-0 left-0 z-[100]">
        <UserHeader />
      </div>
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center pt-16">
        <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-lg overflow-hidden my-8">
          <div className="flex flex-col items-center justify-center h-full p-16">
            <h2 className="text-4xl font-bold text-[#FF086A] mb-10 text-center">Withdrawal Form</h2>
            <form onSubmit={handleWithdraw} className="w-full">
              <div className="grid grid-cols-2 gap-x-8">
                <div className="py-5 text-[22px] text-gray-800 flex items-center">Available Balance</div>
                <div className="py-5 border-b border-gray-200 text-[22px] text-gray-500 flex items-center">{availableBalance}</div>

                <div className="py-5 text-[22px] text-gray-800 flex items-center">Interest Rate</div>
                <div className="py-5 border-b border-gray-200 text-[22px] text-gray-500 flex items-center">{interestRate}</div>

                <div className="py-5 text-[22px] text-gray-800 flex items-center">Withdrawal Amount</div>
                <div className="py-5 border-b border-gray-200 flex items-center">
                  <input
                    type="text"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    className="w-full bg-transparent text-[22px] text-gray-700 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-between gap-8 mt-12">
                <button
                  type="button"
                  className="flex-1 py-5 rounded-xl bg-gray-300 text-white text-2xl font-bold uppercase tracking-wide transition hover:bg-gray-400"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-5 rounded-xl bg-[#FF086A] text-white text-2xl font-bold uppercase tracking-wide transition hover:bg-[#FB5D5D]"
                >
                  Withdraw
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
