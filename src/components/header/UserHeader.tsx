"use client";

import Link from 'next/link';
import Image from 'next/image';
import logoHeader from '@/assets/logoHeader.png'; 
import userIcon from '@/assets/user.png'; // Đổi tên biến
import { usePathname, useRouter } from 'next/navigation'; // Thêm useRouter
import { useState, useEffect } from 'react';

const UserHeader = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        // Kiểm tra token hoặc thông tin user trong localStorage để xác định trạng thái đăng nhập
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const userEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null; // Hoặc tên user nếu có
        
        if (token) {
            setIsLoggedIn(true);
            setUserName(userEmail ? userEmail.split('@')[0] : "User"); // Hiển thị phần trước @ của email hoặc "User"
        } else {
            setIsLoggedIn(false);
            setUserName(null);
        }
    }, [pathname]); // Re-check khi path thay đổi, phòng trường hợp token bị xóa ở trang khác

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("userId");
            localStorage.removeItem("userEmail");
        }
        setIsLoggedIn(false);
        setUserName(null);
        setIsDropdownOpen(false);
        router.push('/signin'); // Chuyển về trang đăng nhập
    };

    const navLinks = [
        { href: "/user/home", label: "Trang Chủ" }, // Dịch sang tiếng Việt
        { href: "/user/yoursavings", label: "Sổ Của Bạn" }, // Đổi tên path cho nhất quán (ví dụ)
        { href: "/user/dashboard", label: "Thống Kê" } // Link đến dashboard của user
    ];

    return (
        <header className="bg-white text-gray-800 p-4 shadow-md sticky top-0 z-50 h-16 md:h-20"> {/* Sticky header, chiều cao cố định */}
            <nav className="container mx-auto flex justify-between items-center h-full">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link href={isLoggedIn ? "/user/home" : "/"}> {/* Link về home của user nếu đã login */}
                        <Image
                            src={logoHeader} 
                            alt="MonNes Logo"
                            width={150} // Điều chỉnh kích thước nếu cần
                            height={70}
                            priority 
                        />
                    </Link>
                </div>
                
                {/* Navigation Links (Chỉ hiển thị nếu đã đăng nhập) */}
                {isLoggedIn && (
                    <ul className="hidden md:flex flex-row space-x-6 lg:space-x-10 items-center">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link 
                                    href={link.href}
                                    className={`font-medium pb-1 hover:text-pink-600 transition-colors duration-200 ${
                                        pathname === link.href || (link.href === "/user/dashboard" && pathname.startsWith("/user/dashboard"))
                                            ? 'text-pink-600 border-b-2 border-pink-600' 
                                            : 'text-gray-600'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                {/* User Info / Login Button */}
                <div className="relative">
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md"
                    >
                        <Image src={userIcon} alt="User" width={32} height={32} className="rounded-full" />
                        {userName && <span className="text-sm font-medium hidden md:inline">{userName}</span>}
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                            <Link href="/user/profile" passHref>
                                <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">
                                    Hồ sơ cá nhân
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

export default UserHeader;