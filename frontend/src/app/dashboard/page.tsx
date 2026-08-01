'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function DashboardRedirectPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/');
      return;
    }

    switch (user.role) {
      case 'STUDENT':
        router.replace('/dashboard/student');
        break;
      case 'FACULTY':
        router.replace('/dashboard/faculty');
        break;
      case 'PLACEMENT_OFFICER':
        router.replace('/dashboard/placement');
        break;
      case 'ADMIN':
        router.replace('/dashboard/admin');
        break;
      default:
        router.replace('/dashboard/student');
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 mx-auto flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-400 text-sm">Redirecting to your portal...</p>
      </div>
    </div>
  );
}
