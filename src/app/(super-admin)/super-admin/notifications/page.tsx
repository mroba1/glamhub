"use client";
import { useState } from "react";
import { Megaphone, Plus, Send, Building2, Users, Bell } from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Target = "all_companies" | "all_customers" | "specific_company";
type SentNotification = { id: string; title: string; message: string; target: Target; sentAt: string; sentBy: string; recipientCount: number };

export default function SuperAdminNotificationsPage() {
  const [sent, setSent] = useState<SentNotification[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<Target>("all_companies");
  const [isSending, setIsSending] = useState(false);

  const TARGETS: { value: Target; label: string; desc: string; icon: React.ElementType }[] = [
    { value: "all_companies",  label: "All Companies",  desc: "Send to all admin accounts",   icon: Building2 },
    { value: "all_customers",  label: "All Customers",  desc: "Send to all customer accounts", icon: Users },
    { value: "specific_company", label: "Specific Company", desc: "Target one company only", icon: Bell },
  ];

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Title and message are required");
      return;
    }
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSent((prev) => [{
      id: String(Date.now()),
      title,
      message,
      target,
      sentAt: new Date().toISOString(),
      sentBy: "Super Admin",
      recipientCount: target === "all_companies" ? 3 : target === "all_customers" ? 0 : 1,
    }, ...prev]);
    setIsSending(false);
    setShowForm(false);
    setTitle(""); setMessage(""); setTarget("all_companies");
    toast.success("Notification sent successfully");
  };

  const TARGET_LABEL: Record<Target, string> = {
    all_companies: "All Companies",
    all_customers: "All Customers",
    specific_company: "Specific Company",
  };

  return (
    <div className="space-y-0">
      <AdminTopBar title="Platform Notifications" subtitle="Broadcast messages to companies and customers" userName="Super Admin" showTimePeriod={false} />

      <div className="p-4 md:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{sent.length} notification{sent.length !== 1 ? "s" : ""} sent</p>
          <Button variant="gold" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" /> Send Notification
          </Button>
        </div>

        {sent.length === 0 ? (
          <EmptyState icon={Megaphone} title="No notifications sent yet" description="Use the button above to broadcast messages to companies or customers."
            action={{ label: "Send First Notification", onClick: () => setShowForm(true) }} />
        ) : (
          <div className="space-y-3">
            {sent.map((n) => (
              <div key={n.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-gray-800">{n.title}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5 font-semibold">
                      {TARGET_LABEL[n.target]}
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 font-semibold">
                      {n.recipientCount} recipients
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">{n.message}</p>
                <p className="text-xs text-gray-400">Sent by {n.sentBy} · {formatDateTime(n.sentAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send form modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader><DialogTitle className="text-gray-900">Send Platform Notification</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            {/* Target selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Send To</label>
              <div className="grid grid-cols-1 gap-2">
                {TARGETS.map(({ value, label, desc, icon: Icon }) => (
                  <button key={value} onClick={() => setTarget(value)}
                    className={cn("flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                      target === value ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-200")}>
                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                      target === value ? "bg-emerald-500" : "bg-gray-100")}>
                      <Icon className={cn("h-4 w-4", target === value ? "text-white" : "text-gray-400")} />
                    </div>
                    <div>
                      <p className={cn("text-sm font-medium", target === value ? "text-emerald-700" : "text-gray-700")}>{label}</p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title"
                className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Message *</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Write your message here…"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
            </div>
          </div>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="ghost" onClick={() => setShowForm(false)} className="text-gray-600">Cancel</Button>
            <Button variant="gold" onClick={handleSend} isLoading={isSending} disabled={!title.trim() || !message.trim()}>
              <Send className="h-4 w-4" /> Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
