"use client";

import React, { useState } from "react";
import UserHeader from "@/components/header/UserHeader";
import { useSearchParams, useRouter } from "next/navigation";
import { userWithdrawFromAccount, userGetMySavingsAccountDetails } from "@/services/api";

export default function WithdrawalPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const moSoIdParam = searchParams.get("id");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [savingsDetail, setSavingsDetail] = useState<MoSoTietKiemResponse | null>(null);

  React.useEffect(() => {
    if (!moSoIdParam) return;
    userGetMySavingsAccountDetails(Number(moSoIdParam))
      .then((detail) => {
        setSavingsDetail(detail);
        if (detail && typeof detail.soDuHienTai === 'number') {
          setWithdrawAmount(detail.soDuHienTai.toLocaleString('vi-VN'));
        }
      })
      .catch(() => setSavingsDetail(null));
  }, [moSoIdParam]);

  const handleCancel = () => {
    window.history.back();
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!moSoIdParam) {
      setError("Không tìm thấy mã sổ tiết kiệm.");
      return;
    }
    let soTien = 0;
    try {
      soTien = Number(withdrawAmount.replace(/[^\d]/g, ""));
      if (!soTien || soTien <= 0) throw new Error("Số tiền không hợp lệ");
    } catch {
      setError("Số tiền rút không hợp lệ.");
      return;
    }
    setLoading(true);
    try {
      await userWithdrawFromAccount(Number(moSoIdParam), { soTien });
      setSuccess("Rút tiền thành công!");
      setWithdrawAmount("");
      setTimeout(() => {
        router.push("/user/yoursavings");
      }, 1000);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB]">
      <div className="fixed top-0 left-0 right-0 z-[100]">
        <UserHeader />
      </div>
      <div className="flex-1 flex items-center justify-center pt-20 md:pt-24 px-4 pb-10">
        <div className="w-full max-w-xl lg:max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 my-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-6 sm:mb-8 text-center">
            Rút Tiền Từ Sổ Tiết Kiệm
          </h2>
          {error && <p className="text-red-600 bg-red-100 p-3 rounded-md mb-4 text-sm text-center">{error}</p>}
          {success && <p className="text-green-600 bg-green-100 p-3 rounded-md mb-4 text-sm text-center">{success}</p>}
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
              <label className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">Số dư hiện tại</label>
              <div className="w-full sm:w-3/5 md:w-2/3 text-base text-gray-800 bg-gray-100 rounded-md px-3 py-2">
                {savingsDetail ? `${savingsDetail.soDuHienTai.toLocaleString('vi-VN')} VND` : '--'}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
              <label className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">Lãi suất áp dụng</label>
              <div className="w-full sm:w-3/5 md:w-2/3 text-base text-gray-800 bg-gray-100 rounded-md px-3 py-2">
                {savingsDetail?.laiSuatApDungChoSoNay ? `${savingsDetail.laiSuatApDungChoSoNay.toFixed(2)}%/năm` : '--'}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
              <label className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">Kỳ hạn</label>
              <div className="w-full sm:w-3/5 md:w-2/3 text-base text-gray-800 bg-gray-100 rounded-md px-3 py-2">
                {savingsDetail?.kyHanSanPham ? `${savingsDetail.kyHanSanPham} tháng` : 'Không kỳ hạn'}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
              <label className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">Số tiền rút</label>
              <div className="w-full sm:w-3/5 md:w-2/3">
                <input
                  type="text"
                  value={withdrawAmount}
                  readOnly
                  className="w-full text-base text-gray-800 bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 cursor-not-allowed"
                  placeholder="Nhập số tiền rút"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-6 pt-8">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-8 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors text-sm uppercase shadow-sm"
                disabled={loading}
              >
                HỦY
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors text-sm uppercase shadow-sm disabled:opacity-70"
              >
                {loading ? 'ĐANG RÚT...' : 'RÚT TIỀN'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
