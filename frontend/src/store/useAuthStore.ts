import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'FACULTY' | 'PLACEMENT_OFFICER' | 'ADMIN';
  department?: string;
  naanMudhalvanId?: string;
  profileId?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  theme: 'dark' | 'light';
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  toggleTheme: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'demo-student-id',
    name: 'Aravind Kumar',
    email: 'aravind.student@college.edu',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
    naanMudhalvanId: 'NM-2026-882341',
    profileId: 'demo-profile-id',
  },
  accessToken: 'demo-access-token',
  isAuthenticated: true,
  theme: 'dark',
  setAuth: (user, token) => set({ user, accessToken: token, isAuthenticated: true }),
  logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));
