import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { stat } from "fs";

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
instance.interceptors.response.use(    function (response: AxiosResponse) {
        const { url } = response.config;
        const { data } = response;

        console.log('[API Interceptor] Response received:', { url, hasToken: !!data.token, hasUser: !!data.user });

        if ((url === '/auth/signin' || url?.includes('/signin')) && data.token && data.user?.vaiTro) {
            if (isBrowser()) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.user.vaiTro); // vaiTro là "ADMIN" hoặc "USER"
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('userEmail', data.user.email);
                
                console.log('[API Interceptor] Login successful, stored user data:', {
                    role: data.user.vaiTro,
                    userId: data.user.id,
                    email: data.user.email
                });
            }
        }
        
        // Chỉ trả về phần data cho các lời gọi API thành công
        return data ?? response;
    },function (error: AxiosError<any>) {
        // Xử lý lỗi tập trung
        let errorMessage = "Đã có lỗi xảy ra từ server.";
        const statusCode = error.response?.status;
        const url = error.config?.url;

        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }       
         // Xử lý chi tiết lỗi 400 cho deposit và withdraw
        if (statusCode === 400) {
            if (url?.includes('/deposit')) {
                if (errorMessage.toLowerCase().includes('amount') || 
                    errorMessage.toLowerCase().includes('số tiền') ||
                    errorMessage.toLowerCase().includes('invalid') ||
                    errorMessage.toLowerCase().includes('không hợp lệ')) {
                    errorMessage = "Số tiền nạp không hợp lệ. Vui lòng kiểm tra lại số tiền và đảm bảo tuân thủ quy định của sản phẩm tiết kiệm.";
                } else if (errorMessage.toLowerCase().includes('minimum') || 
                          errorMessage.toLowerCase().includes('tối thiểu')) {
                    errorMessage = "Số tiền nạp không đạt mức tối thiểu theo quy định của sản phẩm tiết kiệm.";
                } else if (errorMessage.toLowerCase().includes('maximum') || 
                          errorMessage.toLowerCase().includes('tối đa')) {
                    errorMessage = "Số tiền nạp vượt quá mức tối đa cho phép.";
                } else {
                    errorMessage = "Không thể nạp tiền vào sổ tiết kiệm này. Vui lòng kiểm tra thông tin sổ và số tiền nạp.";
                }
            } else if (url?.includes('/withdraw')) {
                if (errorMessage.toLowerCase().includes('amount') || 
                    errorMessage.toLowerCase().includes('số tiền') ||
                    errorMessage.toLowerCase().includes('invalid') ||
                    errorMessage.toLowerCase().includes('không hợp lệ')) {
                    errorMessage = "Số tiền rút không hợp lệ. Vui lòng kiểm tra lại số tiền và đảm bảo tuân thủ quy định của sản phẩm tiết kiệm.";
                } else if (errorMessage.toLowerCase().includes('balance') || 
                          errorMessage.toLowerCase().includes('số dư')) {
                    errorMessage = "Số dư trong sổ không đủ để thực hiện giao dịch rút tiền.";
                } else if (errorMessage.toLowerCase().includes('term') || 
                          errorMessage.toLowerCase().includes('kỳ hạn') ||
                          errorMessage.toLowerCase().includes('maturity')) {
                    errorMessage = "Sổ tiết kiệm chưa đến kỳ hạn. Không thể rút tiền trước thời hạn.";
                } else if (errorMessage.toLowerCase().includes('partial') || 
                          errorMessage.toLowerCase().includes('toàn bộ')) {
                    errorMessage = "Sổ tiết kiệm có kỳ hạn chỉ cho phép rút toàn bộ số dư.";
                } else {
                    errorMessage = "Không thể rút tiền từ sổ tiết kiệm này. Vui lòng kiểm tra thông tin sổ và điều kiện rút tiền.";
                }
            }
        }
        else if (statusCode === 500) {
            if (url?.includes('/deposit'))
                errorMessage = "Chưa đến thời gian nạp tiền vào sổ."
        }

        const customError = new Error(errorMessage);
        (customError as any).response = {
            statusCode: statusCode,
            code: statusCode,
            data: error.response?.data
        };
        return Promise.reject(customError);
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
        window.location.href = '/signin';
    }
};


export default instance;