import React from 'react';
import { useAuth } from '../src/hooks/useAuth';
import Header from '../src/components/Layout/Header';
import MenuView from '../src/components/Menu/MenuView';

export default function MenuPage() {
    const { isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-clinic-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-3 border-clinic-200 border-t-clinic-600 rounded-full animate-spin mx-auto" style={{ borderWidth: 3 }} />
                    <p className="text-slate-500 text-sm font-medium">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-clinic-50">
            <Header />
            <main className="container mx-auto px-4 py-10">
                <MenuView />
            </main>
        </div>
    );
}
