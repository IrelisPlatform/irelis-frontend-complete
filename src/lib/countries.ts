// src/lib/countries.ts
export const COUNTRIES_WITH_CITIES = {
  "Cameroun": ["Douala", "Yaoundé", "Bafoussam", "Garoua", "Limbe", "Kribi", "Autre"],
  "Côte D'Ivoire": ["Abidjan", "Bouaké", "Daloa", "San-Pédro", "Autre"],
  "Gabon": ["Libreville", "Port-Gentil", "Franceville", "Autre"],
  "France": ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Autre"],
  "États-Unis": ["New York", "Los Angeles", "Chicago", "Miami", "San Francisco", "Autre"],
  "Allemagne": ["Berlin", "Munich", "Hambourg", "Francfort", "Autre"],
  "Espagne": ["Madrid", "Barcelone", "Valence", "Séville", "Autre"],
  "Italie": ["Rome", "Milan", "Florence", "Naples", "Autre"],
  "Royaume-Uni": ["Londres", "Manchester", "Birmingham", "Liverpool", "Autre"],
  "Canada": ["Montréal", "Toronto", "Vancouver", "Ottawa", "Autre"],
  "Australie": ["Sydney", "Melbourne", "Brisbane", "Perth", "Autre"],
  "Inde": ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Autre"],
  "Chine": ["Pékin", "Shanghai", "Guangzhou", "Shenzhen", "Autre"],
  "Japon": ["Tokyo", "Osaka", "Kyoto", "Nagoya", "Autre"],
  "Brésil": ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Autre"],
  "Afrique du Sud": ["Le Cap", "Johannesburg", "Durban", "Pretoria", "Autre"],
  "Mexique": ["Mexico", "Guadalajara", "Monterrey", "Cancún", "Autre"],
  "Russie": ["Moscou", "Saint-Pétersbourg", "Novossibirsk", "Ekaterinbourg", "Autre"],
  "Turquie": ["Istanbul", "Ankara", "Izmir", "Antalya", "Autre"],
  "Arabie Saoudite": ["Riyad", "La Mecque", " Médine", "Djeddah", "Autre"],
};

export const COUNTRIES = Object.keys(COUNTRIES_WITH_CITIES);

export type Country = keyof typeof COUNTRIES_WITH_CITIES;