"use client";
import { Bell, Search, Calendar, ChevronDown } from "lucide-react";
import { useState } from "react";
import { getInitials } from "@/lib/utils";

interface AdminTopBarProps {
  title: string;
  subtitle?: string;
  userName?: string;
  unreadNotifications?: number;
  showTimePeriod?: boolean;
}

const TIME_PERIODS = ["Today", "Last 7 days", "Last 30 days", "Last 3 months", "Last year"];

export function AdminTopBar({
  title,
  subtitle,
  userName = "Admin User",
  unreadNotifications = 0,
  showTimePeriod = true,
}: AdminTopBarProps) {
  const [period, setPeriod] = useState("Last 30 days");
  const [periodOpen, setPeriodOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-20">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center h-9 w-52 rounded-xl bg-gray-50 border border-gray-200 px-3 gap-2">
          <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <input
            placeholder="Search…"
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
          />
        </div>

        {/* Time period selector */}
        {showTimePeriod && (
          <div className="relative">
            <button
              onClick={() => setPeriodOpen(!periodOpen)}
              className="flex items-center gap-2 h-9 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              {period}
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
            {periodOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-gray-100 bg-white shadow-lg py-1 z-50">
                {TIME_PERIODS.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setPeriod(p); setPeriodOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      period === p ? "text-emerald-600 bg-emerald-50" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications */}
        <button className="relative h-9 w-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell className="h-4 w-4" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 h-4 min-w-[16px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-1">
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </span>
          )}
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
            {getInitials(userName)}
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden md:block" />
        </div>
      </div>
    </div>
  );
}
