"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation'; // Thêm useRouter
import logoHeader from '@/assets/logoHeader.png';
import userIcon from '@/assets/user.png'; // Đổi tên biến cho rõ ràng
import { useState, useEffect } from 'react';

const AdminHeader = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [adminName, setAdminName] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        // Lấy thông tin admin từ localStorage (ví dụ: email hoặc tên)
        const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
        // Hoặc bạn có thể lưu tên người dùng đầy đủ nếu UserResponse có
        setAdminName(email); 
    }, []);

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("userId");
            localStorage.removeItem("userEmail");
        }
        router.push('/'); // Chuyển hướng về trang đăng nhập
    };

    const navLinks = [
        { href: "/admin/home", label: "Trang Chủ" },
        { href: "/admin/management", label: "Người Dùng" }, // Rõ ràng hơn
        { href: "/admin/savings-products-management", label: "Loại Sổ" }, // Link tới trang quản lý loại sổ
        { href: "/admin/dashboard", label: "Thống Kê" }, // Trang thống kê doanh thu
        { href: "/admin/transactions", label: "Giao Dịch" }, // Trang quản lý giao dịch
    ];

    return (
        <header className="bg-white text-black p-4 shadow-md sticky top-0 z-50 h-20"> {/* sticky top-0 z-50 để cố định header, tăng chiều cao h-20 */}
            <nav className="container mx-auto flex justify-between items-center h-full"> {/* Thêm container mx-auto */}
                <div> {/* Bọc logo trong div */}
                    <Link href="/admin/home">
                        <Image
                            src={logoHeader} 
                            alt="MonNes Logo"
                            width={150}  // Có thể điều chỉnh
                            height={70} // Có thể điều chỉnh
                            priority 
                        />
                    </Link>
                </div>
                
                <ul className="flex flex-row space-x-6 lg:space-x-8 items-center"> {/* Bỏ absolute, căn giữa bằng flex của nav */}
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
                        {/* Hiển thị phần trước @ của email */}
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