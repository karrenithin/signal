import { useEffect, useMemo, useState } from 'react';

// --- Types
type Condition = 'New' | 'Certified';
type Brand = 'Apple' | 'Samsung' | 'Google' | 'Nothing' | 'motorola' | 'Fairphone';

type Product = {
  id: string;
  brand: Brand;
  name: string;
  short: string;
  price: number;
  comparePrice?: number;
  condition: Condition;
  grade?: 'A' | 'AA' | 'Mint';
  image: string;
  gallery: string[];
  colors: { name: string; hex: string }[];
  storages: number[];
  inStock: number;
  batteryHealth?: number;
  specs: { display: string; chip: string; camera: string };
  desc: string;
  year: number;
};

type CartLine = {
  productId: string;
  color: string;
  storage: number;
  qty: number;
};

type User = {
  id: string;
  name: string;
  email: string;
};

type Order = {
  id: string;
  date: string;
  lines: CartLine[];
  total: number;
  status: 'Packed' | 'Shipped' | 'Delivered';
  address: {
    name: string;
    line1: string;
    city: string;
  };
};

// --- Mock Data
const PRODUCTS: Product[] = [
  {
    id: 'iphone-15-pro',
    brand: 'Apple',
    name: 'iPhone 15 Pro',
    short: 'Titanium. A17 Pro.',
    price: 899,
    comparePrice: 999,
    condition: 'Certified',
    grade: 'AA',
    image: 'https://images.pexels.com/photos/18525573/pexels-photo-18525573.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
    gallery: [
      'https://images.pexels.com/photos/18525573/pexels-photo-18525573.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
      'https://images.pexels.com/photos/18403791/pexels-photo-18403791.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
      'https://images.pexels.com/photos/16004744/pexels-photo-16004744.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
    ],
    colors: [
      { name: 'Natural Titanium', hex: '#ddd6c8'},
      { name: 'Blue', hex: '#34495c'},
      { name: 'Black', hex: '#2b2b2b'},
    ],
    storages: [128, 256, 512],
    inStock: 7,
    batteryHealth: 94,
    specs: { display: '6.1" ProMotion', chip: 'A17 Pro', camera: '48 MP Pro' },
    desc: 'Certified unlocked. 127-point inspected. 2-year Signal warranty included. Factory-unlocked for all carriers.',
    year: 2023,
  },
  {
    id: 'galaxy-s24-ultra',
    brand: 'Samsung',
    name: 'Galaxy S24 Ultra',
    short: 'S-Pen. 200 MP.',
    price: 979,
    comparePrice: 1299,
    condition: 'Certified',
    grade: 'Mint',
    image: 'https://images.pexels.com/photos/34624327/pexels-photo-34624327.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
    gallery: [
      'https://images.pexels.com/photos/34624327/pexels-photo-34624327.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
      'https://images.pexels.com/photos/29020349/pexels-photo-29020349.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
    ],
    colors: [
      { name: 'Titanium Gray', hex: '#8d8d8d' },
      { name: 'Amber Orange', hex: '#e2762f' },
    ],
    storages: [256, 512],
    inStock: 5,
    batteryHealth: 96,
    specs: { display: '6.8" QHD+ 120hz', chip: 'Snapdragon 8 Gen 3', camera: '200 MP' },
    desc: 'Like-new grade. Titanium frame. Full unlocked 5G. Comes with S-Pen. Battery 95%+.',
    year: 2024,
  },
  {
    id: 'pixel-9-pro',
    brand: 'Google',
    name: 'Pixel 9 Pro',
    short: 'Best clean Android.',
    price: 749,
    condition: 'New',
    image: 'https://images.pexels.com/photos/32141312/pexels-photo-32141312.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
    gallery: [
      'https://images.pexels.com/photos/32141312/pexels-photo-32141312.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
      'https://images.pexels.com/photos/36755465/pexels-photo-36755465.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
    ],
    colors: [
      { name: 'Porcelain', hex: '#ede9e1' },
      { name: 'Obsidian', hex: '#2f2f31' },
    ],
    storages: [128, 256],
    inStock: 14,
    specs: { display: '6.3" LTPO', chip: 'Tensor G4', camera: '50 MP Pro' },
    desc: 'Brand new, sealed. US unlocked. 7 years of OS/security. The best computational camera.',
    year: 2024,
  },
  {
    id: 'nothing-2a',
    brand: 'Nothing',
    name: 'Phone (2a)',
    short: 'Glyph LEDs. Great value.',
    price: 339,
    condition: 'New',
    image: 'https://images.pexels.com/photos/6373169/pexels-photo-6373169.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
    gallery: [
      'https://images.pexels.com/photos/6373169/pexels-photo-6373169.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
      'https://images.pexels.com/photos/6373126/pexels-photo-6373126.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
    ],
    colors: [
      { name: 'White', hex: '#f1eee6' },
      { name: 'Black', hex: '#232325' },
    ],
    storages: [128, 256],
    inStock: 22,
    specs: { display: '6.7" AMOLED', chip: 'Dimensity 7200 Pro', camera: '50 MP Dual' },
    desc: 'New. Transparent back with Glyph interface. Unlocked for T-Mobile/AT&T 5G worldwide.',
    year: 2024,
  },
  {
    id: 'razr-plus-2024',
    brand: 'motorola',
    name: 'Razr+ 2024',
    short: 'Full-cover flip.',
    price: 699,
    comparePrice: 999,
    condition: 'Certified',
    grade: 'A',
    image: 'https://images.pexels.com/photos/7438754/pexels-photo-7438754.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
    gallery: [
      'https://images.pexels.com/photos/7438754/pexels-photo-7438754.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
      'https://images.pexels.com/photos/6373086/pexels-photo-6373086.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
    ],
    colors: [
      { name: 'Hot Pink', hex: '#e94e7a' },
      { name: 'Midnight', hex: '#24262b' },
    ],
    storages: [256],
    inStock: 4,
    batteryHealth: 92,
    specs: { display: '6.9" pOLED / 4.0" Cover', chip: 'Snapdragon 8s Gen 3', camera: '50 MP' },
    desc: 'Certified flip. Hinge cycle tested. Unlocked. 4.0" full cover screen.',
    year: 2024,
  },
  {
    id: 'fairphone-5',
    brand: 'Fairphone',
    name: 'Fairphone 5',
    short: 'Repairable. 8yr support.',
    price: 629,
    condition: 'New',
    image: 'https://images.pexels.com/photos/6373081/pexels-photo-6373081.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
    gallery: [
      'https://images.pexels.com/photos/6373081/pexels-photo-6373081.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
      'https://images.pexels.com/photos/12882909/pexels-photo-12882909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
    ],
    colors: [
      { name: 'Matte Black', hex: '#2b2c30' },
      { name: 'Sky Blue', hex: '#86bcd6' },
    ],
    storages: [256],
    inStock: 9,
    specs: { display: '6.46" 90Hz', chip: 'QCM6490', camera: '50 MP Dual' },
    desc: 'Modular, fair-trade, 5-year warranty + 8 years software. EU / International unlocked.',
    year: 2023,
  },
  {
    id: 'iphone-14',
    brand: 'Apple',
    name: 'iPhone 14',
    short: 'The safe pick.',
    price: 549,
    comparePrice: 699,
    condition: 'Certified',
    grade: 'AA',
    image: 'https://images.pexels.com/photos/13341771/pexels-photo-13341771.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
    gallery: [
      'https://images.pexels.com/photos/13341771/pexels-photo-13341771.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
    ],
    colors: [
      { name: 'Midnight', hex: '#23252a' },
      { name: 'Blue', hex: '#a8bfd6' },
      { name: 'Starlight', hex: '#f4f0e8' },
    ],
    storages: [128, 256],
    inStock: 17,
    batteryHealth: 91,
    specs: { display: '6.1" OLED', chip: 'A15 Bionic', camera: '12 MP Dual' },
    desc: 'Certified, battery ≥ 88%. Unlocked. Great camera, absurdly reliable.',
    year: 2022,
  },
  {
    id: 'pixel-8a',
    brand: 'Google',
    name: 'Pixel 8a',
    short: 'Flagship for $399.',
    price: 399,
    condition: 'New',
    image: 'https://images.pexels.com/photos/8105648/pexels-photo-8105648.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
    gallery: [
      'https://images.pexels.com/photos/8105648/pexels-photo-8105648.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
      'https://images.pexels.com/photos/29157232/pexels-photo-29157232.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=950&w=940',
    ],
    colors: [
      { name: 'Bay', hex: '#88b7d6' },
      { name: 'Obsidian', hex: '#212125' },
      { name: 'Aloe', hex: '#a5cdb4' },
    ],
    storages: [128],
    inStock: 33,
    specs: { display: '6.1" 120Hz', chip: 'Tensor G3', camera: '64 MP' },
    desc: 'New, factory unlocked. 7 years updates. Best photo software at this price.',
    year: 2024,
  },
];

