"use client";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; 
import { ReactNode, useEffect } from 'react';
import LoadingScreen from './display/LoadingScreen';

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
    useEffect(() => {
        if (isLoading) return;

        const isAuthenticated = !!user;
        const userRole = user?.vaiTro;

        console.log('ProtectedRoute:', { isAuthenticated, userRole, requiredRole, isGuestRoute });

        if (isAuthenticated) {
            if (isGuestRoute) {
                const redirectPath = userRole === Role.ADMIN ? '/admin/home' : '/user/home';
                console.log('Redirecting authenticated user from guest route to:', redirectPath);
                router.push(redirectPath);
                return;
            }
            if (requiredRole && userRole !== requiredRole) {
                console.log('User role mismatch, redirecting...');
                alert("Bạn không có quyền truy cập trang này.");
                router.push(userRole === Role.ADMIN ? '/admin/home' : '/user/home');
                return;
            }
        } else {
            if (!isGuestRoute) {
                console.log('User not authenticated, redirecting to signin...');
                router.push('/signin');
                return;
            }
        }
    }, [user, isLoading, requiredRole, isGuestRoute, router]);if (isLoading) {
        return <div>Checking permissions...</div>; 
    }

    const isAuthenticated = !!user;
    const userRole = user?.vaiTro;

    // Chỉ render loading/redirect states sau khi isLoading = false
    if (isAuthenticated && isGuestRoute) {
        return <LoadingScreen />;
    }

    if (isAuthenticated && requiredRole && userRole !== requiredRole) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated && !isGuestRoute) {
        return <LoadingScreen />;
    }
    
    return <>{children}</>;
};

export default ProtectedRoute;