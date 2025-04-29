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
    <header className="bg-white text-black p-4 shadow-md relative h-15">
      <nav className="flex flex-row justify-between items-center max-w-5xl">
        <h1>
          <Link href="/">
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
              href="/user/home"
              onClick={() => handleLinkClick('home')}
              className={activeLink === 'home' ? 'text-pink-700' : 'text-black'}
              >Home
            </Link>
          </li>
          <li>
            <Link 
              href="/user/yoursavings"
              onClick={() => handleLinkClick('your_savings')}
              className={activeLink === 'yoursavings' ? 'text-pink-700' : 'text-black'}
              >Your Savings
            </Link>
          </li>
          <li>
            <Link 
              href="/signin"
              onClick={() => handleLinkClick('dashboard')}
              className={activeLink === 'dashboard' ? 'text-pink-700' : 'text-black'}
            >Dashboard
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

export default Header;