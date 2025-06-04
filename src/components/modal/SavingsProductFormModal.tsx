"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';

interface SavingProductFormState extends Partial<SoTietKiemRequest> {
    maSo?: number; // ID của sản phẩm, chỉ có khi chỉnh sửa
}

const initialFormState: SavingProductFormState = {
    tenSo: '',
    kyHan: 0,
    laiSuat: 0.0,
    tienGuiBanDauToiThieu: 1000000,
    tienGuiThemToiThieu: 100000,
    soNgayGuiToiThieuDeRut: null,
    maLoaiDanhMuc: undefined,
};

interface SavingsProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (productData: SoTietKiemRequest, id?: number) => Promise<void>;
    initialData: SavingProductFormState | null; // Dữ liệu ban đầu cho form (khi sửa)
    categories: LoaiSoTietKiemDanhMucDTO[];
    formError: string | null;
    setFormError: (error: string | null) => void;
    formLoading: boolean;
}

export default function SavingsProductFormModal({
    isOpen,
    onClose,
    onSave,
    initialData,
    categories,
    formError,
    setFormError,
    formLoading
}: SavingsProductFormModalProps) {
    const [formData, setFormData] = useState<SavingProductFormState>(initialFormState);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(initialFormState);
        }
    }, [initialData]);

    useEffect(() => {
        console.log('Categories in SavingsProductFormModal:', categories);
    }, [categories]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numFields = ['kyHan', 'laiSuat', 'tienGuiBanDauToiThieu', 'tienGuiThemToiThieu', 'soNgayGuiToiThieuDeRut', 'maLoaiDanhMuc'];
        
        let parsedValue: string | number | null | undefined = value;
        if (numFields.includes(name)) {
            if (value === '') {
                if (name === 'soNgayGuiToiThieuDeRut') parsedValue = null;
                else if (name === 'maLoaiDanhMuc') parsedValue = undefined;
                else parsedValue = ''; 
            } else {
                parsedValue = (name === 'laiSuat') ? parseFloat(value) : parseInt(value, 10);
            }
        }
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);

        if (!formData.tenSo || formData.kyHan == null || formData.laiSuat == null || 
            formData.tienGuiBanDauToiThieu == null || formData.tienGuiThemToiThieu == null || 
            formData.maLoaiDanhMuc == null || formData.maLoaiDanhMuc === undefined || Number(formData.maLoaiDanhMuc) === 0) {
            setFormError("Vui lòng điền đầy đủ các trường bắt buộc (*) và chọn danh mục hợp lệ.");
            return;
        }
        
        const requestBody: SoTietKiemRequest = {
            tenSo: formData.tenSo!,
            kyHan: Number(formData.kyHan!),
            laiSuat: Number(formData.laiSuat!),
            tienGuiBanDauToiThieu: Number(formData.tienGuiBanDauToiThieu!),
            tienGuiThemToiThieu: Number(formData.tienGuiThemToiThieu!),
            soNgayGuiToiThieuDeRut: formData.soNgayGuiToiThieuDeRut ? Number(formData.soNgayGuiToiThieuDeRut) : null,
            maLoaiDanhMuc: Number(formData.maLoaiDanhMuc!),
        };
        await onSave(requestBody, formData.maSo);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-[100] p-4">
            <div className="relative mx-auto p-6 border w-full max-w-lg md:max-w-xl shadow-xl rounded-xl bg-white transform transition-all duration-300 scale-95 opacity-0 animate-modalShow">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-2xl text-center font-semibold text-pink-600 mb-5">
                        {formData.maSo ? "Chỉnh Sửa Sản Phẩm Sổ Tiết Kiệm" : "Thêm Sản Phẩm Sổ Tiết Kiệm Mới"}
                    </h3>
                    
                    {formError && <p className="text-red-600 bg-red-100 p-3 rounded-md text-sm mb-3">{formError}</p>}

                    <div>
                        <label htmlFor="tenSoModal" className="block text-sm font-medium text-gray-700">Tên Sản Phẩm <span className="text-red-500">*</span></label>
                        <input type="text" name="tenSo" id="tenSoModal" value={formData.tenSo || ''} onChange={handleChange} required 
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-gray-900"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="kyHanModal" className="block text-sm font-medium text-gray-700">Kỳ Hạn (tháng, 0 = KKH) <span className="text-red-500">*</span></label>
                            <input type="number" name="kyHan" id="kyHanModal" value={formData.kyHan ?? ''} onChange={handleChange} required min="0"
                                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-gray-900"/>
                        </div>
                        <div>
                            <label htmlFor="laiSuatModal" className="block text-sm font-medium text-gray-700">Lãi Suất (%/năm) <span className="text-red-500">*</span></label>
                            <input type="number" name="laiSuat" id="laiSuatModal" value={formData.laiSuat ?? ''} onChange={handleChange} required step="0.01" min="0"
                                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-gray-900"/>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="tienGuiBanDauToiThieuModal" className="block text-sm font-medium text-gray-700">Tiền Gửi Ban Đầu Tối Thiểu <span className="text-red-500">*</span></label>
                            <input type="number" name="tienGuiBanDauToiThieu" id="tienGuiBanDauToiThieuModal" value={formData.tienGuiBanDauToiThieu ?? ''} onChange={handleChange} required min="0"
                                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-gray-900"/>
                        </div>
                         <div>
                            <label htmlFor="tienGuiThemToiThieuModal" className="block text-sm font-medium text-gray-700">Tiền Gửi Thêm Tối Thiểu <span className="text-red-500">*</span></label>
                            <input type="number" name="tienGuiThemToiThieu" id="tienGuiThemToiThieuModal" value={formData.tienGuiThemToiThieu ?? ''} onChange={handleChange} required min="0"
                                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-gray-900"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="soNgayGuiToiThieuDeRutModal" className="block text-sm font-medium text-gray-700">Số Ngày Gửi Tối Thiểu Để Rút (cho KKH)</label>
                        <input type="number" name="soNgayGuiToiThieuDeRut" id="soNgayGuiToiThieuDeRutModal" value={formData.soNgayGuiToiThieuDeRut ?? ''} onChange={handleChange} min="0" placeholder="Bỏ trống nếu không áp dụng"
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-gray-900"/>
                    </div>
                     <div>
                        <label htmlFor="maLoaiDanhMucModal" className="block text-sm font-medium text-gray-700">Danh Mục Loại Sổ <span className="text-red-500">*</span></label>
                        <select name="maLoaiDanhMuc" id="maLoaiDanhMucModal" value={formData.maLoaiDanhMuc ?? ''} onChange={handleChange} required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-gray-900">
                            <option value="">-- Chọn danh mục --</option>
                            {categories?.length > 0 ? (
                                categories
                                    .filter(cat => cat.maLoaiSoTietKiem !== undefined && cat.maLoaiSoTietKiem !== null)
                                    .map(cat => (
                                        <option key={String(cat.maLoaiSoTietKiem)} value={cat.maLoaiSoTietKiem}>{cat.tenLoaiSoTietKiem}</option>
                                    ))
                            ) : (
                                <option value="" disabled>Đang tải hoặc không có danh mục</option>
                            )}
                        </select>
                    </div>

                    <div className="pt-5 flex justify-end space-x-3">
                        <button type="button" onClick={onClose}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium transition-colors">Hủy</button>
                        <button type="submit" disabled={formLoading}
                                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 disabled:opacity-70 font-medium transition-colors">
                            {formLoading ? 'Đang lưu...' : (formData.maSo ? 'Cập nhật' : 'Thêm mới')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}