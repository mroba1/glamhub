"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Sparkles, CheckCircle, XCircle, Eye, EyeOff,
  Clock, Building2, ArrowRight, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInviteStore } from "@/store/invite.store";
import { useAuthStore } from "@/store/auth.store";
import { APP_NAME } from "@/constants";
import { toast } from "sonner";

const schema = z.object({
  ownerName:    z.string().min(2, "Enter your full name"),
  businessName: z.string().min(2, "Enter your business name"),
  email:        z.string().email("Enter a valid email address"),
  phone:        z.string().min(7, "Enter a valid phone number"),
  city:         z.string().min(2, "Enter your city"),
  state:        z.string().min(2, "Enter your state"),
  password:     z.string().min(8, "Password must be at least 8 characters"),
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

export default function InviteRegisterPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  const getByToken  = useInviteStore((s) => s.getByToken);
  const markUsed    = useInviteStore((s) => s.markUsed);
  const setUser     = useAuthStore((s) => s.setUser);

  const [invite, setInvite]           = useState<ReturnType<typeof getByToken>>(undefined);
  const [loading, setLoading]         = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [businessType, setBusinessType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone]               = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
  });

  useEffect(() => {
    // Simulate a brief lookup delay
    const timer = setTimeout(() => {
      const found = getByToken(token);
      setInvite(found);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [token, getByToken]);

  const handleRegister = async (data: FormData) => {
    if (!businessType) { toast.error("Please select your business type"); return; }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));

    // Mark invite as used
    markUsed(token, data.businessName, data.email);

    // Set user as admin (pending approval)
    setUser({
      id: "admin-" + Math.random().toString(36).substring(2, 7),
      name: data.ownerName,
      email: data.email,
      phone: data.phone,
      role: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setIsSubmitting(false);
    setDone(true);
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Verifying invite link…</p>
        </div>
      </div>
    );
  }

  /* ── Invalid token ── */
  if (!invite) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid Invite Link</h1>
          <p className="text-gray-500 text-sm mb-6">
            This invite link is invalid or does not exist. Please contact Glam Hub support or ask for a new invite.
          </p>
          <Button variant="gold" onClick={() => router.push("/")} className="w-full">
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  /* ── Expired / used ── */
  if (invite.status !== "pending") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 ${invite.status === "used" ? "bg-blue-100" : "bg-gray-100"}`}>
            {invite.status === "used"
              ? <CheckCircle className="h-8 w-8 text-blue-500" />
              : <Clock className="h-8 w-8 text-gray-400" />
            }
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {invite.status === "used" ? "Link Already Used" : "Link Expired"}
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            {invite.status === "used"
              ? "This invite link has already been used to create an account. Each link can only be used once."
              : "This invite link has expired. Please contact Glam Hub to request a new one."
            }
          </p>
          <Button variant="gold" onClick={() => router.push("/login")} className="w-full">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  /* ── Success / done ── */
  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Account Created!</h1>
          <p className="text-gray-500 text-sm mb-4">
            Your business account has been created successfully. The Glam Hub team will review and approve it shortly.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-amber-700 mb-1">What happens next?</p>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• The Super Admin will review your registration</li>
              <li>• You'll receive a notification once approved</li>
              <li>• After approval, choose a subscription plan to unlock your dashboard</li>
              <li>• Then you can build your mini-site and start taking bookings</li>
            </ul>
          </div>
          <Button variant="gold" onClick={() => router.push("/admin/dashboard")} className="w-full">
            Go to Dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  /* ── Registration form ── */
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">{APP_NAME}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Create Your Business Account
          </h1>
          <p className="text-gray-500 text-sm">
            You&apos;ve been invited to join Glam Hub as a business owner.
            Fill in your details to get started.
          </p>
          {invite.note && (
            <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 text-xs text-emerald-700">
              <CheckCircle className="h-3.5 w-3.5" />
              {invite.note}
            </div>
          )}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit(handleRegister as any)} className="space-y-5">

            {/* Section: Personal Info */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">1</span>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Full Name *</label>
                  <input {...register("ownerName")} placeholder="Adaeze Okonkwo"
                    className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                  {errors.ownerName && <p className="text-xs text-red-500">{errors.ownerName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                  <input {...register("phone")} type="tel" placeholder="08012345678"
                    className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Email Address *</label>
                  <input {...register("email")} type="email" placeholder="you@example.com"
                    defaultValue={invite.email ?? ""}
                    className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
              </div>
            </div>

            {/* Section: Business Info */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">2</span>
                Business Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Business Name *</label>
                  <input {...register("businessName")} placeholder="e.g. Glam Parlor by Annie"
                    className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                  {errors.businessName && <p className="text-xs text-red-500">{errors.businessName.message}</p>}
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Business Type *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {BUSINESS_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setBusinessType(type)}
                        className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all text-center ${
                          businessType === type
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 text-gray-500 hover:border-emerald-200"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">City *</label>
                  <input {...register("city")} placeholder="e.g. Lagos"
                    className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                  {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">State *</label>
                  <input {...register("state")} placeholder="e.g. Lagos"
                    className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                  {errors.state && <p className="text-xs text-red-500">{errors.state.message}</p>}
                </div>
              </div>
            </div>

            {/* Section: Password */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">3</span>
                Set Password
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 relative">
                  <label className="text-sm font-medium text-gray-700">Password *</label>
                  <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="Min. 8 characters"
                    className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Confirm Password *</label>
                  <input {...register("confirmPassword")} type="password" placeholder="Repeat password"
                    className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                  {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 text-sm text-gray-500 cursor-pointer">
              <input type="checkbox" required className="mt-0.5 rounded border-gray-300 accent-emerald-500" />
              <span>I agree to Glam Hub&apos;s <span className="text-emerald-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-emerald-600 hover:underline cursor-pointer">Privacy Policy</span></span>
            </label>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
            >
              <Building2 className="h-4 w-4" />
              Create Business Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Already have an account?{" "}
          <button onClick={() => router.push("/login")} className="text-emerald-600 hover:underline font-medium">Sign in</button>
        </p>
      </div>
    </div>
  );
}
