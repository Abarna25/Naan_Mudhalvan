'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useAuthStore } from '@/store/useAuthStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!user || !isAuthenticated) {
      router.push('/');
      return;
    }

    const role = user.role;
    // Strict RBAC Route Guards
    if (pathname.startsWith('/dashboard/faculty') && role !== 'FACULTY' && role !== 'ADMIN') {
      router.push('/dashboard/student');
    } else if (pathname.startsWith('/dashboard/placement') && role !== 'PLACEMENT_OFFICER' && role !== 'ADMIN') {
      router.push('/dashboard/student');
    } else if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
      router.push('/dashboard/student');
    }
  }, [user, isAuthenticated, pathname, router]);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-2">
          {children}
        </main>
      </div>
    </div>
  );
}
