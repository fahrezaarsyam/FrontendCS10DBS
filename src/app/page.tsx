'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/items');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f5f0e6] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
        <p className="text-sm font-black uppercase tracking-widest text-gray-400">Loading ShopDB...</p>
      </div>
    </div>
  );
}