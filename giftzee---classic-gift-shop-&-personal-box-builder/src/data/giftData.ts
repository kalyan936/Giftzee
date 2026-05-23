export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  category: string;
  tags?: string[];
  isNew?: boolean;
  isSale?: boolean;
  description: string;
  occasions: string[];
  recipients: string[];
}

export interface BoxOption {
  id: string;
  name: string;
  price: number;
  capacity: number;
  description: string;
  image: string;
  colorName: string;
}

export interface FillerItem {
  id: string;
  name: string;
  price: number;
  category: 'chocolates' | 'toys' | 'candles' | 'bath' | 'drinks' | 'keepsakes';
  image: string;
  rating: number;
}

export interface GreetingCardOption {
  id: string;
  name: string;
  category: 'birthday' | 'anniversary' | 'thank_you' | 'love' | 'congrats';
  image: string;
  borderColor: string;
}

export const CATEGORIES = [
  { id: 'all', name: 'All Collection' },
  { id: 'chocolates', name: 'Gourmet Treats' },
  { id: 'toys', name: 'Plush & Toys' },
  { id: 'candles', name: 'Aroma Candles' },
  { id: 'bath', name: 'Luxury Bath & Spa' },
  { id: 'drinks', name: 'Tea & Warm Mugs' },
  { id: 'floral', name: 'Floral Arrangements' }
];

export const BOX_OPTIONS: BoxOption[] = [
  {
    id: 'box_small',
    name: 'Little Sparkle Kraft Box',
    price: 8.99,
    capacity: 3,
    description: 'Perfect for cute gestures. Crafted from natural eco-fiber with golden wax seals.',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400',
    colorName: 'Warm Kraft Gold'
  },
  {
    id: 'box_medium',
    name: 'Royal Crimson Gift Box',
    price: 13.99,
    capacity: 6,
    description: 'Our most popular choice. Textured premium crimson exterior wrapped in double-face satin gold ribbons.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400',
    colorName: 'Textured Burgundy'
  },
  {
    id: 'box_large',
    name: 'Imperial Gold Chest',
    price: 19.99,
    capacity: 10,
    description: 'Absolute supreme luxury. Handcrafted brass-locked chest lined inside with gold satin cushioning.',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&q=80&w=400',
    colorName: 'Shimmering Gold'
  }
];

export const FILLER_ITEMS: FillerItem[] = [
  { 
    id: 'f1', 
    name: 'Belgian Truffles (Pack of 6)', 
    price: 12.99, 
    category: 'chocolates', 
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=300', 
    rating: 5 
  },
  { 
    id: 'f2', 
    name: 'Dark Roast Organic Coffee Beans', 
    price: 9.99, 
    category: 'drinks', 
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=300', 
    rating: 4.8 
  },
  { 
    id: 'f3', 
    name: 'Vanilla & Jasmine Candle Trio', 
    price: 11.50, 
    category: 'candles', 
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=300', 
    rating: 4.9 
  },
  { 
    id: 'f4', 
    name: 'Rose Petal Botanical Bath Salts', 
    price: 8.50, 
    category: 'bath', 
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=300', 
    rating: 4.7 
  },
  { 
    id: 'f5', 
    name: 'Premium Burgundy Giftzee Ceramic Mug', 
    price: 14.99, 
    category: 'drinks', 
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=300', 
    rating: 4.9 
  },
  { 
    id: 'f6', 
    name: 'Miniature Handmade Golden Teddy', 
    price: 10.99, 
    category: 'toys', 
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=300', 
    rating: 5 
  },
  { 
    id: 'f7', 
    name: 'Pink Salt Caramel Chocolate Bar', 
    price: 5.99, 
    category: 'chocolates', 
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=300', 
    rating: 4.6 
  },
  { 
    id: 'f8', 
    name: 'Calming Chamomile Loose Leaf Tea', 
    price: 7.99, 
    category: 'drinks', 
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=300', 
    rating: 4.8 
  },
  { 
    id: 'f9', 
    name: 'Lavender Scented Organic Oils', 
    price: 13.50, 
    category: 'candles', 
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=300', 
    rating: 4.9 
  },
  { 
    id: 'f10', 
    name: 'Sparkling Cranberry Cider (Mini)', 
    price: 6.50, 
    category: 'drinks', 
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=300', 
    rating: 4.5 
  },
  { 
    id: 'f11', 
    name: 'Gold-Plated Devotion Bookmark', 
    price: 12.00, 
    category: 'keepsakes', 
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=300', 
    rating: 4.9 
  },
  { 
    id: 'f12', 
    name: 'Organic Honey Baked Cashew Nuts', 
    price: 7.50, 
    category: 'chocolates', 
    image: 'https://images.unsplash.com/photo-1590005354167-6da97870c913?auto=format&fit=crop&q=80&w=300', 
    rating: 4.6 
  }
];

