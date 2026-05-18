"use client";
import { useState } from "react";
import { Calendar, Clock, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { MOCK_BOOKINGS } from "@/constants/mock-data";
import { formatDate, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import type { Booking, BookingStatus } from "@/types";

export default function AdminAppointmentsPage() {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);

  const updateStatus = async (id: string, status: BookingStatus) => {
    await new Promise((r) => setTimeout(r, 400));
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    toast.success(`Appointment ${status}`);
  };

  // Summary counts
  const counts = {
    total:    bookings.length,
    pending:  bookings.filter((b) => b.status === "pending").length,
    approved: bookings.filter((b) => b.status === "approved").length,
    rejected: bookings.filter((b) => b.status === "rejected").length,
  };

  // Group by date
  const grouped = bookings.reduce<Record<string, Booking[]>>((acc, b) => {
    if (!acc[b.date]) acc[b.date] = [];
    acc[b.date].push(b);
    return acc;
  }, {});

  return (
    <div className="space-y-0">
      <AdminTopBar title="Appointments" subtitle="Manage upcoming appointments" userName="Studio Admin" showTimePeriod={false} />

      <div className="p-4 md:p-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total",    count: counts.total,    color: "text-gray-900" },
            { label: "Pending",  count: counts.pending,  color: "text-amber-600" },
            { label: "Approved", count: counts.approved, color: "text-emerald-600" },
            { label: "Rejected", count: counts.rejected, color: "text-red-500" },
          ].map(({ label, count, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <p className={`text-3xl font-bold ${color}`}>{count}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {bookings.length === 0 ? (
          <EmptyState icon={Calendar} title="No appointments yet" description="Appointments will appear here once customers start booking." />
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([date, appts]) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-emerald-500" />
                  <h3 className="font-semibold text-gray-800">{formatDate(date)}</h3>
                  <span className="text-xs text-gray-400">({appts.length} appointment{appts.length > 1 ? "s" : ""})</span>
                </div>
                <div className="space-y-2">
                  {appts.map((appt) => (
                    <div key={appt.id} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 sm:w-24 shrink-0">
                        <Clock className="h-3.5 w-3.5 text-emerald-500" />
                        {appt.timeSlot}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800">{appt.customerName}</p>
                        <p className="text-xs text-gray-400">{appt.serviceName} · {formatCurrency(appt.servicePrice)}</p>
                      </div>
                      <StatusBadge status={appt.status} />
                      <div className="flex gap-1">
                        {appt.status !== "approved" && (
                          <button onClick={() => updateStatus(appt.id, "approved")}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-all" title="Approve">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {appt.status !== "rejected" && (
                          <button onClick={() => updateStatus(appt.id, "rejected")}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all" title="Reject">
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                        {appt.status !== "pending" && (
                          <button onClick={() => updateStatus(appt.id, "pending")}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-amber-500 hover:bg-amber-50 transition-all" title="Reset">
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
