"use client";
import { useState } from "react";
import { Search, CheckCircle, XCircle, RotateCcw, Eye, Calendar } from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { MOCK_BOOKINGS } from "@/constants/mock-data";
import { BOOKING_STATUSES } from "@/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { Booking, BookingStatus } from "@/types";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: "approve" | "reject" | "reset"; booking: Booking } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filtered = bookings.filter((b) => {
    const matchSearch = !search || b.customerName.toLowerCase().includes(search.toLowerCase()) || b.bookingNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAction = async (type: "approve" | "reject" | "reset", booking: Booking) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const newStatus: BookingStatus = type === "approve" ? "approved" : type === "reject" ? "rejected" : "pending";
    setBookings((prev) => prev.map((b) => b.id === booking.id ? { ...b, status: newStatus } : b));
    setConfirmAction(null);
    setIsLoading(false);
    toast.success(`Booking ${type === "approve" ? "approved" : type === "reject" ? "rejected" : "reset"} successfully`);
  };

  return (
    <div className="space-y-0">
      <AdminTopBar title="Bookings" subtitle="Manage and approve customer bookings" userName="Studio Admin" showTimePeriod={false} />

      <div className="p-4 md:p-6 space-y-5">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by customer or booking #…"
              className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setStatusFilter("all")} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${statusFilter === "all" ? "bg-emerald-500 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-emerald-300"}`}>All</button>
            {BOOKING_STATUSES.map((s) => (
              <button key={s.value} onClick={() => setStatusFilter(s.value)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${statusFilter === s.value ? "bg-emerald-500 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-emerald-300"}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Calendar} title="No bookings found" description="Customer bookings will appear here once they start booking services." />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {["Booking #", "Customer", "Service", "Date & Time", "Amount", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="py-3.5 px-5 font-mono text-xs text-emerald-600">{booking.bookingNumber}</td>
                      <td className="py-3.5 px-5">
                        <p className="font-medium text-gray-800">{booking.customerName}</p>
                        <p className="text-xs text-gray-400">{booking.customerEmail}</p>
                      </td>
                      <td className="py-3.5 px-5 text-gray-600">{booking.serviceName}</td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <p className="text-gray-700">{formatDate(booking.date)}</p>
                        <p className="text-xs text-gray-400">{booking.timeSlot}</p>
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-emerald-600">{formatCurrency(booking.servicePrice)}</td>
                      <td className="py-3.5 px-5"><StatusBadge status={booking.status} /></td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSelectedBooking(booking)} className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all"><Eye className="h-3.5 w-3.5" /></button>
                          {booking.status !== "approved" && (
                            <button onClick={() => setConfirmAction({ type: "approve", booking })} className="h-7 w-7 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-all"><CheckCircle className="h-3.5 w-3.5" /></button>
                          )}
                          {booking.status !== "rejected" && (
                            <button onClick={() => setConfirmAction({ type: "reject", booking })} className="h-7 w-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"><XCircle className="h-3.5 w-3.5" /></button>
                          )}
                          {booking.status !== "pending" && (
                            <button onClick={() => setConfirmAction({ type: "reset", booking })} className="h-7 w-7 rounded-lg flex items-center justify-center text-amber-500 hover:bg-amber-50 transition-all"><RotateCcw className="h-3.5 w-3.5" /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedBooking(null)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">{selectedBooking.bookingNumber}</h2>
            <div className="space-y-2.5 text-sm">
              {[
                { label: "Customer",  value: selectedBooking.customerName },
                { label: "Email",     value: selectedBooking.customerEmail },
                { label: "Phone",     value: selectedBooking.customerPhone },
                { label: "Service",   value: selectedBooking.serviceName },
                { label: "Date",      value: formatDate(selectedBooking.date) },
                { label: "Time",      value: selectedBooking.timeSlot },
                { label: "Amount",    value: formatCurrency(selectedBooking.servicePrice) },
                { label: "Status",    value: selectedBooking.status },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-medium text-gray-800 capitalize">{value}</span>
                </div>
              ))}
              {selectedBooking.notes && (
                <div className="pt-2">
                  <p className="text-xs text-gray-400 mb-1">Customer Notes</p>
                  <p className="text-gray-700 text-sm">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
            <button onClick={() => setSelectedBooking(null)} className="w-full mt-5 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={() => setConfirmAction(null)}
        title={`${confirmAction?.type === "approve" ? "Approve" : confirmAction?.type === "reject" ? "Reject" : "Reset"} Booking?`}
        description={`Are you sure you want to ${confirmAction?.type} booking ${confirmAction?.booking.bookingNumber} for ${confirmAction?.booking.customerName}?`}
        confirmLabel={confirmAction?.type === "approve" ? "Approve" : confirmAction?.type === "reject" ? "Reject" : "Reset"}
        variant={confirmAction?.type === "reject" ? "destructive" : "default"}
        onConfirm={() => confirmAction && handleAction(confirmAction.type, confirmAction.booking)}
        isLoading={isLoading}
      />
    </div>
  );
}
