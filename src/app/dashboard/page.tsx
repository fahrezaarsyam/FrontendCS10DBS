'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, ShoppingBag, Loader2, RefreshCw, ArrowLeft, CreditCard, CheckCircle2, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { apiFetch, getSession, getToken, saveSession, type UserSession } from '@/lib/api';
import { getItemImage } from '@/lib/images';

interface Transaction {
  id: number;
  item_name: string;
  quantity: number;
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
}

function formatIDR(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<Partial<UserSession> | null>(null);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    setUser(getSession());
  }, [router]);

  const fetchProfile = useCallback(async () => {
    const session = getSession();
    if (!session) return;
    setLoadingProfile(true);
    try {
      const res = await apiFetch<UserSession>(`/user/${session.email}`);
      setProfile(res.payload);
      if (res.payload.balance !== session.balance) {
        saveSession({ ...session, balance: res.payload.balance });
      }
    } catch {
      setProfile(session);
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await apiFetch<Transaction[]>('/user/history');
      setHistory(res.payload);
    } catch { /* ignore */ }
    finally { setLoadingHistory(false); }
  }, []);

  useEffect(() => {
    if (user) { fetchProfile(); fetchHistory(); }
  }, [user, fetchProfile, fetchHistory]);

  async function handleTopUp(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) return;

    setTopUpLoading(true);
    try {
      await apiFetch('/user/top-up', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });
      setToast('Funds added successfully');
      setTopUpAmount('');
      fetchProfile();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Top up failed');
    } finally {
      setTopUpLoading(false);
    }
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const displayUser = profile ?? user;

  return (
    <div className="min-h-screen bg-[#f5f0e6] flex flex-col pb-20 font-sans text-black">
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 w-full fade-in pt-10">

        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <button onClick={() => router.back()} className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform border border-white">
              <ArrowLeft className="w-5 h-5 text-black" />
            </button>
            <h1 className="text-4xl font-black text-black">My Dashboard</h1>
          </div>
          <button onClick={() => { fetchProfile(); fetchHistory(); }} className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm hover:rotate-180 transition-all duration-700 border border-white">
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {toast && (
          <div className="fixed bottom-10 right-10 z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="bg-black text-white px-10 py-5 rounded-full shadow-2xl flex items-center gap-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-black tracking-tight">{toast}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          <div className="lg:col-span-4 space-y-10">

            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-white">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] flex items-center justify-center overflow-hidden border border-gray-100 shadow-inner">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${displayUser?.name}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-black tracking-tight">{displayUser?.name}</h2>
                  <p className="text-gray-400 text-sm font-bold mt-1 tracking-widest uppercase">@{displayUser?.username}</p>
                </div>
                <div className="w-full pt-8 border-t border-gray-50 flex flex-col gap-4 text-left">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Email</span>
                    <span className="text-sm font-bold text-black">{displayUser?.email}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Phone</span>
                    <span className="text-sm font-bold text-black">{displayUser?.phone || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-white">
              <div className="space-y-8">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center"><Wallet className="w-7 h-7 text-black" /></div>
                  <CreditCard className="w-6 h-6 text-gray-200" />
                </div>

                <div>
                  <span className="text-4xl font-black text-black block">{formatIDR(displayUser?.balance ?? 0)}</span>
                  <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest mt-1">Total Available Funds</p>
                </div>

                <form onSubmit={handleTopUp} className="space-y-3 pt-6 border-t border-gray-50">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">Rp</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={topUpAmount}
                      onChange={e => setTopUpAmount(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-black/5 outline-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={topUpLoading || !topUpAmount}
                    className="w-full py-4 bg-black text-white rounded-full text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-30 hover:scale-[1.02] transition-transform"
                  >
                    {topUpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add Funds
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-[3.5rem] shadow-sm border border-white overflow-hidden">
              <div className="px-10 py-10 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-xl font-black text-black">Order History</h3>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{history.length} transactions</span>
              </div>
              <div className="divide-y divide-gray-50">
                {loadingHistory ? (
                  <div className="p-32 text-center"><Loader2 className="w-12 h-12 animate-spin mx-auto text-gray-100" /></div>
                ) : history.length === 0 ? (
                  <div className="p-32 text-center flex flex-col items-center space-y-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center"><ShoppingBag className="w-10 h-10 text-gray-100" /></div>
                    <p className="text-gray-400 text-sm font-bold">No orders found.</p>
                    <button onClick={() => router.push('/items')} className="px-8 py-3 bg-black text-white rounded-full text-xs font-black uppercase tracking-widest">Start Shopping</button>
                  </div>
                ) : (
                  history.map(tx => (
                    <div key={tx.id} className="p-10 hover:bg-gray-50/50 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform overflow-hidden">
                          <img
                            src={getItemImage(tx.item_name)}
                            alt={tx.item_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="text-2xl font-black text-black leading-tight">{tx.item_name}</h4>
                          <div className="flex items-center gap-4">
                            <span className="text-[11px] font-bold text-gray-400">{formatDate(tx.created_at)}</span>
                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm ${tx.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                              }`}>{tx.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-black">{formatIDR(tx.total)}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{tx.quantity} pcs</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}