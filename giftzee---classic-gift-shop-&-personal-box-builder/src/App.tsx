import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Plus, 
  Minus, 
  Check, 
  Gift, 
  SlidersHorizontal, 
  Star, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Home, 
  Trash2, 
  Truck, 
  ShieldCheck, 
  Leaf,
  Send,
  Info
} from 'lucide-react';
import { GiftzeeLogo } from './components/GiftzeeLogo';
import { 
  PRODUCTS, 
  CATEGORIES, 
  BOX_OPTIONS, 
  FILLER_ITEMS, 
  GREETING_CARDS, 
  TESTIMONIALS, 
  Product, 
  BoxOption, 
  FillerItem, 
  GreetingCardOption 
} from './data/giftData';

// Cart Item Type
interface CartItem {
  id: string; // unique cart instance id
  type: 'product' | 'custom_box';
  product?: Product;
  customBox?: {
    box: BoxOption;
    fillers: { item: FillerItem; quantity: number }[];
    card: GreetingCardOption | null;
    sender: string;
    recipient: string;
    message: string;
  };
  quantity: number;
  price: number;
}

export default function App() {
  // --- STATE SYSTEM ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  
  // Navigation / Tabs State
  const [currentTab, setCurrentTab] = useState<'all' | 'chocolates' | 'toys' | 'candles' | 'bath' | 'drinks' | 'floral'>('all');
  const [catalogFilter, setCatalogFilter] = useState<'best_sellers' | 'new_arrivals' | 'sale_deals'>('best_sellers');
  const [searchQuery, setSearchQuery] = useState('');
  const [headerSearchFocused, setHeaderSearchFocused] = useState(false);
  
  // Gift Finder State
  const [finderRecipient, setFinderRecipient] = useState('');
  const [finderOccasion, setFinderOccasion] = useState('');
  const [finderBudget, setFinderBudget] = useState('');
  const [finderLoading, setFinderLoading] = useState(false);
  const [finderResults, setFinderResults] = useState<Product[] | null>(null);

  // Box Builder State
  const [builderStep, setBuilderStep] = useState<1 | 2 | 3>(1);
  const [builderSelectedBox, setBuilderSelectedBox] = useState<BoxOption | null>(BOX_OPTIONS[1]); // Default to Medium Box
  const [builderAddedFillers, setBuilderAddedFillers] = useState<{ item: FillerItem; qty: number }[]>([]);
  const [builderSelectedCard, setBuilderSelectedCard] = useState<GreetingCardOption | null>(GREETING_CARDS[0]);
  const [builderSender, setBuilderSender] = useState('');
  const [builderRecipient, setBuilderRecipient] = useState('');
  const [builderMessage, setBuilderMessage] = useState('');

  // Hero Carousel State
  const [heroIndex, setHeroIndex] = useState(0);

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedQuickViewWrap, setSelectedQuickViewWrap] = useState<'none' | 'royal_crimson' | 'golden_starburst'>('none');

  // Toasts
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Newsletter Sign up
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Checkout Success Overlay
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'processing' | 'success'>('idle');

  // Auto Hero Slider Intervals
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % 3);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Sync state to local storage if desired
  useEffect(() => {
    const savedCart = localStorage.getItem('giftzee_cart');
    const savedWishlist = localStorage.getItem('giftzee_wishlist');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch(e) {}
    }
    if (savedWishlist) {
      try { setWishlist(JSON.parse(savedWishlist)); } catch(e) {}
    }
  }, []);

  const saveCartToLocalStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('giftzee_cart', JSON.stringify(newCart));
  };

  const saveWishlistToLocalStorage = (newWishlist: string[]) => {
    setWishlist(newWishlist);
    localStorage.setItem('giftzee_wishlist', JSON.stringify(newWishlist));
  };

  // Toast Trigger Helper
  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // --- ACTIONS ---

  // Add standard product to cart
  const handleAddToCart = (product: Product, quantity = 1, isGiftWrapped = false) => {
    const existingIndex = cart.findIndex(item => item.type === 'product' && item.product?.id === product.id);
    const wrapPrice = isGiftWrapped ? 4.99 : 0;
    const finalPrice = product.price + wrapPrice;

    let updatedCart = [...cart];
    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += quantity;
      triggerToast(`Successfully updated quantity for ${product.name}!`, 'success');
    } else {
      updatedCart.push({
        id: `prod_${product.id}_${Date.now()}`,
        type: 'product',
        product: product,
        quantity: quantity,
        price: finalPrice
      });
      triggerToast(`Added ${product.name} to your Giftzee bag!`, 'success');
    }
    saveCartToLocalStorage(updatedCart);
  };

  // Toggle wishlist
  const toggleWishlist = (productId: string) => {
    let updatedWishlist = [...wishlist];
    if (updatedWishlist.includes(productId)) {
      updatedWishlist = updatedWishlist.filter(id => id !== productId);
      triggerToast('Removed item from your favorites.', 'info');
    } else {
      updatedWishlist.push(productId);
      const prod = PRODUCTS.find(p => p.id === productId);
      triggerToast(`Added ${prod?.name || 'product'} to your favorites list!`, 'success');
    }
    saveWishlistToLocalStorage(updatedWishlist);
  };

  // Add item filler to custom box
  const handleAddFillerToBox = (filler: FillerItem) => {
    if (!builderSelectedBox) {
      triggerToast('Please select a gift box size in Step 1 first!', 'error');
      setBuilderStep(1);
      return;
    }

    const currentTotalItems = builderAddedFillers.reduce((acc, f) => acc + f.qty, 0);
    if (currentTotalItems >= builderSelectedBox.capacity) {
      triggerToast(`Your chosen ${builderSelectedBox.name} is full! Remove items or upgrade box capacity.`, 'error');
      return;
    }

    const existingIndex = builderAddedFillers.findIndex(f => f.item.id === filler.id);
    let updated = [...builderAddedFillers];
    if (existingIndex > -1) {
      updated[existingIndex].qty += 1;
    } else {
      updated.push({ item: filler, qty: 1 });
    }
    setBuilderAddedFillers(updated);
    triggerToast(`Added ${filler.name} to your custom box crate!`, 'success');
  };

  const handleRemoveFillerFromBox = (fillerId: string) => {
    const existingIndex = builderAddedFillers.findIndex(f => f.item.id === fillerId);
    if (existingIndex > -1) {
      let updated = [...builderAddedFillers];
      if (updated[existingIndex].qty > 1) {
        updated[existingIndex].qty -= 1;
      } else {
        updated = updated.filter(f => f.item.id !== fillerId);
      }
      setBuilderAddedFillers(updated);
      triggerToast('Item removed from custom crate.', 'info');
    }
  };

  // Calculate Box Builder Pricing
  const boxFillersTotal = builderAddedFillers.reduce((sum, f) => sum + (f.item.price * f.qty), 0);
  const boxBasePrice = builderSelectedBox ? builderSelectedBox.price : 0;
  const cardPrice = builderSelectedCard ? 2.50 : 0;
  const computedBoxPrice = boxBasePrice + boxFillersTotal + cardPrice;
  const currentItemsCount = builderAddedFillers.reduce((sum, f) => sum + f.qty, 0);

  // Add the fully curated gift box to the cart
  const handleAddCustomBoxToCart = () => {
    if (!builderSelectedBox) {
      triggerToast('Please specify a Gift Box style first.', 'error');
      setBuilderStep(1);
      return;
    }
    if (builderAddedFillers.length === 0) {
      triggerToast('A luxury box needs some delicacies! Add at least 1 item in Step 2.', 'error');
      setBuilderStep(2);
      return;
    }

    const customBoxItem: CartItem = {
      id: `box_${Date.now()}`,
      type: 'custom_box',
      customBox: {
        box: builderSelectedBox,
        fillers: [...builderAddedFillers],
        card: builderSelectedCard,
        sender: builderSender || 'Anonymous Friend',
        recipient: builderRecipient || 'My Dearest',
        message: builderMessage || 'Crafted with absolute devotion. Enjoy these custom-selected surprises!'
      },
      quantity: 1,
      price: computedBoxPrice
    };

    const newCart = [...cart, customBoxItem];
    saveCartToLocalStorage(newCart);
    setCartOpen(true);
    triggerToast('Luxury custom Gift Box added to your main basket!', 'success');

    // Reset Box Builder State
    setBuilderAddedFillers([]);
    setBuilderSender('');
    setBuilderRecipient('');
    setBuilderMessage('');
    setBuilderStep(1);
  };

  // Gift Finder Trigger
  const handleTriggerGiftFinder = (e: React.FormEvent) => {
    e.preventDefault();
    setFinderLoading(true);

    // Filter logic
    setTimeout(() => {
      const filtered = PRODUCTS.filter(prod => {
        // Filter Recipient
        const matchesRecipient = !finderRecipient || finderRecipient === 'any' || prod.recipients.includes(finderRecipient);
        // Filter Occasion
        const matchesOccasion = !finderOccasion || finderOccasion === 'any' || prod.occasions.includes(finderOccasion);
        // Filter Budget
        let matchesBudget = true;
        if (finderBudget === 'under_30') matchesBudget = prod.price < 30;
        else if (finderBudget === '30_60') matchesBudget = prod.price >= 30 && prod.price <= 60;
        else if (finderBudget === 'over_60') matchesBudget = prod.price > 60;

        return matchesRecipient && matchesOccasion && matchesBudget;
      });

      setFinderResults(filtered);
      setFinderLoading(false);
      triggerToast(`Found ${filtered.length} perfect custom suggestions!`, 'success');

      // Scroll smoothly to results
      const resEl = document.getElementById('gift-finder-results');
      if (resEl) {
        resEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1200);
  };

  // Checkout trigger
  const handleCheckoutSubmit = () => {
    setCheckoutStep('processing');
    setTimeout(() => {
      setCheckoutStep('success');
      saveCartToLocalStorage([]);
      triggerToast('Order placed successfully!', 'success');
    }, 2000);
  };

  const getFilteredProducts = () => {
    let list = [...PRODUCTS];

    // General Search
    if (searchQuery) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category Selector Menu
    if (currentTab !== 'all') {
      list = list.filter(p => p.category === currentTab);
    }

    // Catalog switch tabs (Best sellers, new arrivals, discount)
    if (catalogFilter === 'new_arrivals') {
      list = list.filter(p => p.isNew);
    } else if (catalogFilter === 'sale_deals') {
      list = list.filter(p => p.isSale);
    } else {
      // Default / Best sellers sort
      list = list.sort((a,b) => b.rating - a.rating);
    }

    return list;
  };

  const cartTotalSum = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Hero slideshow slides definition
  const heroSlides = [
    {
      title: "Royal Crimson & Gold Gifting Bespoke Curations",
      subtitle: "PREMIUM EXPERIENCE",
      highlight: "Personalized hampers sculpted specifically for momentous Occasions.",
      bg: "bg-[#7A0026]",
      accent: "text-[#D4AF37]",
      actionText: "Build Your Custom Box",
      anchor: "#box-builder"
    },
    {
      title: "Handmade Delicacies from Gourmet Chocolatiers",
      subtitle: "BELGIAN CRAFTSMANSHIP",
      highlight: "Twelve-piece gold wrapped tins featuring rich hazelnut pralinés and liquid caramels.",
      bg: "bg-[#5A001B]",
      accent: "text-amber-300",
      actionText: "Shop Fine Chocolate",
      anchor: "#catalog-section"
    },
    {
      title: "Scented Botanicals & Calming Candle Hampers",
      subtitle: "THE LUXURY SPA ESCAPE",
      highlight: "Preserved gold pampas bouquets, rose petal salts, and hand-poured vanilla jars.",
      bg: "bg-[#3D1E26]",
      accent: "text-amber-400",
      actionText: "Explore Aromas",
      anchor: "#catalog-section"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-gray-800 font-sans selection:bg-[#7A0026] selection:text-white relative">
      
      {/* --- PROMO ANNOUNCEMENT BAR --- */}
      <div className="bg-[#7A0026] text-[#E6C15C] text-xs py-2 px-4 shadow-sm relative z-50 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-center gap-2">
          <p className="font-semibold tracking-wide flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3 animate-pulse text-[#D4AF37]" />
            EXQUISITE GIFTING: Enjoy Free Express Same-Day Shipping on custom orders over $75. Use code <span className="underline decoration-dotted text-white">GIFTZEE75</span>
          </p>
          <div className="hidden md:flex items-center gap-4 text-xs">
            <a href="#box-builder" className="hover:text-white transition-colors">Gift Box Studio</a>
            <span className="text-[#9E1B42]">|</span>
            <a href="#gift-finder" className="hover:text-white transition-colors">Occasion Finder</a>
            <span className="text-[#9E1B42]">|</span>
            <span>Support: 7204721444</span>
          </div>
        </div>
      </div>

      {/* --- TOAST SYSTEM --- */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-white border-l-4 border-[#7A0026] rounded-r-lg shadow-2xl p-4 flex items-start gap-3 animate-bounce">
          <div className="bg-[#7A0026]/10 p-2 roundedSecondary text-[#7A0026]">
            <Gift className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Giftzee Concierge</h4>
            <p className="text-xs text-gray-600 mt-0.5">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="ml-auto text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F7EBD3] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo Left */}
            <a href="#" className="flex items-center gap-3 shrink-0 focus:outline-none">
              <GiftzeeLogo className="h-16 w-auto" showText={true} />
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-black text-[#7A0026] tracking-tight leading-none">Giftzee</span>
                <span className="text-[10px] tracking-[0.25em] font-bold text-[#C5A55B] uppercase mt-0.5">Art Of Gifting</span>
              </div>
            </a>

            {/* Central Search Widget */}
            <div className="hidden lg:block flex-1 max-w-lg relative">
              <div className={`flex items-center border ${headerSearchFocused ? 'border-[#7A0026] ring-2 ring-[#7A0026]/10' : 'border-[#F1DFBA]'} bg-[#FFFDF9] rounded-full transition-all duration-300 px-4 py-2.5`}>
                <input 
                  type="text" 
                  placeholder="Search curated hampers, hand-made chocolates, soft plush toys..." 
                  className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400 focus:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setHeaderSearchFocused(true)}
                  onBlur={() => setTimeout(() => setHeaderSearchFocused(false), 200)}
                />
                {searchQuery ? (
                  <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 pr-2">
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
                <Search className="h-5 w-5 text-[#C5A55B]" />
              </div>

              {/* Instant Search Overlay */}
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-96 overflow-y-auto p-4 z-50">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C5A55B]">Search suggestions</span>
                    <span className="text-xs text-gray-400">{getFilteredProducts().length} items matched</span>
                  </div>
                  <div className="space-y-2">
                    {getFilteredProducts().slice(0, 5).map(prod => (
                      <div 
                        key={prod.id} 
                        onClick={() => { setQuickViewProduct(prod); setSearchQuery(''); }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50/50 cursor-pointer transition-colors"
                      >
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          className="w-10 h-10 object-cover rounded-lg bg-[#FAF6EE] shrink-0 border border-amber-100" 
                          referrerPolicy="no-referrer" 
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">{prod.name}</h4>
                          <span className="text-xs text-gray-500 uppercase">{prod.category}</span>
                        </div>
                        <span className="text-sm font-bold text-[#7A0026]">${prod.price}</span>
                      </div>
                    ))}
                    {getFilteredProducts().length === 0 && (
                      <p className="text-xs text-center text-gray-500 py-4">No specific items match: &quot;{searchQuery}&quot;</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Icons Right */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Support Hotline Widget */}
              <div className="hidden sm:flex flex-col text-right items-end justify-center pr-2 border-r border-[#FFF1D6]">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Premium Concierge</span>
                <span className="text-xs font-bold text-[#7A0026] hover:underline cursor-pointer">Support Desk</span>
              </div>

              {/* Wishlist Button */}
              <button 
                onClick={() => setWishlistOpen(true)}
                className="p-2 sm:p-2.5 rounded-full hover:bg-neutral-100 text-gray-700 relative transition-transform duration-200 hover:scale-105"
                title="View Favorites"
              >
                <Heart className={`h-6 w-6 ${wishlist.length > 0 ? 'fill-[#7A0026] text-[#7A0026] animate-pulse' : 'text-gray-600'}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-gray-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Drawer Toggle */}
              <button 
                onClick={() => setCartOpen(true)}
                className="p-2 sm:p-2.5 rounded-full hover:bg-neutral-100 text-gray-700 relative transition-transform duration-200 hover:scale-105"
                title="View Shopping Bag"
              >
                <ShoppingBag className="h-6 w-6 text-gray-600" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#7A0026] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                    {cart.reduce((count, item) => count + item.quantity, 0)}
                  </span>
                )}
              </button>

              {/* Logo in text overlay on smaller screens */}
              <div className="md:hidden flex items-center shrink-0">
                <a href="#box-builder" className="bg-[#7A0026] text-[#E6C15C] rounded-full p-2 hover:bg-[#5F001D] transition-colors" title="Custom Box Builder">
                  <Gift className="h-5 w-5 animate-pulse" />
                </a>
              </div>

            </div>

          </div>
        </div>

        {/* --- NAVIGATION SUB-BAR --- */}
        <nav className="bg-[#FFFDF9] border-t border-[#FFF1D6] hidden md:block">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center py-2 text-sm font-medium">
              <div className="flex gap-x-10">
                <a href="#" className="text-gray-900 hover:text-[#7A0026] font-semibold py-1.5 transition-colors border-b-2 border-transparent hover:border-[#7A0026]">Home</a>
                <a href="#box-builder" className="text-gray-900 hover:text-[#7A0026] font-semibold py-1.5 transition-colors flex items-center gap-1">
                  <Gift className="h-4 w-4 text-[#D4AF37] fill-[#D4AF37]" /> Custom Hampers Builder
                </a>
                <a href="#gift-finder" className="text-gray-900 hover:text-[#7A0026] font-semibold py-1.5 transition-colors">Gift Finder AI</a>
                <a href="#catalog-section" className="text-gray-900 hover:text-[#7A0026] font-semibold py-1.5 transition-colors">Artisan Catalog</a>
                <a href="#testimonials-lookbook" className="text-gray-900 hover:text-[#7A0026] font-semibold py-1.5 transition-colors">Customer Stories</a>
              </div>
              
              {/* Highlight Action Tag */}
              <a 
                href="#box-builder" 
                className="bg-[#7A0026] text-[#E6C15C] text-xs font-black tracking-widest uppercase hover:bg-neutral-900 hover:text-white px-5 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 hover:scale-105"
              >
                <span>Curate Hamper</span>
                <span className="bg-[#E6C15C] text-[#7A0026] rounded-full text-[9px] px-1.5 py-0.5 font-bold animate-ping">HOT</span>
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* --- HERO BANNER CAROUSEL --- */}
      <section className="relative overflow-hidden bg-gray-50">
        <div className="h-[520px] md:h-[600px] w-full transition-all duration-700 ease-in-out relative flex items-center">
          
          {/* Background overlay image container */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-[#7A0026]/40 z-10" />
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105 bg-blend-multiply bg-zinc-600"
            style={{
              backgroundImage: heroIndex === 0 
                ? 'url("https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1600&auto=format&fit=crop")' 
                : heroIndex === 1 
                ? 'url("https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=1600&auto=format&fit=crop")' 
                : 'url("https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1600&auto=format&fit=crop")'
            }}
          />

          {/* Banner Content Panel (Animated based on active sliding index) */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20 relative text-white">
            <AnimatePresence mode="wait">
              <motion.div 
                key={heroIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-2xl text-left"
              >
                <span className="inline-block bg-[#E6C15C] text-[#7A0026] text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-4 shadow-md">
                  {heroSlides[heroIndex].subtitle}
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-md">
                  {heroSlides[heroIndex].title}
                </h1>
                <p className="mt-4 text-base sm:text-lg text-amber-50/90 leading-relaxed font-light drop-shadow">
                  {heroSlides[heroIndex].highlight}
                </p>
                
                <div className="mt-8 flex flex-wrap gap-4">
                  <a 
                    href={heroSlides[heroIndex].anchor}
                    className="bg-[#E6C15C] hover:bg-white text-[#7A0026] font-bold px-8 py-3.5 rounded-full transition-all text-sm shadow-lg hover:shadow-xl inline-flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
                  >
                    <span>{heroSlides[heroIndex].actionText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a 
                    href="#gift-finder"
                    className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-semibold px-8 py-3.5 rounded-full transition-all text-sm inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Try Occasion Finder</span>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Arrows */}
          <button 
            onClick={() => setHeroIndex(prev => (prev - 1 + 3) % 3)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/30 text-white transition-all hidden sm:block"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={() => setHeroIndex(prev => (prev + 1) % 3)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/30 text-white transition-all hidden sm:block"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Carousel Indicator Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroIndex(idx)}
                className={`h-2.5 transition-all rounded-full ${heroIndex === idx ? 'w-8 bg-[#E6C15C]' : 'w-2.5 bg-white/40'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- EXQUISITE BRAND STATS CARD --- */}
      <section className="bg-white py-6 border-b border-[#F7EBD3] relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl font-black text-[#7A0026]">15,000+</span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C5A55B] mt-1">Bespoke Boxes Sent</span>
            </div>
            <div className="flex flex-col items-center border-l border-amber-300/30">
              <span className="font-serif text-3xl font-black text-[#7A0026]">100%</span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C5A55B] mt-1">Guaranteed Scent Accuracy</span>
            </div>
            <div className="flex flex-col items-center border-l border-amber-300/30">
              <span className="font-serif text-3xl font-black text-[#7A0026]">Belgian</span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C5A55B] mt-1">Fine Organic Cacao Only</span>
            </div>
            <div className="flex flex-col items-center border-l border-amber-300/30">
              <span className="font-serif text-3xl font-black text-[#7A0026]">2 Hours</span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C5A55B] mt-1">Local Delivery Window</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- DYNAMIC COLLAPSIBLE GIFT FINDER AI WIDGET --- */}
      <section id="gift-finder" className="py-14 bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EA] border-b border-[#F5E6CD]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="flex justify-center mb-3">
            <div className="p-2.5 bg-[#7A0026]/10 rounded-full text-[#7A0026]">
              <SlidersHorizontal className="h-6 w-6" />
            </div>
          </div>
          
          <h2 className="font-serif text-3xl font-extrabold text-gray-900 leading-tight">
            The Giftzee Signature Occasion Finder
          </h2>
          <p className="mt-2 text-sm text-gray-500 max-w-lg mx-auto">
            Struggling to find the perfect tokens? Replicate premium hampers tailored specifically to your budget and recipient. Try it below:
          </p>

          <form onSubmit={handleTriggerGiftFinder} className="mt-8 bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-[#FAECD3] text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Recipient Dropdown */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#7A0026] uppercase tracking-wider mb-2">Who is the Recipient?</label>
                <select 
                  className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#7A0026] focus:ring-1 focus:ring-[#7A0026]"
                  value={finderRecipient}
                  onChange={(e) => setFinderRecipient(e.target.value)}
                >
                  <option value="any">Any Recipient</option>
                  <option value="her">For Her</option>
                  <option value="him">For Him</option>
                  <option value="kids">For Kids</option>
                  <option value="parents">For Parents</option>
                  <option value="couple">For Couples</option>
                  <option value="coworker">For Coworkers</option>
                </select>
              </div>

              {/* Occasion Dropdown */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#7A0026] uppercase tracking-wider mb-2">What is the Occasion?</label>
                <select 
                  className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#7A0026] focus:ring-1 focus:ring-[#7A0026]"
                  value={finderOccasion}
                  onChange={(e) => setFinderOccasion(e.target.value)}
                >
                  <option value="any">Any Occasion</option>
                  <option value="birthday">Birthday Celebration</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="thank_you">Thank You Note</option>
                  <option value="love">Just Pure Love</option>
                </select>
              </div>

              {/* Budget Range Selector */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#7A0026] uppercase tracking-wider mb-2">Maximum Budget</label>
                <select 
                  className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#7A0026] focus:ring-1 focus:ring-[#7A0026]"
                  value={finderBudget}
                  onChange={(e) => setFinderBudget(e.target.value)}
                >
                  <option value="any">Show All Prices</option>
                  <option value="under_30">Under $30</option>
                  <option value="30_60">$30 - $60</option>
                  <option value="over_60">$60 and Above</option>
                </select>
              </div>

            </div>

            <div className="mt-8 flex justify-center">
              <button 
                type="submit" 
                disabled={finderLoading}
                className="bg-[#7A0026] hover:bg-neutral-900 text-[#E6C15C] font-extrabold px-10 py-4 rounded-full text-sm tracking-widest uppercase transition-all shadow-md inline-flex items-center gap-2"
              >
                {finderLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#E6C15C]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Analyzing Catalogs...</span>
                  </>
                ) : (
                  <>
                    <Gift className="h-4 w-4 text-[#E6C15C]" />
                    <span>Find My Perfect Gift!</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* GIFTYMO FINDER RESULTS DISPLAY */}
          {finderResults !== null && (
            <div id="gift-finder-results" className="mt-12 text-left border-t border-dashed border-amber-300 pt-10 animate-fade-in scroll-mt-24">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-gray-900">Recommended Match Suggestions</h3>
                  <p className="text-xs text-gray-500 mt-1">Based on chosen filters: recipient (&quot;{finderRecipient || 'any'}&quot;), occasion (&quot;{finderOccasion || 'any'}&quot;), budget (&quot;{finderBudget || 'any'}&quot;)</p>
                </div>
                <button 
                  onClick={() => setFinderResults(null)} 
                  className="text-xs font-bold text-[#7A0026] underline hover:no-underline"
                >
                  Clear Recommendations
                </button>
              </div>

              {finderResults.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center shadow">
                  <span className="text-4xl text-gray-300 block mb-2">🎁</span>
                  <p className="text-sm font-semibold text-gray-600">No pre-packaged items perfectly matched these criteria.</p>
                  <p className="text-xs text-gray-400 mt-1">We highly recommend custom crafting your own boutique crate in the Personal Box Builder below!</p>
                  <a href="#box-builder" className="mt-4 bg-[#D4AF37] text-gray-900 text-xs font-bold px-6 py-2.5 rounded-full inline-block">Curate Box From Scratch</a>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {finderResults.map(p => (
                    <motion.div 
                      key={p.id} 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -6, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-2xl border border-[#FAECD3] p-4 relative group hover:shadow-lg transition-shadow"
                    >
                      <div className="bg-[#FAF5EA] h-40 rounded-xl relative flex items-center justify-center overflow-hidden mb-3">
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          referrerPolicy="no-referrer" 
                        />
                        <button 
                          onClick={() => toggleWishlist(p.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-gray-400 hover:text-[#7A0026] shadow z-10"
                        >
                          <Heart className={`h-4 w-4 ${wishlist.includes(p.id) ? 'fill-[#7A0026] text-[#7A0026]' : ''}`} />
                        </button>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 truncate">{p.name}</h4>
                      <p className="text-xs text-gray-500 font-serif leading-tight mt-1 truncate">{p.description}</p>
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                        <span className="text-sm font-black text-[#7A0026]">${p.price}</span>
                        <button 
                          onClick={() => handleAddToCart(p)}
                          className="bg-[#7A0026] text-[#E6C15C] rounded-full p-2 hover:bg-neutral-900 transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* --- PERSONALIZED GIFT BOX BUILDER (INTERACTIVE MULTI-STEP STUDIO) --- */}
      <section id="box-builder" className="py-16 md:py-24 bg-[#FAF6EE] scroll-mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#C5A55B]">BESPOKE SELECTIONS</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#7A0026] mt-2 leading-tight">
              Bespoke Gift Box Builder Studio
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-500 font-light">
              Craft a perfect personalized hamper in three simplified steps. Select box volume, stack with sweets or aroma candles, and write a greeting card. We assemble and wrap with custom golden ribbons!
            </p>
          </div>

          {/* Builder Step Progress Tracker */}
          <div className="max-w-xl mx-auto mb-12 relative px-4 text-xs font-bold uppercase tracking-wider text-gray-500">
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-amber-200/50 -translate-y-1/2 -z-10" />
            <div className="flex justify-between items-center bg-transparent z-10 relative">
              
              {/* Step 1 indicator */}
              <button 
                onClick={() => setBuilderStep(1)}
                className={`flex flex-col items-center gap-2 focus:outline-none`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${builderStep >= 1 ? 'bg-[#7A0026] text-[#E6C15C]' : 'bg-white text-gray-400 border border-gray-200'}`}>1</span>
                <span className={builderStep === 1 ? 'text-[#7A0026]' : 'text-gray-400'}>Box Style</span>
              </button>

              {/* Step 2 indicator */}
              <button 
                onClick={() => setBuilderStep(2)}
                className={`flex flex-col items-center gap-2 focus:outline-none`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${builderStep >= 2 ? 'bg-[#7A0026] text-[#E6C15C]' : 'bg-white text-gray-400 border border-gray-200'}`}>2</span>
                <span className={builderStep === 2 ? 'text-[#7A0026]' : 'text-gray-400'}>Treat fillers</span>
              </button>

              {/* Step 3 indicator */}
              <button 
                onClick={() => {
                  if (!builderSelectedBox) { triggerToast('Please pick a box first!', 'error'); return; }
                  setBuilderStep(3);
                }}
                className={`flex flex-col items-center gap-2 focus:outline-none`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${builderStep >= 3 ? 'bg-[#7A0026] text-[#E6C15C]' : 'bg-white text-gray-400 border border-gray-200'}`}>3</span>
                <span className={builderStep === 3 ? 'text-[#7A0026]' : 'text-gray-400'}>Greeting Card</span>
              </button>

            </div>
          </div>

          {/* Main Box Builder Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Choices Panel (size: 7 of 12) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-100 min-h-[460px]">
              
              {/* --- STEP 1: CHOOSE BOX SIZE/COLOR --- */}
              {builderStep === 1 && (
                <div className="animate-fade-in">
                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">Step 1: Pick Luxury Crate Style</h3>
                  <p className="text-xs text-gray-500 mb-6">Select a keepsake build volume. Larger sizes hold more premium treats.</p>
                  
                  <div className="space-y-4">
                    {BOX_OPTIONS.map(opt => {
                      const isSelected = builderSelectedBox?.id === opt.id;
                      return (
                        <motion.div 
                          key={opt.id}
                          onClick={() => setBuilderSelectedBox(opt)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`border-2 rounded-2xl p-5 cursor-pointer transition-all flex items-center gap-4 ${isSelected ? 'border-[#7A0026] bg-amber-50/20 shadow-md' : 'border-gray-100 hover:border-amber-200 bg-[#FFFDF9]'}`}
                        >
                          <img 
                            src={opt.image} 
                            alt={opt.name} 
                            className="w-16 h-16 object-cover rounded-xl border border-amber-100 select-none shrink-0 bg-amber-50" 
                            referrerPolicy="no-referrer" 
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <h4 className="font-bold text-gray-900 text-base truncate">{opt.name}</h4>
                              <span className="text-sm font-black text-[#7A0026]">${opt.price}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed truncate">{opt.description}</p>
                            <span className="inline-block bg-[#FAF6EE] text-[#C5A55B] font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider mt-2">
                              Max Capacity: {opt.capacity} treats Limit
                            </span>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#7A0026] bg-[#7A0026]' : 'border-gray-300'}`}>
                            {isSelected && <Check className="h-4 w-4 text-white" />}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={() => setBuilderStep(2)}
                      className="bg-[#7A0026] hover:bg-neutral-950 text-white font-bold px-8 py-3 rounded-full text-xs uppercase tracking-widest inline-flex items-center gap-2 shadow"
                    >
                      <span>Choose Fillers (Step 2)</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* --- STEP 2: CHOOSE FILLERS & TREATS --- */}
              {builderStep === 2 && (
                <div className="animate-fade-in">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-gray-900">Step 2: Stack Luxury Items</h3>
                      <p className="text-xs text-gray-500">Click to fill your box style. Items can correspond to gourmet, spa oils or luxury keepsakes.</p>
                    </div>
                    {builderSelectedBox && (
                      <div className="bg-[#7A0026]/5 rounded-xl border border-[#7A0026]/10 px-3 py-1 text-center">
                        <span className="block text-[8px] uppercase tracking-widest font-bold text-[#7A0026]">Capacity Limit</span>
                        <span className="text-xs font-black text-[#7A0026]">
                          {currentItemsCount} / {builderSelectedBox.capacity} Items Added
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Filler Category Filter Tab */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                    {['all', 'chocolates', 'candles', 'bath', 'drinks'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => {}} // Simple local filter shown by rendering below
                        className="bg-gray-55 bg-[#FFFDF9] hover:bg-amber-50 text-xs py-2 px-3 border border-amber-100 rounded-xl font-semibold capitalize text-gray-600 focus:outline-none"
                      >
                        {cat === 'all' ? 'Featured Fillers' : cat}
                      </button>
                    ))}
                  </div>

                  {/* List Fillers Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1 pb-4">
                    {FILLER_ITEMS.map(f => {
                      const itemInBox = builderAddedFillers.find(added => added.item.id === f.id);
                      const qtyInBox = itemInBox ? itemInBox.qty : 0;
                      return (
                        <div key={f.id} className="border border-amber-100 hover:border-[#7A0026]/40 transition-colors bg-[#FFFDF9] rounded-xl p-3 flex items-center justify-between gap-3">
                          <img 
                            src={f.image} 
                            alt={f.name} 
                            className="w-12 h-12 object-cover rounded-xl border border-amber-50 bg-amber-50 select-none shrink-0" 
                            referrerPolicy="no-referrer" 
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-gray-900 truncate">{f.name}</h4>
                            <span className="text-[10px] font-bold text-[#C5A55B] uppercase block">{f.category}</span>
                            <span className="block text-xs font-black text-[#7A0026] mt-0.5">${f.price}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            {qtyInBox > 0 ? (
                              <>
                                <button 
                                  onClick={() => handleRemoveFillerFromBox(f.id)}
                                  className="p-1 rounded-full bg-[#7A0026]/10 text-[#7A0026] hover:bg-[#7A0026] hover:text-white"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="text-xs font-bold w-4 text-center">{qtyInBox}</span>
                              </>
                            ) : null}
                            <button 
                              onClick={() => handleAddFillerToBox(f)}
                              className="p-1 rounded-full bg-[#E6C15C] text-gray-900 hover:bg-[#7A0026] hover:text-white"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 flex justify-between gap-4">
                    <button 
                      onClick={() => setBuilderStep(1)}
                      className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold px-6 py-3 rounded-full text-xs uppercase tracking-widest"
                    >
                      Back To Box Size
                    </button>
                    <button 
                      onClick={() => setBuilderStep(3)}
                      className="bg-[#7A0026] hover:bg-neutral-950 text-white font-bold px-8 py-3 rounded-full text-xs uppercase tracking-widest inline-flex items-center gap-2 shadow"
                    >
                      <span>Choose Card Note (Step 3)</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* --- STEP 3: PICK GREETING CARD --- */}
              {builderStep === 3 && (
                <div className="animate-fade-in">
                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">Step 3: Elegant Signature Card</h3>
                  <p className="text-xs text-gray-500 mb-6">Select a boutique greeting note. Type your custom handwritten message below.</p>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
                    {GREETING_CARDS.map(card => {
                      const isSelected = builderSelectedCard?.id === card.id;
                      return (
                        <div 
                          key={card.id}
                          onClick={() => setBuilderSelectedCard(card)}
                          className={`border-2 rounded-xl p-2.5 text-center cursor-pointer transition-all ${isSelected ? 'border-[#7A0026] bg-amber-50/10 scale-105 shadow-md' : 'border-gray-100 hover:border-amber-200 bg-[#FFFDF9]'}`}
                        >
                          <div className="bg-[#FAF6EE] h-16 rounded-lg overflow-hidden mb-2 relative border border-amber-100">
                            <img 
                              src={card.image} 
                              alt={card.name} 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer" 
                            />
                          </div>
                          <span className="text-[10px] font-bold text-gray-900 block leading-tight truncate">{card.name}</span>
                          <span className="text-[9px] uppercase font-bold text-[#C5A55B] block mt-1">{card.category}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Live Handwritten Card Form Layout */}
                  <div className="bg-amber-50/30 p-5 rounded-2xl border border-amber-100">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#7A0026] block mb-3">Handwritten Letter Message:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">To (Recipient Name)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Grandma, Sarah, Alex..." 
                          className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#7A0026]"
                          value={builderRecipient}
                          onChange={(e) => setBuilderRecipient(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">From (Sender Name)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Your Loving Son, Anonymous, Kalyan..." 
                          className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#7A0026]"
                          value={builderSender}
                          onChange={(e) => setBuilderSender(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Personal Greeting Massage</label>
                      <textarea 
                        rows={3}
                        placeholder="Type personal wish. Previews instantly in visualizers..." 
                        className="w-full bg-white border border-amber-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#7A0026]"
                        value={builderMessage}
                        onChange={(e) => setBuilderMessage(e.target.value)}
                        maxLength={180}
                      />
                      <span className="text-[9px] text-gray-400 block text-right mt-1">{builderMessage.length}/180 maximum characters</span>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between gap-4">
                    <button 
                      onClick={() => setBuilderStep(2)}
                      className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold px-6 py-3 rounded-full text-xs uppercase tracking-widest"
                    >
                      Back To Treats
                    </button>
                    <button 
                      onClick={handleAddCustomBoxToCart}
                      className="bg-[#7A0026] hover:bg-neutral-900 text-[#E6C15C] font-extrabold px-8 py-3 rounded-full text-xs uppercase tracking-widest inline-flex items-center gap-2 shadow"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Assemble & Add Box to Bag</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Dynamic Crate Visualizer (size: 5 of 12) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-100 flex flex-col justify-between self-stretch min-h-[460px]">
              
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
                  <span className="text-xs font-black uppercase tracking-wider text-[#C5A55B]">LIVE VISUALIZER</span>
                  <span className="bg-[#FAF6EE] text-[#7A0026] font-bold text-[10px] px-2 py-0.5 rounded">Real-Time Canvas</span>
                </div>

                {/* Simulated Crate box drawing */}
                <div className="bg-[#FAF5EA] rounded-2xl p-6 border border-dashed border-amber-300 flex flex-col items-center justify-center text-center py-10 relative overflow-hidden min-h-[220px]">
                  
                  {/* Decorative ribbon in background */}
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3 bg-[#7A0026]/10 -z-0" />
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-3 bg-[#7A0026]/10 -z-0" />

                  {/* Display box icon or actual treats floating */}
                  {currentItemsCount === 0 ? (
                    <div className="z-10 relative">
                      <span className="text-5xl animate-bounce duration-1000 block">📦</span>
                      <h4 className="text-sm font-bold text-gray-800 mt-2 capitalize">{builderSelectedBox?.name || 'Hamper'}</h4>
                      <p className="text-[11px] text-gray-400 max-w-[200px] mt-1">Ready for curation. Fill with delicious things in Step 2!</p>
                    </div>
                  ) : (
                    <div className="z-10 relative w-full">
                      {/* Interactive stacked pile representation */}
                      <span className="text-3xl block mb-2">🎁</span>
                      <p className="text-[10px] font-bold tracking-wider text-[#C5A55B] uppercase">Crate Inventory</p>
                      
                      {/* Grid listing treat icons */}
                      <div className="flex flex-wrap justify-center gap-2 mt-3 max-w-[260px] mx-auto">
                        {builderAddedFillers.map(f => (
                          <div key={f.item.id} className="relative group bg-white border border-amber-100 rounded-lg overflow-hidden w-11 h-11 flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
                            <img 
                              src={f.item.image} 
                              alt={f.item.name} 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer" 
                            />
                            <span className="absolute -top-1 -right-1 bg-[#7A0026] text-white font-bold text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow">
                              {f.qty}
                            </span>
                          </div>
                        ))}
                      </div>

                      <p className="text-xs font-bold text-[#7A0026] mt-4 capitalize">
                        {builderSelectedBox?.name} ({currentItemsCount} treat slots filled)
                      </p>
                    </div>
                  )}

                  {/* Scent & ribbon indicator tag overlays */}
                  <div className="absolute bottom-2 right-2 bg-white/90 rounded border border-amber-100 px-2 py-0.5 text-[9px] font-bold text-[#C5A55B]">
                    🎀 Gold Ribbon Wrap Engaged
                  </div>
                </div>

                {/* Greeting Card Preview Paper (Simulated Premium Callout) */}
                {builderSelectedCard && (
                  <div className="mt-6 p-4 rounded-2xl bg-[#FFFDF9] border border-l-4 border-amber-300/60 shadow-inner flex gap-3 relative overflow-hidden items-center">
                    <img 
                      src={builderSelectedCard.image} 
                      alt={builderSelectedCard.name} 
                      className="w-14 h-14 object-cover rounded-xl border border-amber-200 shadow-sm shrink-0 select-none bg-amber-50" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[8px] uppercase tracking-wider font-bold text-amber-500">Live Custom Gift Card</span>
                      <p className="text-xs font-serif font-black text-gray-900 leading-tight truncate">{builderSelectedCard.name}</p>
                      <p className="text-xs italic text-gray-600 font-serif mt-1 leading-relaxed border-t border-dotted border-amber-200 pt-1.5 pr-2 truncate">
                        &quot;{builderMessage || 'Best wishes from Giftzee!'}&quot;
                      </p>
                      <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 mt-2">
                        <span>To: <span className="text-gray-900">{builderRecipient || '---'}</span></span>
                        <span>From: <span className="text-gray-900">{builderSender || '---'}</span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Box calculation receipt list footer */}
              <div className="mt-8 pt-4 border-t border-dashed border-gray-100">
                <div className="space-y-1.5 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Selected Box style ({builderSelectedBox?.colorName})</span>
                    <span className="font-bold text-gray-900">${boxBasePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delicacy Fillers ({currentItemsCount} articles)</span>
                    <span className="font-bold text-gray-900">${boxFillersTotal.toFixed(2)}</span>
                  </div>
                  {builderSelectedCard && (
                    <div className="flex justify-between">
                      <span>Bespoke card note (+ print envelope)</span>
                      <span className="font-bold text-gray-900">$2.50</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#C5A55B]">Estimated Crate Price</span>
                  <span className="text-xl font-black text-[#7A0026]">${computedBoxPrice.toFixed(2)}</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* --- RECONSTRUCTED ECO/VALUE COLLATERAL PROPOSITION BADGES --- */}
      <section className="py-12 bg-white border-y border-[#F3E2C4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="p-3 rounded-2xl bg-[#7A0026]/5 text-[#7A0026] shrink-0">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Express White-Glove Shipping</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Same-day local deliveries tracked through live concierge. Free on luxury Hampers exceeding $75.</p>
              </div>
            </div>
            
            <div className="flex gap-4 border-t md:border-t-0 md:border-x border-amber-200/40 pt-6 md:pt-0 md:px-8">
              <div className="p-3 rounded-2xl bg-[#7A0026]/5 text-[#7A0026] shrink-0">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">100% Biodegradable Kraft Packing</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">All box styles employ organic vegetable starch fill peanuts, soy inks, and recycled Golden satin ribbons.</p>
              </div>
            </div>

            <div className="flex gap-4 border-t md:border-t-0 pt-6 md:pt-0">
              <div className="p-3 rounded-2xl bg-[#7A0026]/5 text-[#7A0026] shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Secure Encrypted Transactions</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Shop safely with 256-bit secure checkout systems. Backed by the trusted Giftzee Satisfaction Commitment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CORE PRODUCT CATALOG SHOWCASE SECTION WITH WOOCONNECT INTERFACE --- */}
      <section id="catalog-section" className="py-16 md:py-24 bg-[#FFFDF9] scroll-mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header element to filter the items */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#C5A55B]">ARTISAN CATALOG</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#7A0026] mt-2">
                Curated Gift Packs & Hampers
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Replicate the boutique Woodmart WooCommerce look &amp; feel. Select individual hampers to add directly to bag.</p>
            </div>
            
            {/* Switcheable tabs (Best Sellers, New Arrivals, Sale) */}
            <div className="flex bg-amber-50/50 border border-amber-100 rounded-full p-1 text-xs font-bold font-sans">
              <button 
                onClick={() => setCatalogFilter('best_sellers')}
                className={`px-5 py-2.5 rounded-full transition-all ${catalogFilter === 'best_sellers' ? 'bg-[#7A0026] text-[#E6C15C]' : 'text-gray-500 hover:text-[#7A0026]'}`}
              >
                Best Sellers
              </button>
              <button 
                onClick={() => setCatalogFilter('new_arrivals')}
                className={`px-5 py-2.5 rounded-full transition-all ${catalogFilter === 'new_arrivals' ? 'bg-[#7A0026] text-[#E6C15C]' : 'text-gray-500 hover:text-[#7A0026]'}`}
              >
                New Arrivals
              </button>
              <button 
                onClick={() => setCatalogFilter('sale_deals')}
                className={`px-5 py-2.5 rounded-full transition-all ${catalogFilter === 'sale_deals' ? 'bg-[#7A0026] text-[#E6C15C]' : 'text-gray-500 hover:text-[#7A0026]'}`}
              >
                On Hot Sale
              </button>
            </div>
          </div>

          {/* Category Quick Filter Menu Icons */}
          <div className="flex flex-wrap items-center gap-3 justify-start mb-10 pb-4 border-b border-gray-100">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCurrentTab(cat.id as any)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all border ${currentTab === cat.id ? 'border-[#7A0026] bg-[#7A0026] text-[#E6C15C]' : 'border-amber-200/50 hover:border-[#7A0026]/40 bg-white text-gray-650'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Catalog Showcase Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {getFilteredProducts().map((prod, pIdx) => {
              const isWishlisted = wishlist.includes(prod.id);
              return (
                <motion.div 
                  key={prod.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: Math.min(pIdx * 0.05, 0.3) }}
                  className="bg-white rounded-3xl p-5 border border-[#FAECD3] shadow-sm hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between"
                  id={`product-card-${prod.id}`}
                >
                  
                  {/* Image wrapper with tags */}
                  <div>
                    <div className="bg-[#FAF6EE] h-48 rounded-2xl relative flex items-center justify-center overflow-hidden mb-4 group-hover:scale-[1.01] transition-transform">
                      <div className="absolute inset-0 bg-transparent transition-colors group-hover:bg-amber-300/5 z-10" />
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        referrerPolicy="no-referrer" 
                      />
                      
                      {/* Floating Ribbon Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1 z-15">
                        {prod.isNew && (
                          <span className="bg-[#7A0026] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">NEW</span>
                        )}
                        {prod.isSale && (
                          <span className="bg-[#D4AF37] text-gray-900 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">SALE</span>
                        )}
                      </div>

                      {/* Wishlist Heart Toggle */}
                      <button 
                        onClick={() => toggleWishlist(prod.id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full text-gray-400 hover:text-[#7A0026] shadow-md transition-transform duration-200 hover:scale-115 z-15 cursor-pointer"
                        title="Add to wishlist"
                      >
                        <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-[#7A0026] text-[#7A0026]' : ''}`} />
                      </button>

                      {/* Quick view overlay button */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-15">
                        <button 
                          onClick={() => { setQuickViewProduct(prod); setSelectedQuickViewWrap('none'); }}
                          className="bg-white hover:bg-[#7A0026] hover:text-[#E6C15C] text-[#7A0026] font-bold text-xs py-2.5 px-5 rounded-full transition-colors duration-200 shadow-lg transform translate-y-2 group-hover:translate-y-0 cursor-pointer"
                        >
                          Quick Look View
                        </button>
                      </div>
                    </div>

                    {/* Meta Rating Stars */}
                    <div className="flex items-center gap-1">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < Math.floor(prod.rating) ? 'fill-current' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold ml-1">({prod.reviewsCount} reviews)</span>
                    </div>

                    {/* Title & Desc */}
                    <h3 className="font-serif font-black text-gray-900 text-base mt-2 hover:text-[#7A0026] cursor-pointer" onClick={() => { setQuickViewProduct(prod); setSelectedQuickViewWrap('none'); }}>
                      {prod.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-light leading-relaxed mt-1 line-clamp-2">
                      {prod.description}
                    </p>
                  </div>

                  {/* Foot Pricing & Ajax actions */}
                  <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-[#7A0026]">${prod.price}</span>
                      {prod.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">${prod.originalPrice}</span>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => handleAddToCart(prod)}
                      className="bg-[#7A0026] hover:bg-neutral-900 text-[#E6C15C] text-xs font-bold py-2.5 px-4.5 rounded-full transition-all inline-flex items-center gap-1.5 shadow"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Bag</span>
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* --- CUSTOMER STORIES / LOOKBOOK TESTIMONIALS --- */}
      <section id="testimonials-lookbook" className="py-16 md:py-20 bg-gradient-to-b from-[#FFFDF9] to-[#FAF6EE] border-t border-[#F1DFBA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#C5A55B]">REAL CONCENTRIC CUSTOMERS</span>
            <h2 className="font-serif text-3xl font-extrabold text-[#7A0026] mt-2">
              Endorsed with Infinite Devotion
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Discover words from mothers, partners, and coworkers whom we converted into absolute believers of high-grade gifting.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, tIdx) => (
              <motion.div 
                key={t.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: tIdx * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-6 md:p-8 border border-amber-100/50 shadow-sm relative hover:shadow-md transition-shadow"
              >
                {/* Floating quote sign */}
                <span className="absolute top-4 right-6 text-7xl font-serif text-[#C5A55B]/10 select-none">&ldquo;</span>
                
                {/* Five star ratings */}
                <div className="flex text-amber-500 mb-4 font-sans">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm font-light leading-relaxed text-gray-600 italic">
                  &quot;{t.quote}&quot;
                </p>

                {/* Profile display below */}
                <div className="flex items-center gap-3.5 mt-6 pt-5 border-t border-gray-100">
                  <img 
                    src={t.avatar} 
                    alt={t.name} 
                    className="w-11 h-11 object-cover rounded-full border border-amber-200 shadow-sm shrink-0 bg-amber-50" 
                    referrerPolicy="no-referrer" 
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{t.name}</h4>
                    <span className="text-[10px] text-gray-400 block">{t.location} • {t.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* --- RECONSTRUCTED INSTAGRAM GRID & FLUID FOOTER LOOKBOOK FEED --- */}
      <section className="bg-white py-12 border-t border-[#FAECD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-black uppercase tracking-[0.15em] text-[#7A0026]">#GIFTZEEMOMENTS</span>
          <h3 className="font-serif text-2xl font-black text-gray-900 mt-1">Join Our Gifting Newsletter</h3>
          <p className="text-xs text-gray-500 mt-1 mb-8 max-w-sm mx-auto">Subscribe for exclusive golden coupons, seasonal collections, and bespoke ribbon recipes.</p>
          
          <div className="max-w-md mx-auto relative mb-12">
            {newsletterSubmitted ? (
              <div className="bg-[#FAF6EE] border border-amber-200 rounded-full px-6 py-4 text-xs font-bold text-[#7A0026]">
                💐 Subscription Engaged! Watch your inbox for a 15% Golden Coupon code.
              </div>
            ) : (
              <div className="flex items-center border border-[#F1DFBA] bg-[#FFFDF9] rounded-full p-1 pl-4">
                <input 
                  type="email" 
                  placeholder="Enter luxury mail address..." 
                  className="bg-transparent border-none outline-none text-xs w-full text-gray-700 placeholder-gray-400"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <button 
                  onClick={() => {
                    if (!newsletterEmail) return;
                    setNewsletterSubmitted(true);
                    triggerToast('Thank you for subscribing to Giftzee!', 'success');
                  }}
                  className="bg-[#7A0026] hover:bg-neutral-900 text-[#E6C15C] rounded-full px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-all shadow"
                >
                  Join Us
                </button>
              </div>
            )}
          </div>

          {/* Luxury vector icon highlights of gift categories */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { label: 'Belgian Truffles', image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=300' },
              { label: 'Royal Crimson Boxes', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=300' },
              { label: 'Scented Vanilla Soy', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=300' },
              { label: 'Dried Preserved Pampas', image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&q=80&w=300' },
              { label: 'Bespoke Ceremony Notes', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=300' },
              { label: 'Acoustic Plush Teddies', image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=300' }
            ].map((ins, idx) => (
              <div key={idx} className="bg-white border border-[#FAECD3] rounded-3xl p-4 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 hover:shadow-md">
                <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 border border-amber-100 flex items-center justify-center">
                  <img 
                    src={ins.image} 
                    alt={ins.label} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#7A0026] block leading-snug">{ins.label}</span>
                <span className="text-[9px] text-[#C5A55B] block mt-1">Verified organic</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- FOOTER MAP & DETAILS --- */}
      <footer className="bg-[#1C0009] text-gray-300 pt-16 pb-12 font-sans overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Description Block Left (size: 4 of 12) */}
            <div className="md:col-span-4 space-y-5">
              <div className="flex items-center gap-3">
                <GiftzeeLogo className="h-10 w-auto text-amber-500 fill-amber-500" showText={true} />
                <span className="font-serif text-xl font-bold text-[#E6C15C] tracking-wide">Giftzee</span>
              </div>
              <p className="text-xs text-amber-50/60 leading-relaxed font-light">
                Beautiful replica inspired by the exquisite Gifymo template layout. Styled with premium maroon and gold colorways matching the Giftzee brand identity. Built using React and Tailwind CSS.
              </p>
              <div className="flex gap-4 text-xs">
                <span className="text-[#E6C15C]">🎁 Concierge Live Desk Available</span>
              </div>
            </div>

            {/* Links Block 1 (size: 2 of 12) */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs font-bold uppercase text-[#E6C15C] tracking-widest">Seasonal Shop</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><a href="#catalog-section" className="hover:text-white transition-colors">Bespoke Birthday</a></li>
                <li><a href="#catalog-section" className="hover:text-white transition-colors">Anniversary Collections</a></li>
                <li><a href="#catalog-section" className="hover:text-white transition-colors">Special Sympathy Notes</a></li>
                <li><a href="#catalog-section" className="hover:text-white transition-colors">Corporate Crate Packs</a></li>
              </ul>
            </div>

            {/* Links Block 2 (size: 2 of 12) */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs font-bold uppercase text-[#E6C15C] tracking-widest">Quick actions</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><a href="#box-builder" className="hover:text-white transition-colors">Bespoke Box Studio</a></li>
                <li><a href="#gift-finder" className="hover:text-white transition-colors">Occasion Finder Widget</a></li>
                <li><a href="#catalog-section" className="hover:text-white transition-colors">Fine artisan Chocolate</a></li>
                <li><a href="#testimonials-lookbook" className="hover:text-white transition-colors">Customer Review Log</a></li>
              </ul>
            </div>

            {/* Locations Block Right (size: 4 of 12) */}
            <div className="md:col-span-4 space-y-4 text-xs">
              <h4 className="text-xs font-bold uppercase text-[#E6C15C] tracking-widest">Giftzee Boutique Counter</h4>
              <p className="text-gray-400 flex items-start gap-2 max-w-sm">
                <MapPin className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>#52, 3rd Cross, Aswath Nagar, Marathahalli, Bengaluru, Karnataka-560037</span>
              </p>
              <p className="text-gray-400 flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#D4AF37]" />
                <span>7204721444</span>
              </p>
              <p className="text-gray-400 flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#D4AF37]" />
                <span>giftzee.online@gmail.com</span>
              </p>
            </div>

          </div>

          {/* Subfooter section */}
          <div className="mt-16 pt-8 border-t border-[#3D0315] text-center text-[11px] text-gray-500">
            <p>© {new Date().getFullYear()} Giftzee Inc. All rights reserved. Inspired by Gifymo WooCommerce Template elements.</p>
            <p className="mt-1 text-gray-600">Reconstructed with React, Tailwind CSS, and embedded Vector inline SVG system for deployment on Github Pages.</p>
          </div>
        </div>
      </footer>


      {/* --- DIALOG MODALS & SIDEBARS --- */}

      {/* 1. AJAX SHOPPING CART SIDEBAR DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" id="cart-drawer-overlay">
          {/* Backdrop screen */}
          <div onClick={() => setCartOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300" />
          
          {/* Drawer container body */}
          <div className="bg-white w-full max-w-md h-full relative z-10 flex flex-col justify-between shadow-2xl animate-slide-left pointer-events-auto">
            
            {/* Header elements of drawer */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#7A0026]" />
                <h3 className="font-serif text-lg font-bold text-gray-900">Your Gifting Bag</h3>
                <span className="bg-amber-100 text-[#7A0026] text-xs font-bold rounded-full px-2.5 py-0.5">
                  {cart.length} unique items
                </span>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-1 rounded-full hover:bg-neutral-100 text-gray-500 hover:text-gray-800">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* List items drawer scroll body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {checkoutStep === 'processing' ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <svg className="animate-spin h-10 w-10 text-[#7A0026] mb-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <h4 className="font-bold text-gray-800">Authenticating Payments</h4>
                  <p className="text-xs text-gray-400 mt-1">Contacting secure credit processors...</p>
                </div>
              ) : checkoutStep === 'success' ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-emerald-700 bg-emerald-50/20 p-6 rounded-3xl border border-dashed border-emerald-200">
                  <span className="text-5xl animate-bounce mb-3">🎉</span>
                  <h4 className="text-lg font-extrabold font-serif">Order Authenticated!</h4>
                  <p className="text-xs text-emerald-800 mt-2 max-w-xs">Your custom hampers have been assigned to white-glove packaging. Watch your email address for live concierge tracking logs.</p>
                  <button 
                    onClick={() => { setCheckoutStep('idle'); setCartOpen(false); }}
                    className="mt-6 bg-[#7A0026] text-[#E6C15C] font-bold py-2.5 px-6 rounded-full text-xs uppercase cursor-pointer"
                  >
                    Continue Gifting
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center text-gray-400 max-w-xs mx-auto">
                  <span className="text-5xl block mb-3">🧺</span>
                  <p className="text-sm font-semibold text-gray-600">Your shopping basket is empty</p>
                  <p className="text-xs text-gray-400 mt-1">Pack customized chocolate crates, bath salts, or premium flowers to surprise your loved ones!</p>
                  <button 
                    onClick={() => { setCartOpen(false); }}
                    className="mt-6 bg-[#7A0026] hover:bg-neutral-900 text-[#E6C15C] text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer"
                  >
                    Explore Artisan Collections
                  </button>
                </div>
              ) : (
                /* Cart Items Grid */
                cart.map((item, idx) => (
                  <div key={item.id} className="border-b border-gray-100 pb-4 flex gap-4">
                    
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-xl bg-[#FAF6EE] border border-amber-100 overflow-hidden flex items-center justify-center shrink-0">
                      {item.type === 'product' ? (
                        <img 
                          src={item.product?.image} 
                          alt={item.product?.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer" 
                        />
                      ) : (
                        <img 
                          src={item.customBox?.box.image} 
                          alt={item.customBox?.box.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer" 
                        />
                      )}
                    </div>

                    {/* Item Specifics */}
                    <div className="flex-1 min-w-0">
                      {item.type === 'product' ? (
                        <>
                          <h4 className="text-xs font-bold text-gray-900 truncate">{item.product?.name}</h4>
                          <span className="text-[10px] uppercase font-bold text-[#C5A55B] tracking-wider">{item.product?.category}</span>
                        </>
                      ) : (
                        <>
                          <h4 className="text-xs font-bold text-gray-900 truncate">Curated {item.customBox?.box.name}</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.customBox?.fillers.map(f => (
                              <span key={f.item.id} className="inline-flex items-center gap-0.5 text-[9px] bg-amber-50 hover:bg-amber-100 border border-amber-100/40 rounded px-1 text-gray-600">
                                <img src={f.item.image} alt={f.item.name} className="w-3 h-3 object-cover rounded" referrerPolicy="no-referrer" />
                                <span className="font-medium truncate max-w-[60px]">{f.item.name} ({f.qty})</span>
                              </span>
                            ))}
                          </div>
                          <span className="block text-[9px] text-[#7A0026] mt-1.5 font-bold italic truncate">
                            Envelope Note: &quot;{item.customBox?.message}&quot;
                          </span>
                        </>
                      )}

                      {/* Quantity display / Price */}
                      <div className="flex justify-between items-center mt-2.5">
                        <span className="text-xs font-black text-[#7A0026]">${(item.price * item.quantity).toFixed(2)}</span>
                        
                        {/* Interactive Quantity editor */}
                        <div className="flex items-center gap-2 border border-amber-200 rounded-lg p-0.5 bg-[#FFFDF9]">
                          <button 
                            onClick={() => {
                              const newCart = [...cart];
                              if (newCart[idx].quantity > 1) {
                                newCart[idx].quantity -= 1;
                              } else {
                                newCart.splice(idx, 1);
                              }
                              saveCartToLocalStorage(newCart);
                              triggerToast('Bag items updated.', 'info');
                            }}
                            className="p-0.5 rounded text-gray-500 hover:bg-gray-100"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => {
                              const newCart = [...cart];
                              newCart[idx].quantity += 1;
                              saveCartToLocalStorage(newCart);
                            }}
                            className="p-0.5 rounded text-gray-500 hover:bg-gray-100"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Delete item completely */}
                    <button 
                      onClick={() => {
                        const newCart = cart.filter(it => it.id !== item.id);
                        saveCartToLocalStorage(newCart);
                        triggerToast('Item ejected from shopping bag.', 'info');
                      }}
                      className="p-1 text-gray-400 hover:text-[#7A0026] self-start"
                      title="Remove Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                  </div>
                ))
              )}
            </div>

            {/* Check-Out / Summary Elements drawer footer */}
            {cart.length > 0 && checkoutStep === 'idle' && (
              <div className="p-5 border-t border-gray-100 bg-[#FFFDF9]">
                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Base Gift Items Subtotal</span>
                    <span className="font-bold text-gray-900">${cartTotalSum.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Express White-Glove Dispatch</span>
                    <span className="font-bold text-gray-900">{cartTotalSum > 75 ? 'FREE Shipping' : '$9.99'}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-dashed border-amber-200">
                    <span className="font-serif font-bold text-gray-900">Total Basket Sum</span>
                    <span className="font-black text-lg text-[#7A0026]">
                      ${(cartTotalSum + (cartTotalSum > 75 ? 0 : 9.99)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={handleCheckoutSubmit}
                    className="w-full bg-[#7A0026] hover:bg-neutral-900 text-[#E6C15C] font-extrabold py-3.5 rounded-full text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer"
                  >
                    Authenticate Secure Purchase
                  </button>
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-full text-xs uppercase tracking-widest transition-all"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 2. INSTANT WISHLIST FAVORITES OVERLAY MODAL */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div onClick={() => setWishlistOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="bg-white w-full max-w-md h-full relative z-10 flex flex-col justify-between shadow-2xl animate-slide-left">
            
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-[#7A0026] fill-[#7A0026]" />
                <h3 className="font-serif text-lg font-bold text-gray-900">Your Favorite Items</h3>
                <span className="bg-amber-100 text-[#7A0026] text-xs font-bold rounded-full px-2.5 py-0.5">
                  {wishlist.length} Articles
                </span>
              </div>
              <button onClick={() => setWishlistOpen(false)} className="p-1 rounded-full text-gray-500 hover:text-gray-800">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-12">
                  <span className="text-5xl block mb-2">💖</span>
                  <p className="text-sm font-semibold text-gray-600">Your favorites list is empty</p>
                  <p className="text-xs text-gray-400 mt-1">Tap the heart toggle on product tiles to stack premium gift ideas on this board.</p>
                </div>
              ) : (
                wishlist.map(id => {
                  const p = PRODUCTS.find(prod => prod.id === id);
                  if (!p) return null;
                  return (
                    <div key={p.id} className="flex gap-4 items-center pb-4 border-b border-gray-100">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-12 h-12 object-cover rounded-xl border border-amber-100 shrink-0 bg-[#FAF6EE]" 
                        referrerPolicy="no-referrer" 
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">{p.name}</h4>
                        <span className="text-xs font-bold text-[#7A0026] block">${p.price}</span>
                      </div>
                      
                      <button 
                        onClick={() => {
                          handleAddToCart(p);
                          setWishlistOpen(false);
                        }}
                        className="bg-[#7A0026] text-white p-2 rounded-full hover:bg-neutral-900 transition-colors"
                        title="Add to Shopping Bag"
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </button>

                      <button 
                        onClick={() => toggleWishlist(p.id)}
                        className="text-xs text-gray-400 hover:text-red-600 font-bold"
                      >
                        Eject
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-5 border-t border-gray-100 bg-[#FFFDF9]">
              <button 
                onClick={() => setWishlistOpen(false)}
                className="w-full bg-[#7A0026] text-[#E6C15C] font-bold py-3.5 rounded-full text-xs uppercase"
              >
                Close Panel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. CORE QUICK VIEW PRODUCT PORTAL DIALOG MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div onClick={() => setQuickViewProduct(null)} className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300" />
          
          {/* Modal Container */}
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden relative z-10 shadow-2xl animate-zoom flex flex-col md:flex-row border border-[#FAECD3]">
            
            {/* Left Photo display panel */}
            <div className="md:w-1/2 bg-[#FAF6EE] relative overflow-hidden min-h-[320px] select-none">
              <img 
                src={quickViewProduct.image} 
                alt={quickViewProduct.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
              />
              
              {/* Scent note signature tag overlaid in image */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 rounded-xl border border-amber-100 p-2 text-center text-[10px] font-sans z-10">
                <span className="font-extrabold text-[#7A0026] block uppercase tracking-wider">Premium Curation</span>
                <span className="text-gray-500 font-serif">Sealed in signature golden strings.</span>
              </div>
            </div>

            {/* Right Information detail and configuration panel */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
              
              <div>
                <button 
                  onClick={() => setQuickViewProduct(null)}
                  className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 p-1 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A55B]">
                  {quickViewProduct.category} Collection
                </span>
                
                <h3 className="font-serif text-xl sm:text-2xl font-black text-gray-900 leading-tight mt-1.5 mb-2">
                  {quickViewProduct.name}
                </h3>

                {/* Star rating summaries */}
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < Math.floor(quickViewProduct.rating) ? 'fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">({quickViewProduct.reviewsCount} verified clients review)</span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed font-light mb-6">
                  {quickViewProduct.description}
                </p>

                {/* Special extra addon choice */}
                <div className="mb-6 bg-[#FAF6EE] p-3 rounded-xl border border-amber-200/50">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#7A0026] block mb-2">Custom Presentation Wrap?</label>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                    <button 
                      onClick={() => setSelectedQuickViewWrap('none')}
                      className={`py-2 px-3 rounded-lg border text-center transition-all ${selectedQuickViewWrap === 'none' ? 'border-[#7A0026] bg-[#7A0026] text-white' : 'border-gray-200 bg-white text-gray-600'}`}
                    >
                      Natural Box (Included)
                    </button>
                    <button 
                      onClick={() => setSelectedQuickViewWrap('royal_crimson')}
                      className={`py-2 px-3 rounded-lg border text-center transition-all ${selectedQuickViewWrap === 'royal_crimson' ? 'border-[#7A0026] bg-[#7A0026] text-white' : 'border-gray-200 bg-white text-gray-600'}`}
                    >
                      Royal Ribbon (+$4.99)
                    </button>
                  </div>
                </div>
              </div>

              {/* pricing receipt and active trigger bag button */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Purchase Price</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#7A0026]">
                      ${(quickViewProduct.price + (selectedQuickViewWrap !== 'none' ? 4.99 : 0)).toFixed(2)}
                    </span>
                    {quickViewProduct.originalPrice && (
                      <span className="block text-xs text-gray-400 line-through">${quickViewProduct.originalPrice}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      handleAddToCart(quickViewProduct, 1, selectedQuickViewWrap !== 'none');
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 bg-[#7A0026] hover:bg-neutral-900 text-[#E6C15C] font-extrabold py-3.5 rounded-full text-xs uppercase tracking-widest text-center shadow"
                  >
                    Pack into Bag Crate
                  </button>
                  <button 
                    onClick={() => {
                      toggleWishlist(quickViewProduct.id);
                    }}
                    className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full"
                    title="Toggle Favorite"
                  >
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
