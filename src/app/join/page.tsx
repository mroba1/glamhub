"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Sparkles, CheckCircle, Eye, EyeOff, Building2, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { APP_NAME } from "@/constants";
import { toast } from "sonner";

const schema = z.object({
  ownerName:       z.string().min(2, "Enter your full name"),
  businessName:    z.string().min(2, "Enter your business name"),
  email:           z.string().email("Enter a valid email address"),
  phone:           z.string().min(7, "Enter a valid phone number"),
  city:            z.string().min(2, "Enter your city"),
  state:           z.string().min(2, "Enter your state"),
  password:        z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

const BUSINESS_TYPES = [
  "Hair Salon", "Beauty Studio", "Nail Salon", "Spa & Wellness",
  "Makeup Artist", "Barber Shop", "Skincare Clinic", "Other",
];

const STEPS = ["Personal Info", "Business Info", "Password"];

export default function JoinPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [step, setStep] = useState(0);
  const [businessType, setBusinessType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const { register, handleSubmit, trigger, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
  });

  const nextStep = async () => {
    const fieldsPerStep: (keyof FormData)[][] = [
      ["ownerName", "email", "phone"],
      ["businessName", "city", "state"],
      ["password", "confirmPassword"],
    ];
    const valid = await trigger(fieldsPerStep[step]);
    if (step === 1 && !businessType) return;
    if (valid) setStep((s) => s + 1);
  };

  const handleRegister = async (data: FormData) => {
    if (!businessType) return;
    setIsSubmitting(true);
    try {
      const res = await authService.register({
        name:         data.ownerName,
        email:        data.email,
        phone:        data.phone,
        password:     data.password,
        role:         "ADMIN",
        businessName: data.businessName,
        city:         data.city,
        state:        data.state,
      });

      setUser({
        id:        res.data.user.id,
        name:      res.data.user.name,
        email:     res.data.user.email,
        phone:     res.data.user.phone,
        role:      "admin",
        createdAt: res.data.user.createdAt,
        updatedAt: res.data.user.updatedAt,
      });
      setDone(true);
    } catch (err: any) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success screen ──
  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Account Created!</h1>
          <p className="text-gray-500 text-sm mb-4">
            Your business account has been submitted. The Glam Hub team will review and approve it shortly.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left space-y-1.5">
            <p className="text-xs font-semibold text-amber-700">What happens next?</p>
            {[
              "The Glam Hub team reviews your registration",
              "You'll be notified once your account is approved",
              "Choose a subscription plan to unlock your dashboard",
              "Start building your mini-site and taking bookings",
            ].map((t) => (
              <p key={t} className="text-xs text-amber-700">· {t}</p>
            ))}
          </div>
          <Button variant="gold" onClick={() => router.push("/admin/dashboard")} className="w-full">
            Go to Dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">{APP_NAME}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Register Your Business
          </h1>
          <p className="text-gray-500 text-sm">
            Join Glam Hub and reach more customers with your own beauty mini-site.
          </p>
        </div>

        {/* Step progress */}
        <div className="flex items-center mb-6 px-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < step ? "bg-emerald-500 text-white"
                  : i === step ? "bg-emerald-500 text-white ring-4 ring-emerald-100"
                  : "bg-gray-200 text-gray-400"
                }`}>
                  {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`text-[10px] mt-1 font-medium whitespace-nowrap ${i === step ? "text-emerald-600" : "text-gray-400"}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 mb-4 transition-all ${i < step ? "bg-emerald-500" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit(handleRegister as any)}>

            {/* Step 0 — Personal Info */}
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-800 mb-4">Personal Information</h2>
                <Field label="Full Name *" error={errors.ownerName?.message}>
                  <input {...register("ownerName")} placeholder="Adaeze Okonkwo" className={inputCls} />
                </Field>
                <Field label="Email Address *" error={errors.email?.message}>
                  <input {...register("email")} type="email" placeholder="you@example.com" className={inputCls} />
                </Field>
                <Field label="Phone Number *" error={errors.phone?.message}>
                  <input {...register("phone")} type="tel" placeholder="08012345678" className={inputCls} />
                </Field>
                <div className="pt-2">
                  <button type="button" onClick={nextStep}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white font-semibold py-3 rounded-xl hover:bg-emerald-600 transition-colors">
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 1 — Business Info */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-800 mb-4">Business Information</h2>
                <Field label="Business Name *" error={errors.businessName?.message}>
                  <input {...register("businessName")} placeholder="e.g. Glam Parlor by Annie" className={inputCls} />
                </Field>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Business Type *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {BUSINESS_TYPES.map((type) => (
                      <button key={type} type="button" onClick={() => setBusinessType(type)}
                        className={`rounded-xl border px-2 py-2 text-xs font-medium transition-all text-center ${
                          businessType === type
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 text-gray-500 hover:border-emerald-200"
                        }`}>
                        {type}
                      </button>
                    ))}
                  </div>
                  {!businessType && <p className="text-xs text-red-500">Please select a business type</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="City *" error={errors.city?.message}>
                    <input {...register("city")} placeholder="e.g. Lagos" className={inputCls} />
                  </Field>
                  <Field label="State *" error={errors.state?.message}>
                    <input {...register("state")} placeholder="e.g. Lagos" className={inputCls} />
                  </Field>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(0)}
                    className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                    Back
                  </button>
                  <button type="button" onClick={nextStep}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white font-semibold py-3 rounded-xl hover:bg-emerald-600 transition-colors">
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Password */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-800 mb-4">Create Password</h2>
                <div className="relative">
                  <Field label="Password *" error={errors.password?.message}>
                    <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" className={inputCls + " pr-10"} />
                  </Field>
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Field label="Confirm Password *" error={errors.confirmPassword?.message}>
                  <input {...register("confirmPassword")} type="password" placeholder="Repeat password" className={inputCls} />
                </Field>
                <label className="flex items-start gap-2 text-sm text-gray-500 cursor-pointer pt-1">
                  <input type="checkbox" required className="mt-0.5 rounded border-gray-300 accent-emerald-500" />
                  <span>I agree to Glam Hub&apos;s <span className="text-emerald-600 underline">Terms of Service</span> and <span className="text-emerald-600 underline">Privacy Policy</span></span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                    Back
                  </button>
                  <Button type="submit" variant="gold" size="lg" className="flex-1" isLoading={isSubmitting}>
                    <Building2 className="h-4 w-4" /> Create Account
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Already have an account?{" "}
          <button onClick={() => router.push("/login")} className="text-emerald-600 hover:underline font-medium">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

const inputCls = "w-full h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
