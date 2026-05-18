"use client";
import { useState } from "react";
import { Shield, Link2, Copy, CheckCircle, MessageSquare, Building2, Users, Globe, ExternalLink, Lock } from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { MOCK_COMPANIES } from "@/constants/mock-data";

const BASE = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

const LINKS = {
  superAdmin:    `${BASE}/super-admin/login`,
  businessOwner: `${BASE}/join`,
};

export default function SuperAdminInvitesPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (key: string, url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2500);
    });
  };

  const whatsapp = (url: string, msg: string) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="space-y-0">
      <AdminTopBar
        title="Access Links"
        subtitle="Manage platform access links for each role"
        userName="Super Admin"
        showTimePeriod={false}
      />

      <div className="p-4 md:p-6 space-y-6 max-w-3xl">

        {/* ── How the system works ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Platform Access Structure</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Shield,   color: "bg-purple-50 text-purple-600",  label: "Super Admin",    desc: "Private login link. Only you use this. Never share it." },
              { icon: Building2, color: "bg-emerald-50 text-emerald-600", label: "Business Owners", desc: "Shareable registration link. Business owners create their account here." },
              { icon: Users,     color: "bg-blue-50 text-blue-500",      label: "Customers",       desc: "Each business gets a unique URL. Their customers register there." },
            ].map(({ icon: Icon, color, label, desc }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-gray-50">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-semibold text-gray-800 text-sm">{label}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Link 1: Super Admin private login ── */}
        <div className="bg-white rounded-2xl border border-purple-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 bg-purple-50/50">
            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
              <Lock className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Your Private Login Link</p>
              <p className="text-xs text-red-500 font-medium">⚠ Never share this link with anyone</p>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <code className="flex-1 text-sm text-purple-700 font-medium break-all">{LINKS.superAdmin}</code>
            </div>
            <div className="flex gap-2">
              <button onClick={() => copy("sa", LINKS.superAdmin)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
                  copied === "sa" ? "bg-emerald-500 text-white border-emerald-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {copied === "sa" ? <><CheckCircle className="h-3.5 w-3.5" />Copied!</> : <><Copy className="h-3.5 w-3.5" />Copy Link</>}
              </button>
              <a href={LINKS.superAdmin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                <ExternalLink className="h-3.5 w-3.5" />Open
              </a>
            </div>
          </div>
        </div>

        {/* ── Link 2: Business owner registration ── */}
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 bg-emerald-50/50">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <Link2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Business Owner Registration Link</p>
              <p className="text-xs text-emerald-600 font-medium">✓ Safe to share with business owners</p>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <code className="flex-1 text-sm text-emerald-700 font-medium break-all">{LINKS.businessOwner}</code>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => copy("biz", LINKS.businessOwner)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
                  copied === "biz" ? "bg-emerald-500 text-white border-emerald-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {copied === "biz" ? <><CheckCircle className="h-3.5 w-3.5" />Copied!</> : <><Copy className="h-3.5 w-3.5" />Copy Link</>}
              </button>
              <button
                onClick={() => whatsapp(LINKS.businessOwner,
                  `Hi! You've been invited to create your beauty business on Glam Hub — Nigeria's #1 beauty SaaS platform.\n\nRegister here: ${LINKS.businessOwner}\n\nOnce approved, you'll get your own branded website, booking system, and online store.`)}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors">
                <MessageSquare className="h-3.5 w-3.5" />WhatsApp
              </button>
              <a href={LINKS.businessOwner} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                <ExternalLink className="h-3.5 w-3.5" />Preview
              </a>
            </div>
          </div>
        </div>

        {/* ── All company customer links ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Globe className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Company Customer Links</p>
              <p className="text-xs text-gray-400">Each business owner shares their unique link with their customers</p>
            </div>
          </div>
          {MOCK_COMPANIES.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              No companies registered yet. Share the business registration link above to get started.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {MOCK_COMPANIES.map((co) => {
                const customerLink = `${BASE}/${co.slug}`;
                const registerLink = `${BASE}/${co.slug}/register`;
                return (
                  <div key={co.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-800 text-sm">{co.name}</p>
                          <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                            co.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-600"
                          }`}>{co.status}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 w-16 shrink-0">Customer:</span>
                            <code className="text-xs text-blue-600">{customerLink}</code>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 w-16 shrink-0">Register:</span>
                            <code className="text-xs text-gray-500">{registerLink}</code>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={() => { copy(`co-${co.id}`, customerLink); }}
                          className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-semibold border transition-all ${
                            copied === `co-${co.id}` ? "bg-emerald-500 text-white border-emerald-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                          <Copy className="h-3 w-3" />
                          {copied === `co-${co.id}` ? "Copied" : "Copy"}
                        </button>
                        <a href={customerLink} target="_blank" rel="noopener noreferrer"
                          className="h-8 w-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-gray-50 transition-all">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Flow summary ── */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Complete Onboarding Flow</p>
          <div className="flex flex-wrap gap-2 items-center text-xs text-gray-600">
            {[
              "Super Admin shares business link",
              "Business owner registers at /join",
              "You approve their account",
              "They pay subscription & customize",
              "They get their unique /[slug] URL",
              "Customers register at /[slug]/register",
              "Customers book & shop on /[slug]",
            ].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="h-5 w-5 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  {step}
                </span>
                {i < arr.length - 1 && <span className="text-gray-300">→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
