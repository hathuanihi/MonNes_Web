"use client";

import React, 
{ 
    useState, 
    useEffect, 
    FormEvent, 
    ChangeEvent 
} from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import UserHeader from "@/components/header/UserHeader"; 
import { 
    userCreateSavingsAccount, 
    userGetAllAvailableSavingsProducts 
} from "@/services/api"; 
import ProtectedRoute, { Role }from '@/components/ProtectedRoute';

interface NewSavingsFormState {
    tenSoMo: string;
    soTienGuiBanDau: string; 
    soTietKiemSanPhamId: string; 
}

// Giá trị khởi tạo cho form
const initialFormState: NewSavingsFormState = {
    tenSoMo: "", 
    soTienGuiBanDau: "",
    soTietKiemSanPhamId: "", 
};

export default function CreateNewSavingsPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<NewSavingsFormState>(initialFormState);
    const [availableProducts, setAvailableProducts] = useState<SoTietKiemDTO[]>([]);
    const [selectedProductDetails, setSelectedProductDetails] = useState<{ 
        kyHan: string | null, 
        laiSuat: string | null 
    }>({ 
        kyHan: null, 
        laiSuat: null 
    });
    
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [showProfileUpdatePrompt, setShowProfileUpdatePrompt] = useState(false);

    const USER_HEADER_HEIGHT_STYLE = '5rem'; 

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoadingProducts(true);
                setApiError(null);
                const productsData = await userGetAllAvailableSavingsProducts();
                setAvailableProducts(Array.isArray(productsData) ? productsData : []);
            } catch (error: any) {
                console.error("Lỗi khi tải danh sách sản phẩm sổ tiết kiệm:", error);
                toast.error("Không thể tải danh sách sản phẩm để tạo sổ.");
            } finally {
                setLoadingProducts(false);
            }
        };
        fetchProducts();
    }, []);

    // Cập nhật thông tin kỳ hạn và lãi suất hiển thị khi người dùng chọn sản phẩm
    useEffect(() => {
        if (formData.soTietKiemSanPhamId) {
            const selectedProd = availableProducts.find(p => p.maSo.toString() === formData.soTietKiemSanPhamId);
            if (selectedProd) {
                setSelectedProductDetails({
                    kyHan: selectedProd.kyHan === 0 ? "Không kỳ hạn" : `${selectedProd.kyHan} tháng`,
                    laiSuat: `${selectedProd.laiSuat.toFixed(2)}%/năm`
                });
            } else {
                setSelectedProductDetails({ kyHan: null, laiSuat: null });
            }
        } else {
            setSelectedProductDetails({ kyHan: null, laiSuat: null });
        }
    }, [formData.soTietKiemSanPhamId, availableProducts]);


    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (name === "soTietKiemSanPhamId" && value === "") { // Reset chi tiết nếu không chọn sản phẩm
             setSelectedProductDetails({ kyHan: null, laiSuat: null });
        }
    };

    const formatCurrencyOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue === '') {
            setFormData(prev => ({ ...prev, [name]: '' }));
            return;
        }
        const formattedValue = parseInt(numericValue, 10).toLocaleString('vi-VN');
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
         if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.tenSoMo.trim()) newErrors.tenSoMo = "Tên sổ tiết kiệm không được để trống.";
        if (!formData.soTietKiemSanPhamId) newErrors.soTietKiemSanPhamId = "Vui lòng chọn một loại sổ tiết kiệm.";
        
        const depositAmountNum = parseFloat(formData.soTienGuiBanDau.replace(/[^0-9]/g,"")); // Bỏ dấu phẩy
        if (isNaN(depositAmountNum) || depositAmountNum <= 0) {
            newErrors.soTienGuiBanDau = "Số tiền gửi ban đầu không hợp lệ.";
        } else {
            const selectedProduct = availableProducts.find(p => p.maSo.toString() === formData.soTietKiemSanPhamId);
            if (selectedProduct && depositAmountNum < selectedProduct.tienGuiBanDauToiThieu) {
                newErrors.soTienGuiBanDau = `Số tiền gửi ban đầu tối thiểu cho sản phẩm này là ${selectedProduct.tienGuiBanDauToiThieu.toLocaleString()} VND.`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setApiError(null);
        setShowProfileUpdatePrompt(false);
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const requestData: MoSoTietKiemRequest = {
                tenSoMo: formData.tenSoMo,
                soTienGuiBanDau: parseFloat(formData.soTienGuiBanDau.replace(/[^0-9]/g,"")),
                soTietKiemSanPhamId: parseInt(formData.soTietKiemSanPhamId, 10),
            };

            const response = await userCreateSavingsAccount(requestData);
            console.log("Sổ tiết kiệm đã được tạo:", response);
            toast.success("Tạo sổ tiết kiệm thành công!");
            router.push("/user/yoursavings"); 
        } catch (error: any) {
            const errMsg = (error.message || "").toLowerCase();
            const statusCode = error.response?.status;
            
            // Kiểm tra message cụ thể từ backend
            if (
                statusCode === 401 && 
                error.message?.includes("Full authentication is required to access this resource")
            ) {
                setShowProfileUpdatePrompt(true);
                toast.error("Bạn cần phải cập nhật đầy đủ thông tin cá nhân trước");
                return;
            }
            
            if (statusCode === 401 || statusCode === 400) {
                setShowProfileUpdatePrompt(true);
                toast.error("Bạn cần phải cập nhật thông tin cá nhân trước khi mở sổ tiết kiệm.");
                return;
            }

            if (
                errMsg.includes("cập nhật") ||
                errMsg.includes("cap nhat") ||
                errMsg.includes("update") ||
                errMsg.includes("thong tin ca nhan") ||
                errMsg.includes("thong tin cá nhân")
            ) {
                setShowProfileUpdatePrompt(true);
                toast.error("Bạn cần cập nhật đầy đủ thông tin cá nhân trước khi mở sổ tiết kiệm.");
                return;
            }
            
            // Các lỗi khác
            toast.error(error.message || "Tạo sổ tiết kiệm thất bại. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => router.push("/user/yoursavings");

    return (
        <ProtectedRoute requiredRole={Role.USER}>
            <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB]">
                <div className="fixed top-0 left-0 right-0 z-50">
                    <UserHeader />
                </div>

                <div 
                    className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pb-10"
                    style={{ paddingTop: `calc(${USER_HEADER_HEIGHT_STYLE} + 1rem)` }} // 1rem là khoảng cách thêm từ UserHeader
                >
                    <div className="w-full max-w-2xl lg:max-w-3xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-600 mb-8 text-center">
                            Mở Sổ Tiết Kiệm Mới
                        </h1>

                        {showProfileUpdatePrompt && (
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md mb-6 text-center shadow-sm animate-modalShow">
                                <div className="font-semibold text-base mb-2">Bạn cần cập nhật đầy đủ thông tin cá nhân trước khi mở sổ tiết kiệm!</div>
                                <div className="mb-3 text-sm">Vui lòng bổ sung họ tên, CCCD, địa chỉ trong hồ sơ cá nhân để sử dụng chức năng này.</div>
                                <button
                                    onClick={() => router.push("/user/profile/updateprofile")}
                                    className="inline-block px-6 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors text-sm shadow-sm mt-1"
                                >
                                    Cập nhật hồ sơ cá nhân
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Tên sổ tiết kiệm (do người dùng đặt) */}
                            <div>
                                <label htmlFor="tenSoMo" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên sổ tiết kiệm <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="tenSoMo"
                                    id="tenSoMo"
                                    value={formData.tenSoMo}
                                    onChange={handleChange}
                                    placeholder="Ví dụ: Quỹ du lịch hè, Tiết kiệm cho con..."
                                    className={`w-full text-base text-gray-800 bg-white border ${errors.tenSoMo ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500`}
                                />
                                {errors.tenSoMo && <p className="text-red-500 text-xs mt-1">{errors.tenSoMo}</p>}
                            </div>

                            {/* Chọn Loại Sản Phẩm Sổ Tiết Kiệm */}
                            <div>
                                <label htmlFor="soTietKiemSanPhamId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Loại sổ tiết kiệm <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="soTietKiemSanPhamId"
                                    id="soTietKiemSanPhamId"
                                    value={formData.soTietKiemSanPhamId}
                                    onChange={handleChange}
                                    className={`w-full text-base text-gray-800 bg-white border ${errors.soTietKiemSanPhamId ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500`}
                                    disabled={loadingProducts}
                                >
                                    <option value="">-- {loadingProducts ? "Đang tải sản phẩm..." : "Chọn loại sổ"} --</option>
                                    {availableProducts.map(product => (
                                        <option key={product.maSo} value={product.maSo.toString()}>
                                            {product.tenSo}
                                        </option>
                                    ))}
                                </select>
                                {errors.soTietKiemSanPhamId && <p className="text-red-500 text-xs mt-1">{errors.soTietKiemSanPhamId}</p>}
                            </div>
                            {/* Kỳ hạn và Lãi suất: luôn hiển thị, disabled, tự động đổi nội dung */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kỳ hạn</label>
                                    <input
                                        type="text"
                                        value={selectedProductDetails.kyHan ?? ''}
                                        readOnly
                                        disabled
                                        className="w-full text-base text-gray-600 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 cursor-not-allowed opacity-80"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lãi suất</label>
                                    <input
                                        type="text"
                                        value={selectedProductDetails.laiSuat ?? ''}
                                        readOnly
                                        disabled
                                        className="w-full text-base text-gray-600 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 cursor-not-allowed opacity-80"
                                    />
                                </div>
                            </div>
                            
                            {/* Số Tiền Gửi Ban Đầu */}
                            <div>
                                <label htmlFor="soTienGuiBanDau" className="block text-sm font-medium text-gray-700 mb-1">
                                    Số tiền gửi ban đầu (VND) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="soTienGuiBanDau"
                                    id="soTienGuiBanDau"
                                    value={formData.soTienGuiBanDau}
                                    onChange={formatCurrencyOnChange} // Sử dụng hàm format
                                    placeholder="Nhập số tiền gửi"
                                    className={`w-full text-base text-gray-800 bg-white border ${errors.soTienGuiBanDau ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500`}
                                />
                                {errors.soTienGuiBanDau && <p className="text-red-500 text-xs mt-1">{errors.soTienGuiBanDau}</p>}
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="w-full sm:w-auto px-8 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors text-base shadow-sm"
                                >
                                    HỦY BỎ
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || loadingProducts}
                                    className="w-full sm:w-auto px-8 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors text-base shadow-sm disabled:opacity-70"
                                >
                                    {isSubmitting ? 'ĐANG TẠO SỔ...' : 'TẠO SỔ MỚI'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <Toaster 
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#fff',
                            color: '#333',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            padding: '12px 16px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        },
                        success: {
                            style: {
                                border: '1px solid #10b981',
                                background: '#f0fdf4',
                                color: '#059669'
                            }
                        },
                        error: {
                            style: {
                                border: '1px solid #ef4444',
                                background: '#fef2f2',
                                color: '#dc2626'
                            }
                        }
                    }}
                />
                <style jsx global>{`
                    @keyframes modalShow { /* Giữ lại nếu có modal nào khác dùng */
                        from { opacity: 0; transform: scale(0.95) translateY(-20px); }
                        to { opacity: 1; transform: scale(1) translateY(0); }
                    }
                    .animate-modalShow {
                        animation: modalShow 0.3s ease-out forwards;
                    }
                    .react-datepicker-popper {
                        z-index: 150 !important; 
                    }
                    .react-datepicker { 
                        font-family: inherit; 
                        font-size: 0.9rem;
                        border-radius: 0.5rem; 
                        border: 1px solid #d1d5db; 
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); 
                    }
                    /* ... (các style khác cho datepicker nếu cần) ... */
                `}</style>
            </div>
        </ProtectedRoute>
    );
};