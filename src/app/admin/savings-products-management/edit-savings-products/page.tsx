"use client";

import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminHeader from "@/components/header/AdminHeader";
import { adminUpdateSavingsProduct, adminGetAllLoaiSoTietKiemDanhMuc, adminGetAllSavingsProducts } from "@/services/api";
import ProtectedRoute, { Role } from "@/components/ProtectedRoute";

export default function EditSavingsProductPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');

    const [formData, setFormData] = useState<SoTietKiemRequest>({
        tenSo: "",
        kyHan: 0,
        laiSuat: 0,
        tienGuiBanDauToiThieu: 0,
        tienGuiThemToiThieu: 0,
        soNgayGuiToiThieuDeRut: null,
        maLoaiDanhMuc: 0,
    });

    const [categories, setCategories] = useState<LoaiSoTietKiemDanhMucDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!productId) {
            setError("Không tìm thấy ID sản phẩm.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch categories and products
                const [categoriesData, productsData] = await Promise.all([
                    adminGetAllLoaiSoTietKiemDanhMuc(),
                    adminGetAllSavingsProducts()
                ]);
                
                setCategories(Array.isArray(categoriesData) ? categoriesData : []);
                
                // Find the product to edit
                const products = Array.isArray(productsData) ? productsData : [];
                const productToEdit = products.find((p: SoTietKiemDTO) => p.maSo === parseInt(productId));
                  if (productToEdit) {
                    setFormData({
                        tenSo: productToEdit.tenSo,
                        kyHan: productToEdit.kyHan,
                        laiSuat: productToEdit.laiSuat,
                        tienGuiBanDauToiThieu: productToEdit.tienGuiBanDauToiThieu,
                        tienGuiThemToiThieu: productToEdit.tienGuiThemToiThieu,
                        soNgayGuiToiThieuDeRut: productToEdit.soNgayGuiToiThieuDeRut,
                        maLoaiDanhMuc: productToEdit.loaiSoTietKiemDanhMuc?.maLoaiSoTietKiem || 0,
                    });
                } else {
                    setError("Không tìm thấy sản phẩm cần chỉnh sửa.");
                }
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : "Không thể tải dữ liệu.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [productId]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Xử lý các trường số
        if (name === 'kyHan' || name === 'laiSuat' || name === 'tienGuiBanDauToiThieu' || 
            name === 'tienGuiThemToiThieu' || name === 'soNgayGuiToiThieuDeRut' || name === 'maLoaiDanhMuc') {
            
            if (name === 'soNgayGuiToiThieuDeRut' && value === '') {
                setFormData((prev) => ({ ...prev, [name]: null }));
            } else {
                const numValue = parseFloat(value);
                setFormData((prev) => ({ 
                    ...prev, 
                    [name]: isNaN(numValue) ? 0 : numValue 
                }));
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        
        if (error) setError(null);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        // Validation
        if (!formData.tenSo?.trim()) {
            setError("Tên sản phẩm không được để trống.");
            return;
        }
        if (formData.kyHan < 0) {
            setError("Kỳ hạn không được âm.");
            return;
        }
        if (formData.laiSuat <= 0) {
            setError("Lãi suất phải lớn hơn 0.");
            return;
        }
        if (formData.tienGuiBanDauToiThieu <= 0) {
            setError("Tiền gửi ban đầu tối thiểu phải lớn hơn 0.");
            return;
        }
        if (formData.tienGuiThemToiThieu <= 0) {
            setError("Tiền gửi thêm tối thiểu phải lớn hơn 0.");
            return;
        }
        if (formData.maLoaiDanhMuc <= 0) {
            setError("Vui lòng chọn loại danh mục.");
            return;
        }

        if (!productId) {
            setError("Không tìm thấy ID sản phẩm.");
            return;
        }

        setIsSubmitting(true);
        try {
            await adminUpdateSavingsProduct(parseInt(productId), formData);
            setSuccessMessage("Cập nhật sản phẩm tiết kiệm thành công!");
            setTimeout(() => {
                router.push("/admin/savings-products-management");
            }, 1500);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Cập nhật sản phẩm thất bại. Vui lòng thử lại.";
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push("/admin/savings-products-management");
    };

    if (loading) {
        return (
            <ProtectedRoute requiredRole={Role.ADMIN}>
                <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB]">
                    <div className="fixed top-0 left-0 right-0 z-[100]"><AdminHeader /></div>
                    <div className="flex-1 flex justify-center items-center pt-16">
                        <p className="text-lg text-white">Đang tải thông tin...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute requiredRole={Role.ADMIN}>
            <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB]">
                <div className="fixed top-0 left-0 right-0 z-[100]">
                    <AdminHeader />
                </div>
                <div className="flex-1 flex items-center justify-center pt-20 md:pt-24 px-4 pb-10">
                    <div className="w-full max-w-xl lg:max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 my-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-6 sm:mb-8 text-center">
                            Chỉnh Sửa Sản Phẩm Tiết Kiệm
                        </h2>

                        {error && <p className="text-red-600 bg-red-100 p-3 rounded-md mb-4 text-sm text-center">{error}</p>}
                        {successMessage && <p className="text-green-600 bg-green-100 p-3 rounded-md mb-4 text-sm text-center">{successMessage}</p>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Tên sản phẩm */}
                            <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
                                <label htmlFor="tenSo" className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">
                                    Tên sản phẩm <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="tenSo"
                                    id="tenSo"
                                    value={formData.tenSo}
                                    onChange={handleChange}
                                    placeholder="Nhập tên sản phẩm tiết kiệm"
                                    disabled={isSubmitting}
                                    required
                                    className="w-full sm:w-3/5 md:w-2/3 text-base text-gray-800 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 mt-1 sm:mt-0"
                                />
                            </div>

                            {/* Kỳ hạn */}
                            <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
                                <label htmlFor="kyHan" className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">
                                    Kỳ hạn (tháng, 0 = không kỳ hạn) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="kyHan"
                                    id="kyHan"
                                    value={formData.kyHan}
                                    onChange={handleChange}
                                    placeholder="Nhập kỳ hạn (0 = không kỳ hạn)"
                                    disabled={isSubmitting}
                                    required
                                    min="0"
                                    className="w-full sm:w-3/5 md:w-2/3 text-base text-gray-800 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 mt-1 sm:mt-0"
                                />
                            </div>

                            {/* Lãi suất */}
                            <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
                                <label htmlFor="laiSuat" className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">
                                    Lãi suất (%/năm) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="laiSuat"
                                    id="laiSuat"
                                    value={formData.laiSuat > 0 ? formData.laiSuat : ''}
                                    onChange={handleChange}
                                    placeholder="Nhập lãi suất (%/năm)"
                                    disabled={isSubmitting}
                                    required
                                    min="0.01"
                                    step="0.01"
                                    className="w-full sm:w-3/5 md:w-2/3 text-base text-gray-800 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 mt-1 sm:mt-0"
                                />
                            </div>

                            {/* Tiền gửi ban đầu tối thiểu */}
                            <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
                                <label htmlFor="tienGuiBanDauToiThieu" className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">
                                    Tiền gửi ban đầu tối thiểu (VNĐ) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="tienGuiBanDauToiThieu"
                                    id="tienGuiBanDauToiThieu"
                                    value={formData.tienGuiBanDauToiThieu > 0 ? formData.tienGuiBanDauToiThieu : ''}
                                    onChange={handleChange}
                                    placeholder="Nhập số tiền tối thiểu"
                                    disabled={isSubmitting}
                                    required
                                    min="1"
                                    className="w-full sm:w-3/5 md:w-2/3 text-base text-gray-800 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 mt-1 sm:mt-0"
                                />
                            </div>

                            {/* Tiền gửi thêm tối thiểu */}
                            <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
                                <label htmlFor="tienGuiThemToiThieu" className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">
                                    Tiền gửi thêm tối thiểu (VNĐ) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="tienGuiThemToiThieu"
                                    id="tienGuiThemToiThieu"
                                    value={formData.tienGuiThemToiThieu > 0 ? formData.tienGuiThemToiThieu : ''}
                                    onChange={handleChange}
                                    placeholder="Nhập số tiền gửi thêm tối thiểu"
                                    disabled={isSubmitting}
                                    required
                                    min="1"
                                    className="w-full sm:w-3/5 md:w-2/3 text-base text-gray-800 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 mt-1 sm:mt-0"
                                />
                            </div>

                            {/* Số ngày gửi tối thiểu để rút */}
                            <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
                                <label htmlFor="soNgayGuiToiThieuDeRut" className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">
                                    Số ngày gửi tối thiểu để rút (ngày) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="soNgayGuiToiThieuDeRut"
                                    id="soNgayGuiToiThieuDeRut"
                                    value={formData.soNgayGuiToiThieuDeRut && formData.soNgayGuiToiThieuDeRut > 0 ? formData.soNgayGuiToiThieuDeRut : ''}
                                    onChange={handleChange}
                                    placeholder="Nhập số ngày"
                                    disabled={isSubmitting}
                                    min="0"
                                    className="w-full sm:w-3/5 md:w-2/3 text-base text-gray-800 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 mt-1 sm:mt-0"
                                />
                            </div>

                            {/* Loại danh mục */}
                            <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
                                <label htmlFor="maLoaiDanhMuc" className="w-full sm:w-2/5 md:w-1/3 text-base text-gray-700 font-medium mb-1 sm:mb-0">
                                    Loại danh mục <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="maLoaiDanhMuc"
                                    id="maLoaiDanhMuc"
                                    value={formData.maLoaiDanhMuc}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    required
                                    className="w-full sm:w-3/5 md:w-2/3 text-base text-gray-800 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 mt-1 sm:mt-0"
                                >
                                    <option value="">Chọn loại danh mục</option>
                                    {categories.map((category) => (
                                        <option key={category.maLoaiSoTietKiem} value={category.maLoaiSoTietKiem}>
                                            {category.tenLoaiSoTietKiem}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-6 pt-8">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="w-full sm:w-auto px-8 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors text-sm uppercase shadow-sm"
                                >
                                    HỦY
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto px-8 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors text-sm uppercase shadow-sm disabled:opacity-70"
                                >
                                    {isSubmitting ? 'ĐANG CẬP NHẬT...' : 'CẬP NHẬT SẢN PHẨM'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
