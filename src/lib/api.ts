const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://glamhub.onrender.com/api";

export async function api(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("glamhub_token")
    : null;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function apiUpload(
  endpoint: string,
  formData: FormData
): Promise<any> {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("glamhub_token")
    : null;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data;
}

export const setToken = (token: string) =>
  localStorage.setItem("glamhub_token", token);

export const getToken = () =>
  localStorage.getItem("glamhub_token");

export const clearToken = () =>
  localStorage.removeItem("glamhub_token");
