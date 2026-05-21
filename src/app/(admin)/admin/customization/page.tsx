"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Paintbrush, Store, Clock, Share2, ImageIcon, Layout,
  Save, Eye, CheckCircle, Link2, Globe, Phone,
} from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { UploadZone } from "@/components/shared/upload-zone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MOCK_TEMPLATES } from "@/constants/mock-data";
import { useBrandingStore } from "@/store/branding.store";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

const TABS = [
  { id: "branding",  label: "Branding",          icon: Paintbrush },
  { id: "info",      label: "Business Info",      icon: Store },
  { id: "hours",     label: "Opening Hours",      icon: Clock },
  { id: "sections",  label: "Page Sections",      icon: Layout },
  { id: "social",    label: "Social Links",       icon: Share2 },
  { id: "gallery",   label: "Gallery",            icon: ImageIcon },
  { id: "template",  label: "Template",           icon: Eye },
] as const;

type TabId = typeof TABS[number]["id"];

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const infoSchema = z.object({
  businessName: z.string().min(2),
  tagline: z.string().max(120).optional(),
  about: z.string().max(800).optional(),
  phone: z.string().min(7),
  email: z.string().email(),
  address: z.string().min(5),
});

type InfoFormData = z.infer<typeof infoSchema>;

export default function AdminCustomizationPage() {
  const [activeTab, setActiveTab] = useState<TabId>("branding");
  const { branding, setBranding } = useBrandingStore();
  const companySlug = useAuthStore((s) => s.companySlug); // real DB slug
  const [isSaving, setIsSaving] = useState(false);

  const infoForm = useForm<InfoFormData>({
    resolver: zodResolver(infoSchema) as any,
    defaultValues: {
      businessName: branding.businessName,
      tagline: branding.tagline,
      about: branding.about,
      phone: branding.phone,
      email: branding.email,
      address: branding.address,
    },
  });

  const save = async (msg = "Changes saved") => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    toast.success(msg);
  };

  const toggleSection = (key: keyof typeof branding.sections) => {
    setBranding((b) => ({ ...b, sections: { ...b.sections, [key]: !b.sections[key] } }));
  };

  const updateHour = (day: string, field: "open" | "close" | "closed", value: string | boolean) => {
    setBranding((b) => ({
      ...b,
      openingHours: b.openingHours.map((h) => h.day === day ? { ...h, [field]: value } : h),
    }));
  };

  return (
    <div className="space-y-0">
      <AdminTopBar
        title="Website Customization"
        subtitle="Control how your mini-site looks to customers"
        userName="Studio Admin"
        showTimePeriod={false}
      />

      {/* Live preview banner */}
      <div className="mx-4 md:mx-6 mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-emerald-700">
          <Globe className="h-4 w-4 shrink-0" />
          Your mini-site:
          <span className="font-mono font-semibold">glamhub.com/{companySlug || "your-salon"}</span>
        </div>
        <a
          href={`/${companySlug || "your-salon"}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
        >
          <Eye className="h-3.5 w-3.5" /> Preview site
        </a>
      </div>

      <div className="px-4 md:px-6 mt-4 flex flex-col lg:flex-row gap-4">
        {/* Tab list — vertical on desktop, horizontal scroll on mobile */}
        <div className="lg:w-48 shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex items-center gap-2.5 shrink-0 lg:w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-all text-left",
                  activeTab === id
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap lg:whitespace-normal">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 mb-6">

          {/* ── BRANDING ── */}
          {activeTab === "branding" && (
            <div className="space-y-6">
              <h2 className="font-semibold text-gray-900 text-base">Brand Identity</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo */}
                <div className="space-y-3">
                  {branding.logoUrl && (
                    <div className="relative h-24 w-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                      <button
                        onClick={() => setBranding((b) => ({ ...b, logoUrl: "" }))}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                      >×</button>
                    </div>
                  )}
                  <UploadZone
                    label="Business Logo"
                    hint="Square image, min 200×200px, PNG or WebP"
                    onFilesSelected={(files) => {
                      const url = URL.createObjectURL(files[0]);
                      setBranding((b) => ({ ...b, logoUrl: url }));
                      save("Logo saved");
                    }}
                  />
                </div>

                {/* Banner */}
                <div className="space-y-3">
                  {branding.bannerUrl && (
                    <div className="relative h-24 w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={branding.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setBranding((b) => ({ ...b, bannerUrl: "" }))}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                      >×</button>
                    </div>
                  )}
                  <UploadZone
                    label="Hero Banner"
                    hint="Recommended 1200×400px for best results"
                    onFilesSelected={(files) => {
                      const url = URL.createObjectURL(files[0]);
                      setBranding((b) => ({ ...b, bannerUrl: url }));
                      save("Banner saved");
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Primary Colour</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) => setBranding((b) => ({ ...b, primaryColor: e.target.value }))}
                      className="h-10 w-14 rounded-lg border border-gray-200 cursor-pointer p-1"
                    />
                    <span className="text-sm font-mono text-gray-500">{branding.primaryColor}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Secondary Colour</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={branding.secondaryColor}
                      onChange={(e) => setBranding((b) => ({ ...b, secondaryColor: e.target.value }))}
                      className="h-10 w-14 rounded-lg border border-gray-200 cursor-pointer p-1"
                    />
                    <span className="text-sm font-mono text-gray-500">{branding.secondaryColor}</span>
                  </div>
                </div>
              </div>

              {/* Colour preview */}
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <div className="h-16" style={{ background: branding.primaryColor }} />
                <div className="h-8" style={{ background: branding.secondaryColor }} />
                <div className="p-4 bg-gray-50 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: branding.primaryColor }}>A</div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700">Colour Preview</p>
                    <p className="text-[10px] text-gray-400">This is how your brand colours appear on the site</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button variant="gold" onClick={() => save("Branding saved")} isLoading={isSaving}>
                  <Save className="h-4 w-4" /> Save Branding
                </Button>
              </div>
            </div>
          )}

          {/* ── BUSINESS INFO ── */}
          {activeTab === "info" && (
            <form onSubmit={infoForm.handleSubmit((d) => save("Business info saved"))} className="space-y-4">
              <h2 className="font-semibold text-gray-900 text-base">Business Information</h2>
              <Input label="Business Name" error={infoForm.formState.errors.businessName?.message} {...infoForm.register("businessName")} />
              <Input label="Tagline" placeholder="e.g. Your beauty, our passion" {...infoForm.register("tagline")} />
              <Textarea label="About Your Business" rows={4} placeholder="Tell customers about your salon…" {...infoForm.register("about")} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Phone Number" type="tel" error={infoForm.formState.errors.phone?.message} {...infoForm.register("phone")} />
                <Input label="Email Address" type="email" error={infoForm.formState.errors.email?.message} {...infoForm.register("email")} />
              </div>
              <Input label="Business Address" error={infoForm.formState.errors.address?.message} {...infoForm.register("address")} />
              <Button type="submit" variant="gold" isLoading={isSaving}>
                <Save className="h-4 w-4" /> Save Info
              </Button>
            </form>
          )}

          {/* ── OPENING HOURS ── */}
          {activeTab === "hours" && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 text-base">Opening Hours</h2>
              <div className="space-y-2">
                {branding.openingHours.map((hour) => (
                  <div key={hour.day} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <div className="w-24 shrink-0">
                      <p className="text-sm font-medium text-gray-700">{hour.day}</p>
                    </div>
                    {hour.closed ? (
                      <p className="flex-1 text-sm text-gray-400 italic">Closed</p>
                    ) : (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="time"
                          value={hour.open}
                          onChange={(e) => updateHour(hour.day, "open", e.target.value)}
                          className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                        />
                        <span className="text-gray-400 text-xs">to</span>
                        <input
                          type="time"
                          value={hour.close}
                          onChange={(e) => updateHour(hour.day, "close", e.target.value)}
                          className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                        />
                      </div>
                    )}
                    <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={hour.closed}
                        onChange={(e) => updateHour(hour.day, "closed", e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      Closed
                    </label>
                  </div>
                ))}
              </div>
              <Button variant="gold" onClick={() => save("Opening hours saved")} isLoading={isSaving}>
                <Save className="h-4 w-4" /> Save Hours
              </Button>
            </div>
          )}

          {/* ── PAGE SECTIONS ── */}
          {activeTab === "sections" && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 text-base">Page Sections</h2>
              <p className="text-sm text-gray-400">Toggle which sections appear on your mini-site. The template layout stays fixed.</p>
              <div className="space-y-2">
                {[
                  { key: "showBooking",         label: "Appointment Booking",     desc: "Let customers book services directly" },
                  { key: "showMarketplace",      label: "Product Marketplace",     desc: "Show your products for sale" },
                  { key: "showFeaturedServices", label: "Featured Services",       desc: "Highlight your top services on the homepage" },
                  { key: "showTestimonials",     label: "Customer Testimonials",   desc: "Show reviews from happy clients" },
                  { key: "showGallery",          label: "Photo Gallery",           desc: "Display your salon photos and portfolio" },
                ] .map(({ key, label, desc }) => {
                  const k = key as keyof typeof branding.sections;
                  const on = branding.sections[k];
                  return (
                    <div key={key} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3.5">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => toggleSection(k)}
                        className={cn(
                          "relative h-6 w-11 rounded-full transition-colors duration-200 shrink-0",
                          on ? "bg-emerald-500" : "bg-gray-200"
                        )}
                      >
                        <div className={cn(
                          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                          on ? "translate-x-5" : "translate-x-0.5"
                        )} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <Button variant="gold" onClick={() => save("Sections saved")} isLoading={isSaving}>
                <Save className="h-4 w-4" /> Save Sections
              </Button>
            </div>
          )}

          {/* ── SOCIAL LINKS ── */}
          {activeTab === "social" && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 text-base">Social Media Links</h2>
              <p className="text-sm text-gray-400">Add your handles or full URLs. Leave blank to hide.</p>
              {[
                { key: "instagram", label: "Instagram",  placeholder: "@yoursalon or full URL", icon: Link2 },
                { key: "tiktok",    label: "TikTok",     placeholder: "@yoursalon or full URL", icon: Link2 },
                { key: "whatsapp",  label: "WhatsApp",   placeholder: "+234 801 234 5678",       icon: Phone },
                { key: "facebook",  label: "Facebook",   placeholder: "Page name or full URL",   icon: Globe },
              ].map(({ key, label, placeholder, icon: Icon }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-400" /> {label}
                  </label>
                  <input
                    value={branding.socialLinks[key as keyof typeof branding.socialLinks]}
                    onChange={(e) => setBranding((b) => ({ ...b, socialLinks: { ...b.socialLinks, [key]: e.target.value } }))}
                    placeholder={placeholder}
                    className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                  />
                </div>
              ))}
              <Button variant="gold" onClick={() => save("Social links saved")} isLoading={isSaving}>
                <Save className="h-4 w-4" /> Save Links
              </Button>
            </div>
          )}

          {/* ── GALLERY ── */}
          {activeTab === "gallery" && (
            <div className="space-y-5">
              <h2 className="font-semibold text-gray-900 text-base">Photo Gallery</h2>
              <p className="text-sm text-gray-400">Upload salon photos and portfolio images. These will appear in your Gallery section.</p>
              <UploadZone
                label="Upload Gallery Photos"
                maxFiles={10}
                hint="Up to 10 photos, JPEG or PNG, max 5MB each"
                onFilesSelected={(files) => {
                  setBranding((b) => ({ ...b, gallery: [...b.gallery, ...files.map((f) => URL.createObjectURL(f))] }));
                  toast.success(`${files.length} photo${files.length > 1 ? "s" : ""} added to gallery`);
                }}
              />
              {branding.gallery.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                  {branding.gallery.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setBranding((b) => ({ ...b, gallery: b.gallery.filter((_, idx) => idx !== i) }))}
                        className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Save gallery */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100 mt-4">
                <Button variant="gold" onClick={() => save("Gallery saved")} isLoading={isSaving}>
                  <Save className="h-4 w-4" /> Save Gallery
                </Button>
                {branding.gallery.length > 0 && (
                  <button
                    onClick={() => { setBranding((b) => ({ ...b, gallery: [] })); toast.info("Gallery cleared"); }}
                    className="text-sm text-red-500 hover:text-red-600 hover:underline transition-colors"
                  >
                    Clear all photos
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── TEMPLATE ── */}
          {activeTab === "template" && (
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900 text-base">Choose Template</h2>
                  <p className="text-sm text-gray-400 mt-0.5">Select a layout for your mini-site. You can change content but not the layout structure.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_TEMPLATES.filter((t) => t.isActive).map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setBranding((b) => ({ ...b, templateId: tpl.id }))}
                    className={cn(
                      "text-left rounded-2xl border-2 overflow-hidden transition-all",
                      branding.templateId === tpl.id ? "border-emerald-500 shadow-md" : "border-gray-200 hover:border-emerald-200"
                    )}
                  >
                    <div className="relative h-36 overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={tpl.thumbnailUrl} alt={tpl.name} className="w-full h-full object-cover" />
                      {tpl.isPremium && (
                        <span className="absolute top-2 right-2 rounded-full bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5">PRO</span>
                      )}
                      {branding.templateId === tpl.id && (
                        <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-emerald-600" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-gray-800 text-sm">{tpl.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{tpl.description}</p>
                      {branding.templateId === tpl.id && (
                        <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-emerald-600">
                          <CheckCircle className="h-3 w-3" /> Currently active
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Save template */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100 mt-2">
                <Button variant="gold" onClick={() => save("Template saved")} isLoading={isSaving}>
                  <Save className="h-4 w-4" /> Save Template
                </Button>
                {branding.templateId && (
                  <p className="text-sm text-gray-500">
                    Active: <span className="font-medium text-gray-700">
                      {MOCK_TEMPLATES.find((t) => t.id === branding.templateId)?.name ?? "Unknown"}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
