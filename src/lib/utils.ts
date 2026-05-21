import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "NGN"): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatDateTime(date: string | Date | undefined | null): string {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeCategory(name: string): string {
  return name.toLowerCase().trim();
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  // Normalise to lowercase so both "PENDING" and "pending" work
  const map: Record<string, string> = {
    pending:         "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    pending_payment: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    approved:        "text-green-400 bg-green-400/10 border-green-400/20",
    rejected:        "text-red-400 bg-red-400/10 border-red-400/20",
    completed:       "text-blue-400 bg-blue-400/10 border-blue-400/20",
    cancelled:       "text-gray-400 bg-gray-400/10 border-gray-400/20",
    processing:      "text-purple-400 bg-purple-400/10 border-purple-400/20",
    shipped:         "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    delivered:       "text-green-400 bg-green-400/10 border-green-400/20",
    active:          "text-green-400 bg-green-400/10 border-green-400/20",
    inactive:        "text-gray-400 bg-gray-400/10 border-gray-400/20",
    suspended:       "text-red-400 bg-red-400/10 border-red-400/20",
  };
  return map[status.toLowerCase()] ?? "text-gray-400 bg-gray-400/10 border-gray-400/20";
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
