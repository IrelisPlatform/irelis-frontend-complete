// src/lib/api/client.ts
// BUT : Fournir une fonction générique pour appeler le backend
// POURQUOI : Éviter la duplication, gérer les erreurs, headers, etc. en un seul endroit

// 1. Récupère l’URL de base depuis les variables d’environnement
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 2. Vérifie qu’elle est définie (obligatoire en production)
if (!API_BASE_URL) {
  // L’audit aimera ça : on ne laisse pas d’erreur silencieuse
  throw new Error(
    'NEXT_PUBLIC_API_URL is missing in environment variables. ' +
    'Create a .env.local file with this variable.'
  );
}

// 3. Fonction générique pour appeler n’importe quel endpoint
//    <T> = type TypeScript de la réponse attendue (ex: LoginResponse)
export async function apiRequest<T>(
  endpoint: string,           // ex: "/admin/auth/login"
  options: RequestInit = {}   // méthode, headers, body, etc.
): Promise<T> {
  // 4. Construit l’URL complète
  const url = `${API_BASE_URL}${endpoint}`;

  // 5. Définit les headers par défaut (JSON)
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers, // permet d’ajouter/écraser (ex: Authorization)
  };

  // 6. Effectue la requête
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 7. Cas particulier : réponse 204 ("No Content") → pas de JSON à lire
  if (response.status === 204) {
    return undefined as T; // force le type (utile pour delete/publish)
  }

  // 8. Tente de lire la réponse en JSON (même en cas d’erreur)
  let responseData: any = null;
  try {
    responseData = await response.json();
  } catch (e) {
    // Si le backend ne renvoie pas du JSON (ex: erreur 500 brute), on garde null
  }

  // 9. Si la requête échoue (4xx, 5xx), on lance une erreur lisible
  if (!response.ok) {
    // Essaie de prendre un message du backend, sinon décris l’erreur HTTP
    const message =
      responseData?.message ||
      responseData?.error ||
      `Erreur ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  // 10. Succès : renvoie les données typées
  return responseData as T;
}