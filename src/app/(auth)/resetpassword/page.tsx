"use client";

import { useState } from "react";
import Header from '@/components/header/Header_SignIn';
import Logo from '@/assets/logo_monnes.png';
import Image from "next/image";
import { sendPasscodeAPI, verifyPasscodeAPI, resetPasswordAPI } from '@/services/api';
import ProtectedRoute from '@/components/ProtectedRoute';

import eye_open from '@/assets/icon/eyeopen.png';
import eye_off from '@/assets/icon/eyeoff.png';

export default function ResetPasswordPage() {
  const [modalStep, setModalStep] = useState(1); // 1: nhập email, 2: nhập passcode, 3: đặt lại mật khẩu
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Gửi mã xác thực về email
  const handleSendPasscode = async () => {
    setIsLoading(true);
    setErrorMsg("");
    if (!email) {
      setErrorMsg("Vui lòng nhập email.");
      setIsLoading(false);
      return;
    }
    try {
      await sendPasscodeAPI({ email });
      setModalStep(2); // Chuyển sang bước nhập passcode
      setErrorMsg("");
    } catch (err: any) {
      setErrorMsg("Lỗi khi gửi mã xác thực.");
    } finally {
      setIsLoading(false);
    }
  };

  // Xác thực mã passcode
  const handleVerifyPasscode = async () => {
    setIsLoading(true);
    setErrorMsg("");
    if (!passcode) {
      setErrorMsg("Vui lòng nhập mã xác thực.");
      setIsLoading(false);
      return;
    }
    try {
      await verifyPasscodeAPI({ email, passcode });
      setModalStep(3); // Chuyển sang bước đặt lại mật khẩu
      setErrorMsg("");
    } catch (err: any) {
      setErrorMsg("Mã xác thực không đúng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Đặt lại mật khẩu mới
  const handleSetNewPassword = async () => {
    setIsLoading(true);
    setErrorMsg("");
    if (!newPassword || !confirmPassword) {
      setErrorMsg("Vui lòng nhập đủ thông tin.");
      setIsLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Xác nhận mật khẩu không khớp.");
      setIsLoading(false);
      return;
    }
    try {
      await resetPasswordAPI({ email, newPassword, confirmPassword });
      setIsLoading(false);
      alert("Đặt lại mật khẩu thành công! Hãy đăng nhập lại.");
      window.location.href = "/signin";
    } catch (err: any) {
      setErrorMsg("Lỗi khi đặt lại mật khẩu.");
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (modalStep) {
      case 1: // Nhập email
        return (
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSendPasscode(); }}>
            <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">Quên mật khẩu</h2>
            <div>
              <label htmlFor="email-input" className="block mb-2 font-medium text-sm text-gray-700">Nhập email đăng ký để lấy lại mật khẩu</label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Nhập email đăng ký"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                required
                disabled={isLoading}
              />
            </div>
            {errorMsg && <p className="text-red-600 text-sm mt-1 text-center">{errorMsg}</p>}
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-md disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-150"
              disabled={isLoading || !email}
            >
              {isLoading ? 'Đang xử lý...' : 'Gửi mã xác thực'}
            </button>
          </form>
        );
      case 2: // Nhập passcode
        return (
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleVerifyPasscode(); }}>
            <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">Nhập mã xác thực</h2>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Mã xác thực đã được gửi đến email: <span className="font-semibold">{email}</span>
            </p>
            <div>
              <label htmlFor="passcode-input" className="block mb-2 font-medium text-sm text-gray-700">Mã xác thực</label>
              <input
                id="passcode-input"
                type="text"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="Nhập mã xác thực"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                required
                disabled={isLoading}
              />
            </div>
            {errorMsg && <p className="text-red-600 text-sm mt-1 text-center">{errorMsg}</p>}
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-md disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-150"
              disabled={isLoading || !passcode}
            >
              {isLoading ? 'Đang xác thực...' : 'Xác nhận'}
            </button>
          </form>
        );
      case 3: // Đặt lại mật khẩu mới
        return (
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSetNewPassword(); }}>
            <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">Đặt lại mật khẩu mới</h2>
            <div>
              <label htmlFor="new-password" className="block mb-2 font-medium text-sm text-gray-700">Mật khẩu mới</label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Mật khẩu mới"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  required
                  disabled={isLoading}
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
            <div>
              <label htmlFor="confirm-password" className="block mb-2 font-medium text-sm text-gray-700">Xác nhận mật khẩu</label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Xác nhận mật khẩu"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  required
                  disabled={isLoading}
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
            {errorMsg && <p className="text-red-600 text-sm mt-1 text-center">{errorMsg}</p>}
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-md disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-150"
              disabled={isLoading || !newPassword || !confirmPassword}
            >
              {isLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
            </button>
          </form>
        );
      default:
        return null;
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
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}