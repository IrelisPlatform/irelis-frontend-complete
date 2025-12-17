// src/lib/jobTags.ts

export const TAG_NAMES = {
  skill: [
    "Java", "Python", "Réseau", "Comptabilité", "Cuisine", "Maçonnerie", "Pédagogie",
    "Vente", "Premiers secours", "Gestion de projet", "Soudure", "Marketing digital"
  ],
  tool: [
    "React", "Excel", "SAP", "Photoshop", "AutoCAD", "Power BI", "Git", "Docker",
    "Matlab", "Tableau", "Figma", "WordPress"
  ],
  domain: [
    "IT", "Santé", "Restauration", "BTP", "Éducation", "Finance", "Agriculture",
    "Logistique", "RH", "Juridique", "Énergie", "Médias"
  ]
};

export type TagType = "skill" | "tool" | "domain";