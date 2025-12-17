// src/hooks/useAdminAuth.ts
// BUT : Gérer l’authentification admin de façon sécurisée et réactive
// POURQUOI : Séparer la logique d’auth de l’UI, gérer loading/error, éviter les fuites de token

'use client'; // Obligatoire pour utiliser useState/useEffect dans Next.js App Router

import { useState } from 'react';

// 1. Importe la fonction centralisée
import { apiRequest } from '@/lib/api/client';

// 2. Définis les types attendus (d’après Swagger)
type AdminLoginPayload = {
  email: string;
  password: string;
};

type AdminLoginResponse = {
  accessToken: string;
  tokenType: string; // ex: "Bearer"
};

// 3. Stocke le rôle côté frontend (puisque le backend ne le renvoie pas)
//    → mais seulement après une auth réussie
const ADMIN_ROLE = 'ADMIN';

// 4. Hook principal
export function useAdminAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 5. Fonction de login
  const login = async (credentials: AdminLoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      // Appel au backend
      const data = await apiRequest<AdminLoginResponse>('/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      // Stocke le token + rôle + email dans localStorage
      // → rôle ajouté manuellement car non fourni par le backend (limitation connue)
      localStorage.setItem("adminEmail", credentials.email);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('auth_role', ADMIN_ROLE);

      return data;
    } catch (err: any) {
      // Capture l’erreur et la rend exploitable dans l’UI
      setError(err.message || 'Échec de la connexion');
      throw err; // permet à l’appelant de gérer aussi (ex: redirection)
    } finally {
      setLoading(false);
    }
  };

  // 6. Fonction de logout
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('auth_role');
  };

  // 7. Fonction utilitaire pour récupérer le token
  const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  };

  // 8. Retourne tout ce dont les composants ont besoin
  return {
    login,
    logout,
    getAuthToken,
    loading,
    error,
  };
}