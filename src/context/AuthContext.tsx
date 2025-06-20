"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api.customize'; 
import { userGetProfile } from '@/services/api';
import ErrorDisplay from '@/components/display/ErrorDisplay';
import LoadingScreen from '@/components/display/LoadingScreen';

interface AuthContextType {
    user: UserResponse | null;
    isLoading: boolean;
    logout: () => void;
    refreshUser: () => Promise<void>;
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
            console.log('AuthContext: validating token:', token ? 'Token exists' : 'No token');
              if (token) {
                try {
                    console.log('AuthContext: calling userGetProfile API...');
                    const response: UserResponse = await userGetProfile(); 
                    console.log('AuthContext: profile response:', response);
                    setUser(response);} catch (error) {
                    console.error("Token validation failed:", error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('role'); 
                    localStorage.removeItem('userId');
                    localStorage.removeItem('userEmail');
                    setUser(null);
                    setError("Phiên đăng nhập của bạn đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");                    router.push('/signin');
                }
            } else {
                console.log('AuthContext: No token found, user not authenticated');
            }
            console.log('AuthContext: setting isLoading to false');
            setIsLoading(false);
        };

        validateToken();
    }, []);    const refreshUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                console.log('AuthContext: refreshUser called');
                const response: UserResponse = await userGetProfile(); 
                console.log('AuthContext: refreshUser response:', response);
                setUser(response);
            } catch (error) {
                console.error("AuthContext: refreshUser failed:", error);
                setUser(null);
            }
        }
    };    const logout = () => {
        setUser(null);
        // Xóa tất cả localStorage items liên quan đến auth
        if (typeof window !== "undefined") {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('userId');
            localStorage.removeItem('userEmail');
        }
        router.push('/signin');
    };

    const value = { user, isLoading, logout, refreshUser };

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
            router.push('/signin');
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