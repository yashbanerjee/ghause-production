'use client';

import ProductForm from "@/components/ProductForm";

export default function AddProductPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-gray-500 mt-1">Fill in the details below to create a new fire safety product.</p>
            </div>
            <ProductForm />
        </div>
    );
}
