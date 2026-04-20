'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Layers, Box, LogOut, MessageSquare, Mail, PhoneCall } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Categories', href: '/categories', icon: Layers },
    { title: 'Products', href: '/products', icon: Box },
    { title: 'Product Enquiries', href: '/enquiries-product', icon: MessageSquare },
    { title: 'Normal Enquiries', href: '/enquiries-quick', icon: PhoneCall },
    { title: 'Contact Us', href: '/enquiries-contact', icon: Mail },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/login');
    };

    if (pathname === '/login') return null;

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white text-slate-900 border-r border-gray-200 shadow-sm">
            <div className="flex h-16 items-center justify-center border-b border-gray-100 px-6">
                <span className="text-xl font-bold tracking-tight text-indigo-600 uppercase">GHAUS ADMIN</span>
            </div>
            <nav className="mt-6 flex h-[calc(100%-80px)] flex-col justify-between px-4 pb-4">
                <ul className="space-y-1">
                    {menuItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200",
                                    pathname === item.href 
                                        ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100" 
                                        : "text-slate-500 hover:bg-gray-50 hover:text-slate-900"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition-all hover:bg-red-50 hover:text-red-700"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </nav>
        </aside>
    );
}
