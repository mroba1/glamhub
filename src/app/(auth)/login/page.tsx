"use client";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormData } from "@/validators";
import { APP_NAME } from "@/constants";
import { useAuthStore } from "@/store/auth.store";
import { useBrandingStore } from "@/store/branding.store";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setUser       = useAuthStore((s) => s.setUser);
  const setCompany    = useAuthStore((s) => s.setCompany);
  const setBranding   = useBrandingStore((s) => s.setBranding);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const res = await authService.login(data);
      const { user } = res.data;

      const roleMap: Record<string, "customer" | "admin" | "super_admin"> = {
        CUSTOMER:    "customer",
        ADMIN:       "admin",
        SUPER_ADMIN: "super_admin",
      };

      setUser({
        id:        user.id,
        name:      user.name,
        email:     user.email,
        phone:     user.phone,
        role:      roleMap[user.role] ?? "customer",
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

      // Store the real DB slug and companyId — never changes, never derived from branding
      if (user.managedCompany) {
        setCompany(user.managedCompany.id, user.managedCompany.slug);
      }

      // Restore company branding from backend after login so it persists
      if (user.role === "ADMIN" && user.managedCompany?.branding) {
        const b = user.managedCompany.branding;
        setBranding((prev) => ({
          ...prev,
          companyId:    user.managedCompany.id,
          businessName: b.businessName || user.managedCompany.name,
          primaryColor: b.primaryColor || prev.primaryColor,
          tagline:      b.tagline      || prev.tagline,
          about:        b.about        || prev.about,
          phone:        b.phone        || user.managedCompany.phone || prev.phone,
          email:        b.email        || user.managedCompany.email || prev.email,
          address:      b.address      || user.managedCompany.address || prev.address,
          logoUrl:      b.logoUrl      || prev.logoUrl,
          bannerUrl:    b.bannerUrl    || prev.bannerUrl,
          gallery:      b.gallery?.length ? b.gallery : prev.gallery,
          socialLinks:  {
            instagram: b.instagram || prev.socialLinks.instagram,
            tiktok:    b.tiktok    || prev.socialLinks.tiktok,
            whatsapp:  b.whatsapp  || prev.socialLinks.whatsapp,
            facebook:  b.facebook  || prev.socialLinks.facebook,
          },
          sections: {
            showBooking:         b.showBooking         ?? prev.sections.showBooking,
            showMarketplace:     b.showMarketplace     ?? prev.sections.showMarketplace,
            showFeaturedServices: b.showFeaturedServices ?? prev.sections.showFeaturedServices,
            showTestimonials:    b.showTestimonials    ?? prev.sections.showTestimonials,
            showGallery:         b.showGallery         ?? prev.sections.showGallery,
          },
        }));
      }

      toast.success("Welcome back!");

      if (user.role === "SUPER_ADMIN") router.push("/super-admin/analytics");
      else if (user.role === "ADMIN")  router.push("/admin/dashboard");
      else                             router.push("/marketplace");
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("fetch") || msg.includes("Load") || msg.includes("network") || msg.includes("Failed")) {
        toast.error("Server is waking up — please wait 30 seconds and try again.", { duration: 5000 });
      } else {
        toast.error(msg || "Login failed. Check your email and password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Hero image */}
      <div className="hidden lg:block relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80"
          alt="Beauty salon"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(0,0%,2%)/60%] to-transparent" />
        <div className="absolute bottom-12 left-10 max-w-xs">
          <h2 className="font-serif text-4xl font-bold text-white mb-3">
            Your Beauty Journey Starts Here
          </h2>
          <p className="text-[hsl(0,0%,75%)] text-sm leading-relaxed">
            Access your bookings, orders, and personalized beauty recommendations.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex items-center justify-center px-6 py-12 bg-[hsl(0,0%,4%)]">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="h-9 w-9 rounded-xl bg-[hsl(38,65%,60%)] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-[hsl(0,0%,4%)]" />
            </div>
            <span className="font-serif text-2xl font-bold text-[hsl(0,0%,95%)]">{APP_NAME}</span>
          </div>

          <h1 className="font-serif text-3xl font-bold text-[hsl(0,0%,95%)] mb-2">Welcome back</h1>
          <p className="text-[hsl(0,0%,55%)] mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="adaeze@email.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-[hsl(0,0%,45%)] hover:text-[hsl(0,0%,70%)]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-[hsl(0,0%,60%)] cursor-pointer">
                <input type="checkbox" className="rounded border-[hsl(0,0%,20%)] bg-[hsl(0,0%,7%)]" />
                Remember me
              </label>
              <Link href="#" className="text-sm text-[hsl(38,65%,60%)] hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="gold" size="lg" className="w-full" isLoading={isLoading}>
              Sign In <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-[hsl(0,0%,50%)] mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/join" className="text-[hsl(38,65%,60%)] hover:underline font-medium">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
