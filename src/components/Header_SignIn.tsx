'use client';

import Link from 'next/link';
import Image from 'next/image';
import logoHeader from '@/assets/logoHeader.png'; 

const Header = () => {

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
      </nav>
    </header>
  );
};

export default Header;