'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, LogOut } from 'lucide-react';
import { clearSession, getSession, type UserSession } from '@/lib/api';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    setUser(getSession());
  }, [pathname]);

  function handleLogout() {
    clearSession();
    router.push('/login');
  }

  const navLinks = [
    { href: '/items', label: 'Catalog' },
    { href: '/dashboard', label: 'My Orders' },
  ];

  return (
    <header className="bg-[#f5f0e6] h-24 flex items-center sticky top-0 z-40 px-4 sm:px-8">
      <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between bg-white rounded-full px-8 py-4 shadow-sm border border-white/50">

        <nav className="flex items-center gap-10">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`text-[13px] font-black uppercase tracking-widest transition-all ${
                  active ? 'text-black' : 'text-gray-300 hover:text-black'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <Link href="/items" className="absolute left-1/2 -translate-x-1/2">
          <span className="text-xl font-black tracking-[0.3em] text-black">SHOPDB</span>
        </Link>

        <div className="flex items-center gap-6">
          {user && (
            <div className="hidden sm:flex flex-col items-end">
               <span className="text-[11px] font-black text-black uppercase tracking-tight">{user.name}</span>
               <span className="text-[10px] font-bold text-emerald-600">{ (user.balance ?? 0).toLocaleString() } IDR</span>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-black hover:bg-gray-100 transition-colors">
              <ShoppingBag className="w-4 h-4" />
            </Link>
            <button
              onClick={handleLogout}
              className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full hover:scale-105 transition-transform"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}