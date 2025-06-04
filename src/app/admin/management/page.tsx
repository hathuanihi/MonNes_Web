"use client";

import Image from "next/image";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import SearchIcon from "@/assets/icon/Vector.png"; 
import UserAvatarIcon from "@/assets/icon/Name.png"; 
import DropdownArrowIcon from "@/assets/icon/DropdownArrow.png";
import PenIcon from "@/assets/icon/Pen.png";
import UserInfoModal from '@/components/modal/UserInforModal'; 

import { 
    adminGetAllUsersWithDetails, 
    adminDeleteUserByAdmin 
} from '@/services/api';
import AdminHeader from "@/components/header/AdminHeader";

// --- COMPONENT UserInfoBar ---
interface UserInfoBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

function UserInfoBar({ searchTerm, setSearchTerm }: UserInfoBarProps) {
    return (
        <div
            className="w-full bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB] shadow-md py-4 px-4 sm:px-6 lg:px-8 flex-shrink-0" 
            // flex-shrink-0 để nó không bị co lại khi nội dung chính dài
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-x-4 gap-y-2">
                {/* Cột 1: Thanh tìm kiếm */}
                <div className="flex md:justify-start justify-center w-full">
                    <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 w-full max-w-xs shadow-sm">
                        <Image src={SearchIcon} alt="Search Icon" width={16} height={16} className="mr-2 opacity-50" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên, email, SĐT..."
                            value={searchTerm}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            className="outline-none w-full text-sm placeholder-gray-500 bg-transparent"
                        />
                    </div>
                </div>

                {/* Cột 2: Tiêu đề (căn giữa) */}
                <div className="flex justify-center order-first md:order-none"> {/* Tiêu đề lên trên trên mobile */}
                    <h1 className="text-xl sm:text-2xl font-bold uppercase text-white text-center whitespace-nowrap">
                        Quản Lý Người Dùng
                    </h1>
                </div>
                
                {/* Cột 3: Phần tử trống hoặc các action khác */}
                <div className="hidden md:flex justify-end">
                    {/* Ví dụ: <button>Thêm User</button> */}
                </div>
            </div>
        </div>
    );
}

