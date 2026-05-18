"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { MOCK_COMPANIES } from "@/constants/mock-data";
import { useBrandingStore } from "@/store/branding.store";
import { useAuthStore } from "@/store/auth.store";
import { APP_NAME } from "@/constants";
import { toast } from "sonner";

const schema = z.object({
  email:    z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password required"),
});
type FormData = z.infer<typeof schema>;

export default function CompanyCustomerLoginPage() {
  const params   = useParams();
  const router   = useRouter();
  const slug     = params?.slug as string;
  const setUser  = useAuthStore((s) => s.setUser);
  const branding = useBrandingStore((s) => s.branding);

  const company   = MOCK_COMPANIES.find((c) => c.slug === slug);
  const brandName = branding.businessName || company?.name || APP_NAME;
  const color     = branding.primaryColor || "#10b981";
  const logoUrl   = branding.logoUrl || "";

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
  });

  if (!company) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-white/50">Company not found.</p>
      </div>
    );
  }

  const handleLogin = async (data: FormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    // TODO: replace with real API — validate customer credentials scoped to this company
    setUser({
      id: "cust-" + Math.random().toString(36).substring(2, 7),
      name: "Customer",
      email: data.email,
      role: "customer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setIsLoading(false);
    toast.success(`Welcome back to ${brandName}!`);
    router.push(`/${slug}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Company header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={brandName} className="h-12 w-12 rounded-xl object-cover" />
            ) : (
              <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-xl" style={{ background: color }}>
                {brandName[0].toUpperCase()}
              </div>
            )}
            <h1 className="font-bold text-2xl text-white">{brandName}</h1>
          </div>
          <p className="text-white/50 text-sm">Sign in to your customer account</p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/40">
            <Sparkles className="h-3 w-3" />
            Powered by {APP_NAME}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <form onSubmit={handleSubmit(handleLogin as any)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70">Email Address</label>
              <input {...register("email")} type="email" placeholder="adaeze@email.com"
                className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all" />
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5 relative">
              <label className="text-sm font-medium text-white/70">Password</label>
              <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••"
                className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 pr-11 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-white/40 hover:text-white/70">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
              style={{ background: color }}
            >
              {isLoading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in…</>
              ) : (
                <>Sign In <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/30 mt-5">
          Don&apos;t have an account?{" "}
          <button onClick={() => router.push(`/${slug}/register`)} className="text-white/50 hover:text-white transition-colors">
            Create one
          </button>
          {" · "}
          <button onClick={() => router.push(`/${slug}`)} className="text-white/50 hover:text-white transition-colors">
            Back to {brandName}
          </button>
        </p>
      </div>
    </div>
  );
}
