import { Shield, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { MOCK_SECURITY_LOGS } from "@/constants/mock-data";
import { cn } from "@/lib/utils";

const STATUS_STYLE = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  failed:  "bg-red-100 text-red-600",
};

const STATUS_ICON = {
  success: CheckCircle,
  warning: AlertTriangle,
  failed:  XCircle,
};

const ACTION_LABELS: Record<string, string> = {
  login:                  "Login",
  logout:                 "Logout",
  password_change:        "Password Changed",
  company_approved:       "Company Approved",
  company_suspended:      "Company Suspended",
  subscription_approved:  "Subscription Approved",
  subscription_rejected:  "Subscription Rejected",
  product_removed:        "Product Removed",
  admin_impersonated:     "Admin Impersonated",
};

export default function SuperAdminSecurityPage() {
  return (
    <div className="space-y-0">
      <AdminTopBar title="Security Logs" subtitle="Audit trail of all platform activity" userName="Super Admin" showTimePeriod={false} />

      <div className="p-4 md:p-6 space-y-5">
        {/* Info banner */}
        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <Shield className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            All platform actions are logged here for security audit purposes. Logs are retained for 90 days.
          </p>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-2">
          {["All", "Success", "Warning", "Failed"].map((f) => (
            <button key={f} className={cn("rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
              f === "All" ? "bg-emerald-500 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-emerald-300")}>
              {f}
            </button>
          ))}
        </div>

        {MOCK_SECURITY_LOGS.length === 0 ? (
          <EmptyState icon={Shield} title="No security logs yet" description="Platform activity will be logged here as admins and super admins perform actions." />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {["User", "Action", "Description", "IP Address", "Device", "Status", "Time"].map((h) => (
                      <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_SECURITY_LOGS.map((log) => {
                    const Icon = STATUS_ICON[log.status];
                    return (
                      <tr key={log.id} className="hover:bg-gray-50/40 transition-colors">
                        <td className="py-3.5 px-5">
                          <p className="font-medium text-gray-800 text-xs">{log.userName}</p>
                          <p className="text-[10px] text-gray-400 capitalize">{log.userRole.replace(/_/g, " ")}</p>
                        </td>
                        <td className="py-3.5 px-5 text-gray-600 text-xs whitespace-nowrap">{ACTION_LABELS[log.action] ?? log.action}</td>
                        <td className="py-3.5 px-5 text-gray-500 text-xs max-w-xs truncate">{log.description}</td>
                        <td className="py-3.5 px-5 font-mono text-xs text-gray-400">{log.ipAddress}</td>
                        <td className="py-3.5 px-5 text-xs text-gray-400 whitespace-nowrap">{log.device}</td>
                        <td className="py-3.5 px-5">
                          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold capitalize", STATUS_STYLE[log.status])}>
                            <Icon className="h-2.5 w-2.5" />{log.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-xs text-gray-400 whitespace-nowrap">{log.createdAt}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
