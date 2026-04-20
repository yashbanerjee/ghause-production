'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { X, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Category {
    id: string;
    nameEn: string;
}

interface ProductFormProps {
    editId?: string | null;
    initialData?: any;
    onSuccess?: () => void;
}

export default function ProductForm({ editId, initialData, onSuccess }: ProductFormProps) {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        nameEn: '', nameAr: '', descriptionEn: '', descriptionAr: '', categoryId: '', isFeatured: false
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [catalogFiles, setCatalogFiles] = useState<FileList | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories?all=true');
                // Defensive: Handle both flat array and paginated object shapes
                const categoryList = Array.isArray(data) ? data : (data.data || []);
                setCategories(categoryList);
            } catch (err) {
                toast.error('Failed to fetch categories');
            }
        };
        fetchCategories();

        if (initialData) {
            setFormData({
                nameEn: initialData.nameEn || '',
                nameAr: initialData.nameAr || '',
                descriptionEn: initialData.descriptionEn || '',
                descriptionAr: initialData.descriptionAr || '',
                categoryId: initialData.categoryId || '',
                isFeatured: initialData.isFeatured || false
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.categoryId) return toast.error('Please select a category');
        setLoading(true);

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value.toString());
        });
        if (imageFile) data.append('image', imageFile);
        if (catalogFiles) {
            Array.from(catalogFiles).forEach(file => data.append('catalogs', file));
        }

        try {
            if (editId) {
                await api.put(`/products/${editId}`, data);
                toast.success('Product updated');
            } else {
                await api.post('/products', data);
                toast.success('Product created');
            }
            if (onSuccess) onSuccess();
            else router.push('/products');
        } catch (err) {
            toast.error('Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Name (English)</label>
                    <input
                        type="text"
                        required
                        value={formData.nameEn}
                        onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 shadow-sm transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Name (Arabic)</label>
                    <input
                        type="text"
                        required
                        value={formData.nameAr}
                        onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 shadow-sm transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700">Category</label>
                <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 shadow-sm transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                    <option value="">Select Category</option>
                    {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nameEn}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Description (English)</label>
                    <textarea
                        rows={3}
                        value={formData.descriptionEn}
                        onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 shadow-sm transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Description (Arabic)</label>
                    <textarea
                        rows={3}
                        value={formData.descriptionAr}
                        onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 shadow-sm transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Product Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        className="mt-1 block w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Catalog Files (PDFs/Images)</label>
                    <input
                        type="file"
                        multiple
                        onChange={(e) => setCatalogFiles(e.target.files || null)}
                        className="mt-1 block w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                    <label className="text-sm font-bold text-gray-900 block">Featured Product</label>
                    <p className="text-xs text-gray-500">Feature this product in the website footer</p>
                </div>
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        formData.isFeatured ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.isFeatured ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                <button type="button" onClick={() => router.back()} className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                <button disabled={loading} type="submit" className="rounded-lg bg-indigo-600 px-8 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 transition">
                    {loading ? 'Saving...' : (editId ? 'Update Product' : 'Create Product')}
                </button>
            </div>
        </form>
    );
}
