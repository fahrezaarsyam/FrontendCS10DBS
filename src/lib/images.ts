export const getItemImage = (name: string): string => {
  const lower = name.toLowerCase();

  if (lower.includes('rack server')) return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop';
  if (lower.includes('server')) return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop';
  if (lower.includes('switch')) return 'https://plus.unsplash.com/premium_photo-1661715955019-89f39802cd4d?q=80&w=800&auto=format&fit=crop';
  if (lower.includes('access point')) return 'https://images.unsplash.com/photo-1681383064412-171e5bee5f6e?q=80&w=800&auto=format&fit=crop';
  if (lower.includes('router')) return 'https://images.unsplash.com/photo-1762163516269-3c143e04175c?fm=jpg&amp;q=60&amp?q=80&w=800&auto=format&fit=crop';

  if (lower.includes('laptop')) return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop';
  if (lower.includes('monitor')) return 'https://images.unsplash.com/photo-1547119957-637f8679db1e?q=80&w=800&auto=format&fit=crop';
  if (lower.includes('keyboard')) return 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800&auto=format&fit=crop';
  if (lower.includes('mouse')) return 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop';

  return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop';
};