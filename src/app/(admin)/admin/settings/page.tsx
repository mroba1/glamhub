"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadZone } from "@/components/shared/upload-zone";
import { companySettingsSchema, type CompanySettingsFormData } from "@/validators";
import { useAuthStore } from "@/store/auth.store";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { toast } from "sonner";
import { useState } from "react";

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const user = useAuthStore((s) => s.user);

  const { register, handleSubmit, formState: { errors } } = useForm<CompanySettingsFormData>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      name: user?.name ?? "",
      description: "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      address: "",
      city: "",
      state: "",
    },
  });

  const handleSave = async (data: CompanySettingsFormData) => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    toast.success("Company settings saved");
  };

  return (
    <div className="space-y-0">
      <AdminTopBar title="Settings" subtitle="Manage your salon profile and information" userName={user?.name ?? "Admin"} showTimePeriod={false} />
      <div className="max-w-2xl p-4 md:p-6 space-y-8">

      {/* Logo & Banner */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="h-5 w-5 text-emerald-500" />
          <h2 className="font-semibold text-gray-800">Brand Assets</h2>
        </div>
        <UploadZone label="Company Logo" hint="Square image, minimum 200x200px" />
        <UploadZone label="Banner Image" hint="Recommended 1200x400px" />
      </div>

      {/* Basic Info */}
      <form onSubmit={handleSubmit(handleSave)} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Company Information</h2>
        <Input label="Company Name" error={errors.name?.message} {...register("name")} />
        <Textarea label="Description" error={errors.description?.message} rows={3} {...register("description")} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <Input label="Phone" type="tel" error={errors.phone?.message} {...register("phone")} />
        </div>
        <Input label="Address" error={errors.address?.message} {...register("address")} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="City" error={errors.city?.message} {...register("city")} />
          <Input label="State" error={errors.state?.message} {...register("state")} />
        </div>
        <Button type="submit" variant="gold" isLoading={isSaving}>
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </form>
      </div>
    </div>
  );
}
