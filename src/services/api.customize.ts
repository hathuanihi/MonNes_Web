// api.customize.ts
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8080/api'
});

// Add a request interceptor
instance.interceptors.request.use(
    function (config: InternalAxiosRequestConfig) { // Thêm kiểu cho config
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null; // Kiểm tra window tồn tại
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    function (error: AxiosError) { // Thêm kiểu cho error
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    function (response: AxiosResponse) { // Thêm kiểu cho response
        // Any status code that lie within the range of 2xx cause this function to trigger
        if (response && response.data) {
            // Lưu token và role vào localStorage nếu là response từ API đăng nhập
            // Backend LoginResponse trả về: { user: { ..., vaiTro: "ADMIN" | "USER" }, token: "...", message: "..." }
            if (response.config.url === '/auth/signin' && response.data.token && response.data.user && response.data.user.vaiTro) {
                if (typeof window !== "undefined") { // Kiểm tra window tồn tại
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('role', response.data.user.vaiTro); // Lưu vaiTro là string ("ADMIN" hoặc "USER")
                    localStorage.setItem('userId', response.data.user.id); // Lưu thêm userId nếu cần
                    localStorage.setItem('userEmail', response.data.user.email); // Lưu thêm email nếu cần
                }
            }
            return response.data; // Chỉ trả về phần data cho các lời gọi API thành công
        }
        return response;
    },
    function (error: AxiosError<any>) { // Thêm kiểu cho error response
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Trả về message lỗi từ backend nếu có, nếu không thì trả về message mặc định của error
        if (error.response && error.response.data && error.response.data.message) {
            return Promise.reject(new Error(error.response.data.message));
        }
        if (error.message) {
             return Promise.reject(error);
        }
        return Promise.reject(new Error("Đã có lỗi xảy ra từ server."));
    }
);

export default instance;