// --- COMPONENT UserListItem ---
interface UserListItemProps { user: UserDetailDTO; isSelected: boolean; onSelect: () => void; }
function UserListItem({ user, isSelected, onSelect }: UserListItemProps) { 
    return (
        <div
            className={`flex items-center p-3 md:p-4 hover:bg-pink-50 cursor-pointer transition-colors duration-150 ${
                isSelected ? "bg-pink-100 border-l-4 border-pink-500" : "border-b border-gray-200"
            }`}
            onClick={onSelect}
        >
            <Image 
                src={UserAvatarIcon} 
                alt={user.tenND || "User Avatar"} 
                width={40} 
                height={40} 
                className="mr-3 rounded-full bg-gray-200 p-0.5 object-cover flex-shrink-0" 
            />
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">{user.tenND || user.email || `User ID: ${user.maND}`}</p>
                <p className="text-xs text-gray-500 truncate">{user.email || "Chưa có email"}</p>
            </div>
            <span className={`ml-auto flex-shrink-0 pl-3 px-2 py-0.5 text-xs font-semibold rounded-full ${
                user.vaiTro === "ADMIN" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}>
                {user.vaiTro}
            </span>
        </div>
    );
}

// --- COMPONENT UserDetailPanel ---
interface UserDetailPanelProps { user: UserDetailDTO; onClose: () => void; onEdit: (userToEdit: UserDetailDTO) => void; onDelete: (userId: number, userName: string) => void; }
function UserDetailPanel({ user, onClose, onEdit, onDelete }: UserDetailPanelProps) { 
    const [openSavings, setOpenSavings] = useState<{ [key: string]: boolean }>({});
    const toggleSavingsDetails = (savingKey: string) => setOpenSavings(prev => ({ ...prev, [savingKey]: !prev[savingKey] }));
    const handleDeleteUser = () => onDelete(user.maND, user.tenND || user.email || `User ID ${user.maND}`);

    return (
        // Panel này cần flex-col và h-full để phần content có thể flex-grow và overflow-y-auto
        <div className="bg-white rounded-xl shadow-xl p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-2xl font-semibold text-pink-600">Chi Tiết Người Dùng</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
            </div>
            <div className="flex flex-col items-center mb-6 flex-shrink-0">
                <Image src={UserAvatarIcon} alt="User Avatar" width={100} height={100} className="rounded-full mb-3 border-2 border-pink-300 shadow-sm"/>
                <h3 className="text-xl font-bold text-gray-800">{user.tenND || "Chưa cập nhật tên"}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-2 ${user.vaiTro === "ADMIN" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}>{user.vaiTro}</p>
            </div>
            {/* Phần nội dung có thể cuộn */}
            <div className="space-y-2 text-sm text-gray-700 mb-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                <p><strong>CCCD:</strong> {user.cccd || <span className="italic text-gray-400">Chưa cập nhật</span>}</p>
                <p><strong>Địa chỉ:</strong> {user.diaChi || <span className="italic text-gray-400">Chưa cập nhật</span>}</p>
                <p><strong>SĐT:</strong> {user.sdt || <span className="italic text-gray-400">Chưa cập nhật</span>}</p>
                <p><strong>Ngày sinh:</strong> {user.ngaySinh ? new Date(user.ngaySinh + "T00:00:00Z").toLocaleDateString('vi-VN') : <span className="italic text-gray-400">Chưa cập nhật</span>}</p>
                <p className="font-semibold mt-4 text-pink-600">Tổng số dư: {(user.tongSoDuTatCaSo || 0).toLocaleString()} VND</p>
                <h4 className="font-semibold pt-3 text-gray-800 border-t border-gray-200 mt-4">Sổ tiết kiệm ({user.danhSachSoTietKiemDaMo.length}):</h4>
                {user.danhSachSoTietKiemDaMo.length > 0 ? (
                    user.danhSachSoTietKiemDaMo.map(saving => (
                        <div key={saving.maMoSo} className="mb-2 p-3 bg-pink-50 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSavingsDetails(saving.maMoSo.toString())}>
                                <p className="font-medium text-pink-700">{saving.tenSoMo || `Sổ #${saving.maMoSo}`}</p>
                                <div className="flex items-center">
                                  <p className="text-pink-600 mr-2 font-semibold">{(saving.soDuHienTai || 0).toLocaleString()} VND</p>
                                  <Image src={DropdownArrowIcon} alt="Dropdown" width={12} height={12} className={`transform transition-transform ${openSavings[saving.maMoSo.toString()] ? "rotate-180" : ""}`}/>
                                </div>
                            </div>
                            {openSavings[saving.maMoSo.toString()] && (
                                <div className="mt-2 pl-3 text-xs text-gray-600 border-l-2 border-pink-300 space-y-1">
                                    <p><strong>Sản phẩm:</strong> {saving.tenSanPhamSoTietKiem}</p>
                                    <p><strong>Kỳ hạn:</strong> {saving.kyHanSanPham === 0 ? "Không kỳ hạn" : `${saving.kyHanSanPham} tháng`}</p>
                                    <p><strong>Lãi suất:</strong> {saving.laiSuatApDungChoSoNay}%/năm</p>
                                    <p><strong>Ngày mở:</strong> {new Date(saving.ngayMo).toLocaleDateString('vi-VN')}</p>
                                    {saving.ngayDaoHan && <p><strong>Ngày đáo hạn:</strong> {new Date(saving.ngayDaoHan).toLocaleDateString('vi-VN')}</p>}
                                    <p><strong>Trạng thái:</strong> {saving.trangThaiMoSo === "DANG_HOAT_DONG" ? "Đang hoạt động" : "Đã đóng"}</p>
                                </div>
                            )}
                        </div>
                    ))
                ) : ( <p className="text-gray-500 italic">Chưa có sổ tiết kiệm nào.</p> )}
            </div>
            {/* Nút hành động */}
            <div className="mt-auto pt-4 border-t border-gray-200 flex space-x-3 flex-shrink-0">
                <button onClick={() => onEdit(user)} className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2.5 px-4 rounded-md transition-colors shadow-sm">Sửa thông tin</button>
            </div>
        </div>
    );
}

