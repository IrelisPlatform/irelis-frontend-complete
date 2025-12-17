//src/components/admin/AdminJobsTable.tsx

"use client";

import { useState, useEffect, useMemo, Fragment } from "react";
import {
  Search, Filter, Plus, MoreVertical, Edit, Trash2, Eye, ShieldCheck, Star,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useSectors, { Sector } from '@/hooks/useSectors';
import { useAdminJobs } from '@/hooks/admin/useAdminJobs';
import { BackendPublishedJob } from "@/types/job";
import { COUNTRIES_WITH_CITIES, COUNTRIES, Country } from '@/lib/countries';
import { getSkillsForSector, EDUCATION_LEVELS, EXPERIENCE_OPTIONS } from '@/lib/jobRequirements';
import { TAG_NAMES, TagType } from '@/lib/jobTags';

const STEPS = [
  { id: 1, name: "Création de l'entreprise" },
  { id: 2, name: "Informations générales" },
  { id: 3, name: "Détails du poste" },
  { id: 4, name: "Options avancées" },
];

const DOCUMENT_TYPES = [
  { value: "CV", label: "CV" },
  { value: "COVER_LETTER", label: "Lettre de motivation" },
  { value: "PORTFOLIO", label: "Portfolio" },
  { value: "CERTIFICATE", label: "Certificat" },
  { value: "IDENTITY_DOC", label: "Pièce d'identité" },
] as const;

interface NewJobFormState {
  // Champs entreprise
  companyName: string;
  companyEmail: string;
  companyDescription: string;
  sectorId: string;

  // Champs offre
  title: string;
  description: string;
  workCountryLocation: string;
  workCityLocation: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  contractType: "CDI" | "CDD" | "INTERNSHIP" | "ALTERNATIVE" | "FREELANCE";
  status: "PENDING" | "PUBLISHED" | "DRAFT";
  jobType: "FULL_TIME" | "PART_TIME" | "REMOTE" | "HYBRID";
  salary: string;
  publishedAt: string;
  expirationDate: string;
  isFeatured: boolean;
  isUrgent: boolean;
  requiredLanguage: string;
  sectorName: string;
  postNumber: number;
  tagDto: { name: string; type: string }[];
  requiredDocuments: { type: string }[];
}

// État initial du formulaire
const INITIAL_JOB_STATE: NewJobFormState = {
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
  sectorName: "",
  postNumber: 1,
  tagDto: [],
  requiredDocuments: [{ type: "CV" }],
};

export function AdminJobsTable() {
  const router = useRouter();
  const { sectors, loading: sectorsLoading } = useSectors();
  const {
    getAllJobs,
    createJob,
    publishJob,
    deleteJob,
    loading: jobsActionLoading,
  } = useAdminJobs();

  // États principaux
  const [jobs, setJobs] = useState<BackendPublishedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [newJob, setNewJob] = useState<NewJobFormState>(INITIAL_JOB_STATE);

  // États formulaire step 3

  const [selectedCountry, setSelectedCountry] = useState<Country | "">("");
  const [selectedSectorName, setSelectedSectorName] = useState("");
  const [otherCompetence, setOtherCompetence] = useState<string | null>(null);
  const [formationLevel, setFormationLevel] = useState("");
  const [formationDetail, setFormationDetail] = useState("");
  const [experiences, setExperiences] = useState("");
  const [otherExperience, setOtherExperience] = useState("");

  // État pour stocker les compétences sélectionnées (tableau)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  // Ajouter une compétence
  const addSkill = (skill: string) => {
    if (skill.trim() && !selectedSkills.includes(skill.trim())) {
      const updated = [...selectedSkills, skill.trim()];
      setSelectedSkills(updated);
      // Synchronise avec newJob.requirements
      setNewJob(prev => ({ ...prev, requirements: updated.join(', ') }));
    }
  };

  // Supprimer une compétence
  const removeSkill = (skillToRemove: string) => {
    const updated = selectedSkills.filter(s => s !== skillToRemove);
    setSelectedSkills(updated);
    setNewJob(prev => ({ ...prev, requirements: updated.join(', ') }));
  };

  // Réinitialiser quand le secteur change
  useEffect(() => {
    setSelectedSkills([]);
    setOtherCompetence(null);
    setNewJob(prev => ({ ...prev, requirements: "" }));
  }, [selectedSectorName]);

  const [newTagType, setNewTagType] = useState<"skill" | "tool" | "domain">("skill");
  const [newTagName, setNewTagName] = useState("");

  // === FONCTIONS POUR LES TAGS (à ajouter ici) ===
  const addTag = () => {
    if (newTagName.trim()) {
      setNewJob(prev => ({
        ...prev,
        tagDto: [...prev.tagDto, { name: newTagName.trim(), type: newTagType }]
      }));
      setNewTagName("");
    }
  };

  const removeTag = (index: number) => {
    setNewJob(prev => ({
      ...prev,
      tagDto: prev.tagDto.filter((_, i) => i !== index)
    }));
  };
  
  // Trouver le nom du secteur sélectionné
  useEffect(() => {
    const sector = sectors.find(s => s.id === newJob.sectorId);
    setSelectedSectorName(sector?.name || "");
  }, [newJob.sectorId, sectors]);

  // Générer la liste des compétences en fonction du secteur
  const skillsForSector = useMemo(() => {
    return getSkillsForSector(selectedSectorName);
  }, [selectedSectorName]);

  // Synchroniser les choix dans requirements
  useEffect(() => {
    const parts: string[] = [];

    if (selectedSkills.length > 0) {
      parts.push(...selectedSkills);
    }

    if (formationDetail) {
      parts.push(formationDetail);
    }

    if (experiences && experiences !== "Autre") {
       parts.push(experiences);
    } else if (experiences === "Autre" && otherExperience.trim()) {
      parts.push(otherExperience.trim());
    }

    setNewJob(prev => ({ ...prev, requirements: parts.join(', ') }));
  }, [selectedSkills, formationDetail, experiences, otherExperience]);


  // Charger la liste des offres au montage
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobs();
        setJobs(data);
      } catch (err) {
        // L'erreur est déjà gérée par le hook (toast)
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filtrer les offres côté client
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.workCityLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.workCountryLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesType = typeFilter === "all" || job.contractType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });


  // Validation et création d'une offre
  const handleCreateJob = async () => {
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
    if (!newJob.sectorId || newJob.sectorId === "") {
      toast.error("Veuillez sélectionner un secteur d'activité.");
      setCurrentStep(1);
      return;
    }
    if (newJob.companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newJob.companyEmail)) {
      toast.error("Email de l'entreprise invalide.");
      setCurrentStep(1);
      return;
    }

    // Validation tags
    const validTags = newJob.tagDto.filter(tag => tag.name?.trim());
    if (validTags.length === 0) {
      toast.error("Au moins un mot-clé est requis.");
      return;
    }

    // Validation documents
    if (newJob.requiredDocuments.length === 0) {
      toast.error("Au moins un document requis est requis.");
      return;
    }

    if (selectedSkills.length === 0 || !newJob.requirements.trim()) {
      toast.error("Au moins une compétence est requise.");
      return;
    }

    // Validation champs offre
    if (
      !newJob.title.trim() ||
      !newJob.description.trim() ||
      !newJob.workCityLocation.trim() ||
      !newJob.workCountryLocation.trim() ||
      !newJob.responsibilities.trim() ||
      !newJob.requirements.trim() ||
      !newJob.contractType ||
      !newJob.jobType ||
      !newJob.expirationDate ||
      !newJob.requiredLanguage.trim()
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Vérifier que expirationDate est dans le futur
    const now = new Date();
    const expDate = new Date(newJob.expirationDate);
    if (isNaN(expDate.getTime())) {
      toast.error("Date d'expiration invalide.");
      return;
    }
    expDate.setHours(23, 59, 59, 999); // fin de journée
    const expirationDateISO = expDate.toISOString();

    // Préparer tagDto SANS undefined
    const cleanTagDto = validTags
      .filter(tag => tag.type?.trim())
      .map(tag => ({
        name: tag.name.trim(),
        type: tag.type.trim(),
      }));

    if (cleanTagDto.length === 0) {
      toast.error("Au moins un mot-clé doit avoir un type.");
      return;
    }

    // Préparer le payload exactement comme attendu par Swagger
    const payload = {
      companyName: newJob.companyName.trim(),
      companyDescription: newJob.companyDescription.trim(),
      sectorId: newJob.sectorId,
      companyEmail: newJob.companyEmail?.trim() || undefined,
      title: newJob.title.trim(),
      description: newJob.description.trim(),
      workCountryLocation: newJob.workCountryLocation,
      workCityLocation: newJob.workCityLocation,
      responsibilities: newJob.responsibilities.trim(),
      requirements: newJob.requirements.trim(),
      benefits: newJob.benefits?.trim() || undefined,
      contractType: newJob.contractType,
      jobType: newJob.jobType,
      salary: newJob.salary?.trim() || undefined,
      isUrgent: newJob.isUrgent,
      isFeatured: newJob.isFeatured,
      expirationDate: expirationDateISO,
      requiredLanguage: newJob.requiredLanguage.trim(),
      postNumber: newJob.postNumber || 1,
      tagDto: cleanTagDto,
      requiredDocuments: newJob.requiredDocuments,
    };

    console.log("Payload envoyé au backend :", payload);

    try {
      await createJob(payload);
      // Recharger la liste
      const updatedJobs = await getAllJobs();
      setJobs(updatedJobs);
      // Réinitialiser
      setNewJob(INITIAL_JOB_STATE);
      setSelectedCountry("");
      setSelectedSectorName("");
      setOtherCompetence("");
      setFormationLevel("");
      setFormationDetail("");
      setExperiences("");
      setOtherExperience("");
      setIsCreateDialogOpen(false);
      setCurrentStep(1);
    } catch (err) {
      // Erreur déjà affichée par le hook
    }
  };

  // Publier une offre (si non publiée)
  const handlePublishClick = (id: string) => {
    publishJob(id);
    // Optionnel : recharger après un court délai
    setTimeout(async () => {
      const updated = await getAllJobs();
      setJobs(updated);
    }, 1500);
  };

  // Supprimer une offre
  const confirmDelete = async () => {
    if (!jobToDelete) return;
    await deleteJob(jobToDelete);
    // Recharger
    const updated = await getAllJobs();
    setJobs(updated);
    setDeleteModalOpen(false);
    setJobToDelete(null);
  };

  // Affichage du statut
  const getStatusBadge = (status: string) => {
    const variants = {
      PUBLISHED: "bg-green-100 text-green-800 border-green-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      DRAFT: "bg-gray-100 text-gray-800 border-gray-200",
    };
    const labels = {
      PUBLISHED: "Publiée",
      PENDING: "En attente",
      DRAFT: "Brouillon",
    };
    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants] || "bg-gray-100"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

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
                        placeholder="Décrivez votre entreprise en quelques lignes... Ex: Nous sommes une startup tech basée à Douala, spécialisée dans l’IA appliquée aux ressources humaines."
                        value={newJob.companyDescription}
                        onChange={(e) => setNewJob({ ...newJob, companyDescription: e.target.value })}
                        rows={3}
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
                        disabled={sectorsLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un secteur" />
                        </SelectTrigger>
                        <SelectContent>
                          {sectors
                            .filter(sector => sector.id.trim() !== "")
                            .map((sector: Sector) => (
                              <SelectItem key={sector.id} value={sector.id}>
                                {sector.name}
                              </SelectItem>
                            ))
                          }
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
                        placeholder="Ex: Directeur de Production"
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newJob.description}
                        placeholder="Vous intégrerez l’équipe plateforme pour concevoir, développer et maintenir des systèmes distribués performants et résilients. Vous travaillerez sur des features critiques, performance et scalabilité."
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
                            {selectedCountry && COUNTRIES_WITH_CITIES[selectedCountry as keyof typeof COUNTRIES_WITH_CITIES]
                              ? COUNTRIES_WITH_CITIES[selectedCountry as keyof typeof COUNTRIES_WITH_CITIES].map((city) => (
                                  <SelectItem key={city} value={city}>
                                    {city}
                                  </SelectItem>
                                ))
                              : (
                                  <SelectItem value="__placeholder__" disabled>
                                    Sélectionnez d'abord un pays
                                  </SelectItem>
                                )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>
                          Pays <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={newJob.workCountryLocation}
                          onValueChange={(v) => {
                            setNewJob({ ...newJob, workCountryLocation: v });
                            setSelectedCountry(v as Country); // pour filtrer les villes
                          }}
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
                  <div className="space-y-6">
                    {/* Type de poste */}
                    <div className="space-y-2">
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

                    {/* Missions */}
                    <div className="space-y-2">
                      <Label>Missions</Label>
                      <Textarea
                        value={newJob.responsibilities}
                        onChange={(e) => setNewJob({ ...newJob, responsibilities: e.target.value })}
                        placeholder="Décrivez les principales responsabilités..."
                        rows={3}
                      />
                    </div>

                    {/* Sélection multiple de compétences */}
                    <div className="space-y-2">
                      <Label>Compétences requises <span className="text-red-500">*</span></Label>
  
                      <div className="flex gap-2">
                        <Select 
                          value=""
                          onValueChange={(skill) => {
                            if (skill === "Autre") {
                              // Gère "Autre" séparément
                              setOtherCompetence("");
                            } else if (skill && !selectedSkills.includes(skill)) {
                            setSelectedSkills(prev => [...prev, skill]);
                            }
                          }}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Ajouter une compétence" />
                          </SelectTrigger>
                          <SelectContent>
                            {skillsForSector
                              .filter(skill => skill.trim() !== "" && !selectedSkills.includes(skill))
                              .map(skill => (
                                <SelectItem key={skill} value={skill}>
                                  {skill}
                                </SelectItem>
                              ))}
                            <SelectItem value="Autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Affichage des compétences sélectionnées */}
                      {selectedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedSkills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="ml-1 text-xs text-muted-foreground hover:text-foreground"
                              >
                                ✕
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Gestion manuelle pour "Autre" */}
                      {otherCompetence !== null && (
                        <Input
                          placeholder="Précisez la compétence"
                          value={otherCompetence}
                          onChange={(e) => setOtherCompetence(e.target.value)}
                          onBlur={() => {
                            if (otherCompetence.trim()) {
                              setSelectedSkills(prev => [...prev, otherCompetence.trim()]);
                              setOtherCompetence(null); // cache l'input
                            }
                          }}
                        />
                      )}
                    </div>

                    {/* Formations */}
                    <div className="space-y-2">
                      <Label>Niveau de formation requis <span className="text-red-500">*</span></Label>
                      <Select value={formationLevel} onValueChange={setFormationLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          {EDUCATION_LEVELS.map((group) => (
                            <Fragment key={group.label}>
                              {/* Label de groupe (désactivé → non sélectionnable) */}
                              <SelectItem value={`__group__${group.label}`} disabled>
                                <span className="font-semibold text-muted-foreground">{group.label}</span>
                              </SelectItem>

                              {/* Options réelles */}
                              {group.options.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </Fragment>
                          ))}
                        </SelectContent>            
                      </Select>
                      {formationLevel && !formationLevel.startsWith("__group__") && (
                        <Input
                          className="mt-1"
                          value={formationDetail}
                          onChange={(e) => setFormationDetail(e.target.value)}
                          placeholder="Précisez la formation (ex: Licence en Droit)"
                        />                       
                      )}
                    </div>

                    {/* Expériences */}
                    <div className="space-y-2">
                      <Label>Expérience requise <span className="text-red-500">*</span></Label>
                      <Select value={experiences} onValueChange={setExperiences}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPERIENCE_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {experiences === "Autre" && (
                        <Input
                          className="mt-1"
                          placeholder="Ex: Expérience en gestion de crise"
                          value={otherExperience}
                          onChange={(e) => setOtherExperience(e.target.value)}
                        />
                      )}
                    </div>  
                    
                    {/* Avantages */}
                    <div className="space-y-2">
                      <Label>Avantages</Label>
                      <Textarea
                        value={newJob.benefits}
                        onChange={(e) => setNewJob({ ...newJob, benefits: e.target.value })}
                        placeholder="Ex: Télétravail, mutuelle, formation..."
                        rows={2}
                      />
                    </div>

                    {/* Salaire */}
                    <div className="space-y-2">
                      <Label>Salaire</Label>
                      <Input
                        value={newJob.salary}
                        onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                        placeholder="Ex: 500-800K FCFA"
                      />
                    </div>

                    {/* Gestion des tags (compétences, outils, domaines) */}
                    <div className="space-y-3">
                      <Label>Mots-clés <span className="text-red-500">*</span></Label>                       
                      {/* Nouveau tag */}
                      <div className="grid grid-cols-3 gap-2">
                        <Select value={newTagType} onValueChange={(v) => setNewTagType(v as TagType)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="skill">Compétence</SelectItem>
                            <SelectItem value="tool">Outil</SelectItem>
                            <SelectItem value="domain">Domaine</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select value={newTagName} onValueChange={setNewTagName}>
                          <SelectTrigger>
                            <SelectValue placeholder="Nom" />
                          </SelectTrigger>
                          <SelectContent>
                            {TAG_NAMES[newTagType].map(name => (
                              <SelectItem key={`${newTagType}-${name}`} value={name}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button type="button" onClick={addTag} size="sm">
                          + Ajouter
                        </Button>
                      </div>

                      {/* Tags existants */}
                      {newJob.tagDto.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newJob.tagDto.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {tag.name} ({tag.type})
                              <button
                                type="button"
                                onClick={() => removeTag(index)}
                                className="ml-1 text-xs text-muted-foreground hover:text-foreground"
                              >
                                ✕
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}

                      {newJob.tagDto.length === 0 && (
                        <p className="text-sm text-muted-foreground">Aucun mot-clé ajouté.</p>
                      )}
                    </div>
                     

                    {/* Type de contrat */}
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
                        {DOCUMENT_TYPES.map((doc) => {
                          const isChecked = newJob.requiredDocuments.some(d => d.type === doc.value);
                          return (
                            <div key={doc.value} className="flex items-center gap-1">
                              <Checkbox
                                id={`doc-${doc.value}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  let updated = [...newJob.requiredDocuments];
                                  if (checked) {
                                    updated.push({ type: doc.value });
                                  } else {
                                    updated = updated.filter(d => d.type !== doc.value);
                                  }
                                  if (updated.length === 0) return;
                                  setNewJob({ ...newJob, requiredDocuments: updated });
                                }}
                              />
                              <Label htmlFor={`doc-${doc.value}`} className="text-sm">
                                {doc.label}
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
                  <Button onClick={() => setCurrentStep(currentStep + 1)}>Suivant</Button>
                ) : (
                  <Button 
                    onClick={handleCreateJob} 
                    disabled={jobsActionLoading}
                  >
                    {jobsActionLoading ? "Création..." : "Créer l'offre"}
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Titre</TableHead>
              <TableHead>Localisation</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-center">Urgent</TableHead>
              <TableHead className="text-center">En Vedette</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Expiration</TableHead>
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
                    {job.publishedAt 
                      ? new Date(job.publishedAt).toLocaleDateString("fr-FR")
                      : job.status === "PUBLISHED" 
                        ? "Date indisponible" 
                        : "Non publiée"}
                  </TableCell>
                  <TableCell>
                    {job.expirationDate 
                      ? new Date(job.expirationDate).toLocaleDateString("fr-FR")
                      : "—"}
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
                          <DropdownMenuItem onClick={() => handlePublishClick(job.id)}>
                            <Eye className="h-4 w-4 mr-2" /> Publier
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                           Modifier (non disponible)
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive" 
                          onClick={() => {
                            setJobToDelete(job.id);
                            setDeleteModalOpen(true);
                          }}
                        >
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
      {/* Modal suppression */}
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
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={jobsActionLoading}
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}