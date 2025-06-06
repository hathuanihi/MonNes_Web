export {}; 

declare global {
    // ============================
    // AUTH DTOs
    // ============================
    interface LoginRequest {
        username?: string;
        password?: string;
    }

    interface UserResponse {
        id: number;
        tenND: string | null;
        cccd: string | null;
        diaChi: string | null;
        sdt: string | null;
        email: string | null;
        ngaySinh: string | null; // "YYYY-MM-DD"
        vaiTro: "ADMIN" | "USER";
    }

    interface LoginResponseData {
        user: UserResponse;
        token: string;
        message?: string;
    }

    interface RegisterRequest {
        email: string;
        phoneNumber: string;
        password: string;
        confirmPassword?: string;
    }

    interface ForgotPasswordRequest {
        email: string;
    }

    interface VerifyPasscodeRequest {
        email: string;
        passcode: string;
    }

    interface ResetPasswordRequest {
        email: string;
        newPassword: string;
        confirmPassword: string;
    }

    interface MessageResponse {
        message: string;
    }

    // ============================
    // USER DTOs
    // ============================
    interface UpdateProfileDTO {
        tenND?: string;
        cccd?: string;
        diaChi?: string;
        sdt?: string;
        ngaySinh?: string; // "YYYY-MM-DD"
        email?: string;
    }

    interface UserAccountSummaryDTO {
        tongSoDuTrongTatCaSo: number;
        tongTienDaNapTuTruocDenNay: number;
        tongTienDaRutTuTruocDenNay: number;
        tongSoLuongSoTietKiemDaMo: number;
        tongSoGiaoDichDaThucHien: number;
    }

    interface DashboardSummaryDTO {
        tongSoDuTatCaSoCuaUser: number;
        tongTienDaNapThangNay: number;
        tongTienDaRutThangNay: number;
        soLuongSoTietKiemDangHoatDong: number;
    }

    // ============================
    // SAVINGS PRODUCT (SoTietKiem) DTOs
    // ============================
    interface LoaiSoTietKiemDanhMucDTO {
        maLoaiSoTietKiem: number;
        tenLoaiSoTietKiem: string;
    }

    interface SoTietKiemDTO {
        maSo: number;
        tenSo: string;
        kyHan: number;
        laiSuat: number;
        tienGuiBanDauToiThieu: number;
        tienGuiThemToiThieu: number;
        soNgayGuiToiThieuDeRut?: number | null;
        loaiSoTietKiemDanhMuc?: LoaiSoTietKiemDanhMucDTO;
    }

    interface SoTietKiemRequest {
        tenSo: string;
        kyHan: number;
        laiSuat: number;
        tienGuiBanDauToiThieu: number;
        tienGuiThemToiThieu: number;
        soNgayGuiToiThieuDeRut?: number | null;
        maLoaiDanhMuc: number;
    }

    // ============================
    // OPENED SAVINGS ACCOUNT (MoSoTietKiem) DTOs
    // ============================
    interface MoSoTietKiemRequest {
        soTietKiemSanPhamId: number;
        tenSoMo: string;
        soTienGuiBanDau: number;
    }

    interface MoSoTietKiemResponse {
        maMoSo: number;
        tenSoMo?: string | null;
        ngayMo: string; // "YYYY-MM-DD"
        ngayDaoHan?: string | null; // "YYYY-MM-DD"
        soDuHienTai: number;
        trangThaiMoSo: "DANG_HOAT_DONG" | "DA_DONG" | "DA_DAO_HAN";
        tenNguoiDung?: string | null;
        maSanPhamSoTietKiem?: number;
        tenSanPhamSoTietKiem?: string | null;
        kyHanSanPham?: number;
        laiSuatSanPhamHienTai?: number;
        laiSuatApDungChoSoNay?: number;
    }

    // ============================
    // TRANSACTION (GiaoDich, PhieuGui, PhieuRut) DTOs
    // ============================
    interface DepositRequest {
        soTien: number;
    }

    interface WithdrawRequest {
        soTien: number;
    }

    interface PhieuGuiTienResponse {
        maPGT?: number;
        maMoSo?: number;
        soTienGui: number;
        ngayGui: string; // ISO Date string
    }

    interface PhieuRutTienResponse {
        maPRT?: number;
        maMoSo?: number;
        soTienRut: number;
        ngayRut: string; // ISO Date string
        laiSuatKhiRut?: number | null;
        tienLaiThucNhan?: number | null;
    }

    interface GiaoDichDTO {
        idGiaoDich: number;
        loaiGiaoDich: "DEPOSIT" | "WITHDRAW" | "INTEREST_ACCRUAL" | "INTEREST_PAYMENT";
        soTien: number;
        ngayGD: string; // "YYYY-MM-DD"
        maKhachHang?: number;
        tenKhachHang?: string | null;
        maSoMoTietKiem?: number;
        tenSoMoTietKiem?: string | null;
        tenSanPhamSoTietKiem?: string | null;
    }

    export type DashboardOverviewDTO = {
        recentTransactions: GiaoDichDTO[];
        accountSummary: {
            tongSoDuTrongTatCaSo: number;
            tongTienDaNapTuTruocDenNay: number;
            tongTienDaRutTuTruocDenNay: number;
        };
        activeSavingsAccounts: Array<{
            maMoSo: number;
            tenSoMo: string;
            soDuHienTai: number;
            tenNguoiDung: string;
            tenSanPhamSoTietKiem: string;
            kyHanSanPham: number;
            laiSuatApDungChoSoNay: number;
        }>;
    }

    // ============================
    // ADMIN DTOs
    // ============================
    interface UserDetailDTO {
        maND: number;
        tenND?: string | null;
        cccd?: string | null;
        diaChi?: string | null;
        sdt?: string | null;
        ngaySinh?: string | null; // "YYYY-MM-DD"
        email?: string | null;
        vaiTro: "ADMIN" | "USER";
        danhSachSoTietKiemDaMo: MoSoTietKiemResponse[];
        tongSoDuTatCaSo: number;
    }

    interface ThongKeDTO {
        luotTruyCapHomNay?: number;
        luotTruyCapThangNay?: number;
        doanhThuHomNay?: number;
        doanhThuThangNay?: number;
        tongSoNguoiDung?: number;
        tongSoTaiKhoanTietKiemDangHoatDong?: number;
        tongSoDuToanHeThong?: number;
        giaoDichGanDayNhat?: GiaoDichDTO[];
    }

    // Đăng ký tài khoản qua email/passcode
    interface SignupRequestPasscodeRequest {
        email: string;
    }
    interface SignupVerifyPasscodeRequest {
        email: string;
        passcode: string;
    }
    interface SignupCompleteRequest {
        email: string;
        phoneNumber: string;
        password: string;
        confirmPassword?: string;
        passcode: string;
    }

    // Cho Pageable response từ Spring Data
    interface Page<T> {
        content: T[];
        pageable: {
            pageNumber: number;
            pageSize: number;
            sort: {
                sorted: boolean;
                unsorted: boolean;
                empty: boolean;
            };
            offset: number;
            paged: boolean;
            unpaged: boolean;
        };
        last: boolean;
        totalPages: number;
        totalElements: number;
        size: number;
        number: number; // Current page number
        sort: { // Sort details for the current page
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        };
        first: boolean;
        numberOfElements: number; // Elements in the current page
        empty: boolean;
    }
}