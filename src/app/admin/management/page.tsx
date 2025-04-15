"use client";

import Image from "next/image";
import { useState } from "react";
import AdminHeader from '@/components/AdminHeader';
import Search from "@/assets/icon/Vector.png";
import Name from "@/assets/icon/Name.png";
import Flag from "@/assets/icon/image 1.png"; 
import DropdownArrow from "@/assets/icon/DropdownArrow.png"; 
import Pen from "@/assets/icon/Pen.png"; 
import { getCountryByCode } from '@/components/CountryCodes'; 

interface User {
  name: string;
  location: string;
  image?: string;
  email?: string;
  phone?: string;
  savings?: { [key: string]: { amount: string; details: { customerName: string; nationalId: string; depositAmount: string; depositTerm: string; interestRate: string } } };
  walletBalance?: string;
}


const users: User[] = [
  {
    name: "Phạm Hà Anh Thư",
    location: "TP. Hồ Chí Minh",
    image: "/images/user1.jpg", // Placeholder image path
    email: "email@gmail.com",
    phone: "+84 945771705",
    savings: {
      "My Savings 1": {
        amount: "1,000,000 VND",
        details: {
          customerName: "Phạm Hà Anh Thư",
          nationalId: "123456789",
          depositAmount: "1,000,000 VND",
          depositTerm: "12 months",
          interestRate: "5%",
        },
      },
      "My Savings 2": {
        amount: "10,000,000 VND",
        details: {
          customerName: "Phạm Hà Anh Thư",
          nationalId: "123456789",
          depositAmount: "10,000,000 VND",
          depositTerm: "24 months",
          interestRate: "6%",
        },
      },
    },
  },
  {
    name: "Huỳnh Quốc Sang",
    location: "TP. Hồ Chí Minh",
    email: "huynhquocsang@gmail.com",
    phone: "+1 1234567890",
    savings: {
      "My Savings 1": {
        amount: "2,000,000 VND",
        details: {
          customerName: "Huỳnh Quốc Sang",
          nationalId: "987654321",
          depositAmount: "2,000,000 VND",
          depositTerm: "6 months",
          interestRate: "4%",
        },
      },
    },
  },
  { name: "Nguyễn Thanh Bình", location: "TP. Hồ Chí Minh" },
  { name: "Nguyễn Hoàng Minh", location: "Hà Nội" },
  { name: "Đặng Văn Vỹ", location: "Đà Nẵng" },
];

