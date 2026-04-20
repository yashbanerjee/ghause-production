import EnquiryTable from "@/components/EnquiryTable";
import AuthGuard from "@/components/AuthGuard";

export default function ContactSubmissionsPage() {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-slate-50/50 pb-12">
                <EnquiryTable type="CONTACT" title="Contact Us Submissions" />
            </div>
        </AuthGuard>
    );
}
