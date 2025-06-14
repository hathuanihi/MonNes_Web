"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation'; 
import logoHeader from '@/assets/logoHeader.png';
import userIcon from '@/assets/user.png'; 
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const AdminHeader = () => {
    const { logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [adminName, setAdminName] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
        setAdminName(email); 
    }, []);

    const handleLogout = () => {
        logout(); 
        setIsDropdownOpen(false);
    };

    const navLinks = [
        { href: "/admin/home", label: "Trang Chủ" },
        { href: "/admin/management", label: "Người Dùng" }, 
        { href: "/admin/savings-products-management", label: "Loại Sổ" }, 
        { href: "/admin/dashboard", label: "Thống Kê" }, 
        { href: "/admin/transactions", label: "Giao Dịch" }, 
        { href: "/admin/reports", label: "Báo Cáo" }, 
    ];

    return (
        <header className="bg-white text-black p-4 shadow-md sticky top-0 z-50 h-20"> 
            <nav className="container mx-auto flex justify-between items-center h-full"> 
                <div> 
                    <Link href="/admin/home">
                        <Image
                            src={logoHeader} 
                            alt="MonNes Logo"
                            width={150}  
                            height={70} 
                            priority 
                        />
                    </Link>
                </div>
                
                <ul className="flex flex-row space-x-6 lg:space-x-8 items-center"> 
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link 
                                href={link.href}
                                className={`font-medium pb-1 hover:text-pink-600 transition-colors duration-200 ${
                                    pathname === link.href 
                                        ? 'text-pink-600 border-b-2 border-pink-600' 
                                        : 'text-gray-700'
                                }`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="relative">
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md"
                    >
                        <Image src={userIcon} alt="User" width={32} height={32} className="rounded-full" />
                        {adminName && <span className="text-sm font-medium hidden md:inline">{adminName.split('@')[0]}</span>} 
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                            <Link href="/admin/profile" passHref>
                                <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">
                                    Hồ sơ
                                </div>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default AdminHeader;