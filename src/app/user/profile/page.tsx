"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import UserHeader from "@/components/UserHeader";
import Link from "next/link";

const userImage = "/images/user-placeholder.jpg";
const flagImage = "/images/flag-vietnam.png";

const DropdownArrowSvg = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="dropdown-icon"
  >
    <path
      d="M6.175 7.1582L10 10.9749L13.825 7.1582L15 8.3332L10 13.3332L5 8.3332L6.175 7.1582Z"
      fill="white"
    />
  </svg>
);

// Initial static data, can be used as a fallback or default
const initialUserData = {
  name: "Phạm Hà Anh Thư",
  email: "email@gmail.com",
  phoneNumber: "0945.000.123",
  dob: "20/09/2005",
  address: "TP. Hồ Chí Minh",
  nationalId: "051305000123",
  savings: [
    { name: "My Savings 1", amount: "1,000,000 VNĐ" },
    { name: "My Savings 2", amount: "10,000,000 VNĐ" },
  ],
  walletBalance: "11,000,000 VNĐ",
};

export default function ProfilePage() {
  const [openSavings, setOpenSavings] = useState<{ [key: string]: boolean }>({});
  const [currentUserData, setCurrentUserData] = useState(initialUserData);

  useEffect(() => {
    const storedData = localStorage.getItem("updatedUserProfile");
    if (storedData) {
      try {
        const updatedDataFromStorage = JSON.parse(storedData);
        setCurrentUserData(prevData => ({
            ...prevData,
            ...updatedDataFromStorage,
        }));
        localStorage.removeItem("updatedUserProfile");
      } catch (error) {
        console.error("Failed to parse updated user data from localStorage:", error);
        localStorage.removeItem("updatedUserProfile");
      }
    }
  }, []);

  const toggleSavingsDetails = (index: number) => {
    setOpenSavings((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="min-h-screen bg-white">
        <UserHeader />

    {/* Profile Header Banner */}
        <div className="w-full sticky top-16 z-40">
            <h1
                className="w-full text-center text-3xl md:text-4xl font-bold text-white py-6 rounded-b-lg"
                style={{
                    background: "linear-gradient(90deg, #FF086A 0%, #FB5D5D 50%, #F19BDB 100%)",
                }}
            >
                YOUR SAVINGS
            </h1>
        </div>


      {/* Content */}
      <div className="flex p-10 pt-[120px]">
        {/* Left Column - Gradient background, no big card */}
        <div className="w-[400px] flex flex-col items-start h-full">
          <div className="w-full h-full bg-gradient-to-br from-[#FF84B5] via-[#FDAEAE] to-[#F8CDED] flex flex-col items-center pt-8 pb-8 px-0">
            {/* Avatar + Info */}
            <Image
              src={userImage}
              alt="User"
              width={90}
              height={90}
              className="rounded-full border-4 border-white shadow-md"
            />
            <h2 className="text-[18px] font-bold text-[#FF086A] mt-4">{currentUserData.name}</h2>
            <p className="text-[14px] text-[#FF086A]">{currentUserData.email}</p>
            <div className="flex items-center justify-center mt-2">
              <p className="text-[14px] text-[#FF086A] mr-2">{currentUserData.phoneNumber}</p>
              <Image src={flagImage} alt="Flag" width={20} height={20} />
            </div>
            {/* Savings */}
            <div className="mt-6 w-full flex flex-col gap-3 px-4">
              {currentUserData.savings.map((saving, index) => (
                <div key={index} className="bg-[#FFD6E7] rounded-[10px] px-4 py-3 flex flex-col">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[14px] text-[#FF086A]">{saving.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[14px] text-[#FF086A]">{saving.amount}</span>
                      <button
                        className="w-5 h-5 bg-[#FF086A] rounded-[5px] flex items-center justify-center ml-2"
                        onClick={() => toggleSavingsDetails(index)}
                      >
                        <DropdownArrowSvg />
                      </button>
                    </div>
                  </div>
                  {openSavings[index] && (
                    <div className="mt-2 text-[13px] text-[#FF086A]">
                      Chi tiết sổ tiết kiệm {index + 1} đang cập nhật...
                    </div>
                  )}
                </div>
              ))}
              {/* Wallet Balance */}
              <div className="flex justify-between items-center bg-[#FFD6E7] rounded-[10px] px-4 py-3">
                <span className="text-[14px] text-[#FF086A] font-medium">Wallet Balance</span>
                <span className="text-[14px] text-[#FF086A]">{currentUserData.walletBalance}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 pl-10 flex flex-col">
          {/* Update Button on Top Right */}
          <div className="flex justify-end mb-4">
            <Link href="/user/profile/updateprofile">
              <button className="bg-[#FF086A] text-white text-[16px] font-semibold rounded-[20px] px-[20px] py-[8px]">
                Update Profile
              </button>
            </Link>
          </div>

          {/* User Info Detail */}
          <div className="flex flex-col">
            {[
              { label: "Full Name", value: currentUserData.name },
              { label: "Date of Birth", value: currentUserData.dob },
              { label: "Address", value: currentUserData.address },
              { label: "National ID Card", value: currentUserData.nationalId },
              { label: "Phone Number", value: currentUserData.phoneNumber },
              { label: "Email", value: currentUserData.email },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-3 border-b border-black/20"
              >
                <span className="text-[20px] text-black/80">{item.label}</span>
                <span className="text-[20px] text-black/60">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}