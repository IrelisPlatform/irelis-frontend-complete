"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ShieldCheck,
  Star,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { JobOffer, PaginatedResponse } from "@/types/job";
import { useRouter } from "next/navigation";
import useSectors, { Sector } from '@/hooks/useSectors';

interface AdminJob extends JobOffer {
  recruiterName?: string; 
}

// 🔁 Nouvelle liste des étapes
const STEPS = [
  { id: 1, name: "Création de l'entreprise" },
  { id: 2, name: "Informations générales" },
  { id: 3, name: "Détails du poste" },
  { id: 4, name: "Options avancées" },
];

// Valeurs fixes pour ville/pays
const CITIES = ["Douala", "Yaoundé", "Bafoussam", "Garoua", "Autre"];
const COUNTRIES = ["Cameroun", "France", "États-Unis", "Autre"];

export function AdminJobsTable() {
  const router = useRouter();
  const { sectors, loading: sectorsLoading } = useSectors();
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  
  // 🔁 Nouveau state : on ajoute tous les champs entreprise
  const [newJob, setNewJob] = useState({
    // Champs entreprise (étape 1)
    companyName: "",
    companyEmail: "",
    companyDescription: "",
    sectorId: "",

    // Champs offre
    title: "",
    description: "",
    workCountryLocation: "",
    workCityLocation: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
    contractType: "CDI" as const,
    status: "PENDING" as const,
    jobType: "FULL_TIME" as const,
    salary: "",
    publishedAt: "",
    expirationDate: "",
    isFeatured: false,
    isUrgent: false,
    requiredLanguage: "",
    sectorName: "", // optionnel (affichage)
    postNumber: 1,
    tagDto: [{ name: "", type: "" }],
    requiredDocuments: [{ type: "CV" }],
  });

  const loadJobs = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        localStorage.removeItem('adminToken');
        toast.error("Session expirée. Veuillez vous reconnecter.");
        router.push("/admin/login");
        return;
      }
    } catch (err) {
      localStorage.removeItem('adminToken');
      router.push("/admin/login");
      return;
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://api-irelis.us-east-2.elasticbeanstalk.com';
      const res = await fetch(`${backendUrl}/admin/jobs?page=0&size=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data: PaginatedResponse<JobOffer> = await res.json();
        setJobs(data.content);
      } else {
        toast.error("Échec du chargement des offres admin");
      }
    } catch (err) {
      console.error("Erreur chargement offres admin:", err);
      toast.error("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.workCityLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.workCountryLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesType = typeFilter === "all" || job.contractType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const sanitizeString = (str: string): string => {
    if (!str) return "";
    return str
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t");
  };

  const handleCreateJob = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Session expirée. Veuillez vous reconnecter.");
      router.push("/admin/login");
      return;
    }

    // Validation token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        localStorage.removeItem('adminToken');
        toast.error("Session expirée. Veuillez vous reconnecter.");
        router.push("/admin/login");
        return;
      }
    } catch (err) {
      localStorage.removeItem('adminToken');
      router.push("/admin/login");
      return;
    }

    // Validation champs entreprise (étape 1)
    if (!newJob.companyName.trim()) {
      toast.error("Le nom de l'entreprise est obligatoire.");
      setCurrentStep(1);
      return;
    }
    if (!newJob.companyDescription.trim()) {
      toast.error("La description de l'entreprise est obligatoire.");
      setCurrentStep(1);
      return;
    }
    if (!newJob.sectorId) {
      toast.error("Le secteur d'activité est obligatoire.");
      setCurrentStep(1);
      return;
    }
    if (newJob.companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newJob.companyEmail)) {
      toast.error("Email de l'entreprise invalide.");
      setCurrentStep(1);
      return;
    }

    // Validation champs offre
    const validTags = newJob.tagDto.filter(tag => tag.name?.trim());
    if (validTags.length === 0) {
      toast.error("Au moins un mot-clé est requis.");
      return;
    }
    if (newJob.requiredDocuments.length === 0) {
      toast.error("Au moins un document requis est requis.");
      return;
    }

    if (
      !newJob.title.trim() ||
      !newJob.description.trim() ||
      !newJob.workCityLocation.trim() ||
      !newJob.workCountryLocation.trim() ||
      !newJob.responsibilities.trim() ||
      !newJob.requirements.trim() ||
      !newJob.contractType ||
      !newJob.jobType ||
      !newJob.expirationDate
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const now = new Date();
    const expDate = new Date(newJob.expirationDate).toISOString();
    if (expDate <= now) {
      toast.error("La date d'expiration doit être dans le futur.");
      return;
    }

    // 🔥 Payload complet avec entreprise
    const payload = {
      companyName: sanitizeString(newJob.companyName),
      companyDescription: sanitizeString(newJob.companyDescription),
      companyEmail: newJob.companyEmail ? sanitizeString(newJob.companyEmail) : undefined,
      sectorId: newJob.sectorId,

      title: sanitizeString(newJob.title),
      description: sanitizeString(newJob.description || ""),
      workCountryLocation: sanitizeString(newJob.workCountryLocation),
      workCityLocation: sanitizeString(newJob.workCityLocation),
      responsibilities: sanitizeString(newJob.responsibilities || ""),
      requirements: sanitizeString(newJob.requirements || ""),
      benefits: sanitizeString(newJob.benefits || ""),
      contractType: newJob.contractType,
      jobType: newJob.jobType,
      salary: sanitizeString(newJob.salary || ""),
      expirationDate: newJob.expirationDate,
      isFeatured: newJob.isFeatured,
      isUrgent: newJob.isUrgent,
      requiredLanguage: sanitizeString(newJob.requiredLanguage || ""),
      sectorName: sectors.find(s => s.id === newJob.sectorId)?.name || "",
      postNumber: newJob.postNumber || 1,
      tagDto: validTags.map(tag => {
        const cleanedTag: any = { name: sanitizeString(tag.name) };
        if (tag.type && tag.type.trim()) {
          cleanedTag.type = sanitizeString(tag.type);
        }
        return cleanedTag;
      }),
      requiredDocuments: newJob.requiredDocuments,
    };

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://api-irelis.us-east-2.elasticbeanstalk.com';
      
      const createRes = await fetch(`${backendUrl}/api/v1/jobs/recruiter/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!createRes.ok) {
        let errorMessage = "Échec de la création.";
        try {
          const errorData = await createRes.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {}
        console.error("Erreur API création:", createRes.status, errorMessage);
        toast.error(errorMessage);
        return;
      }

      const createdJob = await createRes.json();

      const publishRes = await fetch(`${backendUrl}/admin/jobs/${createdJob.id}/publish`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!publishRes.ok) {
        console.error("Échec de la publication:", publishRes.status);
        toast.error("Offre créée mais échec de la publication.");
        loadJobs();
        return;
      }

      toast.success("Offre créée et publiée avec succès !");
      loadJobs();
      setIsCreateDialogOpen(false);
      setCurrentStep(1);
      setNewJob({
        companyName: "",
        companyEmail: "",
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
        status: "PENDING",
        jobType: "FULL_TIME",
        salary: "",
        publishedAt: "", 
        expirationDate: "",
        isFeatured: false,
        isUrgent: false,
        requiredLanguage: "",
        sectorName: "",
        postNumber: 1,
        tagDto: [{ name: "" }],
        requiredDocuments: [{ type: "CV" }],
      });
    } catch (err: any) {
      console.error("Erreur inattendue:", err);
      toast.error(err.message || "Erreur réseau inattendue");
    }
  };

  // ... (keep handlePublish & confirmDelete unchanged — they don't use newJob state)

  const handlePublish = async (id: string) => { /* unchanged */ };
  const confirmDelete = async () => { /* unchanged */ };

  const getStatusBadge = (status: string) => { /* unchanged */ };

  return (
    <div className="space-y-4">
      {/* Alerte */}
      <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-300">
        <ShieldCheck className="h-5 w-5 text-green-600" />
        <AlertDescription className="ml-2">
          <p className="text-sm text-green-900">
            <span className="font-semibold">Espace administration :</span> Vous gérez toutes les offres de la plateforme.
          </p>
        </AlertDescription>
      </Alert>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par titre ou localisation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" /> Statut
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="PUBLISHED">Publiée</SelectItem>
              <SelectItem value="PENDING">En attente</SelectItem>
              <SelectItem value="DRAFT">Brouillon</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" /> Type
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="CDI">CDI</SelectItem>
              <SelectItem value="CDD">CDD</SelectItem>
              <SelectItem value="FREELANCE">Freelance</SelectItem>
              <SelectItem value="INTERNSHIP">Stage</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) setCurrentStep(1);
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Nouvelle offre
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
              <DialogHeader>
               <DialogTitle>Créer une offre (Étape {currentStep}/4)</DialogTitle>
                <div className="flex mt-2 space-x-1">
                  {STEPS.map((step) => (
                    <div
                      key={step.id}
                      className={`h-1 flex-1 rounded-full ${
                        currentStep >= step.id ? "bg-[#1e3a88]" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </DialogHeader>

              <div className="py-4">
                {/* ÉTAPE 1 : ENTREPRISE */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label>
                        Nom de l'entreprise <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={newJob.companyName}
                        onChange={(e) => setNewJob({ ...newJob, companyName: e.target.value })}
                        placeholder="Ex: Irelis SARL"
                      />
                    </div>
                    <div>
                      <Label>
                        Description de l'entreprise <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        value={newJob.companyDescription}
                        onChange={(e) => setNewJob({ ...newJob, companyDescription: e.target.value })}
                        rows={3}
                        placeholder="Décrivez votre entreprise en quelques lignes..."
                      />
                    </div>
                    <div>
                      <Label>Email de l'entreprise</Label>
                      <Input
                        type="email"
                        value={newJob.companyEmail}
                        onChange={(e) => setNewJob({ ...newJob, companyEmail: e.target.value })}
                        placeholder="contact@entreprise.com"
                      />
                    </div>
                    <div>
                      <Label>
                        Secteur d'activité <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={newJob.sectorId}
                        onValueChange={(v) => setNewJob({ ...newJob, sectorId: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un secteur" />
                        </SelectTrigger>
                        <SelectContent>
                          {sectors.map((sector: Sector) => (
                            <SelectItem key={sector.id} value={sector.id}>
                              {sector.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* ÉTAPE 2 : INFOS GÉNÉRALES */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label>
                        Titre <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newJob.description}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>
                          Ville <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={newJob.workCityLocation}
                          onValueChange={(v) => setNewJob({ ...newJob, workCityLocation: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une ville" />
                          </SelectTrigger>
                          <SelectContent>
                            {CITIES.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>
                          Pays <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={newJob.workCountryLocation}
                          onValueChange={(v) => setNewJob({ ...newJob, workCountryLocation: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un pays" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRIES.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>
                        Date d'expiration <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={newJob.expirationDate || ""}
                        onChange={(e) => setNewJob({ ...newJob, expirationDate: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* ÉTAPE 3 : DÉTAILS DU POSTE */}
                {currentStep === 3 && (
                  <>
                    <div className="space-y-4">
                      <Label>
                        Type de poste <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={newJob.jobType}
                        onValueChange={(v) => setNewJob({ ...newJob, jobType: v as any })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FULL_TIME">Temps plein</SelectItem>
                          <SelectItem value="PART_TIME">Temps partiel</SelectItem>
                          <SelectItem value="REMOTE">Télétravail</SelectItem>
                          <SelectItem value="HYBRID">Hybride</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Missions</Label>
                        <Textarea
                          value={newJob.responsibilities}
                          onChange={(e) => setNewJob({ ...newJob, responsibilities: e.target.value })}
                          placeholder="Décrivez les principales responsabilités..."
                        />
                      </div>
                      <div>
                        <Label>
                          Compétences requises <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          value={newJob.requirements}
                          onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                          placeholder="Listez les compétences, expériences, diplômes..."
                        />
                      </div>
                      <div>
                        <Label>Avantages</Label>
                        <Textarea
                          value={newJob.benefits}
                          onChange={(e) => setNewJob({ ...newJob, benefits: e.target.value })}
                          placeholder="Ex: Télétravail, mutuelle, formation..."
                        />
                      </div>
                      <div>
                        <Label>Salaire</Label>
                        <Input
                          value={newJob.salary}
                          onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                          placeholder="Ex: 500-800K FCFA"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          Mots-clés <span className="text-red-500">*</span>
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Nom (ex: React)"
                            value={newJob.tagDto[0]?.name || ""}
                            onChange={(e) => {
                              const updated = [...newJob.tagDto];
                              updated[0] = { ...updated[0], name: e.target.value };
                              setNewJob({ ...newJob, tagDto: updated });
                            }}
                          />
                          <Select
                            value={newJob.tagDto[0]?.type || ""}
                            onValueChange={(v) => {
                              const updated = [...newJob.tagDto];
                              updated[0] = { ...updated[0], type: v };
                              setNewJob({ ...newJob, tagDto: updated });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Type (optionnel)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="skill">Compétence</SelectItem>
                              <SelectItem value="tool">Outil</SelectItem>
                              <SelectItem value="domain">Domaine</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Type de contrat</Label>
                        <Select
                          value={newJob.contractType}
                          onValueChange={(v) => setNewJob({ ...newJob, contractType: v })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CDI">CDI</SelectItem>
                            <SelectItem value="CDD">CDD</SelectItem>
                            <SelectItem value="FREELANCE">Freelance</SelectItem>
                            <SelectItem value="INTERNSHIP">Stage</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                {/* ÉTAPE 4 : OPTIONS AVANCÉES */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>
                          Langue requise <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={newJob.requiredLanguage}
                          onChange={(e) => setNewJob({ ...newJob, requiredLanguage: e.target.value })}
                          placeholder="Ex: Français"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="urgent"
                          checked={newJob.isUrgent}
                          onCheckedChange={(checked) => setNewJob({ ...newJob, isUrgent: checked as boolean })}
                        />
                        <Label htmlFor="urgent">Offre urgente</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="featured"
                          checked={newJob.isFeatured}
                          onCheckedChange={(checked) => setNewJob({ ...newJob, isFeatured: checked as boolean })}
                        />
                        <Label htmlFor="featured">Mettre en avant</Label>
                      </div>
                    </div>

                    <div>
                      <Label>Nombre de postes</Label>
                      <Input
                        type="number"
                        min="1"
                        value={newJob.postNumber || 1}
                        onChange={(e) => setNewJob({ ...newJob, postNumber: Number(e.target.value) || 1 })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Documents requis <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {(["CV", "COVER_LETTER", "PORTFOLIO", "CERTIFICATE", "IDENTITY_DOC"] as const).map((docType) => {
                          const isChecked = newJob.requiredDocuments.some(d => d.type === docType);
                          return (
                            <div key={docType} className="flex items-center gap-1">
                              <Checkbox
                                id={`doc-${docType}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  let updated = [...newJob.requiredDocuments];
                                  if (checked) {
                                    updated.push({ type: docType });
                                  } else {
                                    updated = updated.filter(d => d.type !== docType);
                                  }
                                  if (updated.length === 0) return;
                                  setNewJob({ ...newJob, requiredDocuments: updated });
                                }}
                              />
                              <Label htmlFor={`doc-${docType}`} className="text-sm">
                                {docType === "CV" && "CV"}
                                {docType === "COVER_LETTER" && "Lettre de motivation"}
                                {docType === "PORTFOLIO" && "Portfolio"}
                                {docType === "CERTIFICATE" && "Certificat"}
                                {docType === "IDENTITY_DOC" && "Pièce d'identité"}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-2 pt-2">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                    Précédent
                  </Button>
                )}
                {currentStep < STEPS.length ? (
                  <Button onClick={() => setCurrentStep(currentStep + 1)}>
                    Suivant
                  </Button>
                ) : (
                  <Button onClick={handleCreateJob}>
                    Créer et publier
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table (inchangée) */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Titre</TableHead>
              <TableHead>Localisation</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-center">Urgent</TableHead>
              <TableHead className="text-center">Featured</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">Chargement...</TableCell>
              </TableRow>
            ) : filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">Aucune offre trouvée</TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.workCityLocation}, {job.workCountryLocation}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{job.contractType}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell className="text-center">
                    {job.isUrgent ? <AlertCircle className="h-4 w-4 text-red-500" /> : "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    {job.isFeatured ? <Star className="h-4 w-4 text-yellow-500 fill-current" /> : "—"}
                  </TableCell>
                  <TableCell>
                    {job.publishedAt ? new Date(job.publishedAt).toLocaleDateString("fr-FR") : "Non publiée"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {job.status !== "PUBLISHED" && (
                          <DropdownMenuItem onClick={() => handlePublish(job.id)}>
                            <Eye className="h-4 w-4 mr-2" /> Publier
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          <a href={`/admin/jobs/${job.id}/edit`} className="block">
                            Modifier
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => {
                          setJobToDelete(job.id);
                          setDeleteModalOpen(true);
                        }}>
                          <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal suppression (inchangé) */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l’offre</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Êtes-vous sûr ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={confirmDelete}>Supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}