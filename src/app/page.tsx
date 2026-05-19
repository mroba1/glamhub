import Link from "next/link";
import {
  Sparkles, ArrowRight, CheckCircle, Globe, Paintbrush,
  ShoppingBag, Calendar, BarChart3, Bell, Star,
  ChevronDown, Zap, Shield, Crown,
} from "lucide-react";
import { APP_NAME } from "@/constants";

// ── Data ─────────────────────────────────────────────────────
const FEATURES = [
  { icon: Globe,      title: "Your Own Website",       desc: "Get a unique branded URL (glamhub.com/your-salon) that's entirely yours. No coding required." },
  { icon: Calendar,   title: "Appointment Booking",     desc: "Let customers book appointments directly from your site with real-time availability." },
  { icon: ShoppingBag,title: "Online Marketplace",      desc: "Sell your beauty products online. Manage stock, pricing, and orders from one dashboard." },
  { icon: Paintbrush, title: "Full Customization",      desc: "Upload your logo, set your brand colours, write your story. Your site, your identity." },
  { icon: BarChart3,  title: "Business Analytics",      desc: "Track bookings, revenue, and customers with a clean dashboard designed for salons." },
  { icon: Bell,       title: "Smart Notifications",     desc: "Get notified instantly for new bookings, orders, and payments. Never miss a customer." },
];

const STEPS = [
  { step: "01", title: "Create Your Account",     desc: "Sign up as a business owner in under 2 minutes. No credit card needed to start." },
  { step: "02", title: "Customize Your Site",      desc: "Upload your logo, add your services, set your hours and brand colours." },
  { step: "03", title: "Choose a Plan & Pay",      desc: "Pick a subscription that fits your business. Payment is simple and secure." },
  { step: "04", title: "Go Live & Share",          desc: "Get your unique link — glamhub.com/your-salon — and share it with your customers." },
];

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    icon: Zap,
    monthly: "₦15,000",
    yearly: "₦150,000",
    desc: "Perfect for small salons just starting out",
    features: ["Up to 20 products", "50 bookings/month", "Basic analytics", "Customer management", "Your own website URL"],
    cta: "Get Started",
    popular: false,
  },
  {
    id: "growth",
    name: "Growth",
    icon: Shield,
    monthly: "₦35,000",
    yearly: "₦350,000",
    desc: "For growing salons with expanding clientele",
    features: ["Up to 100 products", "200 bookings/month", "Advanced analytics", "Priority notifications", "Custom promotions", "Multiple staff accounts"],
    cta: "Start Growing",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Crown,
    monthly: "₦75,000",
    yearly: "₦750,000",
    desc: "For large salons and multi-branch operations",
    features: ["Unlimited products", "Unlimited bookings", "Full analytics suite", "Dedicated account manager", "API access", "Priority 24/7 support"],
    cta: "Scale Up",
    popular: false,
  },
];

const TESTIMONIALS = [
  { name: "Amaka Eze",      role: "Owner, Glam Parlor Lagos",      text: "I had my website up in one afternoon. My clients now book online and I've doubled my revenue in 3 months.", stars: 5 },
  { name: "Blessing Okafor",role: "CEO, Beauty House Abuja",        text: "The marketplace feature alone was worth it. I sell my products 24/7 without lifting a finger.", stars: 5 },
  { name: "Chidinma Nwosu", role: "Founder, Nail Zone Port Harcourt",text: "Professional, beautiful, and so easy. My customers love the booking system. I love the dashboard.", stars: 5 },
];

