'use client';

import Image from "next/image";
import { useState, ChangeEvent, FormEvent } from "react";
import Header from '@/components/header/Header_SignIn'; // Đảm bảo path đúng
import Logo from '@/assets/logo_monnes.png';    // Đảm bảo path đúng
import Link from "next/link";
import eye_open from '@/assets/icon/eyeopen.png'; // Đảm bảo path đúng
import eye_off from '@/assets/icon/eyeoff.png';   // Đảm bảo path đúng
import { useRouter } from 'next/navigation';
import { registerAPI } from '@/services/api';   // Đảm bảo path đúng

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState<Omit<RegisterRequest, 'confirmPassword'> & { confirmPasswordValue: string }>({
        email: '',
        phoneNumber: '',
        password: '',
        confirmPasswordValue: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.email || !formData.phoneNumber || !formData.password || !formData.confirmPasswordValue) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        if (formData.password !== formData.confirmPasswordValue) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        setIsLoading(true);
        try {
            const dataToSend: RegisterRequest = {
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                password: formData.password,
            };
            const responseData: UserResponse = await registerAPI(dataToSend);
            console.log('Signup response:', responseData);
            setSuccessMessage('Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.');
            setTimeout(() => {
                 router.push('/signin');
            }, 2000);
        } catch (error: any) {
            console.error('Signup error:', error);
            setError(error.message || 'Đăng ký thất bại. Email hoặc số điện thoại có thể đã được sử dụng.');
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
                            <Link href="/signin" className="w-1/2 text-center pb-3">
                                <div className="text-gray-500 hover:text-pink-600 font-medium text-lg cursor-pointer">Đăng nhập</div>
                            </Link>
                            <button className="w-1/2 text-center pb-3 border-b-2 border-pink-500 font-semibold text-pink-600 text-lg">
                                Đăng ký
                            </button>
                        </div>
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="emailInputReg" className="block mb-1 font-medium text-sm text-gray-700">Email</label>
                                <input
                                    id="emailInputReg"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Nhập email của bạn"
                                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="phoneNumberInputReg" className="block mb-1 font-medium text-sm text-gray-700">Số điện thoại</label>
                                <input
                                    id="phoneNumberInputReg"
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
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
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
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
                                        name="confirmPasswordValue"
                                        value={formData.confirmPasswordValue}
                                        onChange={handleChange}
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
                    </div>
                </div>
            </main>
        </div>
    );
}