'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('adminToken');
            const isLoginPage = pathname === '/login';

            if (!token && !isLoginPage) {
                setAuthorized(false);
                router.push('/login');
            } else {
                setAuthorized(true);
            }
        };

        checkAuth();
    }, [pathname, router]);

    // Show nothing while checking auth to prevent UI flicker
    if (!authorized && pathname !== '/login') {
        return <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-400">Loading...</div>;
    }

    return <>{children}</>;
}