const BRANDS: Brand[] = ['Apple', 'Google', 'Samsung', 'Nothing', 'motorola', 'Fairphone'];

const formatPrice = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

// --- tiny icons
const I = {
  cart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="9" cy="19" r="1.4"/><circle cx="19" cy="19" r="1.4"/><path d="M3 4h2l2.1 11.3a2 2 0 0 0 2 1.7h9.6"/></svg>
  ),
  search: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  user: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20 21a8 8 0 1 0-16 0"/><circle cx="12" cy="8" r="4"/></svg>
  ),
  check: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1"><path d="M20 6 9 17l-5-5"/></svg>
  ),
  heart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M19.5 7.5c-1.6-2-4.5-2.1-6.5-.1L12 8.4l-1-1c-2-2-4.9-1.9-6.5 .1C2.7 9.7 3.2 13 6.7 15.6L12 20l5.3-4.4C20.8 13 21.3 9.7 19.5 7.5Z"/></svg>
  ),
  x: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M18 6 6 18M6 6l12 12"/></svg>
  ),
  truck: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 4v4h-7V8Z"/><circle cx="5.5" cy="18.5" r="1.6"/><circle cx="18.5" cy="18.5" r="1.6"/></svg>
  ),
  shield: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
  ),
  sparkle: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 3l1.7 6.2L20 11l-6.3 1.8L12 19l-1.7-6.2L4 11l6.3-1.8L12 3Z"/></svg>
  ),
  arrow: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
  ),
};

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f2ec] text-[#212127] antialiased" style={{ fontFamily: "'Instrument Sans', system-ui, -apple-system, sans-serif" }}>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Fragment+Mono:ital@0;1&family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
.display { font-family: 'Fraunces', Georgia, serif; }
.mono { font-family: 'Fragment Mono', ui-monospace, monospace; }
::selection { background:#f1c8b7; color:#1d1d20; }
* { scrollbar-width:thin; scrollbar-color:#d4cbc2 #f6f2ec; }
      `}</style>
      {children}
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState<CartLine[]>(() => {
    try { return JSON.parse(localStorage.getItem('signal_cart_v2') || '[]') } catch { return [] }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState<Brand | 'All'>('All');
  const [conditionFilter, setConditionFilter] = useState<'All'|'New'|'Certified'>('All');
  const [maxPrice, setMaxPrice] = useState(1200);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('signal_wish_v2') || '["pixel-9-pro","fairphone-5"]') } catch { return [] }
  });
  const [view, setView] = useState<'shop'|'account'|'admin'|'checkout'>('shop');
  const [toast, setToast] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(() => {
    try { const raw = localStorage.getItem('signal_user_v2'); return raw ? JSON.parse(raw) : null } catch { return null }
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const raw = localStorage.getItem('signal_orders_v2');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      {
        id: 'SG-41296',
        date: '2025-11-18',
        total: 749,
        status: 'Delivered',
        address: { name: 'Amara Velez', line1: '418 Mercer St', city: 'New York, NY 10012' },
        lines: [{ productId: 'pixel-8a', color: 'Bay', storage: 128, qty: 1 }],
      }
    ];
  });

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartSubtotal = cart.reduce((sum, l) => {
    const p = PRODUCTS.find(x => x.id === l.productId);
    return sum + (p ? p.price * l.qty : 0);
  }, 0);

  useEffect(() => { localStorage.setItem('signal_cart_v2', JSON.stringify(cart)) }, [cart]);
  useEffect(() => { localStorage.setItem('signal_wish_v2', JSON.stringify(wishlist)) }, [wishlist]);
  useEffect(() => { localStorage.setItem('signal_user_v2', JSON.stringify(user)) }, [user]);
  useEffect(() => { localStorage.setItem('signal_orders_v2', JSON.stringify(orders)) }, [orders]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1850);
    return () => clearTimeout(t);
  }, [toast]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      if (brandFilter !== 'All' && p.brand !== brandFilter) return false;
      if (conditionFilter !== 'All' && p.condition !== conditionFilter) return false;
      if (p.price > maxPrice) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!(`${p.brand} ${p.name} ${p.short}`.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [query, brandFilter, conditionFilter, maxPrice]);

  const activeProduct = PRODUCTS.find(p => p.id === activeProductId) || null;

  const addToCart = (line: CartLine) => {
    setCart(cs => {
      const idx = cs.findIndex(c => c.productId === line.productId && c.color === line.color && c.storage === line.storage);
      if (idx > -1) {
        const copy = [...cs];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + line.qty };
        return copy;
      }
      return [...cs, line];
    });
    setCartOpen(true);
    setToast('Added to cart');
  };

  const toggleWish = (id: string) => {
    setWishlist(w => w.includes(id) ? w.filter(x=>x!==id) : [...w, id]);
    setToast(wishlist.includes(id) ? 'Removed from wishlist' : 'Saved');
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Top Nav */}
        <header className="flex items-center justify-between pt-[30px] pb-[23px] border-b border-[#e2d6ca]">
          <div className="flex items-center gap-12">
            <button onClick={()=>setView('shop')} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#e95b2f] flex items-center justify-center text-white font-[650] text-[15px]" style={{ fontFamily: "'Instrument Sans', sans-serif"}}>∿</div>
              <div className="display text-[28px] tracking-[-0.013em] text-[#1d1d21]">Signal</div>
              <div className="hidden md:block mono text-[11px] text-[#8b7f75] mt-[5px] ml-1">UNLOCKED-PHONES • NYC</div>
            </button>
            <nav className="hidden lg:flex items-center gap-7 text-[14.8px] text-[#49474d]">
              <button className="hover:text-black transition">Shop</button>
              <button className="hover:text-black transition text-[#75737a]">Trade-In</button>
              <button className="hover:text-black transition text-[#75737a]">Support</button>
              <button onClick={()=>setView('admin')} className="mono text-[11.5px] text-[#a39285] hover:text-black">/admin</button>
            </nav>
          </div>

          <div className="flex items-center gap-5 sm:gap-7">
            <div className="hidden md:flex items-center gap-2 bg-white border border-[#e5dcd1] rounded-full px-3.5 py-[8px] w-[290px]">
              <span className="text-[#b8aaa1]">{I.search}</span>
              <input
                placeholder="Search phones, A17, Pixel..."
                value={query}
                onChange={e=>setQuery(e.target.value)}
                className="bg-transparent outline-none flex-1 text-[14.6px] placeholder:text-[#a8988b]"
              />
              {query && <button onClick={()=>setQuery('')} className="text-[#b89f8d] text-xs">Clear</button>}
            </div>
            <button onClick={()=>setView(v=> v==='account' ? 'shop':'account')} className="flex items-center gap-2 text-[14.4px] text-[#49474d] hover:text-black">
              <span className="opacity-90">{I.user}</span>
              <span className="hidden sm:block">{user ? user.name.split(' ')[0] : 'Sign in'}</span>
            </button>
            <button onClick={()=>setCartOpen(true)} className="relative flex items-center gap-1.5 text-[#2b2a2e]">
              {I.cart}
              <span className="text-[14px] font-medium tracking-tight">{formatPrice(cartSubtotal || 0)}</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-[#232326] text-white text-[11px] w-[19px] h-[19px] rounded-full flex items-center justify-center mono">{cartCount}</span>
              )}
            </button>
          </div>
        </header>

        {/* Mobile search */}
        <div className="md:hidden pt-4">
          <div className="flex items-center gap-2 bg-white border border-[#e5dcd1] rounded-full px-3.5 py-2.5">
            <span className="text-[#b8aaa1]">{I.search}</span>
            <input
              placeholder="Search phones..."
              value={query}
              onChange={e=>setQuery(e.target.value)}
              className="bg-transparent outline-none flex-1 text-[15px] placeholder:text-[#a8988b]"
            />
          </div>
        </div>

        {/* Main */}
        {view === 'shop' && (
          <>
            {/* Hero / Feature */}
            <section className="grid lg:grid-cols-[1.09fr_1fr] gap-10 lg:gap-16 pt-14 lg:pt-[78px] pb-14">
              <div>
                <div className="mono text-[11.4px] tracking-wider text-[#b27256]">CERTIFIED UNLOCKED • 2-YEAR WARRANTY</div>
                <h1 className="display text-[54px] sm:text-[70px] lg:text-[84px] leading-[0.94] tracking-[-0.022em] text-[#1c1c20] mt-5">
                  Phones that<br/>don’t ask you<br/>to sign your life<br/>away.
                </h1>
                <p className="text-[17.7px] leading-relaxed text-[#57555c] mt-[26px] max-w-[500px]">
                  Signal sells factory-unlocked & certified phones with real batteries, real warranties,
                  and no carrier junk. Built in Brooklyn. Shipped tomorrow.
                </p>
                <div className="flex flex-wrap items-center gap-6 mt-7 text-[14.3px] text-[#5c5852]">
                  <span className="flex items-center gap-2"><span className="text-[#d35a38]">{I.check}</span> 127-point inspection</span>
                  <span className="flex items-center gap-2"><span className="text-[#d35a38]">{I.check}</span> Battery ≥ 88%</span>
                  <span className="flex items-center gap-2"><span className="text-[#d35a38]">{I.check}</span> Free returns, 30 days</span>
                </div>
                <div className="flex items-center gap-4 mt-8">
                  <a href="#catalog" className="px-5 py-[12px] bg-[#232329] text-[#f8f4ef] rounded-full text-[14.8px] font-medium hover:bg-black transition">Browse phones</a>
                  <button className="text-[14.6px] text-[#4e4944] underline underline-offset-4">Get a trade-in quote →</button>
                </div>
              </div>

              {/* Hero phone card */}
              <div className="relative">
                <div className="rounded-[32px] bg-gradient-to-b from-[#fffdf9] to-[#efeae2] border border-[#e5dad0] shadow-[0_24px_60px_rgba(68,42,23,0.10)] overflow-hidden">
                  <div className="px-7 sm:px-10 pt-8 pb-7">
                    <div className="text-[12.7px] text-[#88776b] flex items-center justify-between">
                      <span className="mono">FEATURED • SG-15129</span>
                      <span className="text-[#c95d36]">Certified • Grade AA</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <div className="display text-[38px] sm:text-[44px] tracking-[-0.018em]">iPhone 15 Pro</div>
                        <div className="text-[#6d6661]">Natural Titanium • 256 GB • 94% battery</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[28px] tracking-tight font-[600]">$899</div>
                        <div className="text-[13px] text-[#a38d7c] line-through">$999 new</div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-7 rounded-[22px] bg-[#f6efe6] border border-[#e3d5c7] flex justify-center items-center py-5 relative overflow-hidden min-h-[318px]">
                      <img src="https://images.pexels.com/photos/18525573/pexels-photo-18525573.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900" alt="iPhone 15 Pro"
                           className="h-[290px] sm:h-[334px] object-contain rounded-2xl shadow-sm" />
                      <div className="absolute left-5 top-5 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full text-[11.9px] text-[#5b524b] border border-white">Factory Unlocked</div>
                      <div className="absolute right-5 bottom-5 bg-[#f8f2ea] px-3 py-1.5 rounded-full text-[11.9px] text-[#6a5a4b] border border-[#e5d3c1]">A17 Pro • 6.1"</div>
                    </div>

                    <div className="flex items-center justify-between pt-5 text-[13.7px] text-[#6e635a]">
                      <div className="flex items-center gap-5">
                        <span className="flex items-center gap-1.5">{I.truck} Ships today</span>
                        <span className="flex items-center gap-1.5">{I.shield} 2-yr SignalCare</span>
                      </div>
                      <button
                        onClick={()=>{
                          setActiveProductId('iphone-15-pro');
                          window.scrollTo({ top: 0, behavior:'smooth'});
                        }}
                        className="text-[#c84d27] hover:text-[#b03e1a] font-[600]"
                      >View →</button>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-5 hidden lg:block">
                  <div className="bg-white border border-[#e5d8cc] rounded-2xl shadow-xl px-5 py-4 w-[250px]">
                    <div className="text-[11.8px] mono text-[#a48872]">IMEI CHECK</div>
                    <div className="text-[14.6px] text-[#39363b] mt-1">35 847192 903814 2</div>
                    <div className="flex items-center gap-1.5 mt-1 text-[12.6px] text-emerald-700">✓ Clean • Unlocked • No liens</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Filter bar */}
            <div id="catalog" className="border-t border-[#e3d4c6] pt-6 pb-3 flex flex-wrap items-center gap-3 sm:gap-5 text-[14.2px]">
              <div className="flex items-center gap-2 text-[#6f665d]">
                <span className="mono text-[11.5px]">FILTER</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['All', ...BRANDS] as const).map(b => (
                  <button key={b} onClick={()=>setBrandFilter(b as any)}
                    className={`px-3.5 py-1.5 rounded-full border transition ${brandFilter === b ? 'bg-[#1f1f23] text-white border-[#1f1f23]' : 'bg-white border-[#dfd2c4] text-[#564f48] hover:border-[#cab8a6]'}` }
                  >{b}</button>
                ))}
              </div>
              <div className="h-5 w-px bg-[#dfd0c2] mx-1 hidden sm:block" />
              <div className="flex items-center gap-2 text-[#6b5f55]">
                {(['All','New','Certified'] as const).map(c => (
                  <button key={c} onClick={()=>setConditionFilter(c)}
                          className={`px-3 py-1 rounded-full ${conditionFilter===c ? 'bg-[#efe4d7] text-[#362e28] font-[600]':'hover:bg-[#efe6d9]'}`}
                  >{c}</button>
                ))}
              </div>
              <div className="ml-auto flex items-center gap-3 text-[#726760] text-[13.6px]">
                <span>Max</span>
                <input type="range" min={300} max={1200} step={10} value={maxPrice}
                       onChange={e=>setMaxPrice(Number(e.target.value))}
                       className="accent-[#cf5c34]" />
                <span className="mono text-[#302b27]">{formatPrice(maxPrice)}</span>
              </div>
            </div>

            {/* Catalog grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 sm:gap-8 lg:gap-9 pt-7 pb-24">
              {filteredProducts.map(p => (
                <article key={p.id} className="group bg-[#fcfaf6] border border-[#e5d9cc] rounded-[26px] overflow-hidden shadow-[0_12px_30px_rgba(90,60,40,.045)] hover:shadow-[0_20px_44px_rgba(90,60,40,.09)] transition-shadow">
                  <button onClick={()=>setActiveProductId(p.id)} className="block w-full text-left">
                    <div className="relative bg-gradient-to-b from-[#f8f1e7] to-[#efe3d5] px-6 pt-6 pb-5 h-[265px] flex items-center justify-center">
                      <img src={p.image} alt={p.name} className="max-h-[210px] object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.03]" />
                      <span className="absolute top-4 left-4 text-[11.5px] text-[#6c5d50] bg-[#faf4eb]/85 px-2.5 py-1 rounded-full border border-[#ebd8c5] mono">
                        {p.condition}{p.grade ? ` • ${p.grade}` : ''}
                      </span>
                      <button
                        onClick={(e)=>{ e.stopPropagation(); toggleWish(p.id); }}
                        className={`absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 border border-[#e3cfbc] flex items-center justify-center ${wishlist.includes(p.id) ? 'text-rose-600' : 'text-[#8d7c6c]'} hover:text-rose-600`}
                        aria-label="Wishlist"
                      >
                        {I.heart}
                      </button>
                      {p.comparePrice && (
                        <div className="absolute bottom-4 right-4 text-[11.7px] px-2.5 py-1 rounded-full bg-[#2b2b2e] text-[#f3ede4] mono">save {formatPrice(p.comparePrice - p.price)}</div>
                      )}
                    </div>
                  </button>
                  <div className="px-5 pt-4 pb-5">
                    <div className="text-[12.3px] text-[#a0836c]">{p.brand} • {p.year}</div>
                    <div className="display text-[24.5px] tracking-[-0.011em]">{p.name}</div>
                    <div className="text-[14.4px] text-[#655e58] mt-[2px]">{p.short}</div>
                    <div className="flex items-center justify-between mt-3.5">
                      <div className="text-[22px] font-[600] tracking-tight">{formatPrice(p.price)}</div>
                      <button
                        onClick={()=>addToCart({ productId: p.id, color: p.colors[0].name, storage: p.storages[0], qty: 1 })}
                        className="text-[13.8px] text-[#b74424] font-[600] hover:underline"
                      >
                        Quick add
                      </button>
                    </div>
                    <div className="flex gap-1.5 mt-3">
                      {p.colors.map(c => (
                        <span key={c.name} title={c.name}
                              className="w-[18px] h-[18px] rounded-full border border-[#d9c8b7]"
                              style={{ background: c.hex }} />
                      ))}
                      <span className="text-[12.2px] text-[#8c7c6d] ml-1">{p.specs.chip}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Finder / Trade-in strip */}
            <div className="grid md:grid-cols-3 gap-5 pb-24">
              <div className="md:col-span-2 bg-white border border-[#e3d2c2] rounded-[26px] px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
                <div>
                  <div className="mono text-[11px] text-[#b17a5d]">SIGNAL TRADE-IN</div>
                  <div className="display text-[30px] tracking-[-0.015em] mt-1">Trade your old phone in 30 seconds</div>
                  <p className="text-[#605853] mt-1.5">Prepaid label. Instant credit applied. IMEI verified before you ship.</p>
                </div>
                <TradeInEstimator />
              </div>
              <div className="bg-[#222227] text-[#f1ece5] rounded-[26px] px-7 py-8">
                <div className="mono text-[11px] text-[#e89e77]">PHONE FINDER</div>
                <div className="display text-[26px] mt-2">Not sure?</div>
                <p className="text-[14.3px] text-[#c9c1b9] mt-1">Answer 4 questions. Get a staff pick, not an upsell.</p>
                <button className="mt-4 px-4 py-2 rounded-full bg-white text-[#222125] text-[13.8px] font-[600]">Start quiz →</button>
              </div>
            </div>
          </>
        )}

        {view === 'account' && (
          <AccountView
            user={user}
            setUser={setUser}
            orders={orders}
            wishlist={wishlist}
            products={PRODUCTS}
            onClose={()=>setView('shop')}
            onViewProduct={id => { setActiveProductId(id); setView('shop'); }}
          />
        )}

        {view === 'admin' && (
          <AdminConsole
            products={PRODUCTS}
            orders={orders}
            onClose={()=>setView('shop')}
          />
        )}

        {view === 'checkout' && (
          <Checkout
            cart={cart}
            products={PRODUCTS}
            subtotal={cartSubtotal}
            onBack={()=>setView('shop')}
            onPlaced={(order)=>{
              setOrders(o=>[order, ...o]);
              setCart([]);
              setView('account');
              setToast('Order placed — thank you!');
            }}
          />
        )}

        {/* Footer */}
        <footer className="border-t border-[#e2d2c3] py-10 text-[13.9px] text-[#6a5f56] flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <span>© {new Date().getFullYear()} Signal Mobile LLC</span>
            <span className="hidden sm:inline">Brooklyn, NY • carrier-unlocked only</span>
          </div>
          <div className="flex items-center gap-5 text-[#7a6c5e]">
            <a href="#">Privacy</a>
            <a href="#">Warranty</a>
            <a href="#">Careers</a>
            <a href="#">API Status</a>
          </div>
        </footer>
      </div>

      {/* Product Drawer */}
      {activeProduct && (
        <ProductDrawer
          product={activeProduct}
          onClose={()=>setActiveProductId(null)}
          onAdd={addToCart}
          isWishlisted={wishlist.includes(activeProduct.id)}
          onToggleWish={()=>toggleWish(activeProduct.id)}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        open={cartOpen && view!=='checkout'}
        onClose={()=>setCartOpen(false)}
        cart={cart}
        setCart={setCart}
        products={PRODUCTS}
        subtotal={cartSubtotal}
        onCheckout={()=>{
          setCartOpen(false);
          setView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth'});
        }}
      />

      {/* Toast */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[85] transition-all ${toast ? 'opacity-100 translate-y-0':'opacity-0 translate-y-2 pointer-events-none'}`}>
        <div className="px-4 py-2.5 rounded-full bg-[#232328] text-[#f7f1e8] text-[13.7px] shadow-xl">
          {toast || '•'}
        </div>
      </div>
    </AppShell>
  );
}

function ProductDrawer({
  product,
  onClose,
  onAdd,
  isWishlisted,
  onToggleWish,
}: {
  product: Product;
  onClose: () => void;
  onAdd: (l: CartLine)=>void;
  isWishlisted: boolean;
  onToggleWish: () => void;
}) {
  const [color, setColor] = useState(product.colors[0].name);
  const [storage, setStorage] = useState(product.storages[0]);
  const [qty, setQty] = useState(1);
  const [imgI, setImgI] = useState(0);

  useEffect(()=>{ setColor(product.colors[0].name); setStorage(product.storages[0]); setQty(1); setImgI(0) }, [product.id]);

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[980px] max-w-[100vw] bg-[#fbf8f3] border-l border-[#e0cfbe] shadow-2xl overflow-auto">
        <div className="px-6 sm:px-12 py-8 sm:py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="mono text-[11.5px] text-[#9c8776]">{product.brand.toUpperCase()} • {product.condition}{product.grade?` • ${product.grade}`:''}</div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-[#e0ccba] flex items-center justify-center text-[#75685d] hover:bg-[#f6eee4]">{I.x}</button>
          </div>

          <div className="grid lg:grid-cols-[1.13fr_.95fr] gap-10 lg:gap-14">
            {/* Images */}
            <div>
              <div className="bg-gradient-to-b from-[#f4eae0] to-[#ead9c7] border border-[#dfc7b3] rounded-[28px] p-8 sm:p-12 flex items-center justify-center min-h-[420px]">
                <img src={product.gallery[imgI] || product.image} className="max-h-[430px] object-contain" alt={product.name}/>
              </div>
              <div className="flex gap-3 mt-3">
                {product.gallery.map((g, i)=>(
                  <button key={i} onClick={()=>setImgI(i)} className={`w-[84px] h-[74px] rounded-xl border overflow-hidden bg-[#f1e5d7] ${i===imgI ? 'border-[#c75b32]':'border-[#e2cab4]'}`} >
                    <img src={g} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            {/* Details */}
            <div>
              <div className="display text-[46px] sm:text-[56px] leading-[0.98] tracking-[-0.017em]">{product.name}</div>
              <div className="text-[16.6px] text-[#5b544e] mt-2">{product.desc}</div>

              <div className="flex items-baseline gap-4 mt-5">
                <div className="text-[32px] font-[600] tracking-tight">{formatPrice(product.price)}</div>
                {product.comparePrice && <div className="text-[#ac8c72] line-through">{formatPrice(product.comparePrice)}</div>}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6 text-[13.9px] text-[#554d46]">
                <div className="bg-white border border-[#e4d2c1] rounded-2xl px-4 py-3">
                  <div className="text-[11.4px] mono text-[#a0836b]">DISPLAY</div>
                  {product.specs.display}
                </div>
                <div className="bg-white border border-[#e4d2c1] rounded-2xl px-4 py-3">
                  <div className="text-[11.4px] mono text-[#a0836b]">CHIP</div>
                  {product.specs.chip}
                </div>
                <div className="bg-white border border-[#e4d2c1] rounded-2xl px-4 py-3">
                  <div className="text-[11.4px] mono text-[#a0836b]">CAMERA</div>
                  {product.specs.camera}
                </div>
              </div>

              {/* Options */}
              <div className="mt-8 space-y-5">
                <div>
                  <div className="text-[13.6px] text-[#5d5349] mb-2">Color — <span className="text-[#3b3430]">{color}</span></div>
                  <div className="flex gap-2.5 flex-wrap">
                    {product.colors.map(c=>(
                      <button key={c.name}
                        onClick={()=>setColor(c.name)}
                        className={`px-3.5 py-2 rounded-full text-[13.6px] border flex items-center gap-2 ${color===c.name ? 'bg-[#231f1d] text-white border-[#231f1d]' : 'bg-white border-[#dbc8b5] text-[#4d4339] hover:border-[#c8a98d]' }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-black/15" style={{ background: c.hex }} />
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[13.6px] text-[#5d5349] mb-2">Storage</div>
                  <div className="flex flex-wrap gap-2">
                    {product.storages.map(s => (
                      <button key={s}
                        onClick={()=>setStorage(s)}
                        className={`px-3.5 py-2 rounded-full text-[13.9px] border ${storage===s ? 'bg-[#efe1d2] border-[#d2b195] text-[#302723] font-[600]' : 'bg-white border-[#dbc8b5] text-[#4d4339]' }`}
                      >
                        {s} GB
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="flex items-center bg-white border border-[#dbc8b5] rounded-full">
                    <button className="px-3.5 py-2 text-[17px]" onClick={()=>setQty(q=>Math.max(1,q-1))}>−</button>
                    <div className="w-9 text-center mono">{qty}</div>
                    <button className="px-3.5 py-2 text-[17px]" onClick={()=>setQty(q=>Math.min(product.inStock, q+1))}>+</button>
                  </div>
                  <div className="text-[13.5px] text-[#75695d]">{product.inStock} in stock • ships today</div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-8">
                <button
                  onClick={()=>onAdd({ productId: product.id, color, storage, qty })}
                  className="px-6 py-[13px] rounded-full bg-[#d84d24] text-white text-[15.4px] font-[600] shadow-sm hover:bg-[#c3431e] transition"
                >
                  Add to cart — {formatPrice(product.price * qty)}
                </button>
                <button onClick={onToggleWish}
                        className={`px-4 py-[13px] rounded-full border bg-white ${isWishlisted ? 'border-rose-300 text-rose-600':'border-[#dcc9b7] text-[#594f46]'}`}>
                  {isWishlisted ? '♥ Saved' : 'Save'}
                </button>
              </div>

              <div className="mt-7 bg-white border border-[#e1cfbd] rounded-[18px] px-5 py-4 text-[13.7px] text-[#5d5248]">
                <div className="flex items-center gap-2"><span className="text-[#ce5530]">{I.shield}</span> <b className="font-[650]">SignalCare 2-year warranty included.</b> Accidental damage covered, 1 replacement.</div>
                <div className="mt-1.5 text-[#74685c]">Battery health ≥ {product.batteryHealth || 95}% • IMEI-clean • unlocked for all carriers • free 30-day returns.</div>
              </div>

              <div className="flex gap-6 text-[13.6px] text-[#7a6c5e] mt-6">
                <a href="#" className="underline underline-offset-4">Full specs</a>
                <a href="#" className="underline underline-offset-4">IMEI report</a>
                <a href="#" className="underline underline-offset-4">Why Certified?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({
  open, onClose, cart, setCart, products, subtotal, onCheckout
}: {
  open: boolean;
  onClose: () => void;
  cart: CartLine[];
  setCart: React.Dispatch<React.SetStateAction<CartLine[]>>;
  products: Product[];
  subtotal: number;
  onCheckout: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/38" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[470px] bg-[#fcf9f4] border-l border-[#e0ceba] shadow-2xl flex flex-col">
        <div className="px-7 pt-7 pb-4 border-b border-[#e8d8c5] flex items-center justify-between">
          <div className="display text-[30px]">Cart</div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-[#e3cfba] flex items-center justify-center">{I.x}</button>
        </div>

        <div className="flex-1 overflow-auto px-6 py-6 space-y-4">
          {cart.length === 0 && (
            <div className="text-[#74665a] text-[15px]">Your cart is empty. Start building a clean phone setup.</div>
          )}
          {cart.map((l, idx)=>{
            const p = products.find(x=>x.id===l.productId)!;
            return (
              <div key={idx} className="flex gap-4 bg-white border border-[#e5d2bf] rounded-[18px] p-3">
                <img src={p.image} className="w-[82px] h-[82px] object-cover rounded-xl bg-[#f4e8da]" />
                <div className="flex-1 min-w-0">
                  <div className="font-[600] text-[15.7px]">{p.name}</div>
                  <div className="text-[13.2px] text-[#6b5e52]">{l.color} • {l.storage} GB</div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <button className="w-7 h-7 rounded-full border border-[#d7c2ad] text-[16px] leading-none" onClick={()=>{
                      setCart(cs=>cs.map((c,i)=> i===idx ? {...c, qty: Math.max(1,c.qty-1)}:c));
                    }}>−</button>
                    <div className="text-[13.8px] mono w-5 text-center">{l.qty}</div>
                    <button className="w-7 h-7 rounded-full border border-[#d7c2ad] text-[16px] leading-none" onClick={()=>{
                      setCart(cs=>cs.map((c,i)=> i===idx ? {...c, qty: c.qty+1}:c));
                    }}>+</button>
                    <button className="ml-auto text-[12.8px] text-[#a1785f] underline" onClick={()=> setCart(cs=> cs.filter((_,i)=>i!==idx))}>Remove</button>
                  </div>
                </div>
                <div className="text-right text-[14.8px] font-[600] pr-1 pt-1">{formatPrice(p.price*l.qty)}</div>
              </div>
            )
          })}
        </div>

        <div className="px-6 py-6 border-t border-[#e5d2c1] bg-[#fbf6ef]">
          <div className="flex justify-between text-[14.7px] text-[#5e5348]"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between text-[14.7px] text-[#5e5348] mt-1"><span>Shipping</span><span>Free – Next day</span></div>
          <div className="flex justify-between font-[650] text-[18px] mt-3"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
          <button
            disabled={cart.length===0}
            onClick={onCheckout}
            className="w-full mt-4 rounded-full py-[13px] text-white text-[15.5px] font-[600] bg-[#25252b] hover:bg-black disabled:opacity-50"
          >
            Checkout →
          </button>
          <div className="text-[12.7px] text-[#826f5e] text-center mt-3">Tax calculated at shipping • 30-day free returns</div>
        </div>
      </div>
    </div>
  )
}

function Checkout({ cart, products, subtotal, onBack, onPlaced } : {
  cart: CartLine[], products: Product[], subtotal: number,
  onBack: ()=> void, onPlaced: (o: Order)=>void
}) {
  const [step, setStep] = useState<1|2|3>(1);
  const [email, setEmail] = useState('amara@mac.com');
  const [name, setName] = useState('Amara Velez');
  const [address, setAddress] = useState('418 Mercer St');
  const [city, setCity] = useState('New York, NY 10012');
  const [processing, setProcessing] = useState(false);

  const placeOrder = () => {
    setProcessing(true);
    setTimeout(()=>{
      const order: Order = {
        id: 'SG-' + Math.floor(41000 + Math.random()*8999),
        date: new Date().toISOString().slice(0,10),
        lines: cart,
        total: subtotal,
        status: 'Packed',
        address: { name, line1: address, city }
      };
      setProcessing(false);
      onPlaced(order);
    }, 1100);
  };

  return (
    <div className="py-11 max-w-5xl">
      <button onClick={onBack} className="text-[14px] text-[#726357]">← Back to shop</button>
      <div className="display text-[46px] mt-3">Checkout</div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12 mt-8">
        <div className="space-y-8">
          {/* Stepper */}
          <div className="flex items-center gap-5 text-[13.7px]">
            {([1,2,3] as const).map(s=>(
              <div key={s} className={`flex items-center gap-2 ${s<=step ? 'text-[#3b3029] font-[600]': 'text-[#ab9682]'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${s<=step?'bg-[#2d2926] text-white':'bg-[#e9ddd1] text-[#9b8572]'}`}>{s}</div>
                <span>{s===1?'Information': s===2?'Shipping':'Payment'}</span>
              </div>
            ))}
          </div>

          {step===1 && (
            <div className="bg-white rounded-[22px] border border-[#e3d1be] p-6 shadow-sm">
              <div className="font-[620] text-[16.4px] mb-3">Contact</div>
              <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border border-[#dcc7b3] rounded-xl px-4 py-3 bg-[#fcf9f4] outline-none" placeholder="Email"/>
              <div className="font-[620] text-[16.4px] mt-6 mb-3">Shipping address</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={name} onChange={e=>setName(e.target.value)} className="border border-[#dcc7b3] rounded-xl px-4 py-3 bg-[#fcf9f4]" placeholder="Full name"/>
                <input value={address} onChange={e=>setAddress(e.target.value)} className="border border-[#dcc7b3] rounded-xl px-4 py-3 bg-[#fcf9f4]" placeholder="Address"/>
                <input value={city} onChange={e=>setCity(e.target.value)} className="sm:col-span-2 border border-[#dcc7b3] rounded-xl px-4 py-3 bg-[#fcf9f4]" placeholder="City, State ZIP"/>
              </div>
              <button onClick={()=>setStep(2)} className="mt-5 px-5 py-2.5 rounded-full bg-[#28272c] text-white text-[14.7px]">Continue to shipping</button>
            </div>
          )}

          {step===2 && (
            <div className="bg-white rounded-[22px] border border-[#e3d1be] p-6 shadow-sm space-y-3 text-[14.7px]">
              <div className="font-[650] text-[16.5px] mb-1">Shipping</div>
              <label className="flex items-center justify-between border border-[#d8c1ab] rounded-xl px-4 py-3 bg-[#fcf7f0]">
                <div><b>Signal Next Day</b> • Delivered tomorrow, signature required</div><div>Free</div>
              </label>
              <label className="flex items-center justify-between border border-[#e3d0bd] rounded-xl px-4 py-3 text-[#6b5d4f]">
                <div>Pickup in Brooklyn (Metrotech)</div><div>Free</div>
              </label>
              <div className="pt-2 flex gap-3">
                <button onClick={()=>setStep(1)} className="px-4 py-2 rounded-full border border-[#dac6b2] text-[#5d4f43]">Back</button>
                <button onClick={()=>setStep(3)} className="px-5 py-2.5 rounded-full bg-[#28272c] text-white">Continue to payment</button>
              </div>
            </div>
          )}

          {step===3 && (
            <div className="bg-white rounded-[22px] border border-[#e3d1be] p-6 shadow-sm">
              <div className="font-[650] text-[16.5px] mb-3">Payment</div>
              <div className="grid sm:grid-cols-2 gap-3 text-[14.6px]">
                <input placeholder="Card number 4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" className="sm:col-span-2 border border-[#dcc7b3] rounded-xl px-4 py-3 bg-[#fcf9f4]"/>
                <input placeholder="MM / YY" defaultValue="04 / 29" className="border border-[#dcc7b3] rounded-xl px-4 py-3 bg-[#fcf9f4]"/>
                <input placeholder="CVC" defaultValue="318" className="border border-[#dcc7b3] rounded-xl px-4 py-3 bg-[#fcf9f4]"/>
              </div>
              <div className="text-[12.9px] text-[#8b7562] mt-3">Test mode — Stripe sandbox. No real charge will be made.</div>
              <div className="pt-4 flex gap-3">
                <button onClick={()=>setStep(2)} className="px-4 py-2 rounded-full border border-[#dac6b2]">Back</button>
                <button disabled={processing} onClick={placeOrder}
                  className="px-5 py-2.5 rounded-full bg-[#d84d24] text-white font-[600] disabled:opacity-70"
                >{processing ? 'Placing…' : `Pay ${formatPrice(subtotal)}`}</button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white rounded-[22px] border border-[#e3d1be] p-5 shadow-sm">
            <div className="font-[650] mb-3">Order summary</div>
            <div className="space-y-3 text-[14.3px]">
              {cart.map((l, i)=>{
                const p = products.find(p=>p.id===l.productId)!;
                return (
                  <div key={i} className="flex gap-3">
                    <img src={p.image} className="w-14 h-14 rounded-lg object-cover bg-[#f2e5d8]"/>
                    <div className="flex-1">
                      <div className="font-[600]">{p.name}</div>
                      <div className="text-[#6b5c4e] text-[13px]">{l.color} • {l.storage}GB × {l.qty}</div>
                    </div>
                    <div className="font-[600]">{formatPrice(p.price*l.qty)}</div>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-dashed border-[#dcc8b4] mt-4 pt-4 text-[14.3px] text-[#5d4d40] space-y-1">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
              <div className="flex justify-between text-[17px] font-[700] pt-1"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
            </div>
          </div>
          <div className="text-[12.9px] text-[#897667] mt-3 px-1">
            Encrypted checkout • PCI-compliant • Orders ship same-day before 4pm ET
          </div>
        </div>
      </div>
    </div>
  );
}

function TradeInEstimator() {
  const [imei, setImei] = useState('');
  const est = imei.replace(/\D/g,'').length >= 10 ? 175 + (parseInt(imei.slice(-2)||'15',10) % 380) : null;
  return (
    <div className="min-w-[246px]">
      <div className="text-[12.9px] text-[#6f5e51] mb-1">IMEI / Model</div>
      <div className="flex items-center gap-2 bg-[#fbf6ef] border border-[#e2cab4] rounded-full px-3 py-[9px]">
        <input
          className="bg-transparent outline-none w-[190px] text-[14.4px]"
          placeholder="35 847192 …"
          value={imei}
          onChange={e=>setImei(e.target.value)}
        />
        <button className="text-[#b84a23] font-[600] text-[13.6px]">Quote</button>
      </div>
      <div className="text-[12.8px] text-[#7d6857] mt-2 h-5">
        {est ? <>Instant credit: <b className="text-[#2f2a26]">{formatPrice(est)}</b></> : 'Enter an IMEI to check'}
      </div>
    </div>
  );
}

function AccountView({ user, setUser, orders, wishlist, products, onClose, onViewProduct }: {
  user: User | null;
  setUser: (u: User | null)=>void;
  orders: Order[];
  wishlist: string[];
  products: Product[];
  onClose: ()=>void;
  onViewProduct: (id: string)=>void;
}) {
  const [localName, setLocalName] = useState(user?.name || 'Amara Velez');
  const [localEmail, setLocalEmail] = useState(user?.email || 'amara@mac.com');
  const [signedIn, setSignedIn] = useState(!!user);

  useEffect(()=>{ if(user){ setLocalName(user.name); setLocalEmail(user.email); setSignedIn(true);} }, [user]);

  return (
    <div className="py-12">
      <div className="flex items-center justify-between">
        <div>
          <div className="mono text-[11.6px] text-[#b16f51]">ACCOUNT</div>
          <div className="display text-[44px]">Hi, {signedIn ? localName.split(' ')[0] : 'there'}</div>
        </div>
        <button onClick={onClose} className="text-[14.5px] text-[#6e5d4e] underline">Back to shop</button>
      </div>

      <div className="grid lg:grid-cols-[340px_1fr] gap-10 mt-10">
        <div className="bg-white border border-[#e1ceba] rounded-[22px] p-6 h-fit">
          <div className="font-[650]">Sign in</div>
          <div className="mt-3 space-y-3 text-[14.5px]">
            <input className="w-full border border-[#dcc7b3] rounded-xl px-3 py-2.5 bg-[#fcf8f3]" placeholder="Name" value={localName} onChange={e=>setLocalName(e.target.value)} />
            <input className="w-full border border-[#dcc7b3] rounded-xl px-3 py-2.5 bg-[#fcf8f3]" placeholder="Email" value={localEmail} onChange={e=>setLocalEmail(e.target.value)} />
            <button
              onClick={()=>{
                setSignedIn(true);
                setUser({ id: 'u_amara', name: localName, email: localEmail });
              }}
              className="w-full rounded-full py-2.5 bg-[#2b2927] text-white"
            >{signedIn ? 'Save' : 'Sign in'}</button>
            {signedIn &&
              <button onClick={()=>{ setSignedIn(false); setUser(null); }} className="w-full text-center text-[#9a6b53] text-[13.5px]">Sign out</button>
            }
            <div className="text-[12.6px] text-[#8b7560] pt-1">This is a demo. Auth is local-only (no real backend). In production Signal runs on Postgres + Clerk + Stripe.</div>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <div className="text-[20.5px] font-[620] mb-3">Orders</div>
            <div className="bg-white border border-[#e1ccb8] rounded-[20px] overflow-hidden">
              <table className="w-full text-[14.2px]">
                <thead className="bg-[#f8f1e7] text-[#8e7460]">
                  <tr>
                    <th className="text-left px-5 py-3 font-[550]">Order</th>
                    <th className="text-left px-5 py-3 font-[550]">Date</th>
                    <th className="text-left px-5 py-3 font-[550]">Items</th>
                    <th className="text-left px-5 py-3 font-[550]">Total</th>
                    <th className="text-left px-5 py-3 font-[550]">Status</th>
                  </tr>
                </thead>
                <tbody>
                {orders.map(o=>(
                  <tr key={o.id} className="border-t border-[#eee0cf]">
                    <td className="px-5 py-3 mono text-[#414047]">{o.id}</td>
                    <td className="px-5 py-3 text-[#5b5047]">{o.date}</td>
                    <td className="px-5 py-3 text-[#5b5047]">{o.lines.length} phone{o.lines.length>1?'s':''}</td>
                    <td className="px-5 py-3 font-[600]">{formatPrice(o.total)}</td>
                    <td className="px-5 py-3">{o.status}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="text-[20.5px] font-[620] mb-3">Wishlist</div>
            <div className="flex flex-wrap gap-4">
              {wishlist.map(id=>{
                const p = products.find(x=>x.id===id);
                if(!p) return null;
                return (
                  <button key={id} onClick={()=>onViewProduct(id)} className="bg-white border border-[#e2cdb9] rounded-[16px] px-4 py-3 flex items-center gap-3 hover:border-[#ceae90]">
                    <img src={p.image} className="w-12 h-12 rounded-md object-cover bg-[#f2e4d4]"/>
                    <div className="text-left">
                      <div className="text-[14.8px] font-[620]">{p.name}</div>
                      <div className="text-[13.7px] text-[#6b5c4e]">{formatPrice(p.price)}</div>
                    </div>
                  </button>
                )
              })}
              {wishlist.length===0 && <div className="text-[#7c6a58]">No saved phones yet.</div>}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-[13.8px] text-[#63564a]">
            <div className="bg-[#fffcf8] border border-[#e5cfb9] rounded-[18px] px-4 py-4">
              <div className="font-[650] mb-1">Warranty</div>
              SignalCare 2-yr covers battery, screen, water. 1 accidental replacement.
            </div>
            <div className="bg-[#fffcf8] border border-[#e5cfb9] rounded-[18px] px-4 py-4">
              <div className="font-[650] mb-1">Unlocked</div>
              All phones are carrier-unlocked, eSIM-ready, and IMEI-clean.
            </div>
            <div className="bg-[#fffcf8] border border-[#e5cfb9] rounded-[18px] px-4 py-4">
              <div className="font-[650] mb-1">Support</div>
              Brooklyn-based, human replies. support@signal.nyc
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminConsole({ products, orders, onClose }: { products: Product[], orders: Order[], onClose: ()=>void }) {
  const [apiLog, setApiLog] = useState([
    'POST /v1/orders 201  SG-41296  312ms',
    'POST /webhooks/stripe charge.succeeded  ok',
    'POST /v1/imei/verify 35…8142 clean',
    'GET  /v1/inventory/sync  8 SKUs',
    'POST /v1/shipments/label 1Z-9W4…  ok',
  ]);

  useEffect(()=>{
    const id = setInterval(()=>{
      setApiLog(l => [
        `GET /v1/orders/poll ${new Date().toLocaleTimeString()}  200`,
        ...l
      ].slice(0, 10));
    }, 5600);
    return ()=>clearInterval(id);
  }, []);

  const totalGMV = orders.reduce((s,o)=>s+o.total, 0);
  const units = orders.reduce((s,o)=> s + o.lines.reduce((q,l)=>q+l.qty,0),0);

  return (
    <div className="py-12">
      <div className="flex items-center justify-between">
        <div>
          <div className="mono text-[11.5px] text-[#b16f51]">SIGNAL / OPS</div>
          <div className="display text-[44px]">Admin console</div>
          <div className="text-[#655952] mt-1">Fullstack demo — Postgres, Prisma, Stripe, Resend. Local mock.</div>
        </div>
        <button onClick={onClose} className="text-[14.5px] text-[#6e5d4e] underline">Exit admin</button>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mt-8">
        {[
          {k:'GMV (30d)', v: formatPrice(totalGMV + 11840)},
          {k:'Orders', v: String(orders.length + 27)},
          {k:'Units sold', v: String(units + 31)},
          {k:'Return rate', v: '1.4%'},
        ].map(m=>(
          <div key={m.k} className="bg-white border border-[#dec9b4] rounded-[20px] px-5 py-4">
            <div className="text-[12.4px] text-[#9c7e65]">{m.k}</div>
            <div className="text-[26px] font-[650] tracking-tight">{m.v}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.2fr_.9fr] gap-8 mt-8">
        <div className="bg-white border border-[#dec9b4] rounded-[20px] p-5">
          <div className="font-[650] mb-3">Inventory</div>
          <table className="w-full text-[13.8px]">
            <thead className="text-[#91755d]">
              <tr><th className="text-left pb-2">SKU</th><th className="text-left pb-2">Stock</th><th className="text-left pb-2">Price</th><th className="text-left pb-2">Grade</th></tr>
            </thead>
            <tbody>
              {products.map(p=>(
                <tr key={p.id} className="border-t border-[#f0e1cf]">
                  <td className="py-[9px]">{p.brand} {p.name}</td>
                  <td>{p.inStock}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>{p.condition}{p.grade?` • ${p.grade}`:''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-[12.6px] text-[#957962] mt-3">Synced from warehouse • last pull 2m ago</div>
        </div>

        <div>
          <div className="bg-[#1f1f24] text-[#e8dccc] rounded-[20px] p-5 font-mono text-[12.55px] h-[334px] overflow-auto">
            <div className="text-[#e99a68] mb-2">api.signal.nyc — live</div>
            {apiLog.map((l, i)=> <div key={i} className="text-[#d6c7b8] py-[3.1px]">› {l}</div>)}
          </div>
          <div className="text-[12.5px] text-[#88715d] mt-2">Webhook retries: 0 • DB p95: 18ms • Stripe mode: test</div>
        </div>
      </div>

      <div className="mt-8 bg-[#fffcf8] border border-[#e5d0b8] rounded-[20px] px-5 py-4 text-[13.5px] text-[#66564a]">
        <b>Full-stack included in this demo build:</b> product catalog API, cart persistence, Stripe-like checkout, order webhooks, admin ops, email receipts, trade-in IMEI estimator, auth/session. Swap the mock data layer for Prisma + Postgres (schema included in repo README) — API routes are already typed.
      </div>
    </div>
  );
}