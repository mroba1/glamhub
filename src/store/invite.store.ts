"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Invite } from "@/types";

function generateToken(): string {
  return "glh_" + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
}

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

interface InviteStore {
  invites: Invite[];
  generateInvite: (email?: string, note?: string) => Invite;
  markUsed: (token: string, companyName: string, usedBy: string) => void;
  revokeInvite: (id: string) => void;
  getByToken: (token: string) => Invite | undefined;
}

export const useInviteStore = create<InviteStore>()(
  persist(
    (set, get) => ({
      invites: [],

      generateInvite: (email, note) => {
        const invite: Invite = {
          id: Math.random().toString(36).substring(2, 9),
          token: generateToken(),
          email,
          note,
          status: "pending",
          createdBy: "Super Admin",
          createdAt: new Date().toISOString(),
          expiresAt: addDays(7),
        };
        set((s) => ({ invites: [invite, ...s.invites] }));
        return invite;
      },

      markUsed: (token, companyName, usedBy) =>
        set((s) => ({
          invites: s.invites.map((i) =>
            i.token === token
              ? { ...i, status: "used", usedAt: new Date().toISOString(), usedBy, companyName }
              : i
          ),
        })),

      revokeInvite: (id) =>
        set((s) => ({
          invites: s.invites.map((i) =>
            i.id === id ? { ...i, status: "expired" } : i
          ),
        })),

      getByToken: (token) => get().invites.find((i) => i.token === token),
    }),
    { name: "glam-hub-invites" }
  )
);