export const GREETING_CARDS: GreetingCardOption[] = [
  { 
    id: 'card_bday', 
    name: 'Celestial Birthday Splendor', 
    category: 'birthday', 
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=350', 
    borderColor: 'border-[#7A0026]' 
  },
  { 
    id: 'card_anniv', 
    name: 'Golden Hearts Anniversary', 
    category: 'anniversary', 
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=350', 
    borderColor: 'border-[#D4AF37]' 
  },
  { 
    id: 'card_thank', 
    name: 'Incredible Gratitude Thank You', 
    category: 'thank_you', 
    image: 'https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?auto=format&fit=crop&q=80&w=350', 
    borderColor: 'border-emerald-600' 
  },
  { 
    id: 'card_love', 
    name: 'Burgundy Devotion Love Note', 
    category: 'love', 
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=350', 
    borderColor: 'border-rose-600' 
  },
  { 
    id: 'card_congrats', 
    name: 'Shining Star Congratulations', 
    category: 'congrats', 
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=350', 
    borderColor: 'border-amber-500' 
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Bespoke Royal Rose & Truffles Hamper',
    price: 89.99,
    originalPrice: 105.00,
    rating: 4.9,
    reviewsCount: 124,
    image: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&q=80&w=500',
    category: 'floral',
    tags: ['Bestseller', 'Romantic'],
    isNew: false,
    isSale: true,
    description: 'An premium display consisting of fresh burgundy roses matched beautifully with premium Belgian dark chocolate ganache, wrapped with elegant gold strings.',
    occasions: ['anniversary', 'love', 'birthday'],
    recipients: ['her', 'couple']
  },
  {
    id: 'p2',
    name: 'The Golden Scented Aromatherapy Trio',
    price: 45.00,
    rating: 4.8,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=500',
    category: 'candles',
    tags: ['Relaxation', 'Golden Glow'],
    isNew: true,
    isSale: false,
    description: 'Three hand-poured soy wax candles with custom oils of Sandalwood, Royal Rose, and Honey Vanilla, styled in elegant bronze containers.',
    occasions: ['birthday', 'thank_you', 'anniversary'],
    recipients: ['her', 'him', 'parents']
  },
  {
    id: 'p3',
    name: 'Premium Teddy Plush & Sweets Basket',
    price: 34.99,
    originalPrice: 39.99,
    rating: 5.0,
    reviewsCount: 56,
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=500',
    category: 'toys',
    tags: ['Cute', 'Festive'],
    isNew: false,
    isSale: true,
    description: 'A ultra-soft golden fuzzy plush teddy carrying a burgundy heart, packed with a mini-crate of chocolate fudge and caramel toffee pops.',
    occasions: ['birthday', 'love'],
    recipients: ['kids', 'her']
  },
  {
    id: 'p4',
    name: 'Imperial Golden Jasmine Herbal Tea Set',
    price: 29.99,
    rating: 4.7,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=500',
    category: 'drinks',
    tags: ['Elegant', 'Healthy'],
    isNew: false,
    isSale: false,
    description: 'Collectible gold metallic loose-tea tin featuring premium Jasmine pearls, paired with a heavy-base double-wall glass teacup and wooden infuser spoon.',
    occasions: ['thank_you', 'anniversary', 'birthday'],
    recipients: ['parents', 'coworker', 'him']
  },
  {
    id: 'p5',
    name: 'Artisan Gourmet Dark Chocolate Selection',
    price: 19.99,
    rating: 4.9,
    reviewsCount: 167,
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=500',
    category: 'chocolates',
    tags: ['Gourmet', 'Fudge'],
    isNew: false,
    isSale: false,
    description: 'A master chocolatier assortment of twelve sea-salt caramels, dark hazelnut pralinés, and rich raspberry truffles wrapped in crimson tins.',
    occasions: ['anniversary', 'love', 'birthday'],
    recipients: ['him', 'her', 'coworker']
  },
  {
    id: 'p6',
    name: 'Rich Honeycomb bath Fizzers & Towel Set',
    price: 52.00,
    originalPrice: 65.00,
    rating: 4.8,
    reviewsCount: 78,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=500',
    category: 'bath',
    tags: ['Luxury Spa', 'Sale'],
    isNew: false,
    isSale: true,
    description: 'Organic raw-honey spa bath fizzers, royal moisturizing body butter, and a super-plush Egyptian cotton hand towel in a gold woven basket.',
    occasions: ['birthday', 'thank_you'],
    recipients: ['her', 'parents', 'coworker']
  },
  {
    id: 'p7',
    name: 'Gold Horizon Dried Botanical Bouquet',
    price: 59.99,
    rating: 4.6,
    reviewsCount: 31,
    image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&q=80&w=500',
    category: 'floral',
    tags: ['Everlasting', 'Home Accent'],
    isNew: true,
    isSale: false,
    description: 'Elegantly preserved gold-tinted palm leaves, pampas grass, white bunny tails, and burgundy baby breaths that bring year-round style to any room.',
    occasions: ['anniversary', 'thank_you'],
    recipients: ['her', 'couple', 'coworker']
  },
  {
    id: 'p8',
    name: 'Executive Brass Writing Set & Keepsake Mug',
    price: 74.99,
    rating: 4.9,
    reviewsCount: 95,
    image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=500',
    category: 'keepsakes',
    tags: ['Limited Edition', 'Premium'],
    isNew: true,
    isSale: false,
    description: 'A premium heavy brass rollerball pen accompanied by a gold-trimmed Burgundy ceramic Giftzee mug. Delivered in a luxurious velvet-lined keepsake box.',
    occasions: ['thank_you', 'birthday'],
    recipients: ['him', 'coworker']
  }
];

export const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Sarah Montgomery',
    location: 'Austin, TX',
    quote: "I ordered the 'Royal Crimson Gift Box' tailored for my sister's birthday and she literally video-called me in tears! The elegant burgundy box with gold ribbon is pure class. Highly recommended!",
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    stars: 5,
    date: '2 weeks ago'
  },
  {
    id: 't2',
    name: 'Aron Kingsley',
    location: 'Chicago, IL',
    quote: "Giftzee's Custom Box Builder is light-years ahead of standard ecommerce apps. Choosing the box size, stacking it with gourmet truffles and scented candles, and writing a live preview greeting card was a sublime experience.",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    stars: 5,
    date: '1 month ago'
  },
  {
    id: 't3',
    name: 'Elena Rostova',
    location: 'Seattle, WA',
    quote: "Absolute gold standard! Customer service responded in minutes when I wanted to change the gift card message. The shipping was prompt and packaging was exceptionally sturdy. Spot on!",
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    stars: 5,
    date: '3 days ago'
  }
];
