// src/hooks/usePublishedJobs.ts
'use client';

import { useState, useEffect } from 'react';
import { BackendPublishedJob, PublishedJob } from '@/types/job';

// Utilisé uniquement dans ce hook
interface JobPage {
  content: BackendPublishedJob[];
  page: number;
  size: number;
  total_elements: number;
  total_pages: number;
  first: boolean;
  last: boolean;
}

// Fonction utilitaire de parsing robuste
const parseListFromString = (input: string): string[] => {
  if (!input || typeof input !== 'string') return [];
  
  // Divise par sauts de ligne, puces, tirets, etc.
  return input
    .split(/[\n•*—\-–]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !/^(responsibilités?|qualifications?|avantages?)$/i.test(s));
};

// Fonction de transformation backend → frontend
const transformJob = (job: BackendPublishedJob): PublishedJob => {
  const now = new Date();
  const publishedAt = job.publishedAt ? new Date(job.publishedAt) : null;
  const isNew = publishedAt
    ? (now.getTime() - publishedAt.getTime()) / (1000 * 3600 * 24) <= 7
    : false;

  return {
    id: job.id,
    title: job.title,
    description: job.description,
    company: job.companyName || "Entreprise confidentielle",
    about: job.companyDescription,
    location: `${job.workCityLocation}, ${job.workCountryLocation}`,
    type: job.contractType,
    salary: job.salary,
    publishedAt: job.publishedAt,
    expirationDate: job.expirationDate,
    isFeatured: job.isFeatured,
    isUrgent: job.isUrgent,
    isNew,
    sector: job.sectorName,
    companySize: undefined,
    tags: job.tagDto.map(t => t.name),
    responsibilities: parseListFromString(job.responsibilities),
    qualifications: parseListFromString(job.requirements),
    benefits: parseListFromString(job.benefits),
  };
};

export default function usePublishedJobs(page: number = 0, size: number = 10) {
  const [jobs, setJobs] = useState<PublishedJob[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://api-irelis.us-east-2.elasticbeanstalk.com';
        const url = `${API_URL}/api/v1/jobs/published?page=${page}&size=${size}`;
        
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const rawData = await res.text(); // ← Récupère le texte brut
        console.log("🔍 Réponse brute de l'API :", rawData); // ← Affiche dans la console

        // ⚠️ Vérifie que rawData n'est pas vide
        if (!rawData.trim()) {
          throw new Error("Réponse vide du serveur");
        }

        const data = JSON.parse(rawData) as JobPage;
        const transformedJobs = data.content.map(transformJob);
        setJobs(transformedJobs);
        setTotalPages(data.total_pages);
        setTotalElements(data.total_elements);
      } catch (err: any) {
        console.error('Erreur lors du chargement des offres :', err);
        setError('Impossible de charger les offres. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [page, size]);

  return { jobs, totalPages, totalElements, loading, error };
}