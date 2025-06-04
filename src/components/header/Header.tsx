'use client';

import Link from 'next/link';
import Image from 'next/image';
import logoHeader from '@/assets/logoHeader.png'; 
import user from '@/assets/user.png';
import { useState } from 'react';

const Header = () => {
  const [activeLink, setActiveLink] = useState<string | null>(null);

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  return (
    <header className="bg-white text-gray-800 p-4 shadow-md sticky top-0 z-50 h-16 md:h-20">
      <nav className="container mx-auto flex justify-between items-center h-full">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/signin">
            <Image
              src={logoHeader}
              alt="MonNes Logo"
              width={150}
              height={70}
              priority
            />
          </Link>
        </div>
        {/* Navigation Links */}
        <ul className="hidden md:flex flex-row space-x-6 lg:space-x-10 items-center">
        </ul>
        {/* User Icon */}
        <div className="relative">
          <Link href="/signin">
            <Image src={user} alt="User" width={32} height={32} className="rounded-full" />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;