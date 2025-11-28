// /src/lib/i18n.ts

export type Language = 'fr' | 'en';

export const translations = {
  fr: {
    common: {
      langSwitcher: { fr: 'FR', en: 'EN' },
      close: "Fermer",
    },
    header: {
      logoAlt: "Irelis",
      toastLoggingOut: "Déconnexion en cours…",
      login: "Connexion",
      logout: "Se déconnecter",
      postJobCTA: "Recruteur/Publier une offre",
      mobileMenu: {
        title: "Menu"
      },
      nav: {
        home: "Accueil",
        support: "Accompagnement",
        blog: "Blog"
      }
    },
    footer: {
      logoAlt: "Irelis",
      description: "La plateforme de référence pour trouver un emploi au Cameroun et en Afrique centrale.",
      candidates: "Candidats",
      companies: "Entreprises",
      contact: "Contact",
      careerAdvice: "Conseils carrière",
      recruiterSpace: "Espace recruteur",
      address: "AKWA - Douala, Cameroun",
      phone: "+237 696 71 22 13",
      email: "support@irelis.cm",
      legal: "Mentions légales",
      privacy: "Confidentialité",
      cgu: "CGU",
      faq: "FAQ",
      copyright: "© 2025 Irelis. Tous droits réservés.",
      searchJob: "Rechercher un emploi",
      createCv: "Créer mon CV",
      support: "Accompagnement",
      postOffer: "Publier une offre",
      hrSolutions: "Nos solutions RH",
      pricing: "Tarifs"
    },
    auth: {
      footer: {
        terms: "Conditions d’utilisation",
        privacy: "Politique de confidentialité",
        cookies: "Cookies"
      },
      signin: {
        title: "Prêt pour la prochaine étape ?",
        subtitle: "Créez un compte ou connectez-vous.",
        consent: "En cliquant sur \"Continuer\", vous comprenez et acceptez de consentir à notre politique de confidentialité. Vous reconnaissez aussi avoir lu nos conditions d'utilisation.",
        devNote: "En développement : utilisez luqnleng5@gmail.com (ou un alias) pour recevoir l’OTP.",
        google: "Continuer avec Google",
        linkedin: "Continuer avec LinkedIn",
        or: "ou",
        emailLabel: "Adresse email",
        continue: "Continuer",
        verifying: "Vérification...",
        emailPlaceholder: "vous@exemple.com",
        invalidEmail: "Veuillez entrer une adresse email valide.",
        serverError: "Impossible de contacter le serveur.",
        unknownError: "Une erreur est survenue. Veuillez réessayer."
      },
      chooseRole: {
        title: "Votre compte est presque créé, encore une étape.",
        subtitle: "Quel type de compte vous faut-il ?",
        candidate: {
          title: "Je suis candidat",
          description: "Postuler aux offres, recevoir des alertes, gérer mon profil."
        },
        recruiter: {
          title: "Je suis recruteur",
          description: "Publier des offres et contacter des candidats."
        },
        continue: "Continuer"
      },
      otp: {
        title: "Saisissez le code",
        sentTo: (email: string) => `Un code a été envoyé à <strong>${email}</strong>.`,
        validFor: (time: string) => `Valide pendant ${time}.`,
        resend: (countdown: number) => `Renvoyer (${countdown}s)`,
        resendNow: "Renvoyer le code",
        verify: "Vérifier",
        verifying: "Vérification...",
        resendSuccess: "Nouveau code envoyé !"
      },
      error: {
        title: "Erreur d’authentification",
        oauth_failed: "La connexion avec Google a échoué. Veuillez réessayer.",
        otp_invalid: "Le code saisi est invalide ou expiré.",
        network: "Une erreur réseau est survenue. Veuillez vérifier votre connexion.",
        unknown: "Une erreur inattendue s'est produite.",
        backToLogin: "Retour à la connexion"
      },
      success: {
        connecting: "Connexion en cours..."
      }
    },
    filters: {
      title: "Filtres",
      ville: "Ville/Région",
      secteur: "Secteur",
      contrat: "Type de contrat",
      etudes: "Niveau d'études",
      experience: "Expérience",
      langues: "Langues",
      employeur: "Type d'employeur",
      date: "Date de publication",
      salaire: "Salaire (FCFA)",
      taille: "Taille entreprise",
      clear: "Effacer",
      clearAll: "Effacer tout"
    },
    pagination: {
      previous: "Précédent",
      next: "Suivant"
    },
    search: {
      title: "Trouvez votre prochaine opportunité de carrière",
      subtitle: "Des milliers d'opportunités vous attendent au Cameroun et en Afrique",
      keywordPlaceholder: "Titre du poste, mots-clés ou entreprise",
      locationPlaceholder: "Ville, région ou à distance",
      searchButton: "Rechercher",
      jobCount: (count: number) => `${count} emplois disponibles`,
      popularSearches: "Recherches populaires:",
      suggestions: ["Développeur", "Marketing", "Comptable", "Ingénieur"]
    },
    jobAlert: {
      title: "Recevez les offres qui vous correspondent",
      description: "Créez votre alerte emploi et soyez informé en temps réel des nouvelles opportunités correspondant à votre profil",
      emailPlaceholder: "Votre adresse email",
      createAlert: "Créer mon alerte"
    },
    jobCard: {},
    jobDetails: {
      description: "Description",
      responsibilities: "Responsabilités",
      qualifications: "Qualifications",
      benefits: "Avantages",
      about: "À propos de",
      sector: "Secteur :",
      companySize: "Taille :",
      apply: "Postuler",
      sending: "Envoi...",
      save: "Enregistrer",
      saved: "Enregistré",
      share: "Partager",
      new: "Nouveau",
      urgent: "Urgent"
    },
    legal: {
      about: {
        title: "À propos - Irelis",
        heading: "À propos d'Irelis",
        mission: "Notre mission : connecter talents et entreprises en Afrique francophone.",
        description: "Irelis connecte talents et entreprises en Afrique francophone. Notre mission est de ..."
      },
      faq: {
        title: "FAQ - Irelis",
        heading: "FAQ",
        items: [
          { q: "Comment postuler ?", a: "Créez un compte, consultez une offre et cliquez sur \"Postuler\"." },
          { q: "Comment publier une offre ?", a: "Les entreprises peuvent publier via l'espace recruteur." }
        ]
      },
      cgu: {
        title: "Conditions Générales d'Utilisation - Irelis",
        heading: "Conditions Générales d'Utilisation (CGU)",
        article1: "Article 1 — Objet",
        article1Content: "Les présentes conditions régissent l'accès et l'utilisation du service Irelis."
      }
    },
    page: {
      resetFilters: "Réinitialiser les filtres",
      showGroups: "Afficher les groupes",
      joinGroups: {
        title: "Rejoignez nos groupes",
        subtitle: "Soyez les premiers à consulter de nouvelles offres",
        candidates: "Candidats",
        recruiters: "Recruteurs",
        support: "Support",
        hide: "Masquer les groupes"
      },
      jobList: {
        title: "Offres d'emploi",
        subtitle: "Découvrez les meilleures opportunités pour vous"
      },
      sort: {
        relevance: "Plus pertinents",
        recent: "Plus récents",
        salaryHighToLow: "Salaire: Élevé à Faible",
        salaryLowToHigh: "Salaire: Faible à Élevé"
      },
      selectJobToViewDetails: "Sélectionnez une offre pour afficher les détails.",
      jobDetails: {
        defaultTitle: "Détails de l'offre"
      }
    }
  },
  en: {
    common: {
      langSwitcher: { fr: 'FR', en: 'EN' },
      close: "Close",
    },
    header: {
      logoAlt: "Irelis",
      toastLoggingOut: "Logging out…",
      login: "Sign in",
      logout: "Log out",
      postJobCTA: "Recruiter / Post a job",
      mobileMenu: {
        title: "Menu"
      },
      nav: {
        home: "Home",
        support: "Support",
        blog: "Blog"
      }
    },
    footer: {
      logoAlt: "Irelis",
      description: "The leading platform to find a job in Cameroon and Central Africa.",
      candidates: "Candidates",
      companies: "Companies",
      contact: "Contact",
      careerAdvice: "Career advice",
      recruiterSpace: "Recruiter space",
      address: "AKWA - Douala, Cameroon",
      phone: "+237 696 71 22 13",
      email: "support@irelis.cm",
      legal: "Legal notices",
      privacy: "Privacy",
      cgu: "Terms of use",
      faq: "FAQ",
      copyright: "© 2025 Irelis. All rights reserved.",
      searchJob: "Search for a job",
      createCv: "Create my CV",
      support: "Support",
      postOffer: "Post a job",
      hrSolutions: "HR solutions",
      pricing: "Pricing"
    },
    auth: {
      footer: {
        terms: "Terms of use",
        privacy: "Privacy policy",
        cookies: "Cookies"
      },
      signin: {
        title: "Ready for the next step?",
        subtitle: "Create an account or sign in.",
        consent: "By clicking \"Continue\", you agree to our privacy policy and acknowledge that you have read our terms of use.",
        devNote: "In development: use luqnleng5@gmail.com (or alias) to receive OTP.",
        google: "Continue with Google",
        linkedin: "Continue with LinkedIn",
        or: "or",
        emailLabel: "Email address",
        continue: "Continue",
        verifying: "Verifying...",
        emailPlaceholder: "you@example.com",
        invalidEmail: "Please enter a valid email address.",
        serverError: "Unable to reach the server.",
        unknownError: "An error occurred. Please try again."
      },
      chooseRole: {
        title: "Your account is almost ready — one more step.",
        subtitle: "What type of account do you need?",
        candidate: {
          title: "I'm a candidate",
          description: "Apply to jobs, receive alerts, manage my profile."
        },
        recruiter: {
          title: "I'm a recruiter",
          description: "Post job offers and contact candidates."
        },
        continue: "Continue"
      },
      otp: {
        title: "Enter the code",
        sentTo: (email: string) => `A code has been sent to <strong>${email}</strong>.`,
        validFor: (time: string) => `Valid for ${time}.`,
        resend: (countdown: number) => `Resend (${countdown}s)`,
        resendNow: "Resend code",
        verify: "Verify",
        verifying: "Verifying...",
        resendSuccess: "New code sent!"
      },
      error: {
        title: "Authentication error",
        oauth_failed: "Google sign-in failed. Please try again.",
        otp_invalid: "The code is invalid or expired.",
        network: "A network error occurred. Please check your connection.",
        unknown: "An unexpected error occurred.",
        backToLogin: "Back to login"
      },
      success: {
        connecting: "Connecting..."
      }
    },
    filters: {
      title: "Filters",
      ville: "City/Region",
      secteur: "Sector",
      contrat: "Contract type",
      etudes: "Education level",
      experience: "Experience",
      langues: "Languages",
      employeur: "Employer type",
      date: "Date posted",
      salaire: "Salary (XAF)",
      taille: "Company size",
      clear: "Clear",
      clearAll: "Clear all"
    },
    pagination: {
      previous: "Previous",
      next: "Next"
    },
    search: {
      title: "Find your next career opportunity",
      subtitle: "Thousands of opportunities await you in Cameroon and Africa",
      keywordPlaceholder: "Job title, keywords, or company",
      locationPlaceholder: "City, region, or remote",
      searchButton: "Search",
      jobCount: (count: number) => `${count} jobs available`,
      popularSearches: "Popular searches:",
      suggestions: ["Developer", "Marketing", "Accountant", "Engineer"]
    },
    jobAlert: {
      title: "Get job offers that match you",
      description: "Create a job alert and get real-time notifications about new opportunities matching your profile",
      emailPlaceholder: "Your email address",
      createAlert: "Create my alert"
    },
    jobCard: {},
    jobDetails: {
      description: "Description",
      responsibilities: "Responsibilities",
      qualifications: "Qualifications",
      benefits: "Benefits",
      about: "About",
      sector: "Sector:",
      companySize: "Size:",
      apply: "Apply",
      sending: "Sending...",
      save: "Save",
      saved: "Saved",
      share: "Share",
      new: "New",
      urgent: "Urgent"
    },
    legal: {
      about: {
        title: "About - Irelis",
        heading: "About Irelis",
        mission: "Our mission: connecting talent and companies across French-speaking Africa.",
        description: "Irelis connects talent and companies across French-speaking Africa. Our mission is to..."
      },
      faq: {
        title: "FAQ - Irelis",
        heading: "FAQ",
        items: [
          { q: "How to apply?", a: "Create an account, view a job, and click \"Apply\"." },
          { q: "How to post a job?", a: "Companies can post via the recruiter space." }
        ]
      },
      cgu: {
        title: "Terms of Use - Irelis",
        heading: "Terms of Use (ToU)",
        article1: "Article 1 — Purpose",
        article1Content: "These terms govern access to and use of the Irelis service."
      }
    },
    page: {
      resetFilters: "Reset filters",
      showGroups: "Show groups",
      joinGroups: {
        title: "Join our groups",
        subtitle: "Be the first to see new job offers",
        candidates: "Candidates",
        recruiters: "Recruiters",
        support: "Support",
        hide: "Hide groups"
      },
      jobList: {
        title: "Job offers",
        subtitle: "Discover the best opportunities for you"
      },
      sort: {
        relevance: "Most relevant",
        recent: "Most recent",
        salaryHighToLow: "Salary: High to Low",
        salaryLowToHigh: "Salary: Low to High"
      },
      selectJobToViewDetails: "Select a job offer to view details.",
      jobDetails: {
        defaultTitle: "Job details"
      }
    }
  }
};

export const DEFAULT_LANG: Language = 'fr';