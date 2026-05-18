"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { MOCK_COMPANIES } from "@/constants/mock-data";
import { useBrandingStore } from "@/store/branding.store";
import { useAuthStore } from "@/store/auth.store";
import { APP_NAME } from "@/constants";
import { toast } from "sonner";

const schema = z.object({
  name:            z.string().min(2, "Enter your full name"),
  email:           z.string().email("Enter a valid email"),
  phone:           z.string().min(7, "Enter a valid phone number"),
  password:        z.string().min(8, "Min. 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
type FormData = z.infer<typeof schema>;

export default function CompanyCustomerRegisterPage() {
  const params  = useParams();
  const router  = useRouter();
  const slug    = params?.slug as string;
  const setUser = useAuthStore((s) => s.setUser);
  const branding = useBrandingStore((s) => s.branding);

  const company = MOCK_COMPANIES.find((c) => c.slug === slug);
  const brandName  = branding.businessName || company?.name || APP_NAME;
  const color      = branding.primaryColor || "#10b981";
  const logoUrl    = branding.logoUrl || "";

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [done, setDone]                 = useState(false);

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

  const handleRegister = async (data: FormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    // TODO: replace with real API — pass companyId so backend scopes customer to this company
    setUser({
      id: "cust-" + Math.random().toString(36).substring(2, 7),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: "customer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setIsLoading(false);
    setDone(true);
    toast.success(`Welcome to ${brandName}!`);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${color}20` }}>
            <CheckCircle className="h-8 w-8" style={{ color }} />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white mb-2">You&apos;re in!</h1>
          <p className="text-white/60 text-sm mb-6">
            Your account has been created with {brandName}. You can now book appointments and shop products.
          </p>
          <button
            onClick={() => router.push(`/${slug}`)}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ background: color }}
          >
            Go to {brandName} <ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={() => router.push("/booking")} className="mt-3 text-sm text-white/40 hover:text-white/70 transition-colors">
            Book an appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">

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
          <p className="text-white/50 text-sm">Create your customer account to book services and shop products</p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/40">
            <Sparkles className="h-3 w-3" />
            Powered by {APP_NAME}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <form onSubmit={handleSubmit(handleRegister as any)} className="space-y-4">
            <Field label="Full Name" error={errors.name?.message}>
              <input {...register("name")} placeholder="Adaeze Okonkwo" className={inputCls} />
            </Field>
            <Field label="Email Address" error={errors.email?.message}>
              <input {...register("email")} type="email" placeholder="adaeze@email.com" className={inputCls} />
            </Field>
            <Field label="Phone Number" error={errors.phone?.message}>
              <input {...register("phone")} type="tel" placeholder="08012345678" className={inputCls} />
            </Field>
            <Field label="Password" error={errors.password?.message}>
              <div className="relative">
                <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" className={inputCls + " pr-11"} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
            <Field label="Confirm Password" error={errors.confirmPassword?.message}>
              <input {...register("confirmPassword")} type="password" placeholder="Repeat password" className={inputCls} />
            </Field>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{ background: color }}
            >
              {isLoading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Creating account…</>
              ) : (
                <>Create Account <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/30 mt-5">
          Already have an account?{" "}
          <button onClick={() => router.push(`/${slug}/login`)} className="text-white/50 hover:text-white transition-colors">
            Sign in
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

const inputCls = "w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-white/70">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
