// /src/components/jobs/JobDetails.tsx

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Banknote, Info, Briefcase, DollarSign, Clock, Users, Building2, Bookmark, Share2, Send, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useApplyJob } from "@/hooks/useApplyJob";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { JobDetail } from "@/lib/mockJobDetails";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext"; // ← ajout

export default function JobDetails({ job }: { job: JobDetail }) {
  const { t } = useLanguage(); // ← ajout
  const { handleApply } = useApplyJob(job.id);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const onApply = () => {
    setIsApplying(true);
    handleApply();
    setTimeout(() => setIsApplying(false), 1000);
  };

  return (
    <Card className="w-full max-w-full flex flex-col shadow-xl border-gray-100 overflow-hidden">
      <div className="w-full max-w-full overflow-x-hidden p-4 sm:p-6">
        {/* En-tête */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div 
            className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="text-lg sm:text-2xl select-none">{job.company.substring(0, 2).toUpperCase()}</span>
          </motion.div>
          
          <h2 className="text-xl sm:text-2xl mb-2 text-[#1e3a8a] break-words">{job.title}</h2>
          <p className="text-gray-600 mb-4 break-words">{job.company}</p>
          
          {/* Informations clés */}
          <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 p-3 sm:p-5 rounded-xl border border-blue-100/50 shadow-sm">
            <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
              {[
                { icon: MapPin, text: job.location },
                { icon: Briefcase, text: job.type },
                { icon: DollarSign, text: job.salary },
                { icon: Clock, text: job.posted }
              ].map((item, i) => (
                <motion.span 
                  key={i}
                  className="flex items-center gap-2 text-gray-700"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <item.icon className="w-3 h-3 sm:w-4 sm:h-4 text-[#1e3a8a]" />
                  </div>
                  <span className="flex-1 break-words">{item.text}</span>
                </motion.span>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mt-3">
            {job.isNew && (
              <Badge className="bg-blue-600 text-white text-xs sm:text-sm">
                {t.jobDetails.new}
              </Badge>
            )}
            {job.isUrgent && (
              <Badge className="bg-red-600 text-white text-xs sm:text-sm">
                {t.jobDetails.urgent}
              </Badge>
            )}
            {job.tags.map((tag, index) => (
              <Badge 
                key={tag}
                variant="secondary" 
                className="bg-blue-100 text-[#1e3a8a] text-xs sm:text-sm rounded-full px-2 sm:px-3"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Boutons */}
          <div className="flex gap-2 mt-4">
            <Button 
              size="sm" 
              className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white shadow"
              onClick={onApply}
              disabled={isApplying}
            >
              {isApplying ? t.jobDetails.sending : t.jobDetails.apply}
            </Button>
            <Button size="sm" variant="outline" className="border-[#1e3a8a]">
              <Bookmark className="w-4 h-4" />
              <span className="ml-1 text-xs">{isBookmarked ? t.jobDetails.saved : t.jobDetails.save}</span>
            </Button>
            <Button size="sm" variant="outline" className="border-[#1e3a8a]">
              <Share2 className="w-4 h-4" />
              <span className="ml-1 text-xs">{t.jobDetails.share}</span>
            </Button>
          </div>
        </motion.div>

        <Separator className="my-6" />

        {/* Contenu */}
        <motion.div className="space-y-6 text-xs sm:text-sm">
          <div>
            <h3 className="mb-3 text-[#1e3a8a] flex items-center gap-2">
              <Info className="w-4 h-4" /> {t.jobDetails.description}
            </h3>
            <p className="text-gray-600 leading-relaxed break-words">
              {job.description}
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            <AccordionItem value="responsibilities">
              <AccordionTrigger className="text-[#1e3a8a] text-sm sm:text-base">
                {t.jobDetails.responsibilities}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc ml-4 space-y-1 text-gray-600">
                  {job.responsibilities.map((r, idx) => (
                    <li key={idx} className="break-words">{r}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="qualifications">
              <AccordionTrigger className="text-[#1e3a8a] text-sm sm:text-base">
                {t.jobDetails.qualifications}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc ml-4 space-y-1 text-gray-600">
                  {job.qualifications.map((q, idx) => (
                    <li key={idx} className="break-words">{q}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="benefits">
              <AccordionTrigger className="text-[#1e3a8a] text-sm sm:text-base">
                {t.jobDetails.benefits}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc ml-4 space-y-1 text-gray-600">
                  {job.benefits.map((b, idx) => (
                    <li key={idx} className="break-words">{b}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator />

          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 sm:p-4 rounded-xl">
            <h3 className="mb-3 text-[#1e3a8a] flex items-center gap-2">
              <Users className="w-4 h-4" /> {t.jobDetails.about} {job.company}
            </h3>
            <p className="text-gray-600 mb-3 break-words">{job.about}</p>
            <div className="grid grid-cols-2 gap-2 text-gray-600 text-xs sm:text-sm">
              <p><span className="font-medium">{t.jobDetails.sector}</span> {job.sector}</p>
              <p><span className="font-medium">{t.jobDetails.companySize}</span> {job.companySize}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Card>
  );
}