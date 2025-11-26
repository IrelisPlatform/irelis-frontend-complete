// /src/app/page.tsx

"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { JobSearchBar } from "@/components/jobs/SearchBar";
import { DropdownFilters } from "@/components/jobs/Filters";
import { JobCard } from "@/components/jobs/JobCard";
import JobDetails from "@/components/jobs/JobDetails";
import { JobAlert } from "@/components/jobs/JobAlert";
import { JobPagination } from "@/components/jobs/JobPagination";
import { Footer } from "@/components/Footer";
import mockJobs, { type Job } from "@/lib/mockJobs";
import jobDetails from "@/lib/mockJobDetails";
// ⚠️ useAuth non utilisé ici → supprimé

export default function Page() {
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>(mockJobs[0]?.id);

  // ✅ Utilise useMemo pour éviter les recalculs inutiles
  const selectedJob = useMemo(() => {
    if (!selectedJobId) return null;
    return jobDetails.find(j => j.id === selectedJobId) ?? null;
  }, [selectedJobId]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const jobsPerPage = 5;
  const totalPages = Math.ceil(mockJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = mockJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleOpenDetails = (id: string) => {
    setSelectedJobId(id);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Header />
      <JobSearchBar jobCount={mockJobs.length} />
      <DropdownFilters />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h2 className="text-[#1e3a8a] mb-1">Offres d'emploi</h2>
            <p className="text-gray-600 text-sm">Découvrez les meilleures opportunités pour vous</p>
          </div>
          <div className="flex gap-2 text-sm">
            <select className="px-5 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-700 hover:border-[#1e3a8a] focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 transition-all shadow-sm hover:shadow-md">
              <option>Plus pertinents</option>
              <option>Plus récents</option>
              <option>Salaire: Élevé à Faible</option>
              <option>Salaire: Faible à Élevé</option>
            </select>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
          {/* LISTE DES JOBS */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <AnimatePresence mode="wait">
              {isLoading ? (
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
                  {currentJobs.map((job, index) => (
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

          {/* DÉTAILS */}
          <div className="mt-8 lg:mt-0 lg:block lg:overflow-y-auto p-2 lg:col-span-1 border-l">
            {selectedJob ? (
              <JobDetails job={selectedJob} />
            ) : (
              <div className="p-6 text-muted-foreground">
                Sélectionnez une offre pour afficher les détails.
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

      <Footer />
    </div>
  );
}