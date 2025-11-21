# 🚀 Irelis Frontend  
Plateforme d’offres d’emploi premium — Développée avec Next.js, TailwindCSS, ShadCN UI et une architecture moderne.

---

## ✨ Aperçu du projet

Irelis est une plateforme de recrutement moderne pensée pour offrir :  
- Une **expérience utilisateur fluide**  
- Un système d’authentification complet (Google, OTP, check-mail, choix de rôle)  
- Une interface claire pour consulter les offres d’emploi  
- Une architecture évolutive compatible API REST & Microservices

---

## 🛠️ Technologies principales

### **Frontend**
- ⚡ Next.js 16 (App Router + Turbopack)
- 🎨 Tailwind CSS
- 🧩 ShadCN UI
- ✨ Framer Motion
- 🔐 Auth: Google OAuth + OTP
- 📦 Zustand / Context API

### **Outils Dev**
- TypeScript
- ESLint
- PostCSS
- Next Fonts (`geist`)
- CI/CD GitHub Actions (déploiement automatique)

---

## 📚 Structure du projet

src/
├─ app/
│ ├─ auth/
│ ├─ jobs/
│ ├─ api/
│ └─ layout.tsx
│
├─ components/
│ ├─ ui/
│ ├─ jobs/
│ ├─ auth/
│ └─ Header & Footer
│
├─ context/
├─ lib/
├─ utils.ts
public/
├─ icons/
├─ logo.svg



---

## 🔐 Authentification

Le frontend s’appuie sur les endpoints du backend :  

- `POST /auth/otp/check-mail`  
- `POST /auth/otp/send`  
- `POST /auth/otp/verify`

Fonctionnalités incluses :

- ✔ Google OAuth  
- ✔ Vérification email existant / création  
- ✔ Sélection du rôle (Candidat / Recruteur)  
- ✔ Connexion via OTP  

---

## 🚀 Lancer le projet en local

```sh
npm install
npm run dev

