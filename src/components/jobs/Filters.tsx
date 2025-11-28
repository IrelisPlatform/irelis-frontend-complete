// src/components/jobs/Filters.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, X, Filter } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export function DropdownFilters() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const filters = [
    { id: "ville", label: t.filters.ville, options: ["Yaoundé", "Douala", "Bafoussam", "Bamenda", "Garoua", "Kribi"] },
    { id: "secteur", label: t.filters.secteur, options: ["IT/Tech", "Banque/Finance", "Éducation", "Santé", "Agriculture", "Commerce"] },
    { id: "contrat", label: t.filters.contrat, options: ["CDI", "CDD", "Stage", "Freelance", "Temps partiel", "À distance"] },
    { id: "etudes", label: t.filters.etudes, options: ["BAC", "BAC+2", "Licence/BAC+3", "Master/BAC+5", "Doctorat", "Sans diplôme"] },
    { id: "experience", label: t.filters.experience, options: ["Débutant (0-1)", "Junior (1-3)", "Confirmé (3-5)", "Senior (5-10)", "Expert (10+)"] },
    { id: "langues", label: t.filters.langues, options: ["Français", "Anglais", "Bilingue Fr/En", "Autres langues"] },
    { id: "employeur", label: t.filters.employeur, options: ["Entreprise privée", "ONG", "Organisation internationale", "Fonction publique", "Startup"] },
    { id: "date", label: t.filters.date, options: ["Dernières 24h", "Derniers 7 jours", "Derniers 30 jours", "Tout"] },
    { id: "salaire", label: t.filters.salaire, options: ["< 100k", "100k - 300k", "300k - 500k", "500k - 1M", "> 1M"] },
    { id: "taille", label: t.filters.taille, options: ["1-10", "11-50", "51-200", "201-500", "500+"] },
  ];

  const toggleFilter = (filterId: string, option: string) => {
    setSelectedFilters((prev) => {
      const current = prev[filterId] || [];
      const updated = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      if (updated.length === 0) {
        const { [filterId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [filterId]: updated };
    });
  };

  const clearFilter = (filterId: string) => {
    setSelectedFilters((prev) => {
      const { [filterId]: _, ...rest } = prev;
      return rest;
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
  };

  const hasActiveFilters = Object.keys(selectedFilters).length > 0;
  const totalActiveFilters = Object.values(selectedFilters).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <motion.div 
      className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-5">
        <div className="flex items-center gap-3 mb-3">
          <Filter className="w-4 h-4 text-[#1e3a8a]" />
          <span className="text-sm text-gray-700">{t.filters.title}</span>
          {totalActiveFilters > 0 && (
            <motion.span 
              className="bg-[#1e3a8a] text-white text-xs px-2 py-0.5 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              {totalActiveFilters}
            </motion.span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {filters.map((filter, index) => {
            const activeCount = selectedFilters[filter.id]?.length || 0;
            return (
              <motion.div
                key={filter.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.02 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className={`rounded-full transition-all duration-200 ${
                          activeCount > 0
                            ? "bg-[#1e3a8a] text-white border-[#1e3a8a] hover:bg-[#1e40af] hover:text-white shadow-md"
                            : "bg-white text-gray-700 border-gray-300 hover:border-[#1e3a8a] hover:shadow-sm hover:bg-blue-50"
                        }`}
                      >
                        {filter.label}
                        {activeCount > 0 && (
                          <motion.span 
                            className="ml-1.5 bg-white text-[#1e3a8a] rounded-full px-2 py-0.5 text-xs"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {activeCount}
                          </motion.span>
                        )}
                        <motion.div
                          animate={{ rotate: 0 }}
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-4 h-4 ml-1" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 max-h-96 overflow-y-auto">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      {filter.label}
                      {activeCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearFilter(filter.id);
                          }}
                          className="h-auto p-0 text-xs text-[#1e3a8a] hover:text-[#1e40af] hover:bg-transparent"
                        >
                          {t.filters.clear}
                        </Button>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {filter.options.map((option) => (
                      <DropdownMenuCheckboxItem
                        key={option}
                        checked={selectedFilters[filter.id]?.includes(option) || false}
                        onCheckedChange={() => toggleFilter(filter.id, option)}
                        className="cursor-pointer"
                      >
                        {option}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            );
          })}

          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  onClick={clearAllFilters}
                  className="rounded-full text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 border border-transparent hover:border-red-200"
                >
                  <X className="w-4 h-4 mr-1.5" />
                  {t.filters.clearAll}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}