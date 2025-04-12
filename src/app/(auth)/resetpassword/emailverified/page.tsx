'use client';

import Image from "next/image";
import Header from '@/components/Header_SignIn';
import Logo from '@/assets/logo_monnes.png';
import Link from "next/link";

export default function ResetPassword() {
    return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB]">
      <Header />

      <main className="flex-1 flex justify-center items-start px-6 mt-30">
        <div className="w-1/2 hidden md:flex flex-col justify-center items-center pt-20 pl-50">
            <Image
              src={Logo}
              alt="MonNes Large Logo"
              width={140}
              height={140}
            />
        </div>
        <div className="flex flex-col w-full max-w-8xl items-center">
        <div>
            <div className="w-[450px] bg-white p-8 rounded-lg shadow-md"> 
              <h2 className="text-center text-xl font-bold text-pink-600 mb-4">
                Reset Your Password
              </h2>
              <hr className="border-t-2 border-pink-500 mb-6" />
              <form className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-sm text-gray-700">
                    Email
                  </label>
                  <input
                    type="text"
                    placeholder="Email"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div className="text-sm text-pink-600 hover:underline cursor-pointer text-center">
                    Send Passcode To Your Email Address
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sm text-gray-700">
                    Passcode
                  </label>
                  <input
                    type="text"
                    placeholder="Passcode"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <Link 
                  href={'/resetpassword/newpassword'}
                  className="mt-4">
                  <button
                    type="submit"
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded"
                  >
                    CONTINUE
                  </button>
                </Link>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}