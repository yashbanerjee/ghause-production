'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Layers, Box } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({ categories: 0, products: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [cats, prods] = await Promise.all([
                    api.get('/categories?limit=1'),
                    api.get('/products?limit=1')
                ]);
                setStats({
                    categories: cats.data.pagination?.total ?? (Array.isArray(cats.data) ? cats.data.length : 0),
                    products: prods.data.pagination?.total ?? (Array.isArray(prods.data) ? prods.data.length : 0)
                });
            } catch (err) {
                console.error('Error fetching stats:', err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                        <Layers className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Categories</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.categories}</p>
                    </div>
                </div>
                <div className="flex items-center rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                        <Box className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Products</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.products}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
