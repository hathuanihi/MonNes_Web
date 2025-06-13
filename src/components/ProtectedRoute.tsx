"use client";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; 
import { ReactNode } from 'react';

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: Role;
    isGuestRoute?: boolean;
}

const ProtectedRoute = ({ children, requiredRole, isGuestRoute }: ProtectedRouteProps) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    if (isLoading) {
        return <div>Checking permissions...</div>; 
    }

    const isAuthenticated = !!user;
    const userRole = user?.vaiTro;

    if (isAuthenticated) {
        if (isGuestRoute) {
            router.push(userRole === Role.ADMIN ? '/admin/home' : '/user/home');
            return null; 
        }
        if (requiredRole && userRole !== requiredRole) {
            alert("Bạn không có quyền truy cập trang này.");
            router.push(userRole === Role.ADMIN ? '/admin/home' : '/user/home');
            return null;
        }
    } else {
        if (!isGuestRoute) {
            router.push('/auth/signin');
            return null;
        }
    }
    
    return <>{children}</>;
};

export default ProtectedRoute;