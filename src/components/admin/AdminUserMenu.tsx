// src/components/admin/AdminUserMenu.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminUserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("Admin");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("adminEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/admin/login");
  };

  
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="rounded-full"
      >
        <User className="h-5 w-5" />
      </Button>
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
          <div className="p-4 border-b">
            <p className="text-sm font-medium">{email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}