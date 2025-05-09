"use client";

import React from "react";
import UserHeader from "@/components/UserHeader";
import Image from "next/image";
import dropdownIcon from "@/assets/icon/DropdownArrow.png";
import { useRouter } from "next/navigation";

export default function YourSavingsDetail() {
  const router = useRouter();
  const savingsDetail = {
    name: "My Savings",
    customerName: "Phạm Hà Anh Thư",
    address: "TP. Hồ Chí Minh",
    nationalId: "051305000123",
    depositAmount: "5,000,000 VND",
    depositTerm: "3 months",
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="w-full fixed top-0 left-0 z-50">
        <UserHeader />
      </div>
      <div className="w-full sticky top-16 z-40">
        <h1
          className="w-full text-center text-4xl font-bold text-white py-6 rounded-b-lg"
          style={{
            background: "linear-gradient(90deg, #FF086A 0%, #FB5D5D 50%, #F19BDB 100%)",
          }}
        >
          DETAIL
        </h1>
      </div>

      {/* Info Table */}
      <div className="max-w-2xl mx-auto pt-[136px] px-4">
        <div className="grid grid-cols-2 gap-x-6">
          <div className="py-3 text-[20px] text-gray-800">Name of Savings</div>
          <div className="py-3 border-b border-gray-200 text-[20px] text-gray-400">{savingsDetail.name}</div>

          <div className="py-3 text-[20px] text-gray-800">Your Name</div>
          <div className="py-3 border-b border-gray-200 text-[20px] text-gray-400">{savingsDetail.customerName}</div>

          <div className="py-3 text-[20px] text-gray-800">Address</div>
          <div className="py-3 border-b border-gray-200 text-[20px] text-gray-400">{savingsDetail.address}</div>

          <div className="py-3 text-[20px] text-gray-800">National ID Card</div>
          <div className="py-3 border-b border-gray-200 text-[20px] text-gray-400">{savingsDetail.nationalId}</div>

          <div className="py-3 text-[20px] text-gray-800">Deposit Amount</div>
          <div className="py-3 border-b border-gray-200 text-[20px] text-gray-400">{savingsDetail.depositAmount}</div>

          <div className="py-3 text-[20px] text-gray-800">Deposit Term</div>
          <div className="py-3 border-b border-gray-200 text-[20px] text-gray-400 flex items-center justify-between">
            <span>{savingsDetail.depositTerm}</span>
            <span className="ml-2 flex-shrink-0">
              <Image src={dropdownIcon} alt="Dropdown" width={22} height={22} />
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row justify-center gap-10 mt-12">
          <button
            className="w-[240px] py-4 rounded-xl bg-[#FF086A] text-white text-2xl font-bold uppercase tracking-wide transition hover:bg-[#FB5D5D]"
            onClick={() => router.push("/user/yoursavings/detail/withdrawal")}
          >
            Withdraw
          </button>
          <button
            className="w-[240px] py-4 rounded-xl bg-[#FF086A] text-white text-2xl font-bold uppercase tracking-wide transition hover:bg-[#FB5D5D]"
            onClick={() => router.push("/user/yoursavings/detail/deposit")}
          >
            Deposit
          </button>
        </div>
      </div>
    </div>
  );
}
