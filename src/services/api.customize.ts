// api.customize.ts
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Hàm tiện ích để kiểm tra môi trường client-side
const isBrowser = () => typeof window !== "undefined";

const instance = axios.create({
    baseURL: 'http://localhost:8080/api'
});

// Interceptor cho Request
instance.interceptors.request.use(
    function (config: InternalAxiosRequestConfig) {
        if (isBrowser()) {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
        }
        return config;
    },
    function (error: AxiosError) {
        return Promise.reject(error);
    }
);

// Interceptor cho Response
instance.interceptors.response.use(
    function (response: AxiosResponse) {
        // Xử lý logic khi đăng nhập thành công
        // Backend LoginResponse: { user: { ..., vaiTro: "ADMIN" | "USER" }, token: "..." }
        const { url } = response.config;
        const { data } = response;

        if (url === '/auth/signin' && data.token && data.user?.vaiTro) {
            if (isBrowser()) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.user.vaiTro); // vaiTro là "ADMIN" hoặc "USER"
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('userEmail', data.user.email);
            }
        }
        
        // Chỉ trả về phần data cho các lời gọi API thành công
        return data ?? response;
    },
    function (error: AxiosError<any>) {
        // Xử lý lỗi tập trung
        let errorMessage = "Đã có lỗi xảy ra từ server.";

        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        // Hiển thị thông báo lỗi cho người dùng (tùy chọn)
        // toast.error(errorMessage);

        // Quan trọng: Trả về một Promise.reject với một đối tượng Error
        // để các block .catch() ở nơi gọi API có thể bắt được.
        return Promise.reject(new Error(errorMessage));
    }
);

// Hàm để xử lý đăng xuất
export const logout = () => {
    if (isBrowser()) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        // Redirect về trang đăng nhập
        window.location.href = '/auth/signin';
    }
};


export default instance;