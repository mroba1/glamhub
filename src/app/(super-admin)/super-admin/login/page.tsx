"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, Eye, EyeOff, Lock, AlertTriangle } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { APP_NAME } from "@/constants";

const schema = z.object({
  email:    z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password required"),
});
type FormData = z.infer<typeof schema>;

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
  });

  const handleLogin = async (data: FormData) => {
    setFailed(false);
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    // TODO: replace with real API — backend validates super admin credentials
    const isSuperAdmin = data.email.startsWith("super") || data.email.includes("@glamhub");
    if (!isSuperAdmin) {
      setIsLoading(false);
      setFailed(true);
      return;
    }

    setUser({
      id: "sa1",
      name: "Super Admin",
      email: data.email,
      role: "super_admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setIsLoading(false);
    toast.success("Welcome, Super Admin");
    router.push("/super-admin/analytics");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{APP_NAME}</h1>
          <p className="text-gray-400 text-sm">Platform Administration</p>

          {/* Private access warning */}
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2.5 text-left">
            <Lock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-300">
              This is a <strong>private</strong> access point. Not for customers or business owners.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 shadow-2xl">
          {failed && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 mb-5">
              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
              <p className="text-sm text-red-300">Access denied. Super admin credentials required.</p>
            </div>
          )}

          <form onSubmit={handleSubmit(handleLogin as any)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Admin Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="super@glamhub.ng"
                className="w-full h-11 rounded-xl border border-gray-700 bg-gray-800 px-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all"
              />
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full h-11 rounded-xl border border-gray-700 bg-gray-800 px-4 pr-11 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-500 hover:text-gray-300">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Authenticating…</>
              ) : (
                <><Shield className="h-4 w-4" />Access Platform</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Not a super admin?{" "}
          <a href="/login" className="text-gray-400 hover:text-white transition-colors">
            Go to main login
          </a>
          {" · "}
          <a href="/join" className="text-gray-400 hover:text-white transition-colors">
            Register your business
          </a>
        </p>
      </div>
    </div>
  );
}
