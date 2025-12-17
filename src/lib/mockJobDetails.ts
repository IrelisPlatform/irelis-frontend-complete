// src/lib/mockJobDetails.ts

export type JobDetail = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string; // e.g., CDI, CDD, Freelance
  salary: string;
  posted: string;
  description: string;
  tags: string[];
  isNew: boolean;
  isUrgent: boolean;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  about: string;
  companySize: string;
  sector: string;
  companySize: string;
  expirationDate?: string;   
  publishedAt?: string;     
  isNew: boolean;
  isUrgent: boolean;
  tags: string[];
};

const jobDetails: JobDetail[] = [
  {
    id: "1",
    title: "Ingénieur Logiciel Senior",
    company: "TechCorp Solutions",
    location: "Douala, Cameroun (À distance)",
    type: "CDI",
    salary: "800k - 1.2M FCFA",
    posted: "Il y a 2 jours",
    description:
      "Vous intégrerez l’équipe plateforme pour concevoir, développer et maintenir des systèmes distribués performants et résilients. Vous travaillerez sur des features critiques, performance et scalabilité.",
    tags: ["React", "TypeScript", "Node.js", "AWS"],
    isNew: true,
    isUrgent: false,
    responsibilities: [
      "Concevoir et développer des services backend scalables en Node.js/TypeScript.",
      "Participer aux revues de conception et de code.",
      "Mettre en place des tests automatisés et pipelines CI/CD.",
      "Optimiser les performances et résoudre les incidents en production.",
      "Encadrer les développeurs juniors et partager les bonnes pratiques."
    ],
    qualifications: [
      "Bac+5 en informatique ou expérience équivalente.",
      "5+ années d'expérience en développement backend ou full-stack.",
      "Bonne maîtrise de TypeScript, Node.js et des architectures distribuées.",
      "Expérience avec AWS (EC2, ECS, Lambda, RDS) et infra as code.",
      "Connaissance des patterns de scalabilité et observabilité (metrics, tracing)."
    ],
    benefits: [
      "Salaire compétitif + primes de performance.",
      "Assurance santé prise en charge partiellement.",
      "Télétravail flexible et horaires aménageables.",
      "Budget formation et conférences.",
      "Équipe internationale et challenge technique."
    ],
    about:
      "TechCorp Solutions est une scale-up technologique spécialisée dans les plateformes B2B. Nous favorisons l'autonomie, la montée en compétences et la responsabilité technique.",
    companySize: "501-1000 employés",
    sector: "Technologie"
  },

  {
    id: "2",
    title: "Designer Produit",
    company: "DesignHub Inc",
    location: "Yaoundé, Cameroun",
    type: "CDI",
    salary: "600k - 900k FCFA",
    posted: "Il y a 1 semaine",
    description:
      "Concevez des expériences utilisateurs harmonieuses, de la recherche utilisateur aux prototypes haute fidélité. Vous collaborerez étroitement avec produit et engineering.",
    tags: ["Figma", "UI/UX", "Design Systems", "Prototyping"],
    isNew: false,
    isUrgent: false,
    responsibilities: [
      "Mener des ateliers de conception et des sessions de recherche utilisateur.",
      "Créer des maquettes et prototypes haute fidélité sur Figma.",
      "Maintenir et enrichir notre design system.",
      "Collaborer avec les équipes produit et développement pour implémenter les designs.",
      "Participer aux tests utilisateurs et itérer sur les solutions."
    ],
    qualifications: [
      "3+ ans d'expérience en design produit ou UX/UI.",
      "Portfolio démontrant des projets centrés utilisateur.",
      "Maîtrise de Figma et des outils de prototypage.",
      "Connaissance des principes d'accessibilité et d'architecture informationnelle."
    ],
    benefits: [
      "Horaires flexibles et politique remote-friendly.",
      "Budget pour matériel et formation.",
      "Participations aux conférences design.",
      "Ambiance startup et équipe créative."
    ],
    about:
      "DesignHub Inc accompagne des startups et grands comptes pour créer des produits numériques impactants. Notre équipe valorise la recherche, la simplicité et la qualité visuelle.",
    companySize: "51-200 employés",
    sector: "Design / Produit"
  },

  {
    id: "3",
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Douala, Cameroun (Hybride)",
    type: "CDI",
    salary: "700k - 1M FCFA",
    posted: "Il y a 3 jours",
    description:
      "Concevoir et déployer des modèles ML pour extraire des insights business et automatiser des décisions. Vous travaillerez sur pipelines data et modèles supervisionnés/non-supervisionnés.",
    tags: ["Python", "Machine Learning", "SQL", "TensorFlow"],
    isNew: true,
    isUrgent: true,
    responsibilities: [
      "Concevoir, entraîner et déployer des modèles ML à l'échelle.",
      "Préparer et nettoyer des datasets volumineux.",
      "Collaborer avec les équipes produit pour livrer des modèles en production.",
      "Surveiller les performances modèles et gérer le retraining.",
      "Présenter les résultats et recommandations aux stakeholders."
    ],
    qualifications: [
      "Master ou équivalent en data science/Maths/Informatique.",
      "Expérience significative en Python (pandas, scikit-learn, TensorFlow/PyTorch).",
      "Solide maîtrise SQL et data engineering basique.",
      "Expérience en déploiement ML (Docker, Kubernetes, MLOps) est un plus."
    ],
    benefits: [
      "Télétravail hybride et horaires flexibles.",
      "Budget conférences & formation data.",
      "Assurance santé et package salarial attractif.",
      "Équipe data moderne et projets à fort impact."
    ],
    about:
      "Analytics Pro aide les entreprises à devenir data-driven grâce à des solutions analytiques et modèles prédictifs dédiés au décisionnel.",
    companySize: "201-500 employés",
    sector: "Data & Analytics"
  },

  {
    id: "4",
    title: "Développeur Frontend",
    company: "WebWorks Studio",
    location: "Yaoundé, Cameroun (À distance)",
    type: "Freelance",
    salary: "500k - 700k FCFA",
    posted: "Il y a 1 jour",
    description:
      "Participer à la construction d'applications web responsives, accessibles et performantes. Forte orientation UI/UX et qualité front-end requise.",
    tags: ["React", "JavaScript", "CSS", "Accessibility"],
    isNew: true,
    isUrgent: false,
    responsibilities: [
      "Construire des interfaces utilisateurs réactives en React/Next.js.",
      "Assurer l'accessibilité et l'optimisation des performances.",
      "Collaborer avec les designers pour traduire les maquettes en UI.",
      "Maintenir la qualité du code et écrire des tests frontend.",
      "Participer à l'amélioration du design system."
    ],
    qualifications: [
      "2+ années d'expérience en développement front-end.",
      "Maîtrise de React et d'un framework moderne (Next.js recommandé).",
      "Bonnes pratiques CSS, responsive et accessibilité (a11y).",
      "Expérience avec TypeScript est un plus."
    ],
    benefits: [
      "Contrat freelance flexible (télétravail possible).",
      "Paiement compétitif et travail sur projets variés.",
      "Possibilité de collaboration longue durée."
    ],
    about:
      "WebWorks Studio est une agence web spécialisée dans la création d'expériences numériques haut de gamme pour PME et startups.",
    companySize: "11-50 employés",
    sector: "Agence / Web"
  },

  {
    id: "5",
    title: "Ingénieur DevOps",
    company: "CloudSystems Ltd",
    location: "Bafoussam, Cameroun",
    type: "CDI",
    salary: "750k - 1.1M FCFA",
    posted: "Il y a 5 jours",
    description:
      "Construire et maintenir des pipelines CI/CD, automatiser les déploiements et améliorer la fiabilité de l'infrastructure cloud.",
    tags: ["Docker", "Kubernetes", "AWS", "Terraform"],
    isNew: false,
    isUrgent: false,
    responsibilities: [
      "Automatiser les déploiements et les pipelines CI/CD.",
      "Gérer l'infrastructure cloud (AWS) via Terraform.",
      "Monitorer et améliorer la résilience des services.",
      "Travailler sur la sécurité et le hardening des environnements.",
      "Assister les équipes devs pour les déploiements complexes."
    ],
    qualifications: [
      "3+ ans d'expérience en DevOps/Infrastructure.",
      "Maîtrise Docker, Kubernetes et orchestration.",
      "Expérience AWS (ou autre cloud public) et IaC (Terraform).",
      "Connaissance des outils de monitoring (Prometheus, Grafana)."
    ],
    benefits: [
      "Télétravail partiel, tickets resto, assurance santé.",
      "Budget formation et certifications cloud.",
      "Projets techniques ambitieux et environnement DevOps mature."
    ],
    about:
      "CloudSystems Ltd fournit des solutions d'infrastructure cloud aux entreprises de la région, avec un fort accent sur la sécurité et l'automatisation.",
    companySize: "201-500 employés",
    sector: "Cloud / Infrastructure"
  },

  {
    id: "6",
    title: "Responsable Marketing",
    company: "GrowthTech",
    location: "Douala, Cameroun (Hybride)",
    type: "CDI",
    salary: "550k - 850k FCFA",
    posted: "Il y a 1 semaine",
    description:
      "Piloter les campagnes marketing, gérer l'acquisition d'utilisateurs et définir la stratégie de contenu pour soutenir la croissance.",
    tags: ["Marketing Digital", "SEO", "Stratégie de contenu", "Analytics"],
    isNew: false,
    isUrgent: false,
    responsibilities: [
      "Définir et exécuter la stratégie d'acquisition (paid & organic).",
      "Superviser l'équipe marketing et les campagnes cross-channel.",
      "Analyser les performances et optimiser le funnel d'acquisition.",
      "Travailler avec produit pour améliorer la conversion.",
      "Gérer le budget marketing et les prestataires externes."
    ],
    qualifications: [
      "Expérience en marketing digital (3+ ans) avec KPI démontrables.",
      "Maîtrise SEO, publicité en ligne et outils analytics.",
      "Capacité à manager une petite équipe et à piloter projets."
    ],
    benefits: [
      "Télétravail hybride, formation, primes selon objectifs.",
      "Participation aux décisions produit et marketing.",
      "Environnement orienté croissance."
    ],
    about:
      "GrowthTech aide les entreprises à scaler via des stratégies marketing data-driven. Nous privilégions l'expérimentation rapide et l'optimisation continue.",
    companySize: "51-200 employés",
    sector: "Marketing / Growth"
  },

  {
    id: "7",
    title: "Développeur Mobile",
    company: "AppMasters",
    location: "Yaoundé, Cameroun (À distance)",
    type: "CDI",
    salary: "650k - 950k FCFA",
    posted: "Il y a 4 jours",
    description:
      "Développer des applications mobiles performantes pour iOS et Android, avec une attention particulière à l'expérience utilisateur et à la performance.",
    tags: ["React Native", "iOS", "Android", "Mobile"],
    isNew: false,
    isUrgent: false,
    responsibilities: [
      "Développer et maintenir des applications mobiles en React Native ou natif.",
      "Optimiser l'expérience utilisateur et les performances applicatives.",
      "Collaborer avec l'équipe backend pour intégrer les APIs.",
      "Assurer la qualité via tests et intégration continue."
    ],
    qualifications: [
      "Expérience en développement mobile (2+ ans).",
      "Maîtrise de React Native ou des stacks iOS/Android natifs.",
      "Compréhension des contraintes mobiles (offline, perf, batterie)."
    ],
    benefits: [
      "Télétravail flexible, contrat CDI, assurance santé.",
      "Possibilités d'évolution et projets internationaux."
    ],
    about:
      "AppMasters est une équipe dédiée à la création d'applications mobiles innovantes pour clients locaux et internationaux.",
    companySize: "11-50 employés",
    sector: "Mobile / Software"
  },

  {
    id: "8",
    title: "Chargé de Recherche UX",
    company: "UserFirst Design",
    location: "Douala, Cameroun",
    type: "CDD",
    salary: "500k - 750k FCFA",
    posted: "Il y a 6 jours",
    description:
      "Conduire des études utilisateurs, analyser des données qualitatives/quantitatives et fournir des recommandations produits actionnables.",
    tags: ["Recherche utilisateur", "Qualitatif", "Quantitatif", "Tests d'utilisabilité"],
    isNew: false,
    isUrgent: false,
    responsibilities: [
      "Planifier et conduire des sessions de recherche (entretiens, tests).",
      "Analyser et synthétiser les résultats pour l'équipe produit.",
      "Définir des recommandations basées sur les insights utilisateurs.",
      "Travailler avec designers et PM pour intégrer les conclusions."
    ],
    qualifications: [
      "Expérience en recherche UX (2+ ans).",
      "Compétences en méthodologies qualitatives et quantitatives.",
      "Excellentes capacités de communication et de synthèse."
    ],
    benefits: [
      "CDD avec perspective d'embauche, tickets resto, environnement stimulant.",
      "Accès aux outils de recherche et budget formation."
    ],
    about:
      "UserFirst Design aide les entreprises à construire des produits centrés utilisateur grâce à une recherche rigoureuse et des prototypes rapides.",
    companySize: "11-50 employés",
    sector: "UX / Recherche"
  },

  {
    id: "9",
    title: "Chef de Projet IT",
    company: "Digital Solutions CM",
    location: "Yaoundé, Cameroun",
    type: "CDI",
    salary: "700k - 1M FCFA",
    posted: "Il y a 2 jours",
    description:
      "Piloter des projets IT de bout en bout, coordonner les équipes techniques et garantir le respect des délais et budgets.",
    tags: ["Gestion de projet", "Agile", "Scrum", "Leadership"],
    isNew: true,
    isUrgent: false,
    responsibilities: [
      "Planification et gestion du périmètre projet.",
      "Coordination des équipes techniques et stakeholders.",
      "Suivi budgetaire et gestion des risques.",
      "Animation des cérémonies Agile (Scrum/Kanban)."
    ],
    qualifications: [
      "Expérience avérée en gestion de projet IT (3+ ans).",
      "Certification Scrum/Prince2 souhaitée.",
      "Capacité à communiquer avec des interlocuteurs techniques et non-techniques."
    ],
    benefits: [
      "Package attractif, télétravail partiel, formation continue.",
      "Rôle transverse avec visibilité stratégique."
    ],
    about:
      "Digital Solutions CM est un intégrateur IT proposant des solutions sur mesure pour le marché local et régional.",
    companySize: "51-200 employés",
    sector: "Services IT"
  },

  {
    id: "10",
    title: "Comptable Senior",
    company: "Finance Plus",
    location: "Douala, Cameroun",
    type: "CDI",
    salary: "450k - 700k FCFA",
    posted: "Il y a 3 jours",
    description:
      "Superviser la comptabilité générale, produire les états financiers et assurer la conformité aux normes locales (OHADA).",
    tags: ["Comptabilité", "OHADA", "Excel", "SAP"],
    isNew: false,
    isUrgent: false,
    responsibilities: [
      "Superviser la comptabilité générale et les clôtures mensuelles.",
      "Préparer rapports financiers et analyses de variance.",
      "Assurer conformité fiscale et réglementaire.",
      "Travailler avec l'audit externe et assurer la tenue des comptes."
    ],
    qualifications: [
      "Diplôme en comptabilité/finance.",
      "Expérience de 4+ ans en comptabilité d'entreprise.",
      "Maîtrise Excel avancée, connaissance d'un ERP (SAP, Sage)."
    ],
    benefits: [
      "Contrat CDI, mutuelle, plan d'évolution interne.",
      "Environnement stable et équipes expérimentées."
    ],
    about:
      "Finance Plus accompagne la croissance financière d'entreprises locales avec des services comptables et conseils financiers.",
    companySize: "51-200 employés",
    sector: "Finance / Comptabilité"
  },

  {
    id: "11",
    title: "Gestionnaire des Ressources Humaines",
    company: "HR Solutions Cameroun",
    location: "Yaoundé, Cameroun",
    type: "CDI",
    salary: "600k - 850k FCFA",
    posted: "Il y a 2 jours",
    description:
      "Gérer le cycle complet RH : recrutement, onboarding, formation, relations sociales et politiques internes.",
    tags: ["RH", "Recrutement", "Formation", "Gestion des talents"],
    isNew: true,
    isUrgent: false,
    responsibilities: [
      "Piloter le recrutement et le processus d'onboarding.",
      "Mettre en place des plans de formation et développement des compétences.",
      "Assurer conformité légale et relations sociales.",
      "Développer la marque employeur et stratégies de rétention."
    ],
    qualifications: [
      "Diplôme en gestion des ressources humaines ou expérience équivalente.",
      "Expérience en recrutement et gestion RH (3+ ans).",
      "Bonne maîtrise des aspects légaux du travail local."
    ],
    benefits: [
      "Assurance santé, plan de formation continu, environnement dynamique.",
      "Avantages sociaux et package compétitif."
    ],
    about:
      "HR Solutions Cameroun propose des solutions RH externalisées et accompagne les organisations dans leur transformation RH.",
    companySize: "51-200 employés",
    sector: "Ressources Humaines"
  },

  {
    id: "12",
    title: "Spécialiste Cybersécurité",
    company: "SecureNet Africa",
    location: "Douala, Cameroun (Hybride)",
    type: "CDI",
    salary: "900k - 1.3M FCFA",
    posted: "Il y a 1 jour",
    description:
      "Protéger les systèmes d'information contre les menaces, conduire des audits et tests d'intrusion, et mettre en place des mesures de sécurité proactives.",
    tags: ["Cybersécurité", "Pentesting", "Sécurité réseau", "CISSP"],
    isNew: true,
    isUrgent: true,
    responsibilities: [
      "Réaliser des audits de sécurité et tests d'intrusion.",
      "Mettre en place politiques de sécurité et procédures.",
      "Surveiller les incidents et conduire les investigations.",
      "Former les équipes aux bonnes pratiques de sécurité."
    ],
    qualifications: [
      "Expérience en sécurité IT (3+ ans).",
      "Connaissance outils pentesting et sécurité réseau.",
      "Certifications (CISSP, CEH) appréciées."
    ],
    benefits: [
      "Package salarial attractif, télétravail hybride, formation spécialisée.",
      "Projets variés et technologies modernes."
    ],
    about:
      "SecureNet Africa propose des solutions de cybersécurité aux organisations en Afrique, combinant services managés et conseils experts.",
    companySize: "201-500 employés",
    sector: "Sécurité / IT"
  },

  {
    id: "13",
    title: "Ingénieur Commercial",
    company: "Telecom Solutions",
    location: "Garoua, Cameroun",
    type: "CDI",
    salary: "500k - 800k FCFA",
    posted: "Il y a 5 jours",
    description:
      "Développer le portefeuille clients, présenter nos solutions et atteindre les objectifs commerciaux sur votre zone.",
    tags: ["Vente", "B2B", "Télécommunications", "Négociation"],
    isNew: false,
    isUrgent: false,
    responsibilities: [
      "Prospecter et développer un portefeuille clients B2B.",
      "Négocier des contrats commerciaux et atteindre les KPIs.",
      "Assurer le suivi clients et la satisfaction.",
      "Travailler avec l'équipe technique pour les déploiements."
    ],
    qualifications: [
      "Expérience en vente B2B, idéalement dans les télécoms.",
      "Bon réseau local et capacité de négociation.",
      "Permis de conduire requis."
    ],
    benefits: [
      "Voiture de fonction, primes commerciales, formation commerciale.",
      "Package attractif selon résultats."
    ],
    about:
      "Telecom Solutions commercialise des solutions de connectivité et services pour entreprises dans plusieurs régions.",
    companySize: "51-200 employés",
    sector: "Télécommunications"
  },

  {
    id: "14",
    title: "Analyste Financier",
    company: "Investment Group CM",
    location: "Douala, Cameroun",
    type: "CDI",
    salary: "650k - 950k FCFA",
    posted: "Il y a 3 jours",
    description:
      "Analyser les données financières, préparer prévisions et rapports pour soutenir les décisions stratégiques.",
    tags: ["Finance", "Analyse", "Excel", "Modélisation financière"],
    isNew: false,
    isUrgent: false,
    responsibilities: [
      "Construire modèles financiers et prévisions.",
      "Analyser performances et proposer recommandations.",
      "Préparer reporting et supports pour la direction.",
      "Travailler sur due diligence ou projets ponctuels."
    ],
    qualifications: [
      "Diplôme en finance, économie ou équivalent.",
      "Maîtrise Excel et outils d'analyse financière.",
      "Expérience en modélisation et reporting."
    ],
    benefits: [
      "Contrat CDI, assurance santé, primes liées aux résultats.",
      "Opportunités de carrière et évolution interne."
    ],
    about:
      "Investment Group CM accompagne investissements et stratégies financières pour des clients institutionnels et corporate.",
    companySize: "51-200 employés",
    sector: "Finance / Investissement"
  },

  {
    id: "15",
    title: "Enseignant Informatique",
    company: "Université de Yaoundé",
    location: "Yaoundé, Cameroun",
    type: "CDD",
    salary: "400k - 600k FCFA",
    posted: "Il y a 1 semaine",
    description:
      "Assurer des cours en licence/master, encadrer des projets étudiants et participer aux activités pédagogiques et de recherche.",
    tags: ["Enseignement", "Informatique", "Pédagogie", "Recherche"],
    isNew: false,
    isUrgent: false,
    responsibilities: [
      "Préparer et dispenser des cours de programmation et architecture logicielle.",
      "Encadrer des projets étudiants et mémoires.",
      "Participer aux jurys et activités pédagogiques.",
      "Contribuer à la recherche selon profil."
    ],
    qualifications: [
      "Diplôme supérieur (Master/Doctorat) en informatique.",
      "Expérience pédagogique appréciée.",
      "Bonne capacité de communication et encadrement."
    ],
    benefits: [
      "Environnement académique, congés statutaires, opportunités de recherche.",
      "Possibilités de contractualisation longue durée."
    ],
    about:
      "L'Université de Yaoundé est un établissement public majeur offrant enseignement et recherche de niveau national.",
    companySize: "1001+ employés",
    sector: "Éducation"
  },

  {
    id: "16",
    title: "Architecte Logiciel",
    company: "Enterprise Tech",
    location: "Douala, Cameroun (À distance)",
    type: "CDI",
    salary: "1M - 1.5M FCFA",
    posted: "Il y a 2 jours",
    description:
      "Définir et piloter l'architecture technique des systèmes, garantir la qualité et l'évolutivité des plateformes.",
    tags: ["Architecture", "Microservices", "Cloud", "Leadership technique"],
    isNew: true,
    isUrgent: false,
    responsibilities: [
      "Concevoir l'architecture logicielle et technique des projets.",
      "Diriger les revues d'architecture et standards techniques.",
      "Conseiller les équipes de développement et arbitrer techniquement.",
      "Participer à la roadmap technique et choix technologiques."
    ],
    qualifications: [
      "Expérience significative en architecture logicielle (5+ ans).",
      "Connaissance approfondie des microservices, cloud et patterns d'architecture.",
      "Capacité de leadership technique et prise de décision."
    ],
    benefits: [
      "Rémunération attractive, télétravail, stock-options selon seniority.",
      "Projets d'envergure et autonomie technique."
    ],
    about:
      "Enterprise Tech accompagne des grands comptes sur des projets critiques et digitalisation d'entrerpises.",
    companySize: "501-1000 employés",
    sector: "Technologie / Entreprise"
  },

  {
    id: "17",
    title: "Infirmier(ère) Diplômé(e)",
    company: "Hôpital Général de Douala",
    location: "Douala, Cameroun",
    type: "CDI",
    salary: "350k - 550k FCFA",
    posted: "Il y a 4 jours",
    description:
      "Assurer des soins de qualité aux patients, collaborer avec l'équipe médicale et garantir la sécurité des actes.",
    tags: ["Santé", "Soins infirmiers", "Médical", "Diplôme d'État"],
    isNew: false,
    isUrgent: false,
    responsibilities: [
      "Fournir des soins infirmiers adaptés et assurer l'administration des traitements.",
      "Assurer la surveillance des patients et transmissions écrites/orales.",
      "Respecter procédures d'hygiène et de sécurité.",
      "Participer aux réunions de service et formations continues."
    ],
    qualifications: [
      "Diplôme d'État d'infirmier(ère) requis.",
      "Expérience en milieu hospitalier appréciée.",
      "Sens de l'organisation et rigueur."
    ],
    benefits: [
      "Contrat CDI, mutuelle, formation continue et conditions sociales.",
      "Stabilité d'emploi dans un établissement reconnu."
    ],
    about:
      "L'Hôpital Général de Douala est un établissement public offrant une large gamme de soins et services médicaux.",
    companySize: "1001+ employés",
    sector: "Santé"
  },

  {
    id: "18",
    title: "Community Manager",
    company: "Social Media Agency CM",
    location: "Yaoundé, Cameroun (À distance)",
    type: "Freelance",
    salary: "300k - 500k FCFA",
    posted: "Il y a 1 jour",
    description:
      "Animer les réseaux sociaux, créer du contenu engageant et suivre les KPIs pour améliorer la visibilité des clients.",
    tags: ["Réseaux sociaux", "Content creation", "Community management", "Analytics"],
    isNew: true,
    isUrgent: false,
    responsibilities: [
      "Créer et programmer du contenu sur différentes plateformes.",
      "Gérer les interactions et modérer les communautés.",
      "Analyser les performances et proposer optimisations.",
      "Collaborer avec les équipes créatives et clients."
    ],
    qualifications: [
      "Expérience en community management ou marketing digital.",
      "Créativité et aisance rédactionnelle.",
      "Connaissance des outils d'analytics social media."
    ],
    benefits: [
      "Contrat freelance flexible, travail à distance possible.",
      "Projets variés et clients locaux/internationaux."
    ],
    about:
      "Social Media Agency CM accompagne marques et entreprises dans leur stratégie social media et création de contenu.",
    companySize: "11-50 employés",
    sector: "Marketing / Social Media"
  },

  {
    id: "19",
    title: "Agronome",
    company: "AgroTech Cameroun",
    location: "Bafoussam, Cameroun",
    type: "CDI",
    salary: "450k - 700k FCFA",
    posted: "Il y a 6 jours",
    description:
      "Conseiller sur les pratiques agricoles modernes, superviser projets de développement rural et optimiser rendements.",
    tags: ["Agriculture", "Agronomie", "Développement rural", "Conseil"],
    isNew: false,
    isUrgent: false,
    responsibilities: [
      "Conseiller les agriculteurs sur les bonnes pratiques culturales.",
      "Coordonner des projets de développement agricole.",
      "Réaliser des études de terrain et recommandations techniques.",
      "Former les partenaires locaux aux nouvelles méthodes."
    ],
    qualifications: [
      "Diplôme en agronomie ou expérience équivalente.",
      "Connaissance des pratiques agricoles locales et durables.",
      "Capacité à travailler en milieu rural."
    ],
    benefits: [
      "Package salarial, véhicule de service selon besoin.",
      "Projets de développement avec ONG et partenaires internationaux."
    ],
    about:
      "AgroTech Cameroun développe solutions agricoles innovantes pour améliorer productivité et durabilité.",
    companySize: "51-200 employés",
    sector: "Agriculture / Agritech"
  },

  {
    id: "20",
    title: "Juriste d'Entreprise",
    company: "Cabinet Juridique Excellence",
    location: "Yaoundé, Cameroun",
    type: "CDI",
    salary: "600k - 900k FCFA",
    posted: "Il y a 3 jours",
    description:
      "Conseiller la direction sur les sujets juridiques, rédiger et réviser les contrats, gérer les contentieux et assurer conformité réglementaire.",
    tags: ["Droit", "Contrats", "Juridique", "Corporate"],
    isNew: false,
    isUrgent: false,
    responsibilities: [
      "Rédiger et négocier des contrats commerciaux.",
      "Conseiller la direction sur les risques juridiques.",
      "Gérer les relations avec avocats externes et contentieux.",
      "Veille réglementaire et conformité."
    ],
    qualifications: [
      "Master en droit des affaires ou équivalent.",
      "Expérience en cabinet ou service juridique d'entreprise (3+ ans).",
      "Bonnes capacités de rédaction et d'analyse juridique."
    ],
    benefits: [
      "Contrat CDI, mutuelle, formation juridique continue.",
      "Possibilités d'évolution vers des fonctions de direction."
    ],
    about:
      "Cabinet Juridique Excellence offre des services juridiques aux entreprises et accompagne les dossiers complexes nationaux et internationaux.",
    companySize: "11-50 employés",
    sector: "Juridique / Conseil"
  }
];

export default jobDetails;
