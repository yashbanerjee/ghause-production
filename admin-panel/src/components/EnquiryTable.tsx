'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { 
    Eye, 
    Trash2, 
    CheckCircle2, 
    Circle, 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Globe, 
    MessageSquare,
    Building,
    Hash,
    X,
    Search,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

interface Enquiry {
    id: string;
    type: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    company?: string;
    subject?: string;
    country?: string;
    comment: string;
    productName?: string;
    status: string;
    createdAt: string;
}

interface PaginationData {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
}

interface EnquiryTableProps {
    type: 'PRODUCT' | 'QUICK' | 'CONTACT';
    title: string;
}

export default function EnquiryTable({ type, title }: EnquiryTableProps) {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    const fetchEnquiries = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/enquiries?type=${type}&page=${page}&limit=10&search=${searchTerm}`);
            setEnquiries(data.data || []);
            setPagination(data.pagination || null);
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message || "Failed to fetch enquiries";
            toast.error(`Fetch Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    }, [type, page, searchTerm]);

    useEffect(() => {
        // Debounce search
        const timeout = setTimeout(() => {
            fetchEnquiries();
        }, searchTerm ? 500 : 0);
        return () => clearTimeout(timeout);
    }, [fetchEnquiries]);

    // Reset page when search changes
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    const handleMarkAsRead = async (id: string, currentStatus: string) => {
        if (currentStatus === 'read') return;
        try {
            await api.patch(`/enquiries/${id}`, { status: 'read' });
            setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: 'read' } : e));
            toast.success('Marked as read');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this enquiry?')) return;
        try {
            await api.delete(`/enquiries/${id}`);
            fetchEnquiries(); // Refresh to handle pagination correctly
            toast.success('Enquiry deleted');
        } catch (error) {
            toast.error('Failed to delete enquiry');
        }
    };

    return (
        <div className="p-6">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and view all incoming submissions</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search enquiries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-64 shadow-sm"
                        />
                    </div>
                    <div className="hidden md:block rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-bold text-indigo-700 border border-indigo-100 shadow-sm whitespace-nowrap">
                        {pagination?.total || 0} SUBMISSIONS
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                <div className="flex-grow overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Email</th>
                                {type === 'PRODUCT' && <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Product</th>}
                                {type === 'CONTACT' && <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Subject</th>}
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Date</th>
                                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="flex justify-center">
                                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (enquiries?.length || 0) === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center text-slate-400">
                                        No enquiries found.
                                    </td>
                                </tr>
                            ) : (
                                enquiries.map((enquiry) => (
                                    <tr key={enquiry.id} className={`${enquiry.status === 'unread' ? 'bg-indigo-50/20' : 'hover:bg-slate-50'} transition-colors group`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {enquiry.status === 'unread' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider border border-indigo-200 shadow-sm">
                                                    <Circle className="h-1.5 w-1.5 fill-current" />
                                                    New
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wider border border-slate-200">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Read
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{enquiry.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{enquiry.email}</td>
                                        {type === 'PRODUCT' && <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 truncate max-w-[200px]">{enquiry.productName}</td>}
                                        {type === 'CONTACT' && <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 truncate max-w-[200px]">{enquiry.subject}</td>}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(enquiry.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedEnquiry(enquiry);
                                                        handleMarkAsRead(enquiry.id, enquiry.status);
                                                    }}
                                                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all shadow-sm border border-transparent hover:border-indigo-100"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(enquiry.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all shadow-sm border border-transparent hover:border-red-100"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
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
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Showing <span className="text-slate-900">{(page - 1) * 10 + 1}</span> to <span className="text-slate-900">{Math.min(page * 10, pagination.total)}</span> of <span className="text-slate-900">{pagination.total}</span> entries
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setPage(prev => Math.min(pagination.pages, prev + 1))}
                                disabled={page === pagination.pages}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Next <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* View Details Modal */}
            {selectedEnquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                                    <MessageSquare className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <h2 className="text-xl font-bold text-slate-900">Enquiry Details</h2>
                                    <p className="text-xs text-slate-500 mt-0.5 font-medium uppercase tracking-wider">
                                        Submitted on {new Date(selectedEnquiry.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedEnquiry(null)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6 text-left">
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 rounded-md bg-slate-50 text-slate-400">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Full Name</p>
                                            <p className="text-slate-900 font-bold">{selectedEnquiry.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 rounded-md bg-slate-50 text-slate-400">
                                            <Mail size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Email Address</p>
                                            <a href={`mailto:${selectedEnquiry.email}`} className="text-indigo-600 font-bold hover:underline">{selectedEnquiry.email}</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 rounded-md bg-slate-50 text-slate-400">
                                            <Phone size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Phone Number</p>
                                            <p className="text-slate-900 font-bold">{selectedEnquiry.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 text-left">
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 rounded-md bg-slate-50 text-slate-400">
                                            <MapPin size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Address / City</p>
                                            <p className="text-slate-900 font-bold">{selectedEnquiry.address || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 rounded-md bg-slate-50 text-slate-400">
                                            <Globe size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Country</p>
                                            <p className="text-slate-900 font-bold">{selectedEnquiry.country || 'N/A'}</p>
                                        </div>
                                    </div>
                                    {selectedEnquiry.company && (
                                        <div className="flex items-start gap-3">
                                            <div className="p-1.5 rounded-md bg-slate-50 text-slate-400">
                                                <Building size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Company</p>
                                                <p className="text-slate-900 font-bold">{selectedEnquiry.company}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-6 text-left">
                                {selectedEnquiry.productName && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-400">
                                            <Hash size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Related Product</p>
                                            <p className="text-indigo-700 font-extrabold uppercase text-xs">{selectedEnquiry.productName}</p>
                                        </div>
                                    </div>
                                )}
                                {selectedEnquiry.subject && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Subject</p>
                                        <p className="text-slate-900 font-extrabold">{selectedEnquiry.subject}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Message / Comment</p>
                                    <div className="text-slate-700 whitespace-pre-wrap leading-relaxed bg-white p-4 rounded-xl border border-slate-100 shadow-sm italic">
                                        "{selectedEnquiry.comment}"
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button 
                                onClick={() => setSelectedEnquiry(null)}
                                className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                            >
                                Close Window
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
