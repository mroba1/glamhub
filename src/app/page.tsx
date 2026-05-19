"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Sparkles, ArrowRight, CheckCircle, Globe, Paintbrush,
  ShoppingBag, Calendar, BarChart3, Bell, Star, Menu, X,
  Zap, Shield, Crown, ChevronRight,
} from "lucide-react";

const NAV_LINKS = ["Features", "How It Works", "Pricing"];

const FEATURES = [
  { icon: Globe,       title: "Your Own Website URL",     desc: "Get glamhub.com/your-salon — a unique link that's entirely yours. Share it anywhere." },
  { icon: Calendar,    title: "Online Appointment Booking", desc: "Customers book directly from your site. You approve, manage, and track everything." },
  { icon: ShoppingBag, title: "Sell Products Online",      desc: "List your beauty products and sell them 24/7 with built-in inventory management." },
  { icon: Paintbrush,  title: "Custom Branding",           desc: "Your logo, your colours, your story. Make your site look exactly like your brand." },
  { icon: BarChart3,   title: "Business Dashboard",        desc: "Track bookings, revenue, and customers from one clean, simple dashboard." },
  { icon: Bell,        title: "Instant Notifications",     desc: "Get notified the moment a customer books or places an order. Never miss a thing." },
];

const STEPS = [
  { num: "1", title: "Create Your Account",    desc: "Sign up as a business owner. Takes less than 2 minutes." },
  { num: "2", title: "Customize Your Website", desc: "Add your logo, services, photos, and brand colours — no coding needed." },
  { num: "3", title: "Choose a Plan",          desc: "Pick a subscription that fits your business size and budget." },
  { num: "4", title: "Go Live & Share",        desc: "Get your unique link and start receiving bookings and orders immediately." },
];

const PLANS = [
  {
    name: "Starter", icon: Zap, price: "₦15,000", year: "₦150,000",
    desc: "Perfect for small salons starting out",
    features: ["Your own website URL", "Up to 20 products", "50 bookings/month", "Basic analytics", "Customer management"],
    popular: false,
  },
  {
    name: "Growth", icon: Shield, price: "₦35,000", year: "₦350,000",
    desc: "For salons ready to grow fast",
    features: ["Your own website URL", "Up to 100 products", "200 bookings/month", "Advanced analytics", "Custom promotions", "Multiple staff accounts"],
    popular: true,
  },
  {
    name: "Enterprise", icon: Crown, price: "₦75,000", year: "₦750,000",
    desc: "For large salons and multi-branch",
    features: ["Your own website URL", "Unlimited products", "Unlimited bookings", "Full analytics suite", "Dedicated manager", "Priority 24/7 support"],
    popular: false,
  },
];

