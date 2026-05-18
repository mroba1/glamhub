import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Calendar, ShoppingBag, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_SERVICES, MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/constants/mock-data";
import { formatCurrency } from "@/lib/utils";
import { APP_NAME } from "@/constants";

const HERO_STATS = [
  { label: "Happy Clients", value: "8,920+" },
  { label: "Beauty Salons", value: "24+" },
  { label: "Products", value: "456+" },
  { label: "Cities", value: "12+" },
];

const CATEGORY_EMOJI: Record<string, string> = {
  "Hair Care": "💇",
  "Skin Care": "✨",
  "Nail Care": "💅",
  "Makeup": "💄",
  "Fragrance": "🌸",
  "Body Care": "🧴",
  "Lashes": "👁️",
};

export default function HomePage() {
  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);
  const featuredServices = MOCK_SERVICES.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* ── Sticky Nav ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#c9a96e] flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-black" />
          </div>
          <span className="font-serif text-xl font-bold text-white">{APP_NAME}</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          <Link href="/" className="hover:text-[#c9a96e] transition-colors">Home</Link>
          <Link href="/marketplace" className="hover:text-[#c9a96e] transition-colors">Shop</Link>
          <Link href="/booking" className="hover:text-[#c9a96e] transition-colors">Book</Link>
          <Link href="/about" className="hover:text-[#c9a96e] transition-colors">Our Story</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button variant="gold" size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920&q=80"
            alt="Beauty hero"
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
          {/* Dark overlay — left to right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/30" />
          {/* Dark overlay — bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-32 w-full">
          <div className="max-w-2xl">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a96e]/40 bg-[#c9a96e]/10 px-4 py-1.5 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-[#c9a96e]" />
              <span className="text-xs font-medium text-[#c9a96e]">Nigeria&apos;s #1 Beauty Platform</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[0.95] text-white mb-6 drop-shadow-2xl">
              Beauty You{" "}
              <em className="not-italic text-[#c9a96e]">Can</em>{" "}
              See and Feel
            </h1>

            {/* Description */}
            <p className="text-lg text-white/75 max-w-lg leading-relaxed mb-10">
              Experience the ultimate in skincare and beauty. Our meticulously crafted
              services combine advanced techniques with premium products to transform
              your beauty routine.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link href="/booking">
                <Button variant="gold" size="xl" className="group">
                  Book Appointment
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button
                  variant="outline"
                  size="xl"
                  className="text-white border-white/30 hover:bg-white/10 hover:border-white/50"
                >
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            {HERO_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/15 bg-black/50 backdrop-blur-sm p-4 text-center"
              >
                <div className="font-serif text-2xl font-bold text-[#c9a96e]">{stat.value}</div>
                <div className="text-xs text-white/55 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-white/40" />
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold text-white mb-3">Shop by Category</h2>
          <p className="text-white/50">Discover our curated beauty collections</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {MOCK_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/marketplace?category=${cat.id}`}
              className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-center hover:border-[#c9a96e]/50 hover:bg-[#c9a96e]/8 transition-all duration-200"
            >
              <span className="text-2xl">{CATEGORY_EMOJI[cat.name] ?? "💫"}</span>
              <span className="text-xs font-medium text-white/70 group-hover:text-[#c9a96e] transition-colors">
                {cat.name}
              </span>
              <span className="text-[10px] text-white/35">{cat.productCount} items</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Services ──────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-serif text-4xl font-bold text-white mb-3">Our Services</h2>
              <p className="text-white/50">Book your beauty appointment today</p>
            </div>
            <Link href="/booking">
              <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 card-hover"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={service.imageUrl ?? "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400"}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  {/* Bottom fade so card bg shows through */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className="rounded-full bg-black/60 border border-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
                      {service.duration} min
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-[#c9a96e] font-medium mb-1">{service.categoryName}</p>
                  <h3 className="font-serif text-lg font-semibold text-white mb-2">{service.name}</h3>
                  <p className="text-sm text-white/50 line-clamp-2 mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#c9a96e] font-serif">
                      {formatCurrency(service.price)}
                    </span>
                    <Link href={`/booking?service=${service.id}`}>
                      <Button variant="gold" size="sm">
                        <Calendar className="h-3.5 w-3.5" />
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bestsellers ────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-serif text-4xl font-bold text-white mb-3">Bestsellers</h2>
              <p className="text-white/50">Our most-loved beauty products</p>
            </div>
            <Link href="/marketplace">
              <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
                Shop All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/marketplace/${product.id}`}
                className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden card-hover"
              >
                <div className="relative aspect-square overflow-hidden bg-white/5">
                  <Image
                    src={product.images[0]?.url ?? ""}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  {product.compareAtPrice && (
                    <span className="absolute top-2 left-2 rounded-full bg-[#c9a96e] text-black text-xs font-bold px-2 py-0.5">
                      SALE
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-[#c9a96e] mb-1">{product.categoryName}</p>
                  <h3 className="text-sm font-semibold text-white line-clamp-1 mb-1">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="h-3 w-3 fill-[#c9a96e] text-[#c9a96e]" />
                    <span className="text-xs text-white/50">
                      {product.rating} ({product.reviewCount})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{formatCurrency(product.price)}</span>
                    {product.compareAtPrice && (
                      <span className="text-xs text-white/35 line-through">
                        {formatCurrency(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────────────────── */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&q=80"
            alt="Beauty CTA"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Beauty Routine?
          </h2>
          <p className="text-lg text-white/65 mb-10">
            Join thousands of Nigerian women who trust Glam Hub for their beauty needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button variant="gold" size="xl" className="group">
                Start Your Journey
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button
                variant="outline"
                size="xl"
                className="text-white border-white/30 hover:bg-white/10"
              >
                <ShoppingBag className="h-4 w-4" />
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 py-12 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-[#c9a96e] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-black" />
              </div>
              <span className="font-serif text-xl font-bold text-white">{APP_NAME}</span>
            </div>
            <p className="text-sm text-white/45 max-w-xs">
              Nigeria&apos;s premier beauty platform connecting clients with top salons
              and premium beauty products.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white/80 mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/40">
              {["Home", "Book Appointment", "Shop Products", "Our Story"].map((l) => (
                <li key={l}>
                  <Link href="/" className="hover:text-[#c9a96e] transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white/80 mb-4 text-sm">Support</h4>
            <ul className="space-y-2 text-sm text-white/40">
              {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"].map((l) => (
                <li key={l}>
                  <Link href="/" className="hover:text-[#c9a96e] transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-white/30">Made with ❤️ for Nigerian Beauty</p>
        </div>
      </footer>
    </div>
  );
}
