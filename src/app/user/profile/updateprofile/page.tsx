"use client";

import React, { useState, useRef } from "react";
// import Image from "next/image";
import { useRouter } from "next/navigation";
import UserHeader from "@/components/UserHeader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function UpdateProfilePage() {
  const router = useRouter();

  // Initial user data
  const [userData, setUserData] = useState({
    name: "Phạm Hà Anh Thư",
    dob: "20/09/2005",
    address: "TP. Hồ Chí Minh",
    nationalId: "051305000123",
    phoneNumber: "0945.000.123",
    email: "email@gmail.com",
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    const [day, month, year] = userData.dob.split("/").map(Number);
    return new Date(year, month - 1, day);
  });
  const datePickerRef = useRef<DatePicker | null>(null);

  const handleCancel = () => {
    router.push("/user/profile");
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUserData = {
      ...userData,
      dob: selectedDate
        ? selectedDate
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .split("/")
            .join("/")
        : "",
    };
    console.log("Updated user data:", finalUserData);
    localStorage.setItem("updatedUserProfile", JSON.stringify(finalUserData));
    router.push("/user/profile");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .split("/")
        .join("/");
      setUserData((prev) => ({ ...prev, dob: formattedDate }));
    } else {
      setUserData((prev) => ({ ...prev, dob: "" }));
    }
  };

  const openDatePicker = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB]">
      {/* Header */}
      <div className="w-full fixed top-0 left-0 z-[100]">
        <UserHeader />
      </div>

      {/* Main Content - Styled like the admin modal's inner content */}
      <div className="flex-grow flex items-center justify-center pt-16">
        <div className="w-full max-w-[1000px] bg-white rounded-lg shadow-lg overflow-hidden my-8">
          <div className="flex flex-col items-center justify-center h-full p-6 sm:p-8 md:p-10">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#FF086A] mb-6 sm:mb-8">
              Update Your Profile
            </h2>
            <form onSubmit={handleUpdate} className="w-full max-w-[600px] space-y-3 sm:space-y-4">
              {/* Full Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center border-b border-gray-300 py-2 sm:py-3">
                <label className="text-lg text-gray-700 sm:col-span-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  className="text-xl text-gray-700 bg-transparent focus:outline-none sm:col-span-2 mt-1 sm:mt-0"
                />
              </div>

              {/* Date of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center border-b border-gray-300 py-2 sm:py-3">
                <label className="text-lg text-gray-700 sm:col-span-1">Date of Birth</label>
                <div className="relative sm:col-span-2 mt-1 sm:mt-0">
                  <input
                    type="text"
                    name="dob"
                    value={userData.dob}
                    readOnly
                    onClick={openDatePicker}
                    placeholder="dd/mm/yyyy"
                    className="text-xl text-gray-700 bg-transparent focus:outline-none w-full cursor-pointer"
                  />
                  <span
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg cursor-pointer"
                    onClick={openDatePicker}
                  >
                    ▼
                  </span>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    className="hidden"
                    ref={datePickerRef}
                    popperPlacement="bottom-start"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center border-b border-gray-300 py-2 sm:py-3">
                <label className="text-lg text-gray-700 sm:col-span-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={userData.address}
                  onChange={handleChange}
                  className="text-xl text-gray-700 bg-transparent focus:outline-none sm:col-span-2 mt-1 sm:mt-0"
                />
              </div>

              {/* National ID Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center border-b border-gray-300 py-2 sm:py-3">
                <label className="text-lg text-gray-700 sm:col-span-1">National ID Card</label>
                <input
                  type="text"
                  name="nationalId"
                  value={userData.nationalId}
                  onChange={handleChange}
                  className="text-xl text-gray-700 bg-transparent focus:outline-none sm:col-span-2 mt-1 sm:mt-0"
                />
              </div>

              {/* Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center border-b border-gray-300 py-2 sm:py-3">
                <label className="text-lg text-gray-700 sm:col-span-1">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={userData.phoneNumber}
                  onChange={handleChange}
                  className="text-xl text-gray-700 bg-transparent focus:outline-none sm:col-span-2 mt-1 sm:mt-0"
                />
              </div>

              {/* Email */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center border-b border-gray-300 py-2 sm:py-3">
                <label className="text-lg text-gray-700 sm:col-span-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  className="text-xl text-gray-700 bg-transparent focus:outline-none sm:col-span-2 mt-1 sm:mt-0"
                />
              </div>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8 sm:mt-10">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto bg-gray-200 text-gray-700 font-medium py-2 sm:py-3 px-6 sm:px-8 rounded-lg text-lg sm:text-xl uppercase hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#FF086A] text-white font-medium py-2 sm:py-3 px-6 sm:px-8 rounded-lg text-lg sm:text-xl uppercase hover:bg-[#E0075A] transition-colors"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
