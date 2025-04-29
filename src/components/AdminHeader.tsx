"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logoHeader from '@/assets/logoHeader.png';
import user from '@/assets/user.png';
import { useState } from 'react';

const AdminHeader = () => {
  const pathname = usePathname();

  return (
    <header className="bg-white text-black p-4 shadow-md relative h-15">
      <nav className="flex flex-row justify-between items-center max-w-5xl">
        <h1>
          <Link href="/admin/home">
            <Image
              src={logoHeader} 
              alt="Logo"
              width={150}   
              height={70} 
              priority 
            />
          </Link>
        </h1>
        <ul className="text-[18px] font-medium absolute left-1/2 transform -translate-x-1/2 flex flex-row space-x-8 justify-center items-center pt-3">
          <li>
            <Link 
              href="/admin/home"
              className={pathname === '/admin/home' ? 'text-[#FF086A]' : 'text-black'}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/management"
              className={pathname === '/admin/management' ? 'text-[#FF086A]' : 'text-black'}
            >
              Management
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/dashboard"
              className={pathname === '/admin/dashboard' ? 'text-[#FF086A]' : 'text-black'}
            >
              Dashboard
            </Link>
          </li>
        </ul>
        <div className="justify-center items-center flex flex-row absolute right-1">
          <Link href="/signin">
            <Image src={user} alt="User" width={32} height={32} />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;