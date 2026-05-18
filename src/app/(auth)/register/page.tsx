"use client";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Sparkles, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterFormData } from "@/validators";
import { APP_NAME } from "@/constants";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

const PERKS = [
  "Book appointments at top salons",
  "Shop premium beauty products",
  "Earn loyalty points on every purchase",
  "Get exclusive member discounts",
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));

    // Set user in auth store (replace with real API call later)
    setUser({
      id: "new-user",
      name: data.name,
      email: data.email,
      phone: data.phone ?? "",
      role: "customer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setIsLoading(false);
    toast.success("Account created!", { description: "Welcome to Glam Hub!" });
    router.push("/marketplace");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Form */}
      <div className="flex items-center justify-center px-6 py-12 bg-[hsl(0,0%,4%)]">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-9 w-9 rounded-xl bg-[hsl(38,65%,60%)] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-[hsl(0,0%,4%)]" />
            </div>
            <span className="font-serif text-2xl font-bold text-[hsl(0,0%,95%)]">{APP_NAME}</span>
          </div>

          <h1 className="font-serif text-3xl font-bold text-[hsl(0,0%,95%)] mb-2">Create your account</h1>
          <p className="text-[hsl(0,0%,55%)] mb-8">Join thousands of beauty enthusiasts</p>

          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Adaeze Okonkwo"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="adaeze@email.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="08012345678"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                error={errors.password?.message}
                hint="Use at least 8 characters with letters and numbers"
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
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <label className="flex items-start gap-2 text-sm text-[hsl(0,0%,60%)] cursor-pointer">
              <input type="checkbox" className="mt-0.5 rounded border-[hsl(0,0%,20%)] bg-[hsl(0,0%,7%)]" />
              <span>
                I agree to the{" "}
                <Link href="#" className="text-[hsl(38,65%,60%)] hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="#" className="text-[hsl(38,65%,60%)] hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <Button type="submit" variant="gold" size="lg" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-[hsl(0,0%,50%)] mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[hsl(38,65%,60%)] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Perks */}
      <div className="hidden lg:flex flex-col relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80"
          alt="Beauty"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[hsl(0,0%,2%)/50%] to-[hsl(0,0%,2%)/80%]" />
        <div className="relative z-10 flex flex-col justify-center px-12 h-full">
          <h2 className="font-serif text-4xl font-bold text-white mb-4">
            Join the Glam Hub Community
          </h2>
          <p className="text-[hsl(0,0%,70%)] mb-8 leading-relaxed">
            Become part of Nigeria&apos;s fastest-growing beauty platform.
          </p>
          <ul className="space-y-4">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-[hsl(38,65%,60%)] flex items-center justify-center shrink-0">
                  <CheckCircle className="h-4 w-4 text-[hsl(0,0%,4%)]" />
                </div>
                <span className="text-[hsl(0,0%,80%)] text-sm">{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
