"use client";
import { useRestoreSession } from "@/hooks/use-restore-session";

export function SessionRestorer() {
  useRestoreSession();
  return null;
}
