// src/components/jobs/SearchBar.tsx

import { Search, MapPin, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from 'react';

interface JobSearchBarProps {
  jobCount: number;
  onSearch?: (title: string, location: string) => void;
}

export function JobSearchBar({ jobCount }: JobSearchBarProps) {
  const { t } = useLanguage();
  const suggestions = t.search.suggestions;
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  return (
    <div className="bg-gradient-to-b from-white via-blue-50/30 to-white py-20 relative overflow-hidden">
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#1e3a8a]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <motion.h1 
          className="text-[#1e3a8a] text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t.search.title}
        </motion.h1>

        <motion.p 
          className="text-gray-600 text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {t.search.subtitle}
        </motion.p>

        <motion.div 
          className="bg-white rounded-2xl shadow-2xl p-4 flex flex-col md:flex-row gap-3 border border-gray-100 hover:shadow-3xl transition-all duration-500 relative overflow-hidden group"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ y: -2 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/50 to-transparent opacity-0 group-hover:opacity-100"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.8 }}
          />

          <div className="flex items-center flex-1 px-4 border-r border-gray-200 relative">
            <Search className="w-5 h-5 text-[#1e3a8a] mr-3 flex-shrink-0 z-10" />
            <Input
              placeholder={t.search.keywordPlaceholder}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 bg-transparent relative z-10"
            />
          </div>

          <div className="flex items-center flex-1 px-4 relative">
            <MapPin className="w-5 h-5 text-[#1e3a8a] mr-3 flex-shrink-0 z-10" />
            <Input
              placeholder={t.search.locationPlaceholder}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 bg-transparent relative z-10"
            />
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="relative z-10"
          >
            <Button 
              onClick={() => onSearch(keyword, location)}
              size="lg" 
              className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-10 shadow-md hover:shadow-xl transition-all duration-200 relative overflow-hidden group/btn"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">{t.search.searchButton}</span>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex items-center justify-center gap-3 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md border border-gray-100">
            <motion.div 
              className="h-2 w-2 rounded-full bg-[#1e3a8a]"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [1, 0.6, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <TrendingUp className="w-4 h-4 text-[#1e3a8a]" />
            <p className="text-gray-700">
              <span className="text-[#1e3a8a]">{jobCount}</span> {t.search.jobCount(jobCount).replace(`${jobCount}`, '').trim()}
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="flex flex-wrap items-center justify-center gap-2 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <span className="text-sm text-gray-500">{t.search.popularSearches}</span>
          {suggestions.map((tag, index) => (
            <motion.button
              key={tag}
              className="px-4 py-1.5 bg-white hover:bg-[#1e3a8a] text-gray-700 hover:text-white rounded-full text-sm border border-gray-200 hover:border-[#1e3a8a] transition-all duration-200 shadow-sm hover:shadow-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {tag}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}