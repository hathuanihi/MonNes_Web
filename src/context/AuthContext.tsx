"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api.customize'; 
import ErrorDisplay from '@/components/display/ErrorDisplay';
import LoadingScreen from '@/components/display/LoadingScreen';

interface AuthContextType {
    user: UserResponse | null;
    isLoading: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true); 
    const router = useRouter();

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response: UserResponse = await api.get('/auth/profile'); 
                    setUser(response);
                } catch (error) {
                    console.error("Token validation failed:", error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('role'); 
                    setUser(null);
                    setError("Phiên đăng nhập của bạn đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
                    router.push('/auth/signin');
                }
            }
            setIsLoading(false);
        };

        validateToken();
    }, []);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.push('/auth/signin');
    };

    const value = { user, isLoading, logout };

    if (isLoading) {
        return <LoadingScreen />; 
    }

    if (error) {
      return (
        <ErrorDisplay 
          title="Lỗi Xác thực" 
          message={error}
          onRetry={() => {
            setError(null);
            router.push('/auth/signin');
          }}
        />
      );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};