export default function Management() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [openSavings, setOpenSavings] = useState<{ [key: string]: boolean }>({}); 

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate wallet balance as the sum of all savings amounts
  const calculateWalletBalance = (user: User): string => {
    if (!user.savings) return "0 VND";
    const total = Object.values(user.savings).reduce((sum, saving) => {
      const amount = parseInt(saving.amount.replace(/[^0-9]/g, "")) || 0;
      return sum + amount;
    }, 0);
    return `${total.toLocaleString()} VND`;
  };

  // Toggle savings details
  const toggleSavingsDetails = (savingKey: string) => {
    setOpenSavings((prev) => ({
      ...prev,
      [savingKey]: !prev[savingKey],
    }));
  };

  // Handle user selection with toggle behavior
  const handleUserSelect = (user: User) => {
    if (selectedUser === user) {
      setSelectedUser(null); // Hide panel if the same user is clicked
      setIsEditing(false); // Reset editing state
      setOpenSavings({}); // Reset savings dropdowns
    } else {
      setSelectedUser(user);
      setEditedName(user.name);
      setEditedImage(user.image || null);
    }
  };

  // Handle save after editing
  const handleSaveEdit = () => {
    if (selectedUser) {
      selectedUser.name = editedName;
      selectedUser.image = editedImage || selectedUser.image;
      setIsEditing(false);
    }
  };

  // Debugging: Log to confirm the component is rendering
  console.log("Rendering Management with USER INFORMATION bar");

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Use the Header component */}
      <AdminHeader />

      {/* Main Content */}
      <main className="px-10 pt-10 pb-6 mt-6 flex flex-col sm:flex-row">
        {/* User List Section */}
        <div className="w-full sm:w-2/3 px-6">
          <div
            className="user-info-bar w-full flex flex-col sm:flex-row justify-between items-center mb-4 rounded-lg shadow py-6 px-6 mt-0"
            style={{ background: "linear-gradient(90deg, #FF086A 0%, #FB5D5D 44%, #F19BDB 100%)" }}
          >
            <div className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-2 w-full sm:w-72 shadow relative z-10">
              <Image src={Search} alt="Search Icon" width={20} height={20} className="mr-2" />
              <input
                type="text"
                placeholder="Find an user..."
                value={searchTerm}
                onChange={(e) => {
                  console.log("Input changed:", e.target.value);
                  setSearchTerm(e.target.value);
                }}
                className="outline-none w-full pointer-events-auto"
              />
            </div>

            <h2 className="mt-4 sm:mt-0 text-2xl sm:text-3xl font-bold uppercase text-white flex-1 text-center">
              USER INFORMATION
            </h2>
          </div>

        {/* User List */}
        <div className="bg-white rounded shadow divide-y">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, idx) => (
                <div
                  key={idx}
                  className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${
                    selectedUser === user ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleUserSelect(user)} // Toggle user selection
                >
                  <Image src={Name} alt="User Icon" width={45} height={20} className="mr-4" />
                  <span className="flex-1">{user.name}</span>
                  <span className="text-gray-600">{user.location}</span>
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-500 text-center">No users found.</div>
            )}
          </div>
        </div>

        {/* User Profile Panel (conditionally rendered) */}
        {selectedUser && (
          <div className="w-full sm:w-1/3 px-6 flex justify-end">
            <div
              className="w-full sm:w-80 h-fit rounded-lg shadow py-6 px-6 mt-0"
              style={{ background: "linear-gradient(90deg, #FF086A 0%, #FB5D5D 44%, #F19BDB 100%)" }}
            >
              {/* User Image and Name with Edit Option */}
              <div className="flex flex-col items-center mb-4">
                <Image
                  src={editedImage || selectedUser.image || Name}
                  alt="User Image"
                  width={80}
                  height={80}
                  className="rounded-full mb-2"
                />
                <div className="flex items-center">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="text-xl font-bold text-white bg-transparent border-b border-white outline-none mr-2"
                      />
                      <button onClick={handleSaveEdit} className="text-white">
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold text-white">{selectedUser.name}</h3>
                      <Image
                        src={Pen}
                        alt="Edit Icon"
                        width={16}
                        height={16}
                        className="ml-2 cursor-pointer"
                        onClick={() => setIsEditing(true)}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Email and Phone with Country Flag */}
              <div className="flex items-center mb-2">
                {selectedUser.email || selectedUser.phone ? (
                  <>
                    {selectedUser.email ? (
                      <div className="flex items-center flex-1">
                        <p className="text-white">{selectedUser.email}</p>
                      </div>
                    ) : (
                      <p className="text-gray-300 italic flex-1">Email not provided</p>
                    )}
                    {selectedUser.phone && selectedUser.email && (
                      <Image
                        src={selectedUser.phone ? (getCountryByCode(selectedUser.phone)?.flag || Flag) : Flag}
                        alt="Country Flag"
                        width={12}
                        height={12}
                        className="mx-2"
                      />
                    )}
                    {selectedUser.phone ? (
                      <p className="text-white">{selectedUser.phone}</p>
                    ) : (
                      <p className="text-gray-300 italic">Phone not provided</p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center">
                    <p className="text-gray-300 italic flex-1">Email not provided</p>
                    <p className="text-gray-300 italic">Phone not provided</p>
                  </div>
                )}
              </div>

              {/* Savings Sections with Dropdown */}
              {selectedUser.savings &&
                Object.entries(selectedUser.savings).map(([key, saving]) => (
                  <div key={key} className="mb-2">
                    <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1 cursor-pointer" onClick={() => toggleSavingsDetails(key)}>
                      <p className="text-white">{key}</p>
                      <div className="flex items-center">
                        <p className="text-white mr-2">{saving.amount}</p>
                        <Image
                          src={DropdownArrow}
                          alt="Dropdown Arrow"
                          width={12}
                          height={12}
                          className={`transform ${openSavings[key] ? "rotate-180" : ""}`} // Rotate arrow when open
                        />
                      </div>
                    </div>
                    {openSavings[key] && (
                      <div className="bg-white rounded-lg px-2 py-1 mt-1 text-white">
                        <p>Customer's Name: {saving.details.customerName}</p>
                        <p>National ID Card: {saving.details.nationalId}</p>
                        <p>Deposit Amount: {saving.details.depositAmount}</p>
                        <p>Deposit Term: {saving.details.depositTerm}</p>
                        <p>Interest Rate: {saving.details.interestRate}</p>
                      </div>
                    )}
                  </div>
                ))}

              {/* Wallet Balance */}
              <div className="flex justify-between items-center bg-white rounded-lg px-2 py-1">
                <p className="text-white font-bold">Wallet Balance</p>
                <p className="text-white font-bold">{calculateWalletBalance(selectedUser)}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}