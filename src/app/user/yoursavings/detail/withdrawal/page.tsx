"use client";

import React, { useState } from "react";
import UserHeader from "@/components/header/UserHeader";
import { useSearchParams, useRouter } from "next/navigation";
import { userWithdrawFromAccount, userGetMySavingsAccountDetails } from "@/services/api";
import ProtectedRoute, { Role }from '@/components/ProtectedRoute';

export default function WithdrawalPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const moSoIdParam = searchParams.get("id");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [savingsDetail, setSavingsDetail] = useState<MoSoTietKiemResponse | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!moSoIdParam) return;
    
    setLoadingDetails(true);
    setDetailsError(null);
    
    userGetMySavingsAccountDetails(Number(moSoIdParam))
      .then((detail) => {
        setSavingsDetail(detail);
        if (detail && typeof detail.soDuHienTai === 'number') {
          if (detail.kyHanSanPham && detail.kyHanSanPham > 0) {
            setWithdrawAmount(detail.soDuHienTai.toString());
          } else {
            setWithdrawAmount("");
          }
        }
      })
      .catch((err) => {
        console.error("Error loading savings details:", err);
        setSavingsDetail(null);
        setDetailsError("Không thể tải thông tin sổ tiết kiệm. Vui lòng thử lại.");
      })
      .finally(() => {
        setLoadingDetails(false);
      });
  }, [moSoIdParam]);

  const handleCancel = () => {
    window.history.back();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!savingsDetail?.kyHanSanPham || savingsDetail.kyHanSanPham === 0) {
      const rawValue = e.target.value.replace(/[^\d]/g, "");
      setWithdrawAmount(rawValue);
    }
  };

  const getDisplayValue = () => {
    if (!withdrawAmount) return "";
    const numValue = Number(withdrawAmount);
    return isNaN(numValue) ? "" : numValue.toLocaleString('vi-VN');
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
      soTien = Number(withdrawAmount);
      if (!soTien || soTien <= 0 || isNaN(soTien)) throw new Error("Số tiền không hợp lệ");
      
      if (savingsDetail && (!savingsDetail.kyHanSanPham || savingsDetail.kyHanSanPham === 0)) {
        if (soTien > savingsDetail.soDuHienTai) {
          setError(`Số tiền rút (${soTien.toLocaleString('vi-VN')} VND) không thể lớn hơn số dư hiện tại (${savingsDetail.soDuHienTai.toLocaleString('vi-VN')} VND).`);
          return;
        }
      }
      
      if (savingsDetail && savingsDetail.kyHanSanPham && savingsDetail.kyHanSanPham > 0) {
        if (soTien !== savingsDetail.soDuHienTai) {
          setError(`Sổ tiết kiệm có kỳ hạn phải rút hết toàn bộ số dư (${savingsDetail.soDuHienTai.toLocaleString('vi-VN')} VND).`);
          return;
        }
      }
    } catch {
      setError("Số tiền rút không hợp lệ.");
      return;
    }

    setLoading(true);
    
    console.log("Withdrawal Debug Info:", {
      moSoId: moSoIdParam,
      withdrawAmountRaw: withdrawAmount,
      withdrawAmountParsed: soTien,
      currentBalance: savingsDetail?.soDuHienTai,
      isTermDeposit: isTermDeposit,
      kyHan: savingsDetail?.kyHanSanPham,
      currentDate: new Date().toISOString().split('T')[0],
      maturityDate: savingsDetail?.ngayDaoHan
    });
    
    try {
      await userWithdrawFromAccount(Number(moSoIdParam), { soTien });
      setSuccess("Rút tiền thành công!");
      setWithdrawAmount("");
      setTimeout(() => {
        router.push("/user/yoursavings");
      }, 1000);
    } catch (err: any) {
      console.error("Withdrawal error:", err);
      
      const statusCode = err?.response?.statusCode || err?.response?.status || err?.status;
      const errorMessage = err?.message || "Đã có lỗi xảy ra khi rút tiền.";
      
      if (statusCode === 500) {
        setError("Hệ thống tạm thời không thể xử lý giao dịch rút tiền. Vui lòng thử lại sau ít phút hoặc liên hệ bộ phận hỗ trợ.");
      } else if (statusCode === 400) {
        setError(errorMessage);
      } else if (statusCode === 403) {
        setError("Bạn không có quyền thực hiện giao dịch rút tiền từ sổ này.");
      } else if (statusCode === 404) {
        setError("Không tìm thấy thông tin sổ tiết kiệm. Vui lòng kiểm tra lại.");
      } else if (statusCode === 409) {
        setError("Sổ tiết kiệm đang được xử lý bởi giao dịch khác. Vui lòng thử lại sau.");
      } else if (!navigator.onLine) {
        setError("Không có kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.");
      } else {
        setError(errorMessage.includes("server") 
          ? "Máy chủ đang bận xử lý. Vui lòng thử lại sau ít phút." 
          : errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const isTermDeposit = savingsDetail?.kyHanSanPham && savingsDetail.kyHanSanPham > 0;

  return (
    <ProtectedRoute requiredRole={Role.USER}>
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB]">
        <div className="fixed top-0 left-0 right-0 z-[100]">
          <UserHeader />
        </div>
        <div className="flex-1 flex items-center justify-center pt-20 md:pt-24 px-4 pb-10">
          <div className="w-full max-w-xl lg:max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 my-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-6 sm:mb-8 text-center">
              Rút Tiền Từ Sổ Tiết Kiệm
            </h2>
            
            {/* Loading state cho việc tải thông tin sổ */}
            {loadingDetails && (
              <div className="text-center py-4 mb-4">
                <div className="inline-flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600">Đang tải thông tin sổ tiết kiệm...</span>
                </div>
              </div>
            )}
            
            {/* Error khi tải thông tin sổ */}
            {detailsError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
                <div className="flex items-center justify-between">
                  <span>{detailsError}</span>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="ml-4 text-sm bg-red-200 hover:bg-red-300 px-3 py-1 rounded transition-colors"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            )}
            
            {/* Error từ việc rút tiền */}
            {error && <p className="text-red-600 bg-red-100 p-3 rounded-md mb-4 text-sm text-center">{error}</p>}
            {success && <p className="text-green-600 bg-green-100 p-3 rounded-md mb-4 text-sm text-center">{success}</p>}
            
            {/* Thêm thông báo cho phương thức có kỳ hạn */}
            {isTermDeposit && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
                <p className="text-yellow-700 text-sm">
                  <strong>Lưu ý:</strong> Đây là sổ tiết kiệm có kỳ hạn. Bạn bắt buộc phải rút toàn bộ số dư.
                </p>
              </div>
            )}
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
                    value={getDisplayValue()}
                    onChange={handleAmountChange}
                    readOnly={!!isTermDeposit}
                    className={`w-full text-base text-gray-800 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 ${
                      isTermDeposit ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    }`}
                    placeholder={isTermDeposit ? "Bắt buộc rút toàn bộ" : "Nhập số tiền muốn rút (VND)"}
                    disabled={loading || loadingDetails}
                  />
                  {!isTermDeposit && savingsDetail && (
                    <p className="text-xs text-gray-500 mt-1">
                      Số tiền tối đa: {savingsDetail.soDuHienTai.toLocaleString('vi-VN')} VND
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-6 pt-8">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-8 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors text-sm uppercase shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={loading || loadingDetails}
                >
                  HỦY
                </button>
                <button
                  type="submit"
                  disabled={loading || loadingDetails || !!detailsError}
                  className="w-full sm:w-auto px-8 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors text-sm uppercase shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'ĐANG RÚT...' : loadingDetails ? 'ĐANG TẢI...' : 'RÚT TIỀN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
