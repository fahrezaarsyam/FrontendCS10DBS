'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Package, ShoppingCart, Loader2, CheckCircle2, Search, ShoppingBag, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { apiFetch, getSession } from '@/lib/api';
import { getItemImage } from '@/lib/images';

interface Item {
  id: number;
  name: string;
  price: number;
  stock: number;
  description?: string;
}

interface Toast {
  type: 'success' | 'error';
  msg: string;
}

interface BuyState {
  itemId: number;
  quantity: number;
}

function formatIDR(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

export default function ItemsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [filtered, setFiltered] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast | null>(null);
  const [buying, setBuying] = useState<BuyState | null>(null);
  const [buyLoading, setBuyLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch<Item[]>('/items');
      setItems(res.payload);
      setFiltered(res.payload);
    } catch (err) {
      setToast({ type: 'error', msg: 'Failed to load catalog' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(items.filter(i => i.name.toLowerCase().includes(s) || i.description?.toLowerCase().includes(s)));
  }, [search, items]);

  async function handleBuy() {
    if (!buying) return;
    const user = getSession();
    if (!user) { router.push('/login'); return; }

    setBuyLoading(true);
    try {
      const txRes = await apiFetch<{ id: number }>('/transaction/create', {
        method: 'POST',
        body: JSON.stringify({
          user_id: user.id,
          item_id: buying.itemId,
          quantity: buying.quantity,
          description: 'EStore Catalog Order',
        }),
      });

      await apiFetch(`/transaction/pay/${txRes.payload.id}`, {
        method: 'POST',
      });

      setToast({ type: 'success', msg: 'Order completed!' });
      setBuying(null);
      fetchItems();
    } catch (err) {
      setToast({ type: 'error', msg: err instanceof Error ? err.message : 'Purchase failed' });
    } finally {
      setBuyLoading(false);
    }
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="min-h-screen bg-[#f5f0e6] flex flex-col font-sans text-black">
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 w-full pt-12 pb-24 fade-in">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="text-[12px] font-black tracking-[0.4em] text-gray-400 uppercase">Marketplace</div>
            <h1 className="text-6xl font-black text-black tracking-tighter leading-none">Product Catalog</h1>
          </div>

          <div className="relative group max-w-md w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-black transition-colors" />
            <input
              type="text"
              placeholder="Search infrastructure..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-6 bg-white border-none rounded-full text-sm font-bold shadow-sm focus:ring-4 focus:ring-black/5 outline-none transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <Loader2 className="w-12 h-12 animate-spin text-gray-200" />
            <p className="text-xs font-black uppercase tracking-widest text-gray-300">Synchronizing database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-40 space-y-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
               <ShoppingBag className="w-8 h-8 text-gray-200" />
            </div>
            <p className="text-gray-400 font-bold">No assets found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-white flex flex-col"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-gray-50">
                  <img
                    src={getItemImage(item.name)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-8 right-8 bg-black text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-500">
                    {item.stock} in stock
                  </div>
                </div>

                <div className="p-10 space-y-6 flex-1 flex flex-col">
                  <div className="flex-1 space-y-3">
                    <h2 className="text-2xl font-black text-black tracking-tight leading-tight group-hover:text-gray-600 transition-colors">
                      {item.name}
                    </h2>
                    <p className="text-gray-400 text-sm font-bold leading-relaxed line-clamp-3">
                      {item.description || 'Enterprise-grade hardware designed for high-performance infrastructure and reliable networking.'}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Price</span>
                      <span className="text-xl font-black text-black">{formatIDR(item.price)}</span>
                    </div>

                    <button
                      onClick={() => setBuying({ itemId: item.id, quantity: 1 })}
                      className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl shadow-gray-200"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {buying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setBuying(null)} />
          <div className="bg-white w-full max-w-md rounded-[3.5rem] p-12 shadow-2xl relative z-10 scale-in-center">
            <div className="space-y-10">
              <div className="space-y-4 text-center">
                 <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                    <ShoppingCart className="w-8 h-8 text-black" />
                 </div>
                <h3 className="text-3xl font-black text-black">Confirm Order</h3>
                <p className="text-gray-400 text-sm font-bold px-4">
                  Are you sure you want to purchase 1 unit of <span className="text-black">{items.find(i => i.id === buying.itemId)?.name}</span>?
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleBuy}
                  disabled={buyLoading}
                  className="w-full py-5 bg-black text-white rounded-full text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 disabled:opacity-30 shadow-xl shadow-gray-100"
                >
                  {buyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  Complete Purchase
                </button>
                <button
                  onClick={() => setBuying(null)}
                  className="w-full py-5 bg-white text-gray-400 rounded-full text-xs font-black uppercase tracking-widest hover:text-black transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-12 right-12 z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className={`px-10 py-6 rounded-full shadow-2xl flex items-center gap-4 ${
            toast.type === 'success' ? 'bg-black text-white' : 'bg-red-500 text-white'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Package className="w-5 h-5" />}
            <span className="text-sm font-black tracking-tight">{toast.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}