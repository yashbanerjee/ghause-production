'use client';

import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";
import { usePathname } from "next/navigation";
import "./globals.css";
import { Toaster } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-gray-50">
        <AuthGuard>
          <Toaster position="top-right" />
          {!isLoginPage && <Sidebar />}
          <main className={`transition-all duration-300 ${!isLoginPage ? 'md:pl-64' : ''}`}>
            <div className="min-h-screen p-8">{children}</div>
          </main>
        </AuthGuard>
      </body>
    </html>
  );
}
