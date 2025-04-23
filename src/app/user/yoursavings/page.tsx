"use client";

import React, { useState } from "react";
import Link from "next/link";
import UserHeader from "@/components/UserHeader";

const YourSavings = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    threeMonths: false,
    sixMonths: false,
    nineMonths: false,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const toggleFilter = (filter: keyof typeof selectedFilters) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const savingsData = [
    { name: "My Savings 1", amount: "1,456,789 VND", term: "3" },
    { name: "My Savings 2", amount: "2,564,256 VND", term: "6" },
    { name: "My Savings 3", amount: "789,678 VND", term: "9" },
  ];

  const filteredSavings = savingsData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

    const selectedTerms = [];
    if (selectedFilters.threeMonths) selectedTerms.push("3");
    if (selectedFilters.sixMonths) selectedTerms.push("6");
    if (selectedFilters.nineMonths) selectedTerms.push("9");

    const matchesFilter =
      selectedTerms.length === 0 || selectedTerms.includes(item.term);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full">
        <UserHeader />
      </div>

      {/* Main Content */}
      <div className="pt-[100px] w-full">
        <div className="flex w-full gap-8">          {/* Left Column - Savings List */}
          <div className="w-2/3 pl-10 pr-4">
            <div className="flex flex-col font-sans text-xl">
              {filteredSavings.map((saving) => (
                <React.Fragment key={saving.name}>
                  <div className="flex justify-between items-center w-full">
                    <div className="text-black">{saving.name}</div>
                    <div className="text-black/50">{saving.amount}</div>
                  </div>
                  <div className="h-[1px] border-t border-black/10 mt-5 mb-8"></div>
                </React.Fragment>
              ))}
              {filteredSavings.length === 0 && (
                <div className="text-black/50 text-center mt-10 text-xl">
                  No savings match your filters.
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-1/3">
            <div className="bg-gradient-to-l from-pink-600/30 via-red-400/30 to-pink-300/30 rounded-l-[40px] shadow-[-4px_0px_4px_1px_rgba(0,0,0,0.25)] overflow-hidden py-[60px] px-[30px] text-lg text-pink-600 font-normal h-full">
              {/* Search Box */}
              <div className="bg-white rounded-[30px] flex items-center px-4 py-2 mb-10">
                <input
                  type="text"
                  placeholder="Find your Savings"
                  className="bg-transparent w-full outline-none text-black/80 text-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter Section */}
              <div className="text-2xl font-medium mb-5">Filter by:</div>

              {/* Filters */}
              {[
                { key: "threeMonths", label: "3-months deposit term" },
                { key: "sixMonths", label: "6-months deposit term" },
                { key: "nineMonths", label: "9-months deposit term" },
              ].map((filter) => (
                <div
                  key={filter.key}
                  className="flex items-center mt-4 gap-6 cursor-pointer"
                  onClick={() => toggleFilter(filter.key as keyof typeof selectedFilters)}
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    <div
                      className={`w-5 h-5 ${
                        selectedFilters[filter.key as keyof typeof selectedFilters]
                          ? "bg-pink-600"
                          : "border-2 border-pink-600"
                      }`}
                    ></div>
                  </div>
                  <div>{filter.label}</div>
                </div>
              ))}

              {/* Create New Savings Button */}
              <Link href="/user/yoursavings/newsavings">
                <div className="bg-pink-600 rounded-[30px] text-white text-2xl font-bold text-center py-4 mt-[100px] cursor-pointer hover:bg-pink-700 transition-colors">
                  CREATE NEW SAVINGS
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourSavings;