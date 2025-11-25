// src/lib/auth.ts

export function saveAccessToken(token: string) {
  // Sauvegarde dans localStorage (simple et fiable)
  localStorage.setItem("accessToken", token);

  // Optionnel : sauvegarde aussi en cookie pour compatibilité
  const maxAge = 60 * 15; // 15 minutes
  const secure = window.location.protocol === "https:";
  const domain = window.location.hostname === "localhost" ? "" : `;domain=${window.location.hostname}`;
  const secureFlag = secure ? ";Secure" : "";
  const sameSite = ";SameSite=Lax";
  document.cookie = `accessToken=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}${sameSite}${secureFlag}${domain}`;
}

export function clearAccessToken() {
  localStorage.removeItem("accessToken");
  document.cookie = "accessToken=; Path=/; Max-Age=0;";
}

export function getAccessToken() {
  // 1. Essaie d'abord localStorage
  const fromStorage = localStorage.getItem("accessToken");
  if (fromStorage) return fromStorage;

  // 2. Sinon, essaie le cookie
  const match = document.cookie.match(new RegExp('(^| )accessToken=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}
