// /src/components/Header.tsx

"use client";

import { useAuth } from "@/context/AuthContext"; // ✅ Import corrigé
import { Bell, User, Menu } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import logo from "@/../public/icons/logo.png";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function Header() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const notifications = 0; // Tu activeras plus tard

  // Évite le clignotement au chargement initial
  if (loading) {
    return (
      <header className="border-b border-gray-100 bg-white/95 backdrop-blur-md sticky top-0 z-50 h-20" />
    );
  }

  return (
    <motion.header
      className="border-b border-gray-100 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">

          {/* LOGO */}
          <div className="flex items-center gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <img src={logo.src} alt="Irelis" className="h-10" />
            </motion.div>

            {/* NAVIGATION */}
            <nav className="hidden md:flex items-center gap-6">
              {[
                { name: "Accueil", href: "/" },
                { name: "Accompagnement", href: "/accompagnement" },
                { name: "Blog", href: "/blog" },
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-[#1e3a8a] transition-all relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#1e3a8a] after:transition-all"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>

          {/* RIGHT AREA */}
          <div className="flex items-center gap-4">

            {/* Notifications (masqué pour l'instant) */}
            {/* user && notifications > 0 && (
              <motion.div whileHover={{ scale: 1.08 }}>
                <Button variant="ghost" size="icon" className="relative hover:bg-blue-50">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications}
                  </span>
                </Button>
              </motion.div>
            ) */}

            {/* ➤ SI NON CONNECTÉ */}
            {!user && (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="outline"
                  className="border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white"
                  onClick={() => router.push("/auth/signin")}
                >
                  Connexion
                </Button>
              </motion.div>
            )}

            {/* ➤ SI CONNECTÉ */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                    <User className="w-5 h-5 text-gray-700" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem disabled className="text-gray-500">
                    {user.email}
                  </DropdownMenuItem>
                  {/* 🔜 À décommenter quand les espaces existeront */}
                  {/* <DropdownMenuItem onClick={() => router.push("/espace-candidat")}>
                    Espace candidat
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/espace-recruteur")}>
                    Espace recruteur
                  </DropdownMenuItem> */}
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={logout}
                  >
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* CTA Recruteur */}
            <motion.div whileHover={{ scale: 1.05 }} className="hidden md:block">
              <Button className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white shadow-md">
                Recruteur/Publier une offre
              </Button>
            </motion.div>

            {/* MENU MOBILE */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-6 h-6 text-gray-700" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[75%] sm:w-[350px] p-6">
                <SheetHeader>
                  <SheetTitle className="text-lg font-semibold text-[#1e3a8a]">
                    Menu
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 flex flex-col gap-6">
                  <Link href="/" className="text-gray-800 text-lg">Accueil</Link>
                  <Link href="/accompagnement" className="text-gray-800 text-lg">Accompagnement</Link>
                  <Link href="/blog" className="text-gray-800 text-lg">Blog</Link>

                  {!user && (
                    <Button
                      className="bg-[#1e3a8a] text-white mt-4"
                      onClick={() => router.push("/auth/signin")}
                    >
                      Connexion
                    </Button>
                  )}

                  {user && (
                    <>
                      {/* 🔜 À décommenter plus tard */}
                      {/* <Button variant="ghost" onClick={() => router.push("/espace-candidat")}>
                        Espace candidat
                      </Button>
                      <Button variant="ghost" onClick={() => router.push("/espace-recruteur")}>
                        Espace recruteur
                      </Button> */}
                      <Button variant="destructive" onClick={logout}>
                        Se déconnecter
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

          </div>

        </div>
      </div>
    </motion.header>
  );
}