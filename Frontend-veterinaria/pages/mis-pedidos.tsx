import React from 'react';
import { useAuth } from '../src/hooks/useAuth';
import Header from '../src/components/Layout/Header';
import OrdersView from '../src/components/Orders/OrdersView';
import { useRouter } from 'next/router';

export default function MisPedidosPage() {
    const { isAuthenticated, isLoading, hasRole } = useAuth();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-clinic-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-clinic-200 border-t-clinic-600 rounded-full animate-spin mx-auto" style={{ borderWidth: 3 }} />
                    <p className="text-slate-500 text-sm font-medium">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        router.push('/');
        return null;
    }

    if (!hasRole('cliente')) {
        return (
            <div className="min-h-screen bg-clinic-50">
                <Header />
                <main className="container mx-auto px-4 py-20">
                    <div className="text-center space-y-3">
                        <div className="text-5xl">🔒</div>
                        <h1 className="text-2xl font-bold text-clinic-900">Acceso Denegado</h1>
                        <p className="text-slate-500">No tenés permisos para acceder a esta página.</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-clinic-50">
            <Header />
            <main className="container mx-auto px-4 py-10">
                <OrdersView userView />
            </main>
        </div>
    );
}
