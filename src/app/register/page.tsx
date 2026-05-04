'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Phone, Lock, Loader2, ArrowRight } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiFetch('/user/register', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      router.push('/login?registered=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl bg-white rounded-[3.5rem] p-12 lg:p-16 shadow-sm border border-white fade-in">
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="text-[12px] font-black tracking-[0.4em] text-gray-400 uppercase">ShopDB</div>
            <h1 className="text-4xl font-black text-black tracking-tight">Create account</h1>
            <p className="text-gray-400 text-sm font-bold">Start your journey today.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-5 rounded-3xl text-xs font-black uppercase tracking-widest text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl text-sm font-bold focus:ring-4 focus:ring-black/5 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" />
                  <input
                    type="text"
                    placeholder="johndoe"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl text-sm font-bold focus:ring-4 focus:ring-black/5 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl text-sm font-bold focus:ring-4 focus:ring-black/5 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" />
                  <input
                    type="tel"
                    placeholder="0812..."
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl text-sm font-bold focus:ring-4 focus:ring-black/5 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl text-sm font-bold focus:ring-4 focus:ring-black/5 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-black text-white rounded-full text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 disabled:opacity-30 shadow-xl shadow-gray-200"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Create Account
            </button>
          </form>

          <div className="pt-8 text-center border-t border-gray-50">
            <p className="text-gray-400 text-[11px] font-bold">
              Already have an account?{' '}
              <Link href="/login" className="text-black hover:underline underline-offset-4 decoration-2">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}