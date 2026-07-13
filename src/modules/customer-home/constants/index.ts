export type HomeHeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
};

export type HomePromoCard = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  className?: string;
};

export type HomeMosaicTile = {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  image: string;
  className: string;
};

export type HomeTestimonial = {
  id: string;
  name: string;
  rating: number;
  text: string;
  avatar?: string;
};

export const HOME_HERO_SLIDES: HomeHeroSlide[] = [
  {
    id: "1",
    title: "Fresh coffee, delivered fast",
    subtitle: "Order your favorite drinks online for pickup or delivery.",
    ctaLabel: "Order Drinks",
    ctaHref: "/order",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=600&fit=crop",
  },
  {
    id: "2",
    title: "Shop premium packaged coffee",
    subtitle: "Take the café experience home with our curated beans and blends.",
    ctaLabel: "Shop Products",
    ctaHref: "/shop",
    image:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&h=600&fit=crop",
  },
  {
    id: "3",
    title: "Seasonal specials are here",
    subtitle: "Discover limited-time drinks crafted by our baristas.",
    ctaLabel: "Explore Menu",
    ctaHref: "/order",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1200&h=600&fit=crop",
  },
];

export const HOME_PROMO_CARDS: HomePromoCard[] = [
  {
    id: "order-drinks",
    title: "Order Drinks",
    subtitle: "Browse our full menu and customize your perfect cup.",
    href: "/order",
    image:
      "https://images.unsplash.com/photo-1514434754449-9c73f5a6d692?w=600&h=400&fit=crop",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    id: "shop-beans",
    title: "Shop Beans",
    subtitle: "Premium packaged coffee for home brewing.",
    href: "/shop",
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55c?w=400&h=300&fit=crop",
  },
  {
    id: "seasonal",
    title: "Seasonal Special",
    subtitle: "Limited-time favorites from our baristas.",
    href: "/order",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
  },
];

export const HOME_MOSAIC_TILES: HomeMosaicTile[] = [
  {
    id: "espresso",
    title: "Espresso Collection",
    subtitle: "Bold & rich",
    href: "/order",
    image:
      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&h=400&fit=crop",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    id: "cold-brew",
    title: "Cold Brew",
    href: "/order",
    image:
      "https://images.unsplash.com/photo-1517487881594-27866fef5e0b?w=400&h=300&fit=crop",
    className: "md:col-span-1",
  },
  {
    id: "beans",
    title: "Whole Bean",
    href: "/shop",
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55c?w=400&h=300&fit=crop",
    className: "md:col-span-1",
  },
  {
    id: "pastries",
    title: "Pastries & Snacks",
    href: "/order",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop",
    className: "md:col-span-1",
  },
  {
    id: "gift",
    title: "Gift Sets",
    subtitle: "Perfect for coffee lovers",
    href: "/shop",
    image:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&h=300&fit=crop",
    className: "md:col-span-2",
  },
];

export const HOME_TESTIMONIALS: HomeTestimonial[] = [
  {
    id: "1",
    name: "Sarah M.",
    rating: 5,
    text: "The best latte I've had outside of Italy. Fast pickup and always consistent quality!",
  },
  {
    id: "2",
    name: "James K.",
    rating: 5,
    text: "Love ordering through the app. My cold brew is ready when I arrive every morning.",
  },
  {
    id: "3",
    name: "Emily R.",
    rating: 5,
    text: "Their packaged beans are amazing. Fresh roast date and rich flavor every time.",
  },
  {
    id: "4",
    name: "David L.",
    rating: 4,
    text: "Great selection of drinks and the seasonal specials keep me coming back.",
  },
];
