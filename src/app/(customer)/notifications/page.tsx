"use client";
import { useState, useEffect } from "react";
import { Bell, CheckCheck, Trash2, Calendar, ShoppingBag, AlertCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useNotificationStore } from "@/store/notification.store";
import { MOCK_NOTIFICATIONS } from "@/constants/mock-data";
import { formatDateTime } from "@/lib/utils";
import type { NotificationType } from "@/types";

const typeConfig: Record<NotificationType, { icon: React.ElementType; color: string; bg: string }> = {
  booking_approved: { icon: Calendar, color: "text-green-400", bg: "bg-green-500/10" },
  booking_rejected: { icon: Calendar, color: "text-red-400", bg: "bg-red-500/10" },
  booking_reset: { icon: Calendar, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  payment_confirmed: { icon: DollarSign, color: "text-[hsl(38,65%,60%)]", bg: "bg-[hsl(38,65%,60%)/10%]" },
  order_update: { icon: ShoppingBag, color: "text-blue-400", bg: "bg-blue-500/10" },
  system: { icon: AlertCircle, color: "text-purple-400", bg: "bg-purple-500/10" },
};

export default function NotificationsPage() {
  const { notifications, setNotifications, markRead, markAllRead, removeNotification } =
    useNotificationStore();

  useEffect(() => {
    setNotifications(MOCK_NOTIFICATIONS);
  }, [setNotifications]);

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[hsl(0,0%,95%)]">Notifications</h1>
          {unread > 0 && (
            <p className="text-sm text-[hsl(0,0%,55%)] mt-1">{unread} unread</p>
          )}
        </div>
        {unread > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead} className="text-[hsl(38,65%,60%)]">
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up! Check back later for updates."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const { icon: Icon, color, bg } = typeConfig[notification.type] ?? typeConfig.system;
            return (
              <div
                key={notification.id}
                className={`flex gap-4 rounded-xl border p-4 transition-all ${
                  notification.isRead
                    ? "border-[hsl(0,0%,13%)] bg-[hsl(0,0%,6%)]"
                    : "border-[hsl(38,65%,60%)/20%] bg-[hsl(0,0%,8%)]"
                }`}
                onClick={() => markRead(notification.id)}
              >
                <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${notification.isRead ? "text-[hsl(0,0%,70%)]" : "text-[hsl(0,0%,95%)]"}`}>
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <div className="h-2 w-2 rounded-full bg-[hsl(38,65%,60%)] shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-[hsl(0,0%,55%)] mt-0.5 line-clamp-2">{notification.message}</p>
                  <p className="text-[10px] text-[hsl(0,0%,40%)] mt-1.5">{formatDateTime(notification.createdAt)}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeNotification(notification.id); }}
                  className="text-[hsl(0,0%,35%)] hover:text-red-400 transition-colors shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
