"use client";

import React, { useState } from "react";
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

const userData = {
  name: "Phạm Hà Anh Thư",
  email: "email@gmail.com",
  phone: "+84 945771705",
  dob: "20/09/2005",
  address: "TP. Hồ Chí Minh",
  nationalId: "051305000123",
  phoneFormatted: "0945.000.123",
  savings: [
    { name: "My Savings 1", amount: "1,000,000 VNĐ" },
    { name: "My Savings 2", amount: "10,000,000 VNĐ" },
  ],
  walletBalance: "11,000,000 VNĐ",
};

export default function ProfilePage() {
  const [openSavings, setOpenSavings] = useState<{ [key: string]: boolean }>({});

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
        <div className="mt-[80px] h-[80px] w-full bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB] flex items-center justify-center">
            <h1 className="text-white text-3xl font-bold">YOUR PROFILE</h1>
        </div>


      {/* Content */}
      <div className="flex p-10">
        {/* Left Column */}
        <div className="w-[614px]">
          <div className="rounded-tr-[40px] rounded-br-[40px] bg-gradient-to-r from-[#FF84B5] via-[#FDAEAE] to-[#F8CDED] p-8">
            <div className="text-center">
              <div className="flex justify-center">
                <Image
                  src={userImage}
                  alt="User"
                  width={90}
                  height={90}
                  className="rounded-full border-4 border-white shadow-md"
                />
              </div>
              <h2 className="text-[18px] font-bold text-[#FF086A] mt-4">{userData.name}</h2>
              <p className="text-[14px] text-[#FF086A]">{userData.email}</p>
              <div className="flex items-center justify-center mt-2">
                <p className="text-[14px] text-[#FF086A] mr-2">{userData.phone}</p>
                <Image src={flagImage} alt="Flag" width={20} height={20} />
              </div>
            </div>

            {/* Savings */}
            <div className="mt-6">
              {userData.savings.map((saving, index) => (
                <div key={index} className="bg-[#FFD6E7] rounded-[10px] p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] text-[#FF086A]">{saving.name}</span>
                    <span className="text-[14px] text-[#FF086A]">{saving.amount}</span>
                    <button
                      className="w-5 h-5 bg-[#FF086A] rounded-[5px] flex items-center justify-center"
                      onClick={() => toggleSavingsDetails(index)}
                    >
                      <DropdownArrowSvg />
                    </button>
                  </div>
                  {openSavings[index] && (
                    <div className="mt-2 text-[13px] text-[#FF086A]">
                      Chi tiết sổ tiết kiệm {index + 1} đang cập nhật...
                    </div>
                  )}
                </div>
              ))}

              {/* Wallet Balance */}
              <div className="flex justify-between items-center bg-[#FFD6E7] rounded-[10px] p-4 mb-4">
                <span className="text-[14px] text-[#FF086A] font-medium">Wallet Balance</span>
                <span className="text-[14px] text-[#FF086A]">{userData.walletBalance}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 pl-10 flex flex-col">
          {/* Update Button on Top Right */}
          <div className="flex justify-end mb-4">
            <Link href="/user/profile/edit">
              <button className="bg-[#FF086A] text-white text-[16px] font-semibold rounded-[20px] px-[20px] py-[8px]">
                Update Profile
              </button>
            </Link>
          </div>

          {/* User Info Detail */}
          <div className="flex flex-col">
            {[
              { label: "Full Name", value: userData.name },
              { label: "Date of Birth", value: userData.dob },
              { label: "Address", value: userData.address },
              { label: "National ID Card", value: userData.nationalId },
              { label: "Phone Number", value: userData.phoneFormatted },
              { label: "Email", value: userData.email },
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