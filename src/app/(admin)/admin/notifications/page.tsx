"use client";
import { useState } from "react";
import { Bell, Plus, Send, Users } from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { MOCK_NOTIFICATIONS } from "@/constants/mock-data";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type SentNotif = { id: string; title: string; message: string; sentAt: string };

export default function AdminNotificationsPage() {
  const [notifications] = useState(MOCK_NOTIFICATIONS);
  const [sent, setSent] = useState<SentNotif[]>([]);
  const [showSendForm, setShowSendForm] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!title || !message) return;
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent((prev) => [{ id: String(Date.now()), title, message, sentAt: new Date().toISOString() }, ...prev]);
    setIsSending(false);
    setShowSendForm(false);
    setTitle(""); setMessage("");
    toast.success("Notification sent to all your customers");
  };

  return (
    <div className="space-y-0">
      <AdminTopBar title="Notifications" subtitle="Manage and send notifications to your customers" userName="Studio Admin" showTimePeriod={false} />

      <div className="p-4 md:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{notifications.length} notification{notifications.length !== 1 ? "s" : ""} received</p>
          <Button variant="gold" size="sm" onClick={() => setShowSendForm(true)}>
            <Plus className="h-4 w-4" /> Send Notification
          </Button>
        </div>

        {/* Sent notifications */}
        {sent.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Recently Sent</p>
            {sent.map((n) => (
              <div key={n.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <Bell className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{formatDateTime(n.sentAt)}</p>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5 font-semibold shrink-0">Sent</span>
              </div>
            ))}
          </div>
        )}

        {/* Received notifications */}
        {notifications.length === 0 && sent.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="Notifications from customers and the platform will appear here." action={{ label: "Send Notification", onClick: () => setShowSendForm(true) }} />
        ) : (
          <div className="space-y-2">
            {sent.length > 0 && <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Inbox</p>}
            {notifications.map((n) => (
              <div key={n.id} className={`bg-white rounded-xl border shadow-sm p-4 flex items-start gap-3 ${n.isRead ? "border-gray-100" : "border-emerald-200"}`}>
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${n.isRead ? "bg-gray-50" : "bg-emerald-50"}`}>
                  <Bell className={`h-4 w-4 ${n.isRead ? "text-gray-400" : "text-emerald-600"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${n.isRead ? "text-gray-600" : "text-gray-900"}`}>{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{formatDateTime(n.createdAt)}</p>
                </div>
                {!n.isRead && <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />}
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showSendForm} onOpenChange={setShowSendForm}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader><DialogTitle className="text-gray-900">Send Notification</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <Users className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-gray-600">Sending to all your customers</span>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title"
                className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Write your message…"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
            </div>
          </div>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="ghost" onClick={() => setShowSendForm(false)} className="text-gray-600">Cancel</Button>
            <Button variant="gold" onClick={handleSend} isLoading={isSending} disabled={!title || !message}>
              <Send className="h-4 w-4" /> Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
