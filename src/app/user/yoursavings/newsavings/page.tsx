"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import UserHeader from "@/components/UserHeader";

const NewSavings = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    savingsName: "My Savings",
    userName: "Phạm Hà Anh Thư",
    address: "TP. Hồ Chí Minh",
    nationalId: "051305000123",
    depositAmount: "5,000,000 VND",
    depositTerm: "3 months",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTermSelect = (term: string) => {
    setFormData((prev) => ({
      ...prev,
      depositTerm: term,
    }));
    setDropdownOpen(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.savingsName.trim()) newErrors.savingsName = "Savings name is required";
    if (!formData.userName.trim()) newErrors.userName = "Name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.nationalId.trim()) newErrors.nationalId = "National ID is required";
    if (!formData.depositAmount.trim()) newErrors.depositAmount = "Deposit amount is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      router.push("/user/yoursavings");
    }
  };

  const handleCancel = () => router.push("/user/yoursavings");

  return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#FFE2E9] via-[#FFF6F6] to-[#E2F4FF] flex flex-col">
        <div className="fixed top-0 left-0 right-0 z-50">
          <UserHeader />
        </div>

      <div className="flex flex-col items-center pt-[150px] px-6 md:px-20">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-bold text-pink-600 mb-10">Create Your New Savings</h1>

          <form onSubmit={handleSubmit} className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-10 text-lg">
                <div className="font-medium">Name of Savings</div>
                <div className="font-medium mt-[43px]">Your Name</div>
                <div className="font-medium mt-[54px]">Address</div>
                <div className="font-medium mt-[54px]">National ID Card</div>
                <div className="font-medium mt-[54px]">Deposit Amount</div>
                <div className="font-medium mt-[54px]">Deposit Term</div>
              </div>

              <div className="col-span-2 pl-6 md:pl-20">
                <div className="space-y-6">
                  <div>
                    <input
                      type="text"
                      name="savingsName"
                      value={formData.savingsName}
                      onChange={handleChange}
                      className="w-full text-lg bg-transparent border-b border-black/20 pb-2 focus:outline-none focus:border-pink-600 ml-4"
                    />
                    {errors.savingsName && <p className="text-red-500 text-sm mt-1 ml-4">{errors.savingsName}</p>}
                  </div>

                  <div className="mt-6">
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      className="w-full text-lg bg-transparent border-b border-black/20 pb-2 focus:outline-none focus:border-pink-600 ml-4"
                    />
                    {errors.userName && <p className="text-red-500 text-sm mt-1 ml-4">{errors.userName}</p>}
                  </div>

                  <div className="mt-10">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full text-lg bg-transparent border-b border-black/20 pb-2 focus:outline-none focus:border-pink-600 ml-4"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1 ml-4">{errors.address}</p>}
                  </div>

                  <div className="mt-10">
                    <input
                      type="text"
                      name="nationalId"
                      value={formData.nationalId}
                      onChange={handleChange}
                      className="w-full text-lg bg-transparent border-b border-black/20 pb-2 focus:outline-none focus:border-pink-600 ml-4"
                    />
                    {errors.nationalId && <p className="text-red-500 text-sm mt-1 ml-4">{errors.nationalId}</p>}
                  </div>

                  <div className="mt-10">
                    <input
                      type="text"
                      name="depositAmount"
                      value={formData.depositAmount}
                      onChange={handleChange}
                      className="w-full text-lg bg-transparent border-b border-black/20 pb-2 focus:outline-none focus:border-pink-600 ml-4"
                    />
                    {errors.depositAmount && <p className="text-red-500 text-sm mt-1 ml-4">{errors.depositAmount}</p>}
                  </div>

                  <div className="mt-10 relative">
                    <div
                      className="w-full text-lg bg-transparent border-b border-black/20 pb-2 flex justify-between items-center cursor-pointer ml-4"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <span>{formData.depositTerm}</span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                      >
                        <path d="M6 9L12 15L18 9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    {dropdownOpen && (
                      <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 ml-4">
                        {["3 months", "6 months", "9 months"].map((term) => (
                          <div
                            key={term}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleTermSelect(term)}
                          >
                            {term}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-20">
              <button
                type="button"
                onClick={handleCancel}
                className="px-10 py-3 bg-gray-500 text-white font-bold rounded-xl text-xl hover:bg-gray-600 transition-colors"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-10 py-3 bg-pink-600 text-white font-bold rounded-xl text-xl hover:bg-pink-700 transition-colors"
              >
                CREATE
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewSavings;
