import React from 'react';
import ProtectedRoute, { Role } from '@/components/ProtectedRoute';
import UserHeader from '@/components/header/UserHeader';
import TransactionReport from '@/components/TransactionReport';

const UserReportsPage = () => {
    return (
        <ProtectedRoute requiredRole={Role.USER}>
            <div className="min-h-screen bg-gray-50">
                <div className="fixed top-0 left-0 right-0 z-[100]">
                    <UserHeader />
                </div>
                <div className="w-full" style={{marginTop: '4rem'}}>
                    <TransactionReport isAdmin={false} />
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default UserReportsPage;
