import React, { useEffect } from 'react'
import { useAuth } from '../src/hooks/useAuth'
import Header from '../src/components/Layout/Header'
import MenuView from '../src/components/Menu/MenuView'
import LoginButton from '../src/components/Auth/LoginButton'
import { useRouter } from 'next/router'

export default function Home() {
    const { isAuthenticated, isLoading, hasRole } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isAuthenticated) {
            if (hasRole('admin')) {
                router.push('/admin')
            } else if (hasRole('veterinario')) {
                router.push('/pedidos')
            } else if (hasRole('cliente')) {
                router.push('/menu')
            }
        }
    }, [isAuthenticated, hasRole, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-clinic-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clinic-600 mx-auto"></div>
                    <p className="mt-4 text-slate-500">Cargando...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-clinic-50">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {!isAuthenticated ? (
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-clinic-900 mb-8">
                            Bienvenido a VetOnline
                        </h1>
                        <div className="mb-8">
                            <MenuView />
                        </div>
                    </div>
                ) : (
                    <MenuView />
                )}
            </main>
        </div>
    )
} 