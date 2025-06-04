'use client';

import Image from "next/image";
import Header from '@/components/header/Header_SignIn'; 
import Logo from '@/assets/logo_monnes.png';    
import Link from "next/link";
import eye_open from '@/assets/icon/eyeopen.png'; 
import eye_off from '@/assets/icon/eyeoff.png';   
import { useState, FormEvent } from "react";
import { loginAPI } from '@/services/api';       
import { useRouter } from "next/navigation";

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!username || !password) {
            setErrorMsg('Vui lòng nhập tên đăng nhập và mật khẩu.');
            return;
        }

        setIsLoading(true);
        const loginData: LoginRequest = { username, password };

        try {
            const responseData: LoginResponseData = await loginAPI(loginData);
            console.log('Login response data:', responseData);
            setSuccessMsg(responseData.message || 'Đăng nhập thành công!');
            
            const roleFromServer = responseData.user.vaiTro;
            const userId = responseData.user.id; 
            console.log('Vai trò từ server:', roleFromServer);
            console.log('UserID:', userId);

            if (typeof window !== "undefined") {
                localStorage.setItem('userId', userId.toString());
                 // localStorage.setItem('userEmail', responseData.user.email || ''); 
            }

            const redirectPath = roleFromServer === "ADMIN" ? '/admin/home' : '/user/home';
            setTimeout(() => {
                router.push(redirectPath);
            }, 1000);

        } catch (error: any) {
            console.error('Login error:', error);
            setErrorMsg(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB]">
            <Header />
            <main className="flex-1 flex flex-col md:flex-row justify-center items-start md:pt-16 lg:pt-20 px-4 sm:px-6 lg:px-8 py-8">
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center mb-10 md:mb-0 md:pr-8 lg:pr-12 mt-25">
                    <Image src={Logo} alt="MonNes Large Logo" width={160} height={160} priority />
                </div>
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start md:justify-start md:pl-8 lg:pl-12 mt-10">
                    <div className="w-full max-w-lg bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
                        <div className="flex border-b mb-6">
                            <button className="w-1/2 text-center pb-3 border-b-2 border-pink-500 font-semibold text-pink-600 text-lg">
                                Đăng nhập
                            </button>
                            <Link href="/signup" className="w-1/2 text-center pb-3">
                                <div className="text-gray-500 hover:text-pink-600 font-medium text-lg cursor-pointer">Đăng ký</div>
                            </Link>
                        </div>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="usernameInput" className="block mb-2 font-medium text-sm text-gray-700">
                                    Email hoặc Số điện thoại
                                </label>
                                <input
                                    id="usernameInput"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Nhập email hoặc số điện thoại"
                                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="passwordInput" className="block mb-2 font-medium text-sm text-gray-700">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <input
                                        id="passwordInput"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Nhập mật khẩu"
                                        className="w-full border border-gray-300 rounded-md px-4 py-3 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                        disabled={isLoading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-0 top-0 h-full px-4 flex items-center text-gray-500 hover:text-pink-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                    >
                                        <Image
                                            src={showPassword ? eye_open : eye_off}
                                            alt={showPassword ? "Hiện mật khẩu" : "Ẩn mật khẩu"}
                                            width={20}
                                            height={20}
                                        />
                                    </button>
                                </div>
                            </div>
                            <div className="text-right">
                                <Link
                                    href={'/resetpassword'}
                                    className="text-sm text-pink-600 hover:underline hover:text-pink-700 font-medium"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white font-semibold py-3 rounded-md disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-150"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
                            </button>
                            {errorMsg && <p className="text-red-600 text-sm mt-3 text-center">{errorMsg}</p>}
                            {successMsg && <p className="text-green-600 text-sm mt-3 text-center">{successMsg}</p>}
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}