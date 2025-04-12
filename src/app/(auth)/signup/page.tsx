'use client';   

import Image from "next/image";
import { useState } from "react";
import Header from '@/components/Header_SignIn';
import Logo from '@/assets/logo_monnes.png';
import Link from "next/link";
import eye_open from '@/assets/icon/eyeopen.png'
import eye_off from '@/assets/icon/eyeoff.png'

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

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
              <div className="flex border-b mb-6"> 
                <Link 
                    href="/signin"
                    className="w-1/2 text-center pb-2">
                  <button className="text-gray-600 hover:text-pink-600">
                    Sign In
                  </button>
                </Link>
                <button className="w-1/2 text-center pb-2 border-b-2 border-pink-500 font-semibold text-pink-600">
                  Sign Up
                </button>
              </div>
              
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
                <div>
                  <label className="block mb-1 font-medium text-sm text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sm text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full border border-gray-300 rounded px-3 py-2 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <div
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Image
                        src={showPassword ? eye_open : eye_off}
                        alt={showPassword ? "Eye Open" : "Eye Off"}
                        width={20}
                        height={20}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-sm text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      placeholder="Confirm Password"
                      type={"password"}
                      className="w-full border border-gray-300 rounded px-3 py-2 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded"
                >
                  SIGN UP
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}