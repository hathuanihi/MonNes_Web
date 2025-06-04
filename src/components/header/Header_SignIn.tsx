'use client';

import Link from 'next/link';
import Image from 'next/image';
import logoHeader from '@/assets/logoHeader.png'; 

const Header = () => {

  return (
    <header className="bg-white text-gray-800 p-4 shadow-md sticky top-0 z-50 h-16 md:h-20">
      <nav className="container mx-auto flex justify-between items-center h-full">
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src={logoHeader}
              alt="MonNes Logo"
              width={150}
              height={70}
              priority
            />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;