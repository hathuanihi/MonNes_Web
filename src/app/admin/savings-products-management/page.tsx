"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
// AdminHeader sẽ được render bởi AdminLayout.tsx
import SavingsProductFormModal from '@/components/modal/SavingsProductFormModal'; 
import { 
    adminGetAllSavingsProducts, 
    adminCreateSavingsProduct, 
    adminUpdateSavingsProduct, 
    adminDeleteSavingsProduct,
    adminGetAllLoaiSoTietKiemDanhMuc 
} from '@/services/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface SavingProductFormState extends Partial<SoTietKiemRequest> {
    maSo?: number; 
}

export default function SavingsProductManagementPage() {
    const [products, setProducts] = useState<SoTietKiemDTO[]>([]);
    const [categories, setCategories] = useState<LoaiSoTietKiemDanhMucDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [pageError, setPageError] = useState<string | null>(null);
    const [modalFormError, setModalFormError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEditingProductData, setCurrentEditingProductData] = useState<SavingProductFormState | null>(null);

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
    useEffect(() => { fetchData(); }, []);
    const handleOpenAddModal = () => {
        setCurrentEditingProductData(null); 
        setModalFormError(null); setIsModalOpen(true);
    };
    const handleOpenEditModal = (product: SoTietKiemDTO) => {
        setCurrentEditingProductData({
            maSo: product.maSo, tenSo: product.tenSo, kyHan: product.kyHan, laiSuat: product.laiSuat,
            tienGuiBanDauToiThieu: product.tienGuiBanDauToiThieu, tienGuiThemToiThieu: product.tienGuiThemToiThieu,
            soNgayGuiToiThieuDeRut: product.soNgayGuiToiThieuDeRut || null,
            maLoaiDanhMuc: product.loaiSoTietKiemDanhMuc?.maLoaiSoTietKiem || undefined,
        });
        setModalFormError(null); setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false); setCurrentEditingProductData(null); setModalFormError(null);
     };
    const handleSaveProduct = async (productData: SoTietKiemRequest, id?: number) => {
        setFormSubmitting(true); setModalFormError(null);
        try {
            if (id) { await adminUpdateSavingsProduct(id, productData); } 
            else { await adminCreateSavingsProduct(productData); }
            await fetchData(); handleCloseModal();
        } catch (err: any) {
            setModalFormError(err.message || "Có lỗi xảy ra khi lưu sản phẩm.");
            console.error("Lỗi khi lưu sản phẩm:", err);
        } finally { setFormSubmitting(false); }
     };
    const handleDeleteProduct = async (productId: number, productName: string) => { 
        if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${productName}" (ID: ${productId})?`)) {
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
        <>
            {/* Tiêu đề trang và nút Thêm Mới sẽ nằm ở đây, ngay đầu phần nội dung */}
            <div className="w-full bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB] shadow-md max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3 border-b border-gray-200 bg-gray-50 relative flex items-center min-h-[56px]">
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
                    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên Sản Phẩm</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Kỳ Hạn</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Lãi Suất</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Gửi Min</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Gửi Thêm Min</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày Rút Min</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider sticky right-0 bg-gray-100 z-10">Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.maSo} className="hover:bg-pink-50/50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{product.maSo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate" title={product.tenSo}>{product.tenSo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{product.kyHan === 0 ? "Không kỳ hạn" : `${product.kyHan} tháng`}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{product.laiSuat.toFixed(2)}%</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{product.tienGuiBanDauToiThieu.toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{product.tienGuiThemToiThieu.toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{product.soNgayGuiToiThieuDeRut != null ? `${product.soNgayGuiToiThieuDeRut} ngày` : 'Không'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2 sticky right-0 bg-inherit z-0">
                                                <button onClick={() => handleOpenEditModal(product)} className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded-full hover:bg-indigo-100 transition-colors" title="Sửa">
                                                    <PencilIcon className="h-5 w-5"/>
                                                </button>
                                                <button onClick={() => handleDeleteProduct(product.maSo, product.tenSo)} className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-100 transition-colors" title="Xóa">
                                                    <TrashIcon className="h-5 w-5"/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {isModalOpen && (
                <SavingsProductFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveProduct}
                    initialData={currentEditingProductData}
                    categories={categories}
                    formError={modalFormError}
                    setFormError={setModalFormError} 
                    formLoading={formSubmitting}
                />
            )}
             <style jsx global>{`
                /* ... (keyframes modalShow và custom-scrollbar giữ nguyên) ... */
                @keyframes modalShow {
                    from { opacity: 0; transform: scale(0.95) translateY(-20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-modalShow {
                    animation: modalShow 0.3s ease-out forwards;
                }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f3f4f6; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
                .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #d1d5db #f3f4f6; }
            `}</style>
        </> 
    );
}