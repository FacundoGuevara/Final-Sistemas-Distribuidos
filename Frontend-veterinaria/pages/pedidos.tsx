import React from 'react';
import { useAuth } from '../src/hooks/useAuth';
import Header from '../src/components/Layout/Header';
import OrdersView from '../src/components/Orders/OrdersView';
import { useRouter } from 'next/router';

export default function PedidosPage() {
    const { isAuthenticated, isLoading, hasRole } = useAuth();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-clinic-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clinic-600 mx-auto"></div>
                    <p className="mt-4 text-slate-500">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        router.push('/');
        return null;
    }

    if (!hasRole('veterinario') && !hasRole('admin')) {
        return (
            <div className="min-h-screen bg-clinic-50">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
                        <p className="text-slate-500">No tienes permisos para acceder a esta página.</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-clinic-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <OrdersView />
            </main>
        </div>
    );
} 