'use client';

import Image from "next/image";
import Header from '@/components/Header_SignIn';
import Logo from '@/assets/logo_monnes.png';
import Link from "next/link";
import eye_open from '@/assets/icon/eyeopen.png';
import eye_off from '@/assets/icon/eyeoff.png';
import { useState } from "react";
import { loginAPI } from '@/services/api';
import { useRouter } from "next/navigation";

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        // Validate input
        if (!email || !password) {
            setErrorMsg('Vui lòng nhập email và mật khẩu.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await loginAPI(email, password);
            // Lưu token vào localStorage
            localStorage.setItem('token', response.token);
            setSuccessMsg('Đăng nhập thành công!');
            // Chuyển hướng theo vai trò
            const redirectPath = response.user.vaiTro === 0 ? '/admin/home' : '/user/home';
            setTimeout(() => {
                router.push(redirectPath);
            }, 1000);
        } catch (error: any) {
            setErrorMsg(error.message || 'Đăng nhập thất bại!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB]">
            <Header />
            <main className="flex-1 flex justify-center items-start px-6 mt-30">
                <div className="w-1/2 hidden md:flex flex-col justify-center items-center pt-20 pl-50">
                    <Image src={Logo} alt="MonNes Large Logo" width={140} height={140} />
                </div>
                <div className="flex flex-col w-full max-w-8xl items-center">
                    <div>
                        <div className="w-[450px] bg-white p-8 rounded-lg shadow-md">
                            <div className="flex border-b mb-6">
                                <button className="w-1/2 text-center pb-2 border-b-2 border-pink-500 font-semibold text-pink-600">
                                    Đăng nhập
                                </button>
                                <Link href="/signup" className="w-1/2 text-center pb-2">
                                    <button className="text-gray-600 hover:text-pink-600">Đăng ký</button>
                                </Link>
                            </div>
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block mb-1 font-medium text-sm text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email"
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium text-sm text-gray-700">
                                        Mật khẩu
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Mật khẩu"
                                            className="w-full border border-gray-300 rounded px-3 py-2 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            disabled={isLoading}
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
                                <Link
                                    href={'/resetpassword/emailverified'}
                                    className="text-right text-sm text-pink-600 hover:underline cursor-pointer"
                                >
                                    <div>Quên mật khẩu?</div>
                                </Link>
                                <button
                                    type="submit"
                                    className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded disabled:bg-gray-400"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
                                </button>
                                {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
                                {successMsg && <p className="text-green-600 text-sm mt-2">{successMsg}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}