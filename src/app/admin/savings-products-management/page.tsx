"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/header/AdminHeader';
import { 
    adminGetAllSavingsProducts, 
    adminDeleteSavingsProduct,
    adminGetAllLoaiSoTietKiemDanhMuc 
} from '@/services/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ProtectedRoute, { Role } from '@/components/ProtectedRoute';

export default function SavingsProductManagementPage() {
    const router = useRouter();
    const [products, setProducts] = useState<SoTietKiemDTO[]>([]);
    const [categories, setCategories] = useState<LoaiSoTietKiemDanhMucDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState<string | null>(null);

    // Logic fetch, open/close modal, save, delete giữ nguyên như phiên bản trước
    const fetchData = async () => {
        try {
            setLoading(true); setPageError(null);
            const [productsData, categoriesData] = await Promise.all([
                adminGetAllSavingsProducts(),
                adminGetAllLoaiSoTietKiemDanhMuc()
            ]);
            setProducts(Array.isArray(productsData) ? productsData : []);
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (err: any) {
            setPageError(err.message || "Không thể tải dữ liệu.");
            console.error("Lỗi khi fetch dữ liệu:", err);
            setProducts([]); setCategories([]);
        } finally { setLoading(false); }
    };
    useEffect(() => { fetchData(); }, []);    const handleOpenAddModal = () => {
        router.push('/admin/savings-products-management/create-savings-products');
    };    const handleOpenEditModal = (product: SoTietKiemDTO) => {        router.push(`/admin/savings-products-management/edit-savings-products?id=${product.maSo}`);
    };

    const handleDeleteProduct = async (productId: number, productName: string) => { 
        if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${productName}"?`)) {
            try {
                setLoading(true); await adminDeleteSavingsProduct(productId); await fetchData(); 
            } catch (err: any) {
                setPageError(err.message || "Lỗi khi xóa sản phẩm.");
                console.error("Lỗi khi xóa sản phẩm:", err);
            } finally { setLoading(false); }
        }
    };
    
    return (
        // Thẻ div này sẽ là con của div có style paddingTop trong AdminLayout.tsx
        // Nó sẽ không có AdminHeader ở đây
        // <>
        //     {/* Tiêu đề trang và nút Thêm Mới sẽ nằm ở đây, ngay đầu phần nội dung */}
        <ProtectedRoute requiredRole={Role.ADMIN}>
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="fixed top-0 left-0 right-0 z-[100]">
                <AdminHeader />
            </div>

            {/* <div className="w-full bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB] shadow-md max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3 border-b border-gray-200 bg-gray-50 relative flex items-center min-h-[56px]">
                <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-white whitespace-nowrap">
                    Quản Lý Sản Phẩm Sổ Tiết Kiệm
                </h1>
                <button
                    onClick={handleOpenAddModal}
                    className="ml-auto inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-md text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-95"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Thêm Sản Phẩm Mới
                </button>
            </div> */}

            <div className="w-full" style={{marginTop: '5rem'}}>
                <h1 
                    className="w-full text-center text-3xl md:text-4xl font-bold text-white py-5 md:py-6 rounded-b-2xl shadow-lg"
                    style={{
                        background: "linear-gradient(90deg, #FF086A 0%, #FB5D5D 50%, #F19BDB 100%)",
                    }}
                >
                    QUẢN LÝ SẢN PHẨM SỔ TIẾT KIỆM
                </h1>
            </div>
            <div className="w-full max-w-7xl mx-auto flex justify-end px-4 sm:px-6 lg:px-8 mt-4 mb-2">
                <button
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center justify-center px-4 py-3 border-2 border-pink-500 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 hover:from-pink-600 hover:via-pink-500 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl active:scale-95"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Thêm Sản Phẩm Mới
                </button>
            </div>

            {/* Nội dung chính của trang (bảng dữ liệu) */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {pageError && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-6 text-center shadow">{pageError}</p>}
                
                {loading ? (
                    <div className="text-center text-gray-500 py-10 text-lg">
                        <div role="status" className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                        <p className="ml-3 mt-4">Đang tải dữ liệu...</p>
                    </div>
                ) : products.length === 0 && !pageError ? (
                     <div className="text-center text-gray-500 py-10 mt-10 bg-white p-8 rounded-xl shadow-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        <h3 className="mt-4 text-xl font-semibold text-gray-700">Chưa có sản phẩm sổ tiết kiệm</h3>
                        <p className="mt-2 text-sm text-gray-500">Hãy bắt đầu bằng cách thêm một sản phẩm mới để quản lý.</p>
                        <div className="mt-8">
                            <button
                                onClick={handleOpenAddModal}
                                type="button"
                                className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
                            >
                                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Tạo Sản Phẩm Đầu Tiên
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider bg-pink-50">Tên Sản Phẩm</th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider bg-pink-50">Kỳ Hạn</th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider bg-pink-50">Lãi Suất</th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider bg-pink-50">Gửi Min</th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider bg-pink-50">Gửi Thêm Min</th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider bg-pink-50">Ngày Rút Min</th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider sticky right-0 z-10 bg-pink-50">Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.maSo} className="transition-all duration-300 hover:bg-gray-50/80 hover:shadow-md">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate" title={product.tenSo}>{product.tenSo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{product.kyHan === 0 ? "Không kỳ hạn" : `${product.kyHan} tháng`}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{product.laiSuat.toFixed(2)}%</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{product.tienGuiBanDauToiThieu.toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{product.tienGuiThemToiThieu.toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{product.soNgayGuiToiThieuDeRut != null ? `${product.soNgayGuiToiThieuDeRut} ngày` : 'Không'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2 sticky right-0 bg-inherit z-0">
                                                <button 
                                                    onClick={() => handleOpenEditModal(product)} 
                                                    className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition-all duration-300 transform hover:scale-110 hover:shadow-md" 
                                                    title="Sửa"
                                                >
                                                    <PencilIcon className="h-5 w-5"/>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteProduct(product.maSo, product.tenSo)} 
                                                    className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-all duration-300 transform hover:scale-110 hover:shadow-md" 
                                                    title="Xóa"
                                                >
                                                    <TrashIcon className="h-5 w-5"/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>                )}
            </main>
        </div> 
        </ProtectedRoute>
    );
}