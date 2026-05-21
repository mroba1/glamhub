"use client";
import { useEffect } from "react";

const API_URL = "https://glamhub.onrender.com/health";
const INTERVAL = 14 * 60 * 1000; // ping every 14 minutes

export function useKeepAlive() {
  useEffect(() => {
    // Ping immediately on mount
    fetch(API_URL).catch(() => {});

    // Then ping every 14 minutes to prevent Render from sleeping
    const interval = setInterval(() => {
      fetch(API_URL).catch(() => {});
    }, INTERVAL);

    return () => clearInterval(interval);
  }, []);
}
