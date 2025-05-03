'use client';

import Image from "next/image";
import Header from '@/components/Header_SignIn';
import Logo from '@/assets/logo_monnes.png';
import { useState } from "react";
import { sendPasscodeAPI, verifyPasscodeAPI } from '@/services/api';
import { useRouter } from "next/navigation";

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [passcode, setPasscode] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSendPasscode = async () => {
        setErrorMsg('');
        setSuccessMsg('');

        if (!email) {
            setErrorMsg('Vui lòng nhập email.');
            return;
        }

        setIsLoading(true);
        try {
            await sendPasscodeAPI(email);
            setSuccessMsg('Passcode đã được gửi đến email của bạn.');
        } catch (error: any) {
            setErrorMsg(error.message || 'Gửi passcode thất bại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!email || !passcode) {
            setErrorMsg('Vui lòng nhập email và passcode.');
            return;
        }

        const trimmedPasscode = passcode.trim();
        console.log('Submitting passcode:', { email, passcode: trimmedPasscode });

        setIsLoading(true);
        try {
            await verifyPasscodeAPI(email, trimmedPasscode);
            setSuccessMsg('Xác minh passcode thành công!');
            setTimeout(() => {
                router.push(`/resetpassword/newpassword?email=${encodeURIComponent(email)}`);
            }, 1000);
        } catch (error: any) {
            console.error('Verify passcode error:', error);
            setErrorMsg(error.message || 'Passcode không hợp lệ hoặc đã hết hạn.');
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
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value.trim())}
                                        placeholder="Email"
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div
                                    className="text-sm text-pink-600 hover:underline cursor-pointer text-center"
                                    onClick={handleSendPasscode}
                                >
                                    Gửi passcode đến email của bạn
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium text-sm text-gray-700">
                                        Passcode
                                    </label>
                                    <input
                                        type="text"
                                        value={passcode}
                                        onChange={(e) => setPasscode(e.target.value)}
                                        placeholder="Passcode"
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        disabled={isLoading}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded disabled:bg-gray-400"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang xử lý...' : 'TIẾP TỤC'}
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