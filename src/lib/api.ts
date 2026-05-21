const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://glamhub.onrender.com/api";
const TOKEN_KEY = "glamhub_token";
const REMEMBER_KEY = "glamhub_remember";

// ── Token helpers ────────────────────────────────────────────
// "Remember me" checked  → localStorage  (survives browser close)
// "Remember me" unchecked → sessionStorage (cleared when tab closes)

export const setToken = (token: string, remember = true) => {
  if (typeof window === "undefined") return;
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REMEMBER_KEY, "1");
    sessionStorage.removeItem(TOKEN_KEY);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REMEMBER_KEY);
  }
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

export const isRemembered = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(REMEMBER_KEY) === "1";
};

// ── API fetch wrapper ────────────────────────────────────────
export async function api(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export async function apiUpload(endpoint: string, formData: FormData): Promise<any> {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data;
}
