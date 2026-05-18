"use client";
import { useState } from "react";
import { Settings, Globe, Shield, Bell, Database, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { APP_NAME } from "@/constants";

const settingSections = [
  {
    id: "platform",
    icon: Globe,
    title: "Platform Settings",
    fields: [
      { label: "Platform Name", key: "platformName", value: APP_NAME, type: "text" },
      { label: "Support Email", key: "supportEmail", value: "support@glamhub.ng", type: "email" },
      { label: "Commission Rate (%)", key: "commission", value: "8", type: "number" },
      { label: "Max Companies Per City", key: "maxCompanies", value: "50", type: "number" },
    ],
  },
  {
    id: "security",
    icon: Shield,
    title: "Security Settings",
    fields: [
      { label: "Min Password Length", key: "minPassword", value: "8", type: "number" },
      { label: "Session Timeout (minutes)", key: "sessionTimeout", value: "60", type: "number" },
      { label: "Max Login Attempts", key: "maxLogin", value: "5", type: "number" },
    ],
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notification Settings",
    fields: [
      { label: "Notification Email", key: "notifEmail", value: "alerts@glamhub.ng", type: "email" },
    ],
  },
];

export default function SuperAdminSettingsPage() {
  const [isSaving, setIsSaving] = useState<string | null>(null);

  const handleSave = async (section: string) => {
    setIsSaving(section);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(null);
    toast.success("Settings saved");
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[hsl(0,0%,95%)]">Platform Settings</h1>
        <p className="text-[hsl(0,0%,55%)] mt-1">Manage global platform configuration</p>
      </div>

      {settingSections.map(({ id, icon: Icon, title, fields }) => (
        <div key={id} className="rounded-xl border border-[hsl(0,0%,13%)] bg-[hsl(0,0%,7%)] p-6 space-y-5">
          <div className="flex items-center gap-3 pb-2 border-b border-[hsl(0,0%,12%)]">
            <div className="h-9 w-9 rounded-lg bg-[hsl(38,65%,60%)/10%] flex items-center justify-center">
              <Icon className="h-4 w-4 text-[hsl(38,65%,60%)]" />
            </div>
            <h2 className="font-semibold text-[hsl(0,0%,88%)]">{title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ label, key, value, type }) => (
              <Input key={key} label={label} type={type} defaultValue={value} />
            ))}
          </div>
          <Button variant="gold" size="sm" onClick={() => handleSave(id)} isLoading={isSaving === id}>
            <Save className="h-3.5 w-3.5" />
            Save {title.split(" ")[0]} Settings
          </Button>
        </div>
      ))}

      {/* System info */}
      <div className="rounded-xl border border-[hsl(0,0%,13%)] bg-[hsl(0,0%,7%)] p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="h-5 w-5 text-[hsl(38,65%,60%)]" />
          <h2 className="font-semibold text-[hsl(0,0%,88%)]">System Information</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          {[
            { label: "Platform Version", value: "v2.4.1" },
            { label: "Environment", value: "Production" },
            { label: "Next.js", value: "15.x" },
            { label: "Database", value: "Connected" },
            { label: "Cache", value: "Redis" },
            { label: "Uptime", value: "99.9%" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-[hsl(0,0%,5%)] p-3">
              <p className="text-xs text-[hsl(0,0%,45%)]">{label}</p>
              <p className="text-[hsl(0,0%,80%)] font-medium mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
