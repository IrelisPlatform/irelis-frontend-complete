// /src/components/jobs/JobCard.tsx

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, MapPin, Briefcase, DollarSign, Clock, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { formatRelativeExpirationDate } from "@/utils/date";

import { PublishedJob } from "@/types/job";

interface JobCardProps {
  job: PublishedJob;
  onClick: () => void;
  isSelected?: boolean;
}

export function JobCard({ job, onClick, isSelected }: JobCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const location = job.location || "Localisation non précisée";
  const contractType = job.type || "Type non précisé";
  const tags = job.tags || [];
  const company = job.company || "Entreprise confidentielle";
  const companyInitials = company.substring(0, 2).toUpperCase();

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  return (
    <Card 
      className={`p-6 transition-all duration-300 cursor-pointer border group relative overflow-hidden ${ 
        isSelected 
          ? 'ring-2 ring-[#1e3a8a] shadow-xl bg-gradient-to-br from-blue-50/50 to-white border-[#1e3a8a]' 
          : 'hover:border-[#1e3a8a]/40 hover:shadow-xl hover:-translate-y-1 bg-white'
      }`} 
      onClick={onClick}
    >
      {/* Gradient overlay pour l'état sélectionné */}
      {isSelected && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a]/5 to-transparent pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Badges de statut */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        {job.isFeatured && (
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg flex items-center gap-1 px-2 py-1">
              <Sparkles className="w-3 h-3" />
              Nouveau
            </Badge>
          </motion.div>
        )}

        {job.isUrgent && (
          <motion.div
            initial={{ scale: 0, rotate: 10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.1 }}
          >
            <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-lg flex items-center gap-1 px-2 py-1 animate-pulse">
              <Zap className="w-3 h-3" />
              Urgent
            </Badge>
          </motion.div>
        )}
      </div>

      <div className="flex gap-5 relative">
        {/* Logo de l'entreprise avec effet hover */}
        <motion.div 
          className="w-16 h-16 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:shadow-2xl transition-all duration-300"
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="select-none">{companyInitials}</span>
        </motion.div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3 pr-24">
            <div className="flex-1">
              <h3 className="text-[#1e3a8a] group-hover:text-[#1e40af] transition-colors mb-1.5 pr-2">
                {job.title}
              </h3>
              <p className="text-gray-600">{company}</p>
            </div>
          </div>
          
          {/* Informations de l'emploi avec icônes */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-gray-600 mb-4">
            <motion.span 
              className="flex items-center gap-2"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <MapPin className="w-4 h-4 text-[#1e3a8a]/70 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </motion.span>
            <motion.span 
              className="flex items-center gap-2"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <Briefcase className="w-4 h-4 text-[#1e3a8a]/70 flex-shrink-0" />
              {contractType}
            </motion.span>
            <motion.span 
              className="flex items-center gap-2"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <DollarSign className="w-4 h-4 text-[#1e3a8a]/70 flex-shrink-0" />
              <span className="truncate">{job.salary}</span>
            </motion.span>
            <motion.span 
              className="flex items-center gap-2"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <Clock className="w-4 h-4 text-[#1e3a8a]/70 flex-shrink-0" />
              {job.expirationDate
                ? formatRelativeExpirationDate(job.expirationDate)
                : 'Date d’expiration non précisée'}
            </motion.span>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed text-sm">
            {job.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="bg-blue-50 text-[#1e3a8a] hover:bg-blue-100 transition-all duration-200 border border-blue-100 hover:border-blue-200"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge 
                variant="secondary" 
                className="bg-gray-100 text-gray-600 border border-gray-200"
              >
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Bouton Bookmark avec animation */}
          <div className="flex items-center justify-end pt-2 border-t border-gray-100">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                className={`transition-all duration-200 ${
                  isBookmarked 
                    ? 'text-[#1e3a8a] bg-blue-50' 
                    : 'text-gray-400 hover:text-[#1e3a8a] hover:bg-blue-50'
                }`}
                onClick={handleBookmark}
              >
                <motion.div
                  animate={isBookmarked ? { 
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 10, 0]
                  } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Bookmark 
                    className={`w-4 h-4 mr-1.5 ${isBookmarked ? 'fill-current' : ''}`} 
                  />
                </motion.div>
                <span className="text-xs">{isBookmarked ? 'Enregistré' : 'Enregistrer'}</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </Card>
  );
}