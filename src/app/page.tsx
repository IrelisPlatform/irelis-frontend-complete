// /src/app/page.tsx

"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { JobSearchBar } from "@/components/jobs/SearchBar";
import { DropdownFilters } from "@/components/jobs/Filters";
import { JobCard } from "@/components/jobs/JobCard";
import JobDetails from "@/components/jobs/JobDetails";
import { JobAlert } from "@/components/jobs/JobAlert";
import { JobPagination } from "@/components/jobs/JobPagination";
import { Footer } from "@/components/Footer";
import { type Job } from "@/lib/mockJobs";
import { useJobDetails } from "@/hooks/useJobDetails";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { useMediaQuery } from "react-responsive";
import { X, MessageCircle, Send, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import usePublishedJobs from '@/hooks/usePublishedJobs';
import { toast } from "sonner";

export default function Page() {
  const { t } = useLanguage(); // ← Accès aux traductions

  const [selectedJobId, setSelectedJobId] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const { jobs: allJobs, totalPages, totalElements, loading: jobsLoading, error: jobsError } = usePublishedJobs(currentPage - 1, 5);

  // 🔍 Débogage : afficher les dates reçues du backend
  useEffect(() => {
    if (!jobsLoading && allJobs.length > 0) {
      console.log("✅ Offres reçues du backend (dates) :", 
        allJobs.map(job => ({
          id: job.id,
          title: job.title,
          publishedAt: job.publishedAt,
          expirationDate: job.expirationDate,
        }))
      );
    }
  }, [allJobs, jobsLoading]);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 1023 });

  const selectedJob = allJobs.find(job => job.id === selectedJobId);

  useEffect(() => {
    if (allJobs && allJobs.length > 0 && !selectedJobId) {
      setSelectedJobId(allJobs[0].id);
    }
  }, [allJobs, selectedJobId]);


  const [showGroups, setShowGroups] = useState(false);

  const getRandomWhatsAppLink = () => {
    const links = [
      "https://chat.whatsapp.com/DM7BvYe8pnbFfo9sohX1En?mode=wwt",
      "https://chat.whatsapp.com/FqcS0nhbgObGXVqs9O5oVg?mode=wwt",
      "https://chat.whatsapp.com/KAJQnGcmcOaERfE72oldrm?mode=wwt"
    ].map(link => link.trim());
    const randomIndex = Math.floor(Math.random() * links.length);
    return links[randomIndex];
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGroups(true);
    }, 3000); // 3 secondes
    return () => clearTimeout(timer);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetails = (id: string) => {
    setSelectedJobId(id);
    if (isMobile) {
      setIsSheetOpen(true);
    }
  };

  const resetFilters = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Header />
      <JobSearchBar jobCount={totalElements} />
      <DropdownFilters />

      {/* ✅ BOUTON "Réinitialiser les filtres" */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mt-4 flex justify-end">
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          <RefreshCw className="w-4 h-4 mr-1" />
          {t.page.resetFilters}
        </Button>
      </div>

      {/* ✅ BLOC "Rejoignez nos groupes" - visible par défaut */}
      {showGroups && (
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mt-8">
          <div className="bg-[#1e3a8a] text-white p-4 rounded-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold">{t.page.joinGroups.title}</h3>
                <p className="text-xs mt-1">{t.page.joinGroups.subtitle}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="bg-green-400 hover:bg-green-500 text-white border-none"
                  onClick={() => {
                    const link = getRandomWhatsAppLink();
                    window.open(link, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>

                {/* Telegram */}
                <Button
                  variant="outline"
                  className="flex-1 bg-blue-400 hover:bg-blue-500 text-white border-none"
                  asChild
                >
                  <a
                    href="https://t.me/irelisemplois"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Telegram
                  </a>
                </Button>
              </div>
              <button
                onClick={() => setShowGroups(false)}
                className="text-white hover:text-gray-200 ml-2"
                aria-label={t.page.joinGroups.hide}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Bouton "Afficher les groupes" si masqué */}
      {!showGroups && (
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGroups(true)}
            className="bg-[#1e3a8a] text-white hover:bg-[#1e40af]"
          >
            {t.page.showGroups}
          </Button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h2 className="text-[#1e3a8a] mb-1">{t.page.jobList.title}</h2>
            <p className="text-gray-600 text-sm">{t.page.jobList.subtitle}</p>
          </div>
          <div className="flex gap-2 text-sm">
            <select className="px-5 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-700 hover:border-[#1e3a8a] focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 transition-all shadow-sm hover:shadow-md">
              <option>{t.page.sort.relevance}</option>
              <option>{t.page.sort.recent}</option>
              <option>{t.page.sort.salaryHighToLow}</option>
              <option>{t.page.sort.salaryLowToHigh}</option>
            </select>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
          {/* LISTE DES JOBS */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <AnimatePresence mode="wait">
              {jobsError ? (
                <div className="text-center text-red-600 p-6">{jobsError}</div>
              ) : jobsLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                      <div className="flex gap-5">
                        <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {allJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.05,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      onClick={() => handleOpenDetails(job.id)}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedJobId === job.id ? "scale-[1.02]" : "opacity-90"
                      }`}
                    >
                      <JobCard job={job} onClick={() => handleOpenDetails(job.id)} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* DÉTAILS — desktop only */}
          <div className="hidden lg:block mt-8 lg:mt-0 lg:overflow-y-auto p-2 lg:col-span-1 border-l">
            {selectedJob ? (
              <JobDetails job={selectedJob} />
            ) : (
              <div className="p-6 text-muted-foreground">
                {t.page.selectJobToViewDetails}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <JobPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <JobAlert />
        </motion.div>
      </div>

      {/* MODAL MOBILE — SAFE */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="bottom"
          className="w-full max-w-full max-h-[90vh] overflow-y-auto p-6"
          style={{ maxWidth: '100vw' }}
        >
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold truncate">
              {selectedJob?.title || t.page.jobDetails.defaultTitle}
            </SheetTitle>
          </SheetHeader>

          <div
            className="mt-4 w-full overflow-x-hidden"
            style={{
              overflowWrap: 'break-word',
              wordWrap: 'break-word',
              hyphens: 'auto',
              fontSize: '0.875rem',
              lineHeight: 1.6,
            }}
          >
            <div className="w-full overflow-hidden">
              {selectedJob ? <JobDetails job={selectedJob} /> : <p>{t.page.selectJobToViewDetails}</p>}
            </div>
          </div>

          <SheetClose className="mt-6 w-full">
            {t.common.close}
          </SheetClose>
        </SheetContent>
      </Sheet>

      <Footer />
    </div>
  );
}