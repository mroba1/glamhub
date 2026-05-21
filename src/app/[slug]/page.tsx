"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar, ShoppingBag, MapPin, Phone, Mail,
  Clock, Star, ArrowRight, Link2, Globe,
} from "lucide-react";
import { MOCK_COMPANIES, MOCK_SERVICES } from "@/constants/mock-data";
import { useBrandingStore } from "@/store/branding.store";
import { formatCurrency } from "@/lib/utils";

const RESERVED = [
  "login","register","booking","marketplace","cart","orders","profile",
  "notifications","admin","super-admin","api","_next","favicon.ico",
  "join","invite","about","contact","terms","privacy",
];

const FALLBACK_BANNER = "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80";

export default function CompanyMiniSitePage() {
  const params  = useParams();
  const slug    = params?.slug as string;

  // Always read live branding from the store — set by the admin customization page
  const branding = useBrandingStore((s) => s.branding);

  if (RESERVED.includes(slug)) return null;

  const company = MOCK_COMPANIES.find((c) => c.slug === slug);
  if (!company) return <NotFound />;

  const services = MOCK_SERVICES.filter((s) => s.companyId === company.id);

  // Resolved display values — store always takes priority over company defaults
  const brandName    = branding.businessName  || company.name;
  const tagline      = branding.tagline       || "Your beauty, our passion";
  const about        = branding.about         || company.description;
  const color        = branding.primaryColor  || "#10b981";
  const logoUrl      = branding.logoUrl       || "";
  const bannerUrl    = branding.bannerUrl     || FALLBACK_BANNER;
  const hours        = branding.openingHours  || [];
  const social       = branding.socialLinks   || { instagram: "", tiktok: "", whatsapp: "", facebook: "" };
  const sections     = branding.sections      || {
    showBooking: true, showMarketplace: true,
    showFeaturedServices: true, showTestimonials: true, showGallery: false,
  };
  const gallery      = branding.gallery       || [];
  const address      = branding.address       || `${company.address}, ${company.city}`;
  const phone        = branding.phone         || company.phone;
  const email        = branding.email         || company.email;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* ═══════════════════════════════════════════════════════
          FIXED HORIZONTAL NAV BAR
          Layout: [LOGO | BRAND NAME] ── nav links ── [Book Now]
          Logo is always to the LEFT of the brand name.
      ════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/85 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

          {/* LEFT — Logo + Brand Name — clicking goes to THIS company's homepage */}
          <Link href={`/${company.slug}`} className="flex items-center gap-3 min-w-0">
            {/* Logo slot — always 40×40, left of name */}
            <div className="h-10 w-10 shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
              style={{ background: logoUrl ? "transparent" : color }}>
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={brandName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg leading-none">
                  {brandName[0].toUpperCase()}
                </span>
              )}
            </div>

            {/* Brand name — always immediately right of logo */}
            <span className="font-bold text-white text-base sm:text-lg truncate">
              {brandName}
            </span>
          </Link>

          {/* CENTER — Nav links — Home always returns to THIS company's page */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/60">
            <Link href={`/${company.slug}`} className="hover:text-white transition-colors">Home</Link>
            {sections.showFeaturedServices && (
              <a href="#services" className="hover:text-white transition-colors">Services</a>
            )}
            {sections.showMarketplace && (
              <a href="#shop" className="hover:text-white transition-colors">Shop</a>
            )}
            <a href="#about"   className="hover:text-white transition-colors">About</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          {/* RIGHT — CTA button */}
          {sections.showBooking && (
            <Link href="/booking" className="shrink-0">
              <button
                className="text-sm font-semibold text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
                style={{ background: color }}
              >
                Book Now
              </button>
            </Link>
          )}
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════
          HERO BANNER — full width, top of page, below nav.
          Always displays the uploaded banner or the fallback.
          Fixed height: 90vh. Banner fills 100% of this area.
      ════════════════════════════════════════════════════════ */}
      <section
        className="relative w-full flex items-end overflow-hidden"
        style={{ height: "90vh", paddingTop: "4rem" /* offset for fixed nav */ }}
      >
        {/* Banner image — covers the entire hero area */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bannerUrl}
          alt={`${brandName} hero banner`}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Gradient overlay — ensures text is readable over any banner */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

        {/* Hero text — anchored to bottom-left */}
        <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 pb-16">
          <p className="text-sm font-semibold mb-2 uppercase tracking-widest" style={{ color }}>
            {company.city}, {company.state}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
            {brandName}
          </h1>
          <p className="text-lg text-white/75 mb-8 max-w-xl leading-relaxed">
            {tagline}
          </p>
          <div className="flex flex-wrap gap-3">
            {sections.showBooking && (
              <Link href="/booking">
                <button
                  className="flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                  style={{ background: color }}
                >
                  <Calendar className="h-4 w-4" />
                  Book Appointment
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            )}
            {sections.showMarketplace && (
              <a href="#shop">
                <button className="flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl border border-white/30 hover:bg-white/10 transition-colors">
                  <ShoppingBag className="h-4 w-4" />
                  Shop Products
                </button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SERVICES SECTION
      ════════════════════════════════════════════════════════ */}
      {sections.showFeaturedServices && services.length > 0 && (
        <section id="services" className="py-20 px-4 sm:px-6 bg-[#0d0d0d]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">Our Services</h2>
              <p className="text-white/50">Book your next beauty session with us</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-all">
                  <div className="relative h-48 overflow-hidden bg-white/5">
                    {service.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute top-3 right-3 rounded-full bg-black/60 border border-white/20 text-white text-xs font-medium px-3 py-1">
                      {service.duration} min
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-medium mb-1" style={{ color }}>{service.categoryName}</p>
                    <h3 className="font-semibold text-white mb-1">{service.name}</h3>
                    <p className="text-sm text-white/50 line-clamp-2 mb-4">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg" style={{ color }}>{formatCurrency(service.price)}</span>
                      <Link href="/booking">
                        <button className="text-sm font-semibold text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity" style={{ background: color }}>
                          Book Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          CUSTOMER CTA — Register / Login
          Always shown so customers know how to create an account
      ════════════════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 bg-[#111]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to book with us?
          </h2>
          <p className="text-white/50 text-sm mb-7">
            Create a free account to book appointments, shop products, and track your orders.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/${company.slug}/register`}>
              <button
                className="flex items-center justify-center gap-2 w-full sm:w-auto font-semibold text-white px-7 py-3 rounded-xl hover:opacity-90 transition-opacity"
                style={{ background: color }}
              >
                Create Account
              </button>
            </Link>
            <Link href={`/${company.slug}/login`}>
              <button className="flex items-center justify-center gap-2 w-full sm:w-auto font-semibold text-white/70 px-7 py-3 rounded-xl border border-white/20 hover:bg-white/5 transition-colors">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          GALLERY SECTION
      ════════════════════════════════════════════════════════ */}
      {sections.showGallery && gallery.length > 0 && (
        <section className="py-20 px-4 sm:px-6 bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-white mb-3">Gallery</h2>
              <p className="text-white/50">Our work speaks for itself</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {gallery.map((url, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          ABOUT SECTION
      ════════════════════════════════════════════════════════ */}
      <section id="about" className="py-20 px-4 sm:px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 rounded-2xl overflow-hidden bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80"
              alt="About"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-2" style={{ color }}>About Us</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">{brandName}</h2>
            <p className="text-white/65 leading-relaxed mb-6">{about}</p>
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1,2,3,4,5].map((i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
              </div>
              <span className="text-white/50 text-sm">Top-rated in {company.city}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CONTACT + HOURS SECTION
      ════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-20 px-4 sm:px-6 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">Get In Touch</h2>
            <p className="text-white/50">We&apos;d love to hear from you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              { icon: MapPin, label: "Address", value: address },
              { icon: Phone,  label: "Phone",   value: phone },
              { icon: Mail,   label: "Email",   value: email },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center text-center rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}20` }}>
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <p className="text-white/40 text-xs mb-1 uppercase tracking-wide">{label}</p>
                <p className="text-white font-medium text-sm">{value || "—"}</p>
              </div>
            ))}
          </div>

          {hours.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4" style={{ color }} />
                <h3 className="font-semibold text-white">Opening Hours</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {hours.map((h) => (
                  <div key={h.day} className="rounded-lg bg-white/5 p-3 text-center">
                    <p className="text-white/40 text-xs">{h.day.slice(0, 3)}</p>
                    <p className={`text-sm font-medium mt-0.5 ${h.closed ? "text-white/30" : "text-white"}`}>
                      {h.closed ? "Closed" : `${h.open}–${h.close}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/10 py-8 px-4 sm:px-6 bg-[#080808]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Footer logo — clicking returns to THIS company's homepage */}
          <Link href={`/${company.slug}`} className="flex items-center gap-3">
            <div className="h-8 w-8 shrink-0 rounded-lg overflow-hidden flex items-center justify-center" style={{ background: logoUrl ? "transparent" : color }}>
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt={brandName} className="h-full w-full object-cover" />
              ) : (
                <span className="text-white font-bold text-sm">{brandName[0].toUpperCase()}</span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{brandName}</p>
              <p className="text-xs text-white/40">Powered by Glam Hub</p>
            </div>
          </Link>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {social.instagram && (
              <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all">
                <Link2 className="h-4 w-4" />
              </a>
            )}
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all">
                <Globe className="h-4 w-4" />
              </a>
            )}
          </div>

          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-serif text-4xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-white/50 mb-6">This business page does not exist on Glam Hub.</p>
        <Link href="/" className="text-[#c9a96e] hover:underline">Back to Homepage</Link>
      </div>
    </div>
  );
}
