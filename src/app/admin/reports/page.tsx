import React from 'react';
import ProtectedRoute, { Role } from '@/components/ProtectedRoute';
import AdminHeader from '@/components/header/AdminHeader';
import TransactionReport from '@/components/TransactionReport';

const AdminReportsPage = () => {
    return (
        <ProtectedRoute requiredRole={Role.ADMIN}>
            <div className="min-h-screen bg-gray-50">
                <div className="fixed top-0 left-0 right-0 z-[100]">
                    <AdminHeader />
                </div>
                <div className="w-full" style={{marginTop: '5rem'}}>
                    <TransactionReport isAdmin={true} />
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default AdminReportsPage;
