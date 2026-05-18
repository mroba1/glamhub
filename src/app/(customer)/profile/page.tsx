"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Star, Package, Calendar, Lock, Camera, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/shared/stat-card";
import { UploadZone } from "@/components/shared/upload-zone";
import { updateProfileSchema, changePasswordSchema, type UpdateProfileFormData, type ChangePasswordFormData } from "@/validators";
import { useAuthStore } from "@/store/auth.store";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

type ProfileTab = "info" | "security" | "avatar";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("info");
  const [isSaving, setIsSaving] = useState(false);
  const user = useAuthStore((s) => s.user);

  const customer = user ?? {
    id: "guest", name: "Guest User", email: "user@glamhub.ng",
    phone: "", role: "customer" as const,
    loyaltyPoints: 0, totalOrders: 0, totalBookings: 0,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };

  const profileForm = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: customer.name, phone: customer.phone ?? "", address: "" },
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleProfileSave = async (data: UpdateProfileFormData) => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    toast.success("Profile updated successfully");
  };

  const handlePasswordChange = async (data: ChangePasswordFormData) => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    passwordForm.reset();
    toast.success("Password changed successfully");
  };

  const TABS: { id: ProfileTab; label: string; icon: React.ElementType }[] = [
    { id: "info", label: "Personal Info", icon: User },
    { id: "avatar", label: "Profile Photo", icon: Camera },
    { id: "security", label: "Security", icon: Lock },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold text-[hsl(0,0%,95%)] mb-2">My Profile</h1>
      <p className="text-[hsl(0,0%,55%)] mb-8">Manage your personal information and settings</p>

      {/* Profile header */}
      <div className="flex items-center gap-5 rounded-2xl border border-[hsl(0,0%,13%)] bg-[hsl(0,0%,7%)] p-6 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="text-2xl">{getInitials(customer.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="font-serif text-xl font-bold text-[hsl(0,0%,95%)]">{customer.name}</h2>
          <p className="text-sm text-[hsl(0,0%,55%)]">{customer.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 text-xs text-[hsl(38,65%,60%)]">
              <Star className="h-3 w-3 fill-current" />
              {"loyaltyPoints" in customer ? customer.loyaltyPoints : 0} loyalty points
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Orders" value={"totalOrders" in customer ? customer.totalOrders : 0} icon={Package} />
        <StatCard title="Bookings" value={"totalBookings" in customer ? customer.totalBookings : 0} icon={Calendar} />
        <StatCard title="Loyalty Points" value={"loyaltyPoints" in customer ? customer.loyaltyPoints : 0} icon={Star} className="md:block" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-[hsl(0,0%,13%)] bg-[hsl(0,0%,6%)] p-1 mb-6">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
              activeTab === id
                ? "bg-[hsl(38,65%,60%)] text-[hsl(0,0%,4%)]"
                : "text-[hsl(0,0%,55%)] hover:text-[hsl(0,0%,80%)]"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:block">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "info" && (
        <form onSubmit={profileForm.handleSubmit(handleProfileSave)} className="space-y-4">
          <Input
            label="Full Name"
            error={profileForm.formState.errors.name?.message}
            {...profileForm.register("name")}
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[hsl(0,0%,80%)]">Email Address</label>
            <input
              value={customer.email}
              disabled
              className="w-full h-10 rounded-md border border-[hsl(0,0%,15%)] bg-[hsl(0,0%,5%)] px-3 text-sm text-[hsl(0,0%,45%)] cursor-not-allowed"
            />
            <p className="text-xs text-[hsl(0,0%,40%)]">Email cannot be changed</p>
          </div>
          <Input
            label="Phone Number"
            type="tel"
            error={profileForm.formState.errors.phone?.message}
            {...profileForm.register("phone")}
          />
          <Input
            label="Delivery Address"
            error={profileForm.formState.errors.address?.message}
            placeholder="Your default delivery address"
            {...profileForm.register("address")}
          />
          <div className="pt-2">
            <Button type="submit" variant="gold" isLoading={isSaving} className="w-full sm:w-auto">
              <CheckCircle className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      )}

      {activeTab === "avatar" && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-3xl">{getInitials(customer.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-[hsl(0,0%,85%)]">Profile Photo</p>
              <p className="text-sm text-[hsl(0,0%,50%)]">Upload a photo to personalize your profile</p>
            </div>
          </div>
          <UploadZone
            label="Upload New Photo"
            hint="JPEG or PNG, minimum 200x200 pixels, max 5MB"
            onFilesSelected={() => toast.success("Photo uploaded successfully")}
          />
        </div>
      )}

      {activeTab === "security" && (
        <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            error={passwordForm.formState.errors.currentPassword?.message}
            {...passwordForm.register("currentPassword")}
          />
          <Input
            label="New Password"
            type="password"
            error={passwordForm.formState.errors.newPassword?.message}
            hint="At least 8 characters"
            {...passwordForm.register("newPassword")}
          />
          <Input
            label="Confirm New Password"
            type="password"
            error={passwordForm.formState.errors.confirmPassword?.message}
            {...passwordForm.register("confirmPassword")}
          />
          <div className="pt-2">
            <Button type="submit" variant="gold" isLoading={isSaving} className="w-full sm:w-auto">
              <Lock className="h-4 w-4" />
              Update Password
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
