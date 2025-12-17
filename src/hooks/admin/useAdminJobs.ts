// src/hooks/admin/useAdminJobs.ts
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiRequest } from '@/lib/api/client';
import { PublishedJob, JobCreatePayload } from '@/types/job';

import { BackendPublishedJob } from '@/types/job';

export type AdminJob = BackendPublishedJob & {
  recruiterName?: string;
};
export type PaginatedResponse<T> = {
  content: T[];
  page: number;
  size: number;
  total_elements: number;
  total_pages: number;
  first: boolean;
  last: boolean;
};

export function useAdminJobs() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  };

  const handleAuthError = () => {
    localStorage.removeItem('accessToken');
    toast.error('Votre session a expiré. Veuillez vous reconnecter.');
    router.push('/admin/login');
  };

  const ensureAuth = () => {
    const token = getAuthToken();
    if (!token) {
      handleAuthError();
      return null;
    }
    return token;
  };

  // Fonction utilitaire pour gérer les erreurs 401
  const handleApiError = (err: any) => {
    if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
      handleAuthError();
      return true; // erreur gérée
    }
    return false; // erreur non gérée ici
  };

  const getAllJobs = async (): Promise<AdminJob[]> => {
    const token = ensureAuth();
    if (!token) return [];

    try {
      const data = await apiRequest<PaginatedResponse<AdminJob>>('/admin/jobs?page=0&size=100', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.content;
    } catch (err: any) {
      if (!handleApiError(err)) {
        toast.error(err.message || 'Échec du chargement des offres.');
      }
      throw err;
    }
  };

  const createJob = async (payload: JobCreatePayload): Promise<AdminJob> => {
    const token = ensureAuth();    
    if (!token) throw new Error('Non authentifié');

    setLoading(true);
    try {
      const createdJob = await apiRequest<AdminJob>('/admin/jobs/create', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      toast.success('Offre créée avec succès !');
      return createdJob;
    } catch (err: any) {
      if (!handleApiError(err)) {
        toast.error(err.message || 'Échec de la création.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const publishJob = async (id: string) => {
    const token = ensureAuth();
    if (!token) return;

    try {
      await apiRequest<void>(`/admin/jobs/${id}/publish`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Offre publiée !');
    } catch (err: any) {
      if (!handleApiError(err)) {
        toast.error(err.message || 'Échec de la publication.');
      }
    }
  };

  const deleteJob = async (id: string) => {
    const token = ensureAuth();
    if (!token) return;

    try {
      await apiRequest<void>(`/admin/jobs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Offre supprimée.');
    } catch (err: any) {
      if (!handleApiError(err)) {
        toast.error(err.message || 'Échec de la suppression.');
      }
    }
  };

  return {
    getAllJobs,
    createJob,
    publishJob,
    deleteJob,
    loading,
    getAuthToken,
  };
}