// --- COMPONENT UserManagementPage ---
export default function UserManagementPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState<UserDetailDTO[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserDetailDTO | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<UserDetailDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => { 
        try {
            setLoading(true);
            const data = await adminGetAllUsersWithDetails();
            setUsers(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Không thể tải danh sách người dùng.");
            console.error("Lỗi fetch users:", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { fetchUsers(); }, []);

    const filteredUsers = users.filter((user) =>
        (user.tenND && user.tenND.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.sdt && user.sdt.includes(searchTerm))
    );

    const handleUserSelect = (user: UserDetailDTO) => { 
        setSelectedUser(prevUser => (prevUser && prevUser.maND === user.maND) ? null : user);
    };
    
    const handleOpenEditModal = (userToEditData: UserDetailDTO) => { 
        setUserToEdit(userToEditData);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setUserToEdit(null);
     };
    
    const handleUpdateUserSuccess = async (updatedUserResponse: UserResponse) => {
        fetchUsers(); 
        handleCloseEditModal();
        if (selectedUser && selectedUser.maND === updatedUserResponse.id) {
            try {
                 const refreshedUsers = await adminGetAllUsersWithDetails();
                 const foundUser = refreshedUsers.find(u => u.maND === updatedUserResponse.id);
                 if (foundUser) setSelectedUser(foundUser);
                 else setSelectedUser(null); 
            } catch (e) {
                console.error("Lỗi khi làm mới selected user:", e);
                setSelectedUser(null);
            }
        }
     };

    const handleDeleteUser = async (userId: number, userName: string) => { 
        if (window.confirm(`Bạn có chắc muốn xóa người dùng "${userName}" (ID: ${userId})?`)) {
            const originalUsers = [...users];
            setUsers(prevUsers => prevUsers.filter(u => u.maND !== userId));
            if (selectedUser && selectedUser.maND === userId) {
                setSelectedUser(null);
            }
            try {
                await adminDeleteUserByAdmin(userId);
            } catch (err: any) {
                setError(err.message || "Lỗi khi xóa người dùng.");
                setUsers(originalUsers); 
                console.error("Lỗi xóa người dùng:", err);
            }
        }
    };
    
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <AdminHeader />
            {/* Banner Tiêu đề Trang - KHÔNG sticky, cho phép cuộn */}
            <div className="w-full" style={{marginTop: '5rem'}}>
                <h1 
                    className="w-full text-center text-3xl md:text-4xl font-bold text-white py-5 md:py-6 rounded-b-2xl shadow-lg"
                    style={{
                        background: "linear-gradient(90deg, #FF086A 0%, #FB5D5D 50%, #F19BDB 100%)",
                    }}
                >
                    QUẢN LÝ NGƯỜI DÙNG
                </h1>
            </div>
            {/* Thanh tìm kiếm, lọc, nút action - nằm ngang, full width, ngay dưới title header */}
            <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 px-4 sm:px-6 lg:px-8 mt-4 mb-2">
                {/* Tìm kiếm */}
                <div className="flex-1 w-full md:w-auto relative">
                    <div className="flex items-center bg-white border-2 border-pink-300 rounded-xl px-4 py-3 w-full shadow-sm">
                        <Image src={SearchIcon} alt="Search Icon" width={18} height={18} className="mr-2 opacity-50" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên, email, SĐT..."
                            value={searchTerm}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            className="outline-none w-full text-base placeholder-pink-400 bg-transparent text-pink-700 font-semibold"
                        />
                    </div>
                </div>
                {/* (Có thể thêm nút action ở đây nếu cần) */}
            </div>
            {/* Container cho toàn bộ nội dung bên dưới Header/banner/search bar */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col overflow-hidden">
                    {error && !isEditModalOpen && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4 text-center">{error}</p>}

                    {/* Container cho 2 cột, chiếm không gian còn lại và cho phép nội dung bên trong cuộn */}
                    <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
                        {/* Danh sách người dùng (cột trái) */}
                        <div className="w-full md:w-2/5 lg:w-1/3 bg-white rounded-xl shadow-lg flex flex-col">
                            <div className="p-4 border-b border-gray-200 flex-shrink-0"> {/* flex-shrink-0 cho header của card */}
                                <h2 className="text-lg font-semibold text-pink-600">Danh Sách ({loading && users.length === 0 ? "..." : filteredUsers.length})</h2>
                            </div>
                            {/* flex-grow và overflow-y-auto cho phép phần này cuộn */}
                            <div className="overflow-y-auto flex-grow custom-scrollbar">
                                {(loading && users.length === 0) && <p className="p-4 text-center text-gray-500">Đang tải...</p>}
                                {!loading && filteredUsers.length === 0 && <div className="p-6 text-gray-500 text-center">Không tìm thấy người dùng.</div>}
                                {filteredUsers.map((user) => (
                                    <UserListItem 
                                        key={user.maND}
                                        user={user}
                                        isSelected={selectedUser?.maND === user.maND}
                                        onSelect={() => handleUserSelect(user)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Panel chi tiết người dùng (cột phải) */}
                        {/* flex-1 để panel này cũng cố gắng chiếm không gian */}
                        <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col"> 
                            {selectedUser ? (
                                <UserDetailPanel 
                                    user={selectedUser} 
                                    onClose={() => setSelectedUser(null)}
                                    onEdit={handleOpenEditModal}
                                    onDelete={handleDeleteUser}
                                />
                            ) : (
                                <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-400 h-full flex-1 flex items-center justify-center">
                                    <p className="text-lg">Chọn một người dùng từ danh sách để xem chi tiết.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {isEditModalOpen && userToEdit && (
                <UserInfoModal
                    userToEdit={userToEdit}
                    onUpdateSuccess={handleUpdateUserSuccess}
                    onClose={handleCloseEditModal}
                />
            )}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
                .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #c1c1c1 #f1f1f1; }
            `}</style>
        </div>
    );
}