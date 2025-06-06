"use client";

import React, { useEffect, useState } from "react";
import UserHeader from "@/components/header/UserHeader";
import { useRouter, useSearchParams } from "next/navigation";
import { userGetMySavingsAccountDetails } from "@/services/api";
 // Đảm bảo DTO này được import
import { ArrowLeftIcon, ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'; // Icons ví dụ

export default function YourSavingsDetailPage() { // Đổi tên component cho rõ ràng
    const router = useRouter();
    const searchParams = useSearchParams();
    const moSoIdParam = searchParams.get("id");
    
    const [savingsDetail, setSavingsDetail] = useState<MoSoTietKiemResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const USER_HEADER_HEIGHT = '5rem'; // Chiều cao UserHeader (ví dụ: h-20)
    const PAGE_TITLE_BANNER_HEIGHT = '4.5rem'; // Chiều cao banner tiêu đề trang

    useEffect(() => {
        if (!moSoIdParam) {
            setError("Không tìm thấy mã sổ tiết kiệm trong đường dẫn.");
            setLoading(false);
            return;
        }
        const fetchDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await userGetMySavingsAccountDetails(Number(moSoIdParam));
                setSavingsDetail(data);
            } catch (err: any) {
                setError(err.message || "Không thể tải chi tiết sổ tiết kiệm. Vui lòng thử lại.");
                console.error("Lỗi fetch chi tiết sổ:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [moSoIdParam]);

    const DetailItem = ({ label, value }: { label: string, value: string | number | undefined | null }) => (
        <div className="py-3 sm:py-4 grid grid-cols-3 gap-4 px-2 sm:px-0">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || "--"}</dd>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB]">
            <div className="fixed top-0 left-0 right-0 z-[100]">
                <UserHeader />
            </div>
            <div className="flex-1 flex items-center justify-center pt-20 md:pt-24 px-4 pb-10">
                <div className="w-full max-w-xl lg:max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 my-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-6 sm:mb-8 text-center">
                        CHI TIẾT SỔ TIẾT KIỆM
                    </h2>
                    {loading ? (
                        <div className="text-center text-gray-600 py-20">
                            <div role="status" className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent"></div>
                            <p className="mt-3 text-lg">Đang tải dữ liệu...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg shadow-md py-20">
                            <p className="text-lg font-semibold">Lỗi!</p>
                            <p>{error}</p>
                        </div>
                    ) : !savingsDetail ? (
                        <div className="text-center text-gray-500 py-20">Không tìm thấy thông tin sổ tiết kiệm.</div>
                    ) : (
                        <div>
                            <form className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
                                    <label className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">Tên sổ</label>
                                    <div className="w-full sm:w-3/5 md:w-2/3 text-base text-gray-800 bg-gray-100 rounded-md px-3 py-2">
                                        {savingsDetail.tenSoMo || `Sổ Tiết Kiệm #${savingsDetail.maMoSo}`}
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
                                    <label className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">Tên sản phẩm</label>
                                    <div className="w-full sm:w-3/5 md:w-2/3 text-base text-gray-800 bg-gray-100 rounded-md px-3 py-2">
                                        {savingsDetail.tenSanPhamSoTietKiem || "--"}
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
                                    <label className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">Chủ sở hữu</label>
                                    <div className="w-full sm:w-3/5 md:w-2/3 text-base text-gray-800 bg-gray-100 rounded-md px-3 py-2">
                                        {savingsDetail.tenNguoiDung || "--"}
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
                                    <label className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">Số dư hiện tại</label>
                                    <div className="w-full sm:w-3/5 md:w-2/3 text-base text-gray-800 bg-gray-100 rounded-md px-3 py-2">
                                        {(savingsDetail.soDuHienTai || 0).toLocaleString('vi-VN')} VND
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
                                    <label className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">Kỳ hạn</label>
                                    <div className="w-full sm:w-3/5 md:w-2/3 text-base text-gray-800 bg-gray-100 rounded-md px-3 py-2">
                                        {savingsDetail.kyHanSanPham ? `${savingsDetail.kyHanSanPham} tháng` : "Không kỳ hạn"}
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
                                    <label className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">Lãi suất áp dụng</label>
                                    <div className="w-full sm:w-3/5 md:w-2/3 text-base text-gray-800 bg-gray-100 rounded-md px-3 py-2">
                                        {savingsDetail.laiSuatApDungChoSoNay ? `${savingsDetail.laiSuatApDungChoSoNay.toFixed(2)}%/năm` : "--"}
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
                                    <label className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">Ngày mở sổ</label>
                                    <div className="w-full sm:w-3/5 md:w-2/3 text-base text-gray-800 bg-gray-100 rounded-md px-3 py-2">
                                        {savingsDetail.ngayMo ? new Date(savingsDetail.ngayMo).toLocaleDateString('vi-VN') : "--"}
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
                                    <label className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">Ngày đáo hạn</label>
                                    <div className="w-full sm:w-3/5 md:w-2/3 text-base text-gray-800 bg-gray-100 rounded-md px-3 py-2">
                                        {savingsDetail.ngayDaoHan ? new Date(savingsDetail.ngayDaoHan).toLocaleDateString('vi-VN') : "Không áp dụng"}
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
                                    <label className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">Trạng thái</label>
                                    <div className={`w-full sm:w-3/5 md:w-2/3 text-base rounded-md px-3 py-2 
                                        ${savingsDetail.trangThaiMoSo === 'DANG_HOAT_DONG' ? 'text-green-600 bg-green-50' : 
                                          savingsDetail.trangThaiMoSo === 'DA_DAO_HAN' ? 'text-orange-500 bg-orange-50' : 
                                          'text-gray-800 bg-gray-100'}`}>
                                        {savingsDetail.trangThaiMoSo === 'DANG_HOAT_DONG' ? 'Đang hoạt động' : 
                                         savingsDetail.trangThaiMoSo === 'DA_DAO_HAN' ? 'Đã đáo hạn' : 
                                         'Đã đóng'}
                                    </div>
                                </div>
                            </form>
                            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center items-center">
                                {savingsDetail.trangThaiMoSo === "DANG_HOAT_DONG" || "DA_DAO_HAN"? (
                                    <>
                                        <button
                                            type="button"
                                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold text-base shadow transition"
                                            onClick={() => router.push(`/user/yoursavings/detail/deposit?id=${savingsDetail?.maMoSo}`)}
                                            disabled={!savingsDetail}
                                        >
                                            <ArrowDownTrayIcon className="w-5 h-5" />
                                            Nạp tiền
                                        </button>
                                        <button
                                            type="button"
                                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold text-base shadow transition"
                                            onClick={() => router.push(`/user/yoursavings/detail/withdrawal?id=${savingsDetail?.maMoSo}`)}
                                            disabled={!savingsDetail}
                                        >
                                            <ArrowUpTrayIcon className="w-5 h-5" />
                                            Rút tiền
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gray-400 hover:bg-gray-500 text-white font-semibold text-base shadow transition"
                                        style={{marginLeft: 0, marginRight: 0}}
                                        onClick={() => router.push('/user/yoursavings')}
                                    >
                                        Thoát
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style jsx global>{`
                .react-datepicker-popper { z-index: 150 !important; }
                .react-datepicker { 
                    font-family: inherit; font-size: 0.9rem; border-radius: 0.5rem; 
                    border: 1px solid #d1d5db; 
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); 
                }
                .react-datepicker__header { background-color: #FFF1F2; border-bottom: 1px solid #FCE7F3; }
                .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker__day-name {
                    color: #831843; font-weight: 600;
                }
                .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected,
                .react-datepicker__month-text--selected, .react-datepicker__month-text--keyboard-selected {
                    background-color: #FF086A !important; color: white !important;
                }
                .react-datepicker__day:hover, .react-datepicker__month-text:hover {
                    background-color: #FFD6E7 !important; border-radius: 0.375rem;
                }
                .react-datepicker__navigation { top: 0.6rem; }
                .react-datepicker__navigation--previous { border-right-color: #D1D5DB; }
                .react-datepicker__navigation--next { border-left-color: #D1D5DB; }
                .react-datepicker__navigation:hover *::before { border-color: #9D174D; }
            `}</style>
        </div>
    );
}