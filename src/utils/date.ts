// src/utils/date.ts

/**
 * Convertit une chaîne "YYYY-MM" en date ISO 8601 au format "YYYY-MM-DDTHH:mm:ss.sssZ"
 * Ex: "2023-05" → "2023-05-01T00:00:00.000Z"
 */
export const monthStringToIsoDate = (monthStr: string): string | null => {
  if (!monthStr || monthStr.length !== 7 || monthStr[4] !== '-') {
    return null;
  }
  const date = new Date(`${monthStr}-01T00:00:00.000Z`);
  if (isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString(); // ✅ toujours valide pour le backend
};

/**
 * Formate une date ISO en texte relatif : "il y a X..." (publié il y a...)
 * Ex: "2025-12-10T10:00:00Z" → "publié il y a 5 jours"
 */
export const formatRelativePublishDate = (isoDateString: string): string => {
  const inputDate = new Date(isoDateString);
  const now = new Date();

  if (isNaN(inputDate.getTime())) {
    return "Date invalide";
  }

  const diffMs = now.getTime() - inputDate.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return "à l’instant";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} h${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 2) return "hier";
  if (diffDays < 7) return `${diffDays} jours ago`;
  if (diffWeeks === 1) return "1 semaine ago";
  if (diffWeeks < 4) return `${diffWeeks} semaines ago`;
  if (diffMonths === 1) return "1 mois ago";
  if (diffMonths < 12) return `${diffMonths} mois ago`;
  if (diffYears === 1) return "1 an ago";
  return `${diffYears} ans ago`;
};

/**
 * Formate une date d’expiration ISO en texte relatif : "expire dans...", "expire aujourd’hui", etc.
 * Ex: "2025-12-16T10:00:00Z" → "expire demain"
 */
export const formatRelativeExpirationDate = (isoDateString: string): string => {
  const expirationDate = new Date(isoDateString);
  const now = new Date();

  if (isNaN(expirationDate.getTime())) {
    return "Date d’expiration invalide";
  }

  // Si la date est déjà passée
  if (expirationDate < now) {
    return "Expirée";
  }

  const diffMs = expirationDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "expire aujourd’hui";
  if (diffDays === 1) return "expire demain";
  if (diffDays <= 7) return `expire dans ${diffDays} jour${diffDays > 1 ? "s" : ""}`;
  return `expire le ${expirationDate.toLocaleDateString("fr-FR")}`;
};