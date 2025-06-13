'use client';

import Image from "next/image";
import { useState, ChangeEvent, FormEvent } from "react";
import Header from '@/components/header/Header_SignIn'; 
import Logo from '@/assets/logo_monnes.png';    
import Link from "next/link";
import eye_open from '@/assets/icon/eyeopen.png'; 
import eye_off from '@/assets/icon/eyeoff.png';   
import { useRouter } from 'next/navigation';
import { requestSignupPasscodeAPI, verifySignupPasscodeAPI, completeSignupAPI } from '@/services/api';   
import ProtectedRoute from '@/components/ProtectedRoute';

export default function SignUp() {
    const [step, setStep] = useState(1); // 1: nhập email, 2: nhập passcode, 3: nhập phone+password
    const [email, setEmail] = useState('');
    const [passcode, setPasscode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Step 1: Gửi passcode về email
    const handleSendPasscode = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        if (!email) {
            setError('Vui lòng nhập email.');
            return;
        }
        setIsLoading(true);
        try {
            await requestSignupPasscodeAPI({ email });
            setStep(2);
            setSuccessMessage('Mã xác thực đã được gửi về email.');
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || 'Lỗi khi gửi mã xác thực.');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Xác thực passcode
    const handleVerifyPasscode = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        if (!passcode) {
            setError('Vui lòng nhập mã xác thực.');
            return;
        }
        setIsLoading(true);
        try {
            await verifySignupPasscodeAPI({ email, passcode });
            setStep(3);
            setSuccessMessage('Xác thực thành công. Vui lòng hoàn tất thông tin đăng ký.');
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || 'Mã xác thực không đúng.');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Đăng ký tài khoản
    const handleCompleteSignup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        if (!phoneNumber || !password || !confirmPassword) {
            setError('Vui lòng nhập đầy đủ thông tin.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }
        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }
        setIsLoading(true);
        try {
            await completeSignupAPI({ email, phoneNumber, password, confirmPassword, passcode });
            setSuccessMessage('Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.');
            setTimeout(() => {
                router.push('/signin');
            }, 2000);
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || 'Đăng ký thất bại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute isGuestRoute={true}>
            <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB]">
                <Header />
                <main className="flex-1 flex flex-col md:flex-row justify-center items-start md:pt-16 lg:pt-20 px-4 sm:px-6 lg:px-8 py-8">
                    <div className="w-full md:w-1/2 flex flex-col justify-center items-center mb-10 md:mb-0 md:pr-8 lg:pr-12 mt-25">
                        <Image src={Logo} alt="MonNes Large Logo" width={160} height={160} priority />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col items-center md:items-start md:justify-start md:pl-8 lg:pl-12 mt-10">
                        <div className="w-full max-w-lg bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
                            <div className="flex border-b mb-6">
                                <Link href="/signin" className="w-1/2 text-center pb-3">
                                    <div className="text-gray-500 hover:text-pink-600 font-medium text-lg cursor-pointer">Đăng nhập</div>
                                </Link>
                                <button className="w-1/2 text-center pb-3 border-b-2 border-pink-500 font-semibold text-pink-600 text-lg">
                                    Đăng ký
                                </button>
                            </div>
                            {step === 1 && (
                                <form className="space-y-6" onSubmit={handleSendPasscode}>
                                    <div>
                                        <label htmlFor="emailInputReg" className="block mb-1 font-medium text-sm text-gray-700">Email</label>
                                        <input
                                            id="emailInputReg"
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="Nhập email của bạn"
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                    {error && <p className="text-red-600 text-sm mt-3 text-center">{error}</p>}
                                    {successMessage && <p className="text-green-600 text-sm mt-3 text-center">{successMessage}</p>}
                                    <button
                                        type="submit"
                                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-md disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-150"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Đang gửi mã...' : 'Gửi mã xác thực'}
                                    </button>
                                </form>
                            )}
                            {step === 2 && (
                                <form className="space-y-6" onSubmit={handleVerifyPasscode}>
                                    <div>
                                        <label htmlFor="passcodeInputReg" className="block mb-1 font-medium text-sm text-gray-700">Mã xác thực đã gửi về email</label>
                                        <input
                                            id="passcodeInputReg"
                                            type="text"
                                            value={passcode}
                                            onChange={e => setPasscode(e.target.value)}
                                            placeholder="Nhập mã xác thực"
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                    {error && <p className="text-red-600 text-sm mt-3 text-center">{error}</p>}
                                    {successMessage && <p className="text-green-600 text-sm mt-3 text-center">{successMessage}</p>}
                                    <button
                                        type="submit"
                                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-md disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-150"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Đang xác thực...' : 'Xác nhận'}
                                    </button>
                                </form>
                            )}
                            {step === 3 && (
                                <form className="space-y-5" onSubmit={handleCompleteSignup}>
                                    <div>
                                        <label htmlFor="phoneNumberInputReg" className="block mb-1 font-medium text-sm text-gray-700">Số điện thoại</label>
                                        <input
                                            id="phoneNumberInputReg"
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={e => setPhoneNumber(e.target.value)}
                                            placeholder="Nhập số điện thoại"
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="passwordRegInput" className="block mb-1 font-medium text-sm text-gray-700">Mật khẩu</label>
                                        <div className="relative">
                                            <input
                                                id="passwordRegInput"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                                disabled={isLoading}
                                                required
                                                minLength={6}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-0 top-0 h-full px-4 flex items-center text-gray-500 hover:text-pink-600"
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                            >
                                                <Image src={showPassword ? eye_open : eye_off} alt={showPassword ? "Hiện" : "Ẩn"} width={20} height={20}/>
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPasswordInputReg" className="block mb-1 font-medium text-sm text-gray-700">Xác nhận mật khẩu</label>
                                        <div className="relative">
                                            <input
                                                id="confirmPasswordInputReg"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                                placeholder="Xác nhận lại mật khẩu"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                                disabled={isLoading}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-0 top-0 h-full px-4 flex items-center text-gray-500 hover:text-pink-600"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                            >
                                                <Image src={showConfirmPassword ? eye_open : eye_off} alt={showConfirmPassword ? "Hiện" : "Ẩn"} width={20} height={20}/>
                                            </button>
                                        </div>
                                    </div>
                                    {error && <p className="text-red-600 text-sm mt-3 text-center">{error}</p>}
                                    {successMessage && <p className="text-green-600 text-sm mt-3 text-center">{successMessage}</p>}
                                    <button
                                        type="submit"
                                        className="w-full mt-6 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white font-semibold py-3 rounded-md disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-150"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Đang đăng ký...' : 'ĐĂNG KÝ'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}