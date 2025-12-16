// src/app/admin/jobs/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AdminJobOfferRequest } from "@/types/job";
import { useAdminJobs } from "@/hooks/admin/useAdminJobs";

export default function EditJobPage() {
  const { getAllJobs } = useAdminJobs();
  const [job, setJob] = useState<AdminJobOfferRequest>({
    companyName: "",
    companyDescription: "",
    sectorId: "",
    title: "",
    description: "",
    workCountryLocation: "",
    workCityLocation: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
    contractType: "CDI",
    jobType: "FULL_TIME",
    salary: "",
    expirationDate: "",
    requiredLanguage: "",
    postNumber: 1,
    tagDto: [],
    requiredDocuments: [],
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const id = useSearchParams().get("id");

  useEffect(() => {
    if (!id) {
      toast.error("ID de l'offre manquant");
      router.push("/admin");
      return;
    }

    const loadJob = async () => {
      setLoading(true);
      try {
        const jobs = await getAllJobs();
        const found = jobs.find(j => j.id === id);
        if (found) {
          setJob(found);
        } else {
          toast.error("Offre non trouvée");
          router.push("/admin");
        }
      } catch (err) {
        toast.error("Erreur lors du chargement");
        router.push("/admin");
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id, router]);

  const handleSave = () => {
    if (!job) return;
    toast.success("Modifications enregistrées (mode simulation)");
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="p-6">
        <p>Chargement de l'offre...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-6">
        <p>Offre non trouvée.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Modifier l’offre : {job.title}</h1>
      <div className="space-y-4">
        <div>
          <Label>Titre *</Label>
          <Input
            value={job.title}
            onChange={(e) => setJob({ ...job, title: e.target.value })}
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={job.description}
            onChange={(e) => setJob({ ...job, description: e.target.value })}
            rows={6}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Ville</Label>
            <Input
              value={job.workCityLocation}
              onChange={(e) => setJob({ ...job, workCityLocation: e.target.value })}
            />
          </div>
          <div>
            <Label>Pays</Label>
            <Input
              value={job.workCountryLocation}
              onChange={(e) => setJob({ ...job, workCountryLocation: e.target.value })}
            />
          </div>
        </div>
        <div>
          <Label>Type de contrat</Label>
          <Select 
            value={job.contractType} 
            onValueChange={(v) => setJob({ ...job, contractType: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CDI">CDI</SelectItem>
              <SelectItem value="CDD">CDD</SelectItem>
              <SelectItem value="FREELANCE">Freelance</SelectItem>
              <SelectItem value="INTERNSHIP">Stage</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Salaire</Label>
          <Input
            value={job.salary}
            onChange={(e) => setJob({ ...job, salary: e.target.value })}
          />
        </div>
        <div>
          <Label>Statut</Label>
          <Badge 
            variant="outline" 
            className={
              job.status === "PUBLISHED" 
                ? "bg-green-100 text-green-800 border-green-200" 
                : job.status === "PENDING" 
                ? "bg-yellow-100 text-yellow-800 border-yellow-200" 
                : "bg-gray-100 text-gray-800 border-gray-200"
            }
          >
            {job.status === "PUBLISHED" 
              ? "Publiée" 
              : job.status === "PENDING" 
              ? "En attente" 
              : "Brouillon"}
          </Badge>
        </div>
      </div>
      <div className="mt-6 flex gap-2">
        <Button onClick={handleSave}>Sauvegarder les modifications</Button>
        <Button variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </div>
  );
}