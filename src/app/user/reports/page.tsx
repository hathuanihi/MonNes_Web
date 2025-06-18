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
                </div>                <div className="w-full" style={{marginTop: '5rem'}}>
                    <h1
                        className="w-full text-center text-3xl md:text-4xl font-bold text-white py-5 md:py-6 rounded-b-2xl shadow-lg"
                        style={{
                            background: "linear-gradient(90deg, #FF086A 0%, #FB5D5D 50%, #F19BDB 100%)",
                        }}
                    >
                        BÁO CÁO GIAO DỊCH
                    </h1>
                </div>
                <div className="w-full">
                    <TransactionReport isAdmin={false} />
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default UserReportsPage;
