// /src/app/auth/popup-callback/page.tsx

"use client";

import { useEffect } from "react";

export default function PopupCallback() {
  useEffect(() => {
    // Récupère le code depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (window.opener && window.opener !== window) {
      if (error) {
        window.opener.postMessage({ type: "OAUTH_ERROR", error }, "*");
      } else if (code) {
        window.opener.postMessage({ type: "OAUTH_SUCCESS", code }, "*");
      }
      window.close(); // Ferme la popup
    } else {
      // Pas dans une popup → redirige vers erreur
      window.location.href = "/auth/error?reason=popup_only";
    }
  }, []);

  return (
    <div className="p-6 text-center">
      <p>Connexion en cours...</p>
    </div>
  );
}