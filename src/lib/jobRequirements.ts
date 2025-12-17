// src/lib/jobRequirements.ts

// 🔹 Compétences par catégorie sémantique
const SKILL_CATEGORIES = {
  IT: [
    "Java", "Python", "JavaScript", "TypeScript", "React", "Angular", "Vue.js",
    "Node.js", "Django", "Spring Boot", "SQL", "NoSQL", "Docker", "Kubernetes",
    "AWS", "Azure", "CI/CD", "Git", "Linux", "Cybersécurité", "Machine Learning"
  ],
  Marketing: [
    "Marketing digital", "SEO", "Stratégie de contenu", "Google Ads", "Analytics",
    "Community management", "Emailing", "Publicité en ligne", "Branding"
  ],
  Finance: [
    "Comptabilité", "Audit", "Analyse financière", "Gestion de trésorerie", "SAP",
    "Excel avancé", "Fiscalité", "Reporting financier", "Contrôle de gestion"
  ],
  Assurance: [
    "Gestion des risques", "Souscription", "Sinistres", "Relation client", "Actuariat"
  ],
  BTP: [
    "Maçonnerie", "Électricité", "Plomberie", "Soudure", "Lecture de plans",
    "Sécurité sur chantier", "Conduite d’engins", "Génie civil", "Béton armé"
  ],
  Logistique: [
    "Gestion des entrepôts", "Expédition", "Suivi GPS", "Chargement/déchargement",
    "Permis poids lourd", "Doux-marchandises", "Anglais routier", "Supply chain"
  ],
  Energie: [
    "Énergies renouvelables", "Pétrole & gaz", "Génie électrique", "Maintenance",
    "Gestion de réseau", "Sécurité industrielle", "Développement durable"
  ],
  Sante: [
    "Soins infirmiers", "Chirurgie", "Radiologie", "Pharmacie", "Premiers secours",
    "Gestion des dossiers médicaux", "Hygiène hospitalière", "Psychiatrie"
  ],
  Industrie: [
    "Production", "Qualité", "Méthodes", "Maintenance industrielle", "Automatisme",
    "Mécatronique", "Lean manufacturing", "Sécurité au travail"
  ],
  Agriculture: [
    "Culture", "Élevage", "Tracteur", "Agroalimentaire", "Phytopharmacie",
    "Gestion de l’eau", "Commercialisation agricole", "Mécanisation"
  ],
  Commerce: [
    "Vente B2B/B2C", "Gestion de caisse", "Merchandising", "Relation client",
    "Gestion des stocks", "E-commerce", "Anglais commercial", "Négociation"
  ],
  Restauration: [
    "Cuisine", "Pâtisserie", "Service en salle", "Barman", "Hygiène alimentaire",
    "Gestion hôtelière", "Accueil client", "Sommellerie"
  ],
  Education: [
    "Pédagogie", "Préparation de cours", "Évaluation", "Gestion de classe",
    "Langues", "Mathématiques", "Sciences", "Soutien scolaire"
  ],
  Aeronautique: [
    "Ingénierie aéronautique", "Mécanique des fluides", "Maintenance aéronefs",
    "Navigation", "Sécurité aérienne", "Simulation de vol"
  ],
  Immobilier: [
    "Transaction immobilière", "Gestion locative", "Estimation", "Prospection",
    "Droit immobilier", "Marketing immobilier", "Gestion de patrimoine"
  ],
  Juridique: [
    "Droit des affaires", "Droit du travail", "Contrats", "Contentieux",
    "Rédaction juridique", "Conseil juridique", "Propriété intellectuelle"
  ],
  RH: [
    "Recrutement", "Paie", "Formation", "Gestion des carrières", "Droit du travail",
    "GPEC", "Dialogue social", "SIRH", "Coaching"
  ],
  Medias: [
    "Journalisme", "Production audiovisuelle", "Montage vidéo", "Community",
    "Scénarisation", "Photographie", "Événementiel", "Storytelling"
  ],
  ServicesPublics: [
    "Administration publique", "Gestion de projet", "Politiques publiques",
    "Droit administratif", "Service à la citoyenneté", "Urbanisme"
  ],
  Telecom: [
    "Réseaux mobiles", "Téléphonie IP", "Fibre optique", "Cybersécurité",
    "Gestion de réseau", "Support technique", "Infrastructure télécom"
  ],
  Autre: ["Autre"]
};

// 🔹 Mapping : Secteur backend → Catégorie de compétences
const SECTOR_TO_CATEGORY: Record<string, keyof typeof SKILL_CATEGORIES> = {
  "IT": "IT",
  "Technologies de l'information (IT)": "IT",
  "Marketing": "Marketing",
  "Marketing & Communication": "Marketing",
  "Finance & Banque": "Finance",
  "Assurance": "Assurance",
  "BTP / Construction": "BTP",
  "Transport & Logistique": "Logistique",
  "Énergie & Environnement": "Energie",
  "Santé & Pharmaceutique": "Sante",
  "Industrie & Manufacturing": "Industrie",
  "Agriculture & Agroalimentaire": "Agriculture",
  "Commerce & Distribution": "Commerce",
  "Restauration & Hôtellerie": "Restauration",
  "Éducation & Formation": "Education",
  "Aéronautique & Défense": "Aeronautique",
  "Immobilier": "Immobilier",
  "Juridique": "Juridique",
  "Ressources Humaines": "RH",
  "Médias & Divertissement": "Medias",
  "Services Publics & Administration": "ServicesPublics",
  "Télécommunications": "Telecom"
};

// 🔹 Fonction utilitaire
export function getSkillsForSector(sectorName: string): string[] {
  const category = SECTOR_TO_CATEGORY[sectorName];
  return category ? SKILL_CATEGORIES[category] : SKILL_CATEGORIES.Autre;
}

// 🔹 FORMATIONS par niveau
export const EDUCATION_LEVELS = [
  { label: "École primaire", options: ["CEP", "Certificat d’études"] },
  { label: "Collège", options: ["BEPC", "Brevet", "Diplôme national du brevet"] },
  { label: "Lycée", options: ["Baccalauréat général", "Bac Pro", "Bac Techno", "CAP", "BEP"] },
  { label: "Enseignement supérieur court", options: ["BTS", "DUT", "Licence", "Bachelor"] },
  { label: "Enseignement supérieur long", options: ["Master", "Doctorat", "École d'ingénieur", "École de commerce", "DESS", "MBA"] },
  { label: "Formation professionnelle", options: ["Certificat de qualification", "Titre professionnel", "Formation qualifiante", "Autre"] }
];

// 🔹 EXPÉRIENCES
export const EXPERIENCE_OPTIONS = [
  "0-6 mois", "6 mois - 1 an", "1-2 ans", "2-3 ans", "3-5 ans",
  "5-10 ans", "10+ ans", "Débutant accepté", "Autre"
];