const TESTIMONIALS = [
  { name: "Amaka E.",    biz: "Glam Parlor, Lagos",        quote: "I had my website live in one afternoon. Bookings doubled in 3 months.", stars: 5 },
  { name: "Blessing O.", biz: "Beauty House, Abuja",       quote: "The marketplace feature pays for itself. I sell products while I sleep.", stars: 5 },
  { name: "Chidinma N.", biz: "Nail Zone, Port Harcourt",  quote: "My clients love booking online. The dashboard is so clean and simple.", stars: 5 },
];

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">

      {/* ─── NAVBAR ─────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.07] bg-[#080808]/95 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-[#c9a96e] flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-black" />
            </div>
            <span className="font-serif text-lg font-bold">Glam Hub</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7 text-sm text-white/50">
            {NAV_LINKS.map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} className="hover:text-white transition-colors">
                {l}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors">Sign In</Link>
            <Link href="/join" className="flex items-center gap-1.5 text-sm font-semibold text-black bg-[#c9a96e] px-4 py-2 rounded-xl hover:bg-[#b8935a] transition-colors">
              Get Started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden text-white/60 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/[0.07] bg-[#0d0d0d] px-5 py-4 space-y-3">
            {NAV_LINKS.map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} onClick={() => setMobileOpen(false)}
                className="block text-sm text-white/60 hover:text-white py-1.5">{l}</a>
            ))}
            <div className="pt-2 flex flex-col gap-2 border-t border-white/[0.07]">
              <Link href="/login" className="text-sm text-center text-white/60 py-2.5 rounded-xl border border-white/10 hover:bg-white/5">Sign In</Link>
              <Link href="/join" className="text-sm text-center font-semibold text-black bg-[#c9a96e] py-2.5 rounded-xl hover:bg-[#b8935a]">Get Started Free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ─── HERO ───────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-screen pt-16 px-5">
        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="h-[500px] w-[500px] rounded-full bg-[#c9a96e]/[0.07] blur-[100px]" />
        </div>

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a96e]/25 bg-[#c9a96e]/[0.08] px-4 py-1.5 mb-7 text-xs font-medium text-[#c9a96e]">
            <Sparkles className="h-3.5 w-3.5" />
            Built for Nigerian Beauty & Salon Businesses
          </div>

          {/* Headline */}
          <h1 className="font-serif font-bold leading-[1.05] mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Do You Want to Create a{" "}
            <span className="text-[#c9a96e]">Custom Website</span>{" "}
            for Your Beauty Business?
          </h1>

          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Glam Hub gives salons, spas, and beauty studios their own professional website —
            with online booking, a product marketplace, and a full business dashboard.
            No code. No hassle. Just results.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <Link href="/join">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm sm:text-base font-semibold text-black bg-[#c9a96e] px-7 py-3.5 rounded-xl hover:bg-[#b8935a] transition-all hover:shadow-[0_0_25px_rgba(201,169,110,0.25)] group">
                Create My Business Page — Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <a href="#how-it-works">
              <button className="w-full sm:w-auto text-sm sm:text-base text-white/60 border border-white/12 px-7 py-3.5 rounded-xl hover:bg-white/[0.04] hover:text-white transition-colors">
                See How It Works
              </button>
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
            {[
              { v: "500+",  l: "Businesses" },
              { v: "50K+",  l: "Bookings" },
              { v: "12",    l: "Cities" },
              { v: "4.9★",  l: "Rating" },
            ].map(({ v, l }) => (
              <div key={l} className="text-center">
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#c9a96e]">{v}</p>
                <p className="text-xs text-white/35 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* URL preview strip */}
        <div className="relative z-10 mt-16 w-full max-w-md mx-auto">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 flex items-center gap-3">
            <Globe className="h-4 w-4 text-[#c9a96e] shrink-0" />
            <span className="text-sm text-white/40 font-mono">glamhub.com/</span>
            <span className="text-sm text-[#c9a96e] font-mono font-semibold">your-salon-name</span>
            <span className="ml-auto text-[10px] bg-[#c9a96e]/15 text-[#c9a96e] rounded-full px-2 py-0.5 font-semibold shrink-0">Your URL</span>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-5 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#c9a96e] text-xs font-semibold uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              From Sign Up to Live Website in 4 Steps
            </h2>
            <p className="text-white/45 text-base max-w-lg mx-auto">
              No technical skills needed. We built it so any salon owner can go live in under an hour.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 hover:border-[#c9a96e]/30 transition-colors group">
                <div className="font-serif text-5xl font-bold text-[#c9a96e]/20 group-hover:text-[#c9a96e]/35 transition-colors mb-4">{num}</div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/join">
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-black bg-[#c9a96e] px-6 py-3 rounded-xl hover:bg-[#b8935a] transition-colors group">
                Start Building Now <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ───────────────────────────────────── */}
      <section id="features" className="py-24 px-5 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#c9a96e] text-xs font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Everything Your Beauty Business Needs
            </h2>
            <p className="text-white/45 text-base max-w-lg mx-auto">
              One platform. Every tool you need to run and grow your salon online.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 hover:border-[#c9a96e]/25 hover:bg-[#c9a96e]/[0.04] transition-all">
                <div className="h-11 w-11 rounded-xl border border-[#c9a96e]/20 bg-[#c9a96e]/[0.08] flex items-center justify-center mb-4 group-hover:bg-[#c9a96e]/15 transition-colors">
                  <Icon className="h-5 w-5 text-[#c9a96e]" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-5 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#c9a96e] text-xs font-semibold uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Simple, Honest Pricing
            </h2>
            <p className="text-white/45 text-base max-w-lg mx-auto mb-8">
              Start free. Pay only when you&apos;re ready. No hidden fees, ever.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1">
              {(["monthly", "yearly"] as const).map((b) => (
                <button key={b} onClick={() => setBilling(b)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    billing === b ? "bg-[#c9a96e] text-black shadow-sm" : "text-white/50 hover:text-white"
                  }`}>
                  {b}
                  {b === "yearly" && <span className="ml-1.5 text-[10px] font-bold opacity-80">-17%</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {PLANS.map(({ name, icon: Icon, price, year, desc, features, popular }) => (
              <div key={name} className={`relative rounded-2xl p-6 flex flex-col ${
                popular
                  ? "border-2 border-[#c9a96e] bg-[#c9a96e]/[0.06]"
                  : "border border-white/[0.08] bg-white/[0.03]"
              }`}>
                {popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#c9a96e] text-black text-xs font-bold px-4 py-1.5 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${popular ? "bg-[#c9a96e] text-black" : "bg-white/[0.07] text-[#c9a96e]"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mb-1">{name}</h3>
                <p className="text-white/35 text-sm mb-5">{desc}</p>
                <div className="mb-5">
                  <span className="font-serif text-3xl font-bold">{billing === "monthly" ? price : year}</span>
                  <span className="text-white/35 text-sm">/{billing === "monthly" ? "mo" : "yr"}</span>
                </div>
                <ul className="space-y-2.5 mb-7 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/55">
                      <CheckCircle className="h-4 w-4 text-[#c9a96e] shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/join">
                  <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    popular
                      ? "bg-[#c9a96e] text-black hover:bg-[#b8935a]"
                      : "border border-white/12 text-white hover:bg-white/[0.06]"
                  }`}>
                    Get Started
                  </button>
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-white/25 text-xs mt-6">
            All plans include your unique glamhub.com/your-business URL · SSL security · 99.9% uptime
          </p>
        </div>
      </section>

      {/* ─── TESTIMONIALS ───────────────────────────────── */}
      <section className="py-24 px-5 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#c9a96e] text-xs font-semibold uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Loved by Nigerian Beauty Businesses
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ name, biz, quote, stars }) => (
              <div key={name} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                <div className="flex mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#c9a96e] text-[#c9a96e]" />
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-5 italic">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#c9a96e] flex items-center justify-center text-black font-bold text-sm shrink-0">
                    {name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{name}</p>
                    <p className="text-white/35 text-xs">{biz}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ──────────────────────────────────── */}
      <section className="py-28 px-5 bg-[#0d0d0d] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-[400px] w-[400px] rounded-full bg-[#c9a96e]/[0.07] blur-[90px]" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            Your Beauty Business Deserves to Be Online
          </h2>
          <p className="text-white/45 text-base mb-10 max-w-lg mx-auto">
            Join hundreds of Nigerian salons already using Glam Hub to take bookings,
            sell products, and grow their brand online.
          </p>
          <Link href="/join">
            <button className="inline-flex items-center gap-2 text-base font-semibold text-black bg-[#c9a96e] px-8 py-4 rounded-xl hover:bg-[#b8935a] transition-all hover:shadow-[0_0_30px_rgba(201,169,110,0.2)] group">
              Create My Business Website — Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
          <p className="text-white/20 text-xs mt-4">No credit card required · Setup in minutes · Cancel anytime</p>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────── */}
      <footer className="border-t border-white/[0.07] py-10 px-5 bg-[#080808]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-[#c9a96e] flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-black" />
            </div>
            <span className="font-serif font-bold text-white">Glam Hub</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-white/30">
            {["Features", "Pricing", "How It Works", "Sign In", "Create Account"].map((l) => (
              <a key={l} href="#" className="hover:text-white/60 transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-xs text-white/20">© {new Date().getFullYear()} Glam Hub 🇳🇬</p>
        </div>
      </footer>
    </div>
  );
}
