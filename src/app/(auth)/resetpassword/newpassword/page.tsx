'use client';

import Image from "next/image";
import Header from '@/components/Header_SignIn';
import Logo from '@/assets/logo_monnes.png';
import { useState } from "react";
import { resetPasswordAPI } from '@/services/api';
import { useRouter, useSearchParams } from "next/navigation";
import eye_open from '@/assets/icon/eyeopen.png';
import eye_off from '@/assets/icon/eyeoff.png';

export default function NewPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!newPassword || !confirmPassword) {
            setErrorMsg('Vui lòng nhập mật khẩu mới và xác nhận mật khẩu.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMsg('Xác nhận mật khẩu không khớp.');
            return;
        }

        setIsLoading(true);
        try {
            await resetPasswordAPI(email, newPassword, confirmPassword);
            setSuccessMsg('Đặt lại mật khẩu thành công!');
            setTimeout(() => {
                router.push('/signin');
            }, 1000);
        } catch (error: any) {
            setErrorMsg(error.message || 'Đặt lại mật khẩu thất bại.');
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
                            <h2 className="text-center text-xl font-bold text-pink-600 mb-4">
                                Đặt lại mật khẩu
                            </h2>
                            <hr className="border-t-2 border-pink-500 mb-6" />
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block mb-1 font-medium text-sm text-gray-700">
                                        Mật khẩu mới
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Mật khẩu mới"
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
                                <div>
                                    <label className="block mb-1 font-medium text-sm text-gray-700">
                                        Xác nhận mật khẩu
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Xác nhận mật khẩu"
                                            className="wFULL border border-gray-300 rounded px-3 py-2 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                                <button
                                    type="submit"
                                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded disabled:bg-gray-400"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang xử lý...' : 'ĐẶT LẠI MẬT KHẨU'}
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