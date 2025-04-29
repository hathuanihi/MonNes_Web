"use client";

import { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { User } from "@/app/admin/management/page";
import AdminHeader from "@/components/AdminHeader";

interface UserInforProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
  onClose: () => void;
}

export default function UserInfor({ user, onUpdate, onClose }: UserInforProps) {
  const [formData, setFormData] = useState({
    fullName: user.name || "Phạm Hà Anh Thư",
    dateOfBirth: "20/09/2005",
    address: user.location || "TP. Hồ Chí Minh",
    nationalId: user.savings?.["My Savings 1"]?.details.nationalId || "051305000123",
    phoneNumber: user.phone || "0945.000.123",
    email: user.email || "email@gmail.com",
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    formData.dateOfBirth ? new Date(formData.dateOfBirth.split("/").reverse().join("-")) : null
  );
  const datePickerRef = useRef<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      setFormData((prev) => ({ ...prev, dateOfBirth: formattedDate }));
    } else {
      setFormData((prev) => ({ ...prev, dateOfBirth: "" }));
    }
  };

  const openDatePicker = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  const handleUpdate = () => {
    const updatedSavings = user.savings
      ? {
          ...user.savings,
          "My Savings 1": user.savings["My Savings 1"]
            ? {
                amount: user.savings["My Savings 1"].amount,
                details: {
                  ...user.savings["My Savings 1"].details,
                  customerName: formData.fullName,
                  nationalId: formData.nationalId,
                },
              }
            : undefined,
          "My Savings 2": user.savings["My Savings 2"]
            ? {
                amount: user.savings["My Savings 2"].amount,
                details: {
                  ...user.savings["My Savings 2"].details,
                  customerName: formData.fullName,
                  nationalId: formData.nationalId,
                },
              }
            : undefined,
        }
      : undefined;

    const cleanSavings = updatedSavings
      ? Object.fromEntries(
          Object.entries(updatedSavings).filter(([_, value]) => value !== undefined)
        ) as {
          [key: string]: {
            amount: string;
            details: { customerName: string; nationalId: string; depositAmount: string; depositTerm: string; interestRate: string };
          };
        }
      : undefined;

    const updatedUser: User = {
      ...user,
      name: formData.fullName,
      location: formData.address,
      email: formData.email,
      phone: formData.phoneNumber,
      savings: cleanSavings,
    };

    onUpdate(updatedUser);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div
      className="min-h-screen relative z-0"
      style={{
        background: "linear-gradient(90deg, #FF086A 0%, #FB5D5D 50%, #F19BDB 100%)",
      }}
    >
      {/* Fixed AdminHeader */}
      <div className="fixed top-0 left-0 w-full z-[100]">
        <AdminHeader />
      </div>

      {/* Modal */}
      <div className="fixed inset-0 mt-16 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
          className="relative w-[1800px] h-[1100px] max-w-[1800px] max-h-[1100px] flex items-center justify-center"
          style={{
            background: "linear-gradient(90deg, #FF086A 0%, #FB5D5D 50%, #F19BDB 100%)",
          }}
        >
          <div className="relative w-[1000px] h-[555px] bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex flex-col items-center justify-center h-full p-6">
              <h2 className="text-5xl font-bold text-[#FF086A] mb-4">Update Customer's Profile</h2>
              <div className="w-full max-w-[600px] space-y-2">
                {/* Full Name */}
                <div className="grid grid-cols-2 items-center border-b border-gray-300 py-2">
                  <label className="text-lg text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="text-xl text-gray-700 bg-transparent focus:outline-none"
                  />
                </div>

                {/* Date of Birth */}
                <div className="grid grid-cols-2 items-center border-b border-gray-300 py-2">
                  <label className="text-lg text-gray-700">Date of Birth</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      placeholder="dd/mm/yyyy"
                      className="text-xl text-gray-700 bg-transparent focus:outline-none"
                      onClick={openDatePicker}
                    />
                    <span
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg cursor-pointer"
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
                <div className="grid grid-cols-2 items-center border-b border-gray-300 py-2">
                  <label className="text-lg text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="text-xl text-gray-700 bg-transparent focus:outline-none"
                  />
                </div>

                {/* National ID Card */}
                <div className="grid grid-cols-2 items-center border-b border-gray-300 py-2">
                  <label className="text-lg text-gray-700">National ID Card</label>
                  <input
                    type="text"
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={handleChange}
                    className="text-xl text-gray-700 bg-transparent focus:outline-none"
                  />
                </div>

                {/* Phone Number */}
                <div className="grid grid-cols-2 items-center border-b border-gray-300 py-2">
                  <label className="text-lg text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="text-xl text-gray-700 bg-transparent focus:outline-none"
                  />
                </div>

                {/* Email */}
                <div className="grid grid-cols-2 items-center border-b border-gray-300 py-2">
                  <label className="text-lg text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="text-xl text-gray-700 bg-transparent focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-600 font-medium py-2 px-6 rounded-lg text-xl uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-[#FF086A] text-white font-medium py-2 px-6 rounded-lg text-xl uppercase"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}