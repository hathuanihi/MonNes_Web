// api.ts
import axiosInstance from "./api.customize"; // Đổi tên import để rõ hơn là instance đã customize

// ============================
// AUTH APIs
// ============================
export const loginAPI = (data: LoginRequest): Promise<LoginResponseData> => {
    return axiosInstance.post('/auth/signin', data);
};

export const registerAPI = (data: RegisterRequest): Promise<UserResponse> => {
    // Backend RegisterRequest cần confirmPassword, nhưng service không dùng
    // Ta có thể gửi confirmPassword bằng password nếu frontend đã validate
    return axiosInstance.post('/auth/signup', { ...data, confirmPassword: data.password });
};

export const sendPasscodeAPI = (data: ForgotPasswordRequest): Promise<MessageResponse> => {
    return axiosInstance.post('/auth/forgot-password', data);
};

export const verifyPasscodeAPI = (data: VerifyPasscodeRequest): Promise<MessageResponse> => {
    return axiosInstance.post('/auth/verify-passcode', data);
};

export const resetPasswordAPI = (data: ResetPasswordRequest): Promise<MessageResponse> => {
    return axiosInstance.post('/auth/reset-password', data);
};

// ============================
// ADMIN - User Management APIs
// ============================
export const adminGetAllUsersWithDetails = (): Promise<UserDetailDTO[]> => {
    return axiosInstance.get('/admin/users');
};

export const adminGetUserDetailsById = (userId: number): Promise<UserDetailDTO> => {
    return axiosInstance.get(`/admin/users/${userId}`);
};

export const adminUpdateUserByAdmin = (userIdToUpdate: number, data: UpdateProfileDTO): Promise<UserResponse> => {
    return axiosInstance.put(`/admin/users/${userIdToUpdate}`, data);
};

export const adminDeleteUserByAdmin = (userIdToDelete: number): Promise<MessageResponse> => {
    return axiosInstance.delete(`/admin/users/${userIdToDelete}`);
};

// ============================
// ADMIN - Savings Product Management APIs (SoTietKiem)
// ============================
export const adminGetAllSavingsProducts = (): Promise<SoTietKiemDTO[]> => {
    return axiosInstance.get('/admin/savings-products-management');
};

export const adminGetSavingsProductById = (productId: number): Promise<SoTietKiemDTO> => {
    return axiosInstance.get(`/admin/savings-products-management/${productId}`);
};

export const adminCreateSavingsProduct = (data: SoTietKiemRequest): Promise<SoTietKiemDTO> => {
    return axiosInstance.post('/admin/savings-products-management', data);
};

export const adminUpdateSavingsProduct = (productId: number, data: SoTietKiemRequest): Promise<SoTietKiemDTO> => {
    return axiosInstance.put(`/admin/savings-products-management/${productId}`, data);
};

export const adminDeleteSavingsProduct = (productId: number): Promise<MessageResponse> => {
    return axiosInstance.delete(`/admin/savings-products-management/${productId}`);
};

// ============================
// ADMIN - Statistics & Transactions
// ============================
export const adminGetSystemStatistics = (): Promise<ThongKeDTO> => {
    return axiosInstance.get('/admin/statistics');
};

export const adminGetAllSystemTransactions = (page?: number, size?: number, sort?: string): Promise<Page<GiaoDichDTO>> => {
    return axiosInstance.get('/admin/transactions', { params: { page, size, sort } });
};

// ============================
// USER - Profile APIs
// ============================
export const userGetProfile = (): Promise<UserResponse> => {
    return axiosInstance.get('/user/profile');
};

export const userUpdateProfile = (data: UpdateProfileDTO): Promise<UserResponse> => {
    return axiosInstance.put('/user/profile', data);
};

// ============================
// USER - Opened Savings Account (MoSoTietKiem) APIs
// ============================
export const userGetAllMySavingsAccounts = (): Promise<MoSoTietKiemResponse[]> => {
    return axiosInstance.get('/user/savings');
};

export const userGetMySavingsAccountDetails = (moSoId: number): Promise<MoSoTietKiemResponse> => {
    return axiosInstance.get(`/user/savings/${moSoId}`);
};

export const userCreateSavingsAccount = (data: MoSoTietKiemRequest): Promise<MoSoTietKiemResponse> => {
    return axiosInstance.post('/user/savings', data);
};

// ============================
// USER - Deposit/Withdraw APIs
// ============================
export const userDepositToAccount = (moSoId: number, data: DepositRequest): Promise<PhieuGuiTienResponse> => {
    return axiosInstance.post(`/user/savings/${moSoId}/deposit`, data);
};

export const userWithdrawFromAccount = (moSoId: number, data: WithdrawRequest): Promise<PhieuRutTienResponse> => {
    return axiosInstance.post(`/user/savings/${moSoId}/withdraw`, data);
};

// ============================
// USER - Transaction History APIs
// ============================
export const userGetRecentTransactions = (limit: number = 10): Promise<GiaoDichDTO[]> => {
    return axiosInstance.get('/user/transactions/recent', { params: { limit } });
};

export const userGetTransactionDetails = (transactionId: number): Promise<GiaoDichDTO> => { // Long có thể là number
    return axiosInstance.get(`/user/transactions/${transactionId}`);
};

export const userGetTransactionsForSpecificAccount = (moSoId: number): Promise<GiaoDichDTO[]> => {
    return axiosInstance.get(`/user/savings/${moSoId}/transactions`);
};


// ============================
// USER - Dashboard APIs
// ============================
export const userGetAccountSummary = (): Promise<UserAccountSummaryDTO> => {
    return axiosInstance.get('/user/savings/account-summary');
};

export const userGetMonthlyDashboardSummary = (): Promise<DashboardSummaryDTO> => {
    return axiosInstance.get('/user/dashboard/monthly-summary');
};

export const userGetDashboardOverview = (): Promise<Map<string, any>> => { // Kiểu any cho Map value vì nó phức tạp
    return axiosInstance.get('/user/dashboard-overview');
};

// Các API liên quan đến loại sổ tiết kiệm (template - SoTietKiem) cho User xem (nếu cần)
export const userGetAllAvailableSavingsProducts = (): Promise<SoTietKiemDTO[]> => {
    // Giả sử có một endpoint cho user xem các sản phẩm sổ, ví dụ:
    return axiosInstance.get('/admin/savings-products-management'); 
    // Backend cần tạo endpoint này và nó sẽ gọi SoTietKiemService.getAllSoTietKiemDTOs()
};

export const adminGetAllLoaiSoTietKiemDanhMuc = (): Promise<LoaiSoTietKiemDanhMucDTO[]> => {
    return axiosInstance.get('/admin/savings-categories'); 
};
