import EnquiryTable from "@/components/EnquiryTable";
import AuthGuard from "@/components/AuthGuard";

export default function ProductEnquiriesPage() {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-slate-50/50 pb-12">
                <EnquiryTable type="PRODUCT" title="Product Enquiries" />
            </div>
        </AuthGuard>
    );
}
