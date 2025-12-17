// src/hooks/useSectors.ts
// BUT : Charger la liste des secteurs depuis le backend
// POURQUOI : Centralise l’appel via apiRequest, évite la duplication de la logique réseau

'use client';

import { useState, useEffect } from 'react';

// 1. Importe la fonction d’appel API centralisée
import { apiRequest } from '@/lib/api/client';

// 2. Définit le type (inchangé → bon travail !)
export interface Sector {
  id: string;
  name: string;
}

// 3. Hook principal
export default function useSectors() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSectors = async () => {
      setLoading(true);
      setError(null);
      try {
        // 4. Appel unique, propre, typé
        const data = await apiRequest<Sector[]>('/api/v1/sectors');
        setSectors(data);
      } catch (err) {
        // 5. TypeScript : on ne sait pas le type exact, donc on gère de façon générique
        const message = err instanceof Error ? err.message : 'Erreur inconnue';
        setError('Impossible de charger les secteurs.');
        // Optionnel : logger si tu veux (ex: avec ton logger.ts)
        // logger.error('useSectors failed', { error: message });
      } finally {
        setLoading(false);
      }
    };

    fetchSectors();
  }, []);

  return { sectors, loading, error };
}