// ── Page ─────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ═══════════════ NAV ═══════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#c9a96e] flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-black" />
            </div>
            <span className="font-serif text-lg font-bold text-white">{APP_NAME}</span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/55">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#features"     className="hover:text-white transition-colors">Features</a>
            <a href="#pricing"      className="hover:text-white transition-colors">Pricing</a>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-sm text-white/60 hover:text-white transition-colors font-medium">
              Sign In
            </Link>
            <Link href="/join">
              <button className="flex items-center gap-1.5 text-sm font-semibold text-black bg-[#c9a96e] px-4 py-2 rounded-xl hover:bg-[#b8935a] transition-colors">
                Start Free <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-16 overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-[600px] w-[600px] rounded-full bg-[#c9a96e]/6 blur-[120px]" />
        </div>

        {/* Grid background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a96e]/30 bg-[#c9a96e]/8 px-4 py-1.5 mb-8 text-xs font-medium text-[#c9a96e]">
            <Sparkles className="h-3.5 w-3.5" />
            Nigeria&apos;s #1 Beauty Business Platform
          </div>

          {/* Main headline */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.92] mb-6">
            Build Your Beauty
            <br />
            <span className="text-[#c9a96e] italic">Business Website</span>
            <br />
            in Minutes
          </h1>

          <p className="text-lg sm:text-xl text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed">
            Do you own a salon, spa, or beauty studio? Create your professional website,
            take bookings, sell products, and grow your business — all in one place.
            No coding. No stress.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/join">
              <button className="flex items-center justify-center gap-2 text-base font-semibold text-black bg-[#c9a96e] px-8 py-4 rounded-xl hover:bg-[#b8935a] transition-all hover:shadow-[0_0_30px_rgba(201,169,110,0.3)] group">
                Create Your Business Page
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <a href="#how-it-works">
              <button className="flex items-center justify-center gap-2 text-base font-medium text-white/70 border border-white/15 px-8 py-4 rounded-xl hover:bg-white/5 hover:text-white transition-colors">
                See How It Works
                <ChevronDown className="h-4 w-4" />
              </button>
            </a>
          </div>

          {/* Social proof numbers */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { value: "500+", label: "Beauty Businesses" },
              { value: "50K+", label: "Bookings Made" },
              { value: "12",   label: "Cities in Nigeria" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-serif text-3xl font-bold text-[#c9a96e]">{value}</p>
                <p className="text-xs text-white/40 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </section>

      {/* ═══════════════ WHAT YOU GET (mini-site preview) ═══════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#c9a96e] text-sm font-semibold uppercase tracking-widest mb-3">What You Get</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              Your Own Corner of the Internet
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Every business on Glam Hub gets a unique, branded website that customers
              can find, book from, and shop on — all powered by you.
            </p>
          </div>

          {/* Mock browser preview */}
          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Browser chrome */}
            <div className="bg-[#1a1a1a] px-4 py-3 flex items-center gap-3 border-b border-white/8">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 bg-[#111] rounded-md px-3 py-1 text-xs text-white/30 font-mono text-center">
                glamhub.com/<span className="text-[#c9a96e]">your-salon-name</span>
              </div>
            </div>
            {/* Fake website preview */}
            <div className="bg-[#111] aspect-video relative overflow-hidden">
              <div className="absolute inset-0 flex flex-col">
                {/* Fake nav */}
                <div className="h-12 bg-black/60 backdrop-blur flex items-center px-6 gap-6 border-b border-white/5">
                  <div className="h-6 w-6 rounded-lg bg-[#c9a96e]" />
                  <div className="h-3 w-24 rounded bg-white/20" />
                  <div className="flex-1" />
                  <div className="h-3 w-16 rounded bg-white/10" />
                  <div className="h-3 w-14 rounded bg-white/10" />
                  <div className="h-7 w-20 rounded-lg bg-[#c9a96e]" />
                </div>
                {/* Fake hero */}
                <div className="flex-1 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/40" />
                  <div className="absolute inset-0 bg-[#c9a96e]/5" />
                  <div className="absolute bottom-6 left-8 space-y-3">
                    <div className="h-2 w-16 rounded bg-[#c9a96e]/60" />
                    <div className="h-8 w-64 rounded-lg bg-white/80" />
                    <div className="h-4 w-48 rounded bg-white/30" />
                    <div className="flex gap-2 mt-2">
                      <div className="h-9 w-32 rounded-xl bg-[#c9a96e]" />
                      <div className="h-9 w-28 rounded-xl border border-white/30" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute top-4 right-4 bg-[#c9a96e] text-black text-xs font-bold px-3 py-1.5 rounded-full">
                Your unique URL ✓
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#c9a96e] text-sm font-semibold uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              From Sign Up to Live Website in 4 Steps
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              No technical knowledge needed. We&apos;ve made it as simple as possible
              for beauty business owners to get online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(({ step, title, desc }, i) => (
              <div key={step} className="relative group">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(100%+12px)] right-0 w-6 h-px bg-white/10 translate-x-0 z-10" />
                )}
                <div className="rounded-2xl border border-white/8 bg-white/3 p-6 hover:border-[#c9a96e]/30 hover:bg-[#c9a96e]/4 transition-all duration-300 h-full">
                  <div className="font-serif text-4xl font-bold text-[#c9a96e]/25 mb-4">{step}</div>
                  <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/join">
              <button className="flex items-center justify-center gap-2 text-base font-semibold text-black bg-[#c9a96e] px-8 py-4 rounded-xl hover:bg-[#b8935a] transition-all mx-auto group">
                Start Building Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section id="features" className="py-24 px-4 sm:px-6 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#c9a96e] text-sm font-semibold uppercase tracking-widest mb-3">Everything You Need</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              A Complete Business Platform for Beauty Professionals
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              From your first booking to your hundredth loyal customer — Glam Hub has every tool your beauty business needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group rounded-2xl border border-white/8 bg-white/3 p-6 hover:border-[#c9a96e]/30 hover:bg-[#c9a96e]/4 transition-all duration-300">
                <div className="h-11 w-11 rounded-xl bg-[#c9a96e]/10 border border-[#c9a96e]/20 flex items-center justify-center mb-4 group-hover:bg-[#c9a96e]/20 transition-colors">
                  <Icon className="h-5 w-5 text-[#c9a96e]" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRICING ═══════════════ */}
      <section id="pricing" className="py-24 px-4 sm:px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#c9a96e] text-sm font-semibold uppercase tracking-widest mb-3">Transparent Pricing</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              Simple Plans for Every Business
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Start free, pay when you&apos;re ready. No hidden fees. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map(({ id, name, icon: Icon, monthly, yearly, desc, features, cta, popular }) => (
              <div key={id} className={`relative rounded-2xl p-6 flex flex-col ${
                popular
                  ? "border-2 border-[#c9a96e] bg-[#c9a96e]/6 shadow-[0_0_40px_rgba(201,169,110,0.15)]"
                  : "border border-white/10 bg-white/3"
              }`}>
                {popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#c9a96e] text-black text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${popular ? "bg-[#c9a96e] text-black" : "bg-white/8 text-[#c9a96e]"}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="font-serif text-2xl font-bold text-white mb-1">{name}</h3>
                <p className="text-white/40 text-sm mb-5">{desc}</p>

                <div className="mb-2">
                  <span className="font-serif text-4xl font-bold text-white">{monthly}</span>
                  <span className="text-white/40 text-sm">/month</span>
                </div>
                <p className="text-white/30 text-xs mb-6">or {yearly}/year (save 17%)</p>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-white/65">
                      <CheckCircle className="h-4 w-4 text-[#c9a96e] shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href="/join">
                  <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    popular
                      ? "bg-[#c9a96e] text-black hover:bg-[#b8935a]"
                      : "border border-white/15 text-white hover:bg-white/8"
                  }`}>
                    {cta}
                  </button>
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-white/30 text-sm mt-8">
            All plans include your unique glamhub.com/your-business URL, SSL security, and 24/7 uptime.
          </p>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#c9a96e] text-sm font-semibold uppercase tracking-widest mb-3">Real Results</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              Beauty Businesses Love Glam Hub
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text, stars }) => (
              <div key={name} className="rounded-2xl border border-white/8 bg-white/3 p-6">
                <div className="flex mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#c9a96e] text-[#c9a96e]" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-5 italic">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#c9a96e] flex items-center justify-center text-black font-bold text-sm shrink-0">
                    {name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{name}</p>
                    <p className="text-white/40 text-xs">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="py-28 px-4 sm:px-6 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-[500px] w-[500px] rounded-full bg-[#c9a96e]/8 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a96e]/30 bg-[#c9a96e]/8 px-4 py-1.5 mb-6 text-xs font-medium text-[#c9a96e]">
            <Sparkles className="h-3.5 w-3.5" />
            Join 500+ beauty businesses already on Glam Hub
          </div>
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
            Ready to Build Your
            <br />
            <span className="text-[#c9a96e]">Beauty Empire?</span>
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            Create your professional business website today. Your customers are already looking for you online — make sure they find you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join">
              <button className="flex items-center justify-center gap-2 text-base font-semibold text-black bg-[#c9a96e] px-8 py-4 rounded-xl hover:bg-[#b8935a] transition-all hover:shadow-[0_0_30px_rgba(201,169,110,0.3)] group">
                Create Your Business Page — It&apos;s Free to Start
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
          <p className="text-white/25 text-sm mt-5">No credit card required · Set up in minutes · Cancel anytime</p>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-white/8 py-12 px-4 sm:px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-lg bg-[#c9a96e] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-black" />
              </div>
              <span className="font-serif text-xl font-bold">{APP_NAME}</span>
            </div>
            <p className="text-white/35 text-sm max-w-xs leading-relaxed">
              Nigeria&apos;s premier SaaS platform for beauty and salon businesses.
              Build your website, grow your clientele, run your business — all in one place.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white/70 text-sm mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-white/35">
              {["How It Works", "Features", "Pricing", "Sign Up"].map((l) => (
                <li key={l}><a href="#" className="hover:text-[#c9a96e] transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white/70 text-sm mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm text-white/35">
              {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"].map((l) => (
                <li key={l}><a href="#" className="hover:text-[#c9a96e] transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p className="text-white/25 text-xs">Built for Nigerian Beauty Professionals 🇳🇬</p>
        </div>
      </footer>
    </div>
  );
}
