'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Search, Bell, Sun, Moon, ShieldCheck } from 'lucide-react';
import { SearchModal } from '../search/SearchModal';

export const Header = () => {
  const { user, theme, toggleTheme } = useAuthStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      document.body.style.backgroundColor = '#020617';
      document.body.style.color = '#f8fafc';
    }
  }, [theme]);

  return (
    <>
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        {/* Search Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center space-x-3 px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all text-xs w-72"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Search students, skills, certificates...</span>
          <kbd className="ml-auto px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-mono">⌘K</kbd>
        </button>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-4">
          {/* Authenticated User Badge & Role (No unauthorized role switcher dropdown!) */}
          {user && (
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-slate-700 dark:text-slate-200">{user.name}</span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-blue-600/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                {user.role}
              </span>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-4 z-50 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Notifications</h4>
                  <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded">2 New</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
                    <p className="font-medium text-slate-800 dark:text-slate-200">Portfolio Verified</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Faculty Dr. Malathi approved your Smart Traffic AI project.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
                    <p className="font-medium text-slate-800 dark:text-slate-200">Naan Mudhalvan Assessment Updated</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Your Employment Score increased to 88% (+4%).</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
