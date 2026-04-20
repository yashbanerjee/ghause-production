'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { Plus, Edit, Trash2, X, FileText, Image as ImageIcon, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/ProductForm';

interface Product {
    id: string;
    nameEn: string;
    nameAr: string;
    descriptionEn: string;
    descriptionAr: string;
    image: string | null;
    categoryId: string;
    category: { nameEn: string };
    catalogs: string[];
    isActive: boolean;
    isFeatured: boolean;
}

interface PaginationData {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
}

export default function ProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/products?page=${page}&limit=10&search=${searchTerm}`);
            setProducts(data.data || []);
            setPagination(data.pagination || null);
        } catch (err) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchData();
        }, searchTerm ? 500 : 0);
        return () => clearTimeout(timeout);
    }, [fetchData]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    const handleEdit = (prod: Product) => {
        setEditingProduct(prod);
        setShowEditModal(true);
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await api.patch(`/products/${id}/status`, { isActive: !currentStatus });
            toast.success(`Product ${!currentStatus ? 'activated' : 'deactivated'}`);
            setProducts(products.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));
        } catch (err) {
            toast.error('Status update failed');
        }
    };

    const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
        try {
            const formData = new FormData();
            formData.append('isFeatured', (!currentStatus).toString());
            await api.put(`/products/${id}`, formData);
            toast.success(`Product ${!currentStatus ? 'featured' : 'unfeatured'}`);
            setProducts(products.map(p => p.id === id ? { ...p, isFeatured: !currentStatus } : p));
        } catch (err) {
            toast.error('Featured update failed');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success('Product deleted');
            fetchData();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    const handleDeleteCatalog = async (productId: string, fileUrl: string) => {
        if (!confirm('Delete this catalog file?')) return;
        try {
            await api.delete(`/products/catalogs/delete`, { data: { productId, fileUrl } });
            
            // Immediately update the local state for the modal view
            if (editingProduct && editingProduct.id === productId) {
                setEditingProduct({
                    ...editingProduct,
                    catalogs: editingProduct.catalogs.filter(url => url !== fileUrl)
                });
            }

            toast.success('Catalog file deleted');
            fetchData();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="space-y-6 text-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Products Listing</h1>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-64 shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => router.push('/products/add')}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 transition whitespace-nowrap tracking-widest uppercase text-xs"
                    >
                        <Plus className="h-4 w-4" />
                        Add Product
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm min-h-[400px] flex flex-col">
                <div className="flex-grow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Image</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Name (EN)</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Featured</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Catalogs</th>
                                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white text-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex justify-center">
                                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (products?.length || 0) === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-500 italic">No products found.</td>
                                </tr>
                            ) : (
                                products?.map((prod) => (
                                    <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            {prod.image ? (
                                                <img 
                                                    src={prod.image.startsWith('http') ? prod.image : `${process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '')}/uploads/${prod.image}`} 
                                                    alt="" 
                                                    className="h-10 w-10 object-cover rounded-lg border border-gray-100 shadow-sm" 
                                                />
                                            ) : (
                                                <div className="h-10 w-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100"><ImageIcon className="h-5 w-5 text-gray-300" /></div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">{prod.nameEn}</div>
                                            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{prod.nameAr}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold uppercase tracking-widest">{prod.category?.nameEn}</span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <button 
                                                onClick={() => handleToggleFeatured(prod.id, prod.isFeatured)}
                                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                                    prod.isFeatured ? 'bg-indigo-600' : 'bg-gray-200'
                                                }`}
                                                title={prod.isFeatured ? 'Featured' : 'Not Featured'}
                                            >
                                                <span
                                                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                                        prod.isFeatured ? 'translate-x-5' : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <div className="flex -space-x-1">
                                                {prod.catalogs.map((url, idx) => (
                                                    <div key={idx} title={url} className="h-7 w-7 rounded-full bg-orange-50 border border-white flex items-center justify-center text-orange-600 shadow-sm">
                                                        <FileText className="h-3.5 w-3.5" />
                                                    </div>
                                                ))}
                                                {prod.catalogs.length === 0 && <span className="text-[10px] text-gray-400 italic font-medium uppercase tracking-widest">No catalogs</span>}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-3">
                                                <button 
                                                    onClick={() => handleToggleStatus(prod.id, prod.isActive)}
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                                        prod.isActive 
                                                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                                                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {prod.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                                <button onClick={() => handleEdit(prod)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all border border-transparent hover:border-indigo-100"><Edit className="h-4 w-4" /></button>
                                                <button onClick={() => handleDelete(prod.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {pagination && pagination.pages > 1 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                            Showing <span className="text-gray-900">{(page - 1) * 10 + 1}</span> to <span className="text-gray-900">{Math.min(page * 10, pagination.total)}</span> of <span className="text-gray-900">{pagination.total}</span> entries
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="h-4 w-4" /> Prev
                            </button>
                            <div className="flex gap-1">
                                {[...Array(pagination.pages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setPage(i + 1)}
                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                            page === i + 1 
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                                            : 'bg-white border border-gray-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setPage(prev => Math.min(pagination.pages, prev + 1))}
                                disabled={page === pagination.pages}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Next <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showEditModal && editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="mb-6 flex items-center justify-between border-b pb-4">
                            <h2 className="text-xl font-bold text-gray-900">Edit Product: {editingProduct.nameEn}</h2>
                            <button onClick={() => setShowEditModal(false)} className="rounded-full p-2 hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
                        </div>
                        
                        {/* Current Catalogs Section for Editing */}
                        {editingProduct.catalogs.length > 0 && (
                            <div className="mb-8 p-6 bg-orange-50/30 rounded-2xl border border-orange-100 text-left">
                                <label className="text-[10px] font-bold uppercase text-orange-700 tracking-widest mb-4 block">Current Catalogs (Click X to remove)</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {editingProduct.catalogs.map((url, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-orange-100 shadow-sm group">
                                            <span className="text-[10px] font-bold text-orange-800 truncate flex-grow mr-2 tracking-tight">{url.split('/').pop()}</span>
                                            <button type="button" onClick={() => handleDeleteCatalog(editingProduct.id, url)} className="text-red-400 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded-lg">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <ProductForm 
                            editId={editingProduct.id} 
                            initialData={editingProduct} 
                            onSuccess={() => { setShowEditModal(false); fetchData(); }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
