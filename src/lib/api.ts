// /lib/api.ts

import { getAccessToken } from "@/lib/auth";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL!;

function parseJSONOrText(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return res.text();
}


async function apiRequest(path: string, options: RequestInit = {}) {
  const accessToken = getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    credentials: "include", 
  });

  if (res.status === 204) return true;
  if (!res.ok) {
    const body = await parseJSONOrText(res);
    const message = typeof body === "string" ? body : JSON.stringify(body);
    throw new Error(message || `API error ${res.status}`);
  }

  return parseJSONOrText(res);
}


// OTP
export function requestOtp(email: string, userType: "CANDIDATE" | "RECRUITER") {
  return apiRequest("/auth/otp/request", {
    method: "POST",
    body: JSON.stringify({ email, userType }),
  });
}

export function verifyOtp(email: string, code: string, userType: string) {
  return apiRequest("/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ email, code, userType }),
  });
}

export function resendOtp(email: string, userType: string) {
  return apiRequest("/auth/otp/resend", {
    method: "POST",
    body: JSON.stringify({ email, userType }),
  });
}

// User
export function checkEmail(email: string) {
  return apiRequest("/auth/otp/check-mail", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function getUser() {
  return apiRequest("/auth/otp/user", { method: "GET" });
}

export function refreshAccessToken() {
  return apiRequest("/auth/otp/refresh", { method: "POST" });
}


// ✅ OAuth2 Exchange (Google, LinkedIn, etc.)
export async function exchangeOAuthCode(code: string) {
  const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

  const response = await fetch(`${BASE}/auth/otp/oauth2/exchange?code=${encodeURIComponent(code)}`, {
    method: "POST",
    credentials: "include",

  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Échange OAuth échoué (${response.status})`);
  }

  return response.json(); // { accessToken, refreshToken }
}