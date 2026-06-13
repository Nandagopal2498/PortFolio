import React, { useState, useEffect } from 'react';
import { 
  Github, Linkedin, Twitter, ArrowRight, ExternalLink, Mail, Phone, MapPin, 
  Sparkles, Code, Briefcase, GraduationCap, Send, CheckCircle, FileText, ChevronRight, X,
  ShoppingCart, Database, Star, MessageSquare, Zap, MessageCircle, Heart, Users, Download,
  Target, Lightbulb, Copy, Check, Instagram, Sun, Moon, Menu
} from 'lucide-react';
import { PortfolioData, Project, ContactMessage, Education } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const WhatsAppIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const TypingEffect = ({ 
  words, 
  speed = 100, 
  eraseSpeed = 60, 
  pauseTime = 2000 
}: { 
  words: string[]; 
  speed?: number; 
  eraseSpeed?: number; 
  pauseTime?: number; 
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: any;
    const word = words[currentWordIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(word.substring(0, currentText.length - 1));
      }, eraseSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText(word.substring(0, currentText.length + 1));
      }, speed);
    }

    if (!isDeleting && currentText === word) {
      timer = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, speed, eraseSpeed, pauseTime]);

  return (
    <span className="font-mono border-r-2 border-neutral-400 dark:border-neutral-500 pr-1 select-none">
      {currentText}
    </span>
  );
};

interface VisitorViewProps {
  portfolioData: PortfolioData;
  onSendContactMessage: (msg: Omit<ContactMessage, 'id' | 'timestamp' | 'read'>) => void;
  onToggleTheme?: () => void;
}

export default function VisitorView({ portfolioData, onSendContactMessage, onToggleTheme }: VisitorViewProps) {
  const { profile, projects, education = [], skills, settings } = portfolioData;
  
  // Dynamic Unsplash images for education cards
  const fallbackEduImages = [
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80"
  ];

  const getAcademicTags = (degree: string): string[] => {
    const tags: string[] = [];
    const lower = degree.toLowerCase();
    if (lower.includes('computer') || lower.includes('software') || lower.includes('systems') || lower.includes('engineering')) {
      tags.push('Informatics', 'Software Systems', 'Algorithms');
    } else if (lower.includes('design') || lower.includes('interaction') || lower.includes('hci') || lower.includes('creative')) {
      tags.push('Human-Computer Interaction', 'UX Design', 'Design Tokens');
    } else {
      tags.push('Academic Research', 'Technical Core', 'Methodologies');
    }
    return tags;
  };
  
  // States for filtering & interactions
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>('All');
  const [activeEducationModal, setActiveEducationModal] = useState<Education | null>(null);
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [proposalCopied, setProposalCopied] = useState(false);
  
  // Close mobile menu on Escape key for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);
  
  // Contact Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const currentThemeHex = settings.accentColor || '#3b82f6';

  const [activeSection, setActiveSection] = useState<string>('about');

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['about', 'education', 'skills', 'projects', 'contact'];
      let currentSection = 'about';
      let minDistance = Infinity;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Offset top checking for precise viewport entry representation
          if (rect.top <= 140 && rect.bottom >= 120) {
            currentSection = id;
            break;
          }
          const dist = Math.abs(rect.top - 120);
          if (dist < minDistance) {
            minDistance = dist;
            currentSection = id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const timer = setTimeout(handleScroll, 120);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // Adjust for physical stickiness bar height offset
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) return;

    onSendContactMessage({
      name: formName,
      email: formEmail,
      subject: formSubject || "General Collaboration Proposal",
      message: formMessage
    });

    setFormSuccess(true);
    // Reset Form fields
    setFormName('');
    setFormEmail('');
    setFormSubject('');
    setFormMessage('');

    setTimeout(() => {
      setFormSuccess(false);
    }, 4000);
  };

  const filteredSkills = skills.filter(
    sk => selectedSkillCategory === 'All' || sk.category === selectedSkillCategory
  );

  return (
    <div className="space-y-24 font-sans pb-24 text-neutral-900 dark:text-neutral-100">
      
      {/* 1. STUNNING GLASSMORPHIC TOP NAVIGATION */}
      <nav id="header-navbar" className="sticky top-0 z-30 w-full border-b border-gray-200/40 dark:border-neutral-800/40 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span 
              className="h-8 w-8 rounded-full flex items-center justify-center text-white font-extrabold font-display text-xs shadow-xs"
              style={{ backgroundColor: currentThemeHex }}
            >
              DN
            </span>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base font-display tracking-tight hover:opacity-80 transition-opacity">
                {profile.name}
              </span>
              <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/15 px-2.5 py-0.5 text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider select-none">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                Open to Opportunities
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-2xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            {['about', 'education', 'skills', 'projects', 'contact'].map((sec) => (
              <a
                key={sec}
                href={`#${sec}`}
                onClick={(e) => handleScrollToSection(e, sec)}
                className={`transition-all duration-300 relative py-1 px-0.5 tracking-widest uppercase ${
                  activeSection === sec
                    ? 'font-extrabold'
                    : 'text-neutral-500 dark:text-neutral-400 font-bold hover:text-neutral-950 dark:hover:text-white'
                }`}
                style={activeSection === sec ? { color: currentThemeHex } : undefined}
              >
                {sec}
                {activeSection === sec && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: currentThemeHex }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 bg-neutral-250 dark:bg-neutral-800 focus:outline-none"
                style={settings.themeMode === 'dark' ? { backgroundColor: currentThemeHex } : undefined}
                aria-label="Toggle dark mode"
                title={`Switch to ${settings.themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                <span
                  className={`pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md transition duration-300 ease-in-out ${
                    settings.themeMode === 'dark' ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`}
                >
                  {settings.themeMode === 'dark' ? (
                    <Moon className="h-3 w-3 text-indigo-600 fill-indigo-100" />
                  ) : (
                    <Sun className="h-3.5 w-3.5 text-amber-500 fill-amber-100" />
                  )}
                </span>
              </button>
            )}

            {/* Mobile-first Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-350 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all focus:outline-none cursor-pointer"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-controls="mobile-navigation-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 transition-transform duration-200 rotate-95" />
              ) : (
                <Menu className="h-5 w-5 transition-transform duration-200" />
              )}
            </button>

            <a 
              href="#contact" 
              onClick={(e) => handleScrollToSection(e, 'contact')}
              style={{ backgroundColor: currentThemeHex }}
              className="hidden sm:flex rounded-full px-5 py-2 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all items-center gap-1.5 cursor-pointer font-display"
            >
              <span>Collaborate</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Responsive Mobile Overlay Dropdown Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-navigation-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-gray-200/40 dark:border-neutral-800/40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl"
            >
              <div className="flex flex-col px-6 py-6 space-y-4">
                {['about', 'education', 'skills', 'projects', 'contact'].map((sec, idx) => (
                  <motion.a
                    key={sec}
                    initial={{ x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.03, duration: 0.2 }}
                    href={`#${sec}`}
                    onClick={(e) => {
                      handleScrollToSection(e, sec);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between text-xs font-bold uppercase tracking-widest py-3 px-4.5 rounded-2xl transition-all duration-200 ${
                      activeSection === sec
                        ? 'bg-neutral-50 dark:bg-neutral-900/60 font-extrabold shadow-2xs'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40'
                    }`}
                    style={activeSection === sec ? { color: currentThemeHex } : undefined}
                  >
                    <span>{sec}</span>
                    <ChevronRight 
                      className="h-4 w-4 opacity-40 transition-transform group-hover:translate-x-0.5" 
                      style={activeSection === sec ? { color: currentThemeHex, opacity: 1 } : undefined} 
                    />
                  </motion.a>
                ))}

                {/* Inline CTA in Mobile Drawer */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="pt-4 border-t border-neutral-100 dark:border-neutral-800"
                >
                  <a 
                    href="#contact" 
                    onClick={(e) => {
                      handleScrollToSection(e, 'contact');
                      setIsMobileMenuOpen(false);
                    }}
                    style={{ backgroundColor: currentThemeHex }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md hover:brightness-110 active:scale-95 transition-all font-display"
                  >
                    <span>Collaborate</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. DYNAMIC LAYOUT SWITCHER */}

      {/* A. BENTO LAYOUT ARCHITECTURE */}
      {settings.layoutStyle === 'bento' && (
        <div className="mx-auto max-w-7xl px-6 space-y-8">
          {/* Top Row: Hero Card & Interactive Profile Avatar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Primary Bento Hero card */}
            <div className="lg:col-span-2 border border-neutral-200/50 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md rounded-[32px] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group min-h-[400px]">
              {/* Radial Accent Bloom */}
              <div 
                className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 w-80 h-80 rounded-full blur-3xl opacity-15 dark:opacity-20 pointer-events-none transition-transform duration-500 group-hover:scale-110" 
                style={{ backgroundColor: currentThemeHex }}
              ></div>
              
              <div className="space-y-6 z-10 max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 dark:border-emerald-500/35 px-3 py-1 text-2xs font-mono text-emerald-600 dark:text-emerald-400 font-bold tracking-wider uppercase select-none">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Open to Opportunities
                </div>
                
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5.5xl font-black text-neutral-950 dark:text-white tracking-tight font-display leading-[1.1]">
                    Hello, I'm <span className="relative inline-block"><span className="relative z-10" style={{ color: currentThemeHex }}>{profile.name}</span></span>
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-extrabold tracking-wider text-neutral-600 dark:text-neutral-350 font-mono uppercase">
                    <span>Specializing in</span>
                    <span className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-850 text-neutral-800 dark:text-neutral-200 border border-neutral-200/50 dark:border-neutral-700/50">
                      <TypingEffect words={["Full-Stack Development", "Machine Learning Models", "AI App Architecture", "Data Science Systems"]} />
                    </span>
                  </div>
                </div>
                
                <p className="text-xs sm:text-sm font-bold tracking-widest text-neutral-500 dark:text-neutral-400 font-mono uppercase bg-neutral-100 dark:bg-neutral-800/80 px-3 py-1.5 rounded-lg w-fit">
                  {profile.title}
                </p>
                
                <p className="text-neutral-600 dark:text-neutral-300 text-sm md:text-base leading-relaxed font-sans font-medium">
                  {profile.bio}
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-gray-200/50 dark:border-neutral-800/50 mt-8 z-10">
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="#contact"
                    style={{ backgroundColor: currentThemeHex }}
                    className="inline-flex items-center justify-center gap-2 text-white text-xs font-bold px-6 py-3.5 rounded-2xl shadow-lg hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all font-display cursor-pointer"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Get In Touch</span>
                  </a>
                  
                  <button
                    onClick={() => {
                      const nameStr = profile.name.replace(/\s+/g, '_');
                      const resumeText = `RESUME - ${profile.name.toUpperCase()}\n\nTitle: ${profile.title}\nEmail: ${profile.email}\nPhone: ${profile.phone}\nLocation: ${profile.location}\nGitHub: ${profile.githubUrl}\nLinkedIn: ${profile.linkedinUrl}\n\nBIO:\n${profile.bio}\n\nLONG BIO:\n${profile.longBio || ''}`;
                      const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', `${nameStr}_Resume.txt`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold px-6 py-3.5 rounded-2xl hover:scale-[1.02] transition-colors font-display cursor-pointer"
                  >
                    <Download className="h-4 w-4 text-neutral-500" />
                    <span>Download Resume</span>
                  </button>
                </div>

                {/* Inline Social Quick Links */}
                <div className="flex items-center gap-2">
                  {profile.githubUrl && (
                    <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-550 dark:text-neutral-350 hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-colors duration-200" aria-label="GitHub">
                      <Github className="h-4.5 w-4.5" />
                    </a>
                  )}
                  {profile.linkedinUrl && (
                    <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-550 dark:text-neutral-350 hover:bg-[#0077b5] hover:text-white transition-colors duration-200" aria-label="LinkedIn">
                      <Linkedin className="h-4.5 w-4.5" />
                    </a>
                  )}
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-550 dark:text-neutral-350 hover:bg-orange-500 hover:text-white transition-colors duration-200" aria-label="Email">
                      <Mail className="h-4.5 w-4.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Micro-Contact & Branding Card */}
            <div className="border border-neutral-200/50 dark:border-neutral-800 bg-white/45 dark:bg-neutral-900/45 backdrop-blur-md rounded-[32px] p-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-6">
                <div className="relative h-28 w-28 mx-auto rounded-3xl overflow-hidden border border-neutral-250 dark:border-neutral-750">
                  <img 
                    src={profile.avatarUrl} 
                    alt={profile.name} 
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                <div className="text-center space-y-1">
                  <p className="text-lg font-extrabold font-display leading-tight">{profile.name}</p>
                  <p className="text-2xs font-mono font-bold uppercase tracking-wider text-neutral-400">Software Engineer</p>
                </div>

                <div className="space-y-3 font-mono text-xs pt-4 border-t border-neutral-200/50 dark:border-neutral-800/80">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Based In:</span>
                    <span className="font-bold flex items-center gap-1"><MapPin className="h-3 w-3 text-red-400" /> {profile.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Email:</span>
                    <a href={`mailto:${profile.email}`} className="font-bold truncate max-w-[150px] hover:underline hover:opacity-85">{profile.email}</a>
                  </div>
                </div>
              </div>

              {/* Connected Social Hub */}
              <div className="flex justify-center gap-4 pt-6 border-t border-neutral-200/50 dark:border-neutral-800/50 mt-6 md:mt-0">
                {profile.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-550 dark:text-neutral-350 hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-colors duration-200" aria-label="GitHub">
                    <Github className="h-4.5 w-4.5" />
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-550 dark:text-neutral-350 hover:bg-[#0077b5] hover:text-white transition-colors duration-200" aria-label="LinkedIn">
                    <Linkedin className="h-4.5 w-4.5" />
                  </a>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-550 dark:text-neutral-350 hover:bg-orange-500 hover:text-white transition-colors duration-200" aria-label="Email">
                    <Mail className="h-4.5 w-4.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Redesigned About Section (Modern Card Layout) */}
          <div id="about" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Professional Summary Card */}
            <div className="lg:col-span-2 border border-neutral-200/50 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md rounded-[32px] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-4">
                <span className="text-2xs font-extrabold uppercase tracking-widest text-neutral-400 font-mono">Overview</span>
                <h2 className="text-3xl font-black text-neutral-950 dark:text-white tracking-tight font-display leading-[1.1]">
                  Professional Narrative
                </h2>
                <p className="text-neutral-650 dark:text-neutral-300 text-sm sm:text-base leading-relaxed font-sans font-medium whitespace-pre-line">
                  {profile.longBio}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-neutral-200/40 dark:border-neutral-850/40 mt-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 font-mono uppercase tracking-wider">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-500" /> Modular Design
                  </div>
                  <p className="text-2xs text-neutral-450 dark:text-neutral-400 font-medium">Focusing on clean, highly componentized React codebases.</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 font-mono uppercase tracking-wider">
                    <Code className="h-3.5 w-3.5 text-blue-500" /> Modern Stack
                  </div>
                  <p className="text-2xs text-neutral-450 dark:text-neutral-400 font-medium">Utilizing TypeScript, Python, and scalable web APIs.</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 font-mono uppercase tracking-wider">
                    <Database className="h-3.5 w-3.5 text-amber-500" /> Data-Driven
                  </div>
                  <p className="text-2xs text-neutral-450 dark:text-neutral-400 font-medium">Applying Machine Learning and analytics workflows.</p>
                </div>
              </div>
            </div>

            {/* Statistics and Highlights Card */}
            <div className="border border-neutral-200/50 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md rounded-[32px] p-8 flex flex-col justify-between gap-6">
              <div>
                <span className="text-2xs font-extrabold uppercase tracking-widest text-neutral-400 font-mono">Metrics</span>
                <h3 className="text-lg font-extrabold font-display leading-tight mt-1.5 mb-4 text-neutral-950 dark:text-white">Performance Metrics</h3>
                
                <div className="grid grid-cols-2 gap-4 font-display">
                  <div className="p-4 rounded-2xl bg-neutral-100/50 dark:bg-neutral-800/30 border border-neutral-200/20 dark:border-neutral-800/50 text-center">
                    <div className="text-3.5xl font-black" style={{ color: currentThemeHex }}>{projects.length}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mt-1">Projects Built</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-100/50 dark:bg-neutral-800/30 border border-neutral-200/20 dark:border-neutral-800/50 text-center">
                    <div className="text-3.5xl font-black" style={{ color: currentThemeHex }}>{skills.length}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mt-1">Core Skills</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-100/50 dark:bg-neutral-800/30 border border-neutral-200/20 dark:border-neutral-800/50 text-center">
                    <div className="text-3.5xl font-black" style={{ color: currentThemeHex }}>2024</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mt-1">B.Tech Start</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-100/50 dark:bg-neutral-800/30 border border-neutral-200/20 dark:border-neutral-800/50 text-center">
                    <div className="text-3.5xl font-black" style={{ color: currentThemeHex }}>9+</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mt-1">Focus Areas</div>
                  </div>
                </div>
              </div>

              {/* Attestation Quick Info */}
              <div className="pt-4 border-t border-neutral-200/40 dark:border-neutral-800/40 flex items-center justify-between text-2xs font-mono text-neutral-400">
                <span>Verification State</span>
                <span className="font-bold text-emerald-500 dark:text-emerald-450 uppercase flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active Portfolio
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* B. MINIMAL CENTERED LAYOUT */}
      {settings.layoutStyle === 'minimal' && (
        <div className="mx-auto max-w-3xl px-6 space-y-16">
          {/* Centered Typography Hero */}
          <div className="space-y-6 pt-12 text-center">
            <h1 className="text-5xl sm:text-7xl font-black text-neutral-950 dark:text-white tracking-tight font-display leading-[1.05]">
              {profile.name}
            </h1>
            
            <div className="flex flex-wrap justify-center items-center gap-2 text-xs sm:text-sm font-extrabold tracking-wider text-neutral-600 dark:text-neutral-300 font-mono uppercase bg-neutral-100 dark:bg-neutral-850 px-4 py-2 rounded-full w-fit mx-auto border border-neutral-200/50 dark:border-neutral-700/50">
              <span>Specializing in</span>
              <span style={{ color: currentThemeHex }}>
                <TypingEffect words={["Full-Stack Development", "Machine Learning Models", "AI App Architecture", "Data Science Systems"]} />
              </span>
            </div>

            <p className="text-xs sm:text-sm font-extrabold tracking-widest uppercase font-mono text-neutral-550 dark:text-neutral-450">
              {profile.title}
            </p>
            
            <p className="text-neutral-600 dark:text-neutral-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-sans font-medium">
              {profile.bio}
            </p>
            
            {/* Action Bar */}
            <div className="flex flex-wrap justify-center items-center gap-3 pt-6">
              <a
                href="#contact"
                style={{ backgroundColor: currentThemeHex }}
                className="inline-flex items-center justify-center gap-2 text-white text-xs font-bold px-6 py-3.5 rounded-2xl shadow-lg hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all font-display cursor-pointer"
              >
                <Mail className="h-4 w-4" />
                <span>Get In Touch</span>
              </a>
              
              <button
                onClick={() => {
                  const nameStr = profile.name.replace(/\s+/g, '_');
                  const resumeText = `RESUME - ${profile.name.toUpperCase()}\n\nTitle: ${profile.title}\nEmail: ${profile.email}\nPhone: ${profile.phone}\nLocation: ${profile.location}\nGitHub: ${profile.githubUrl}\nLinkedIn: ${profile.linkedinUrl}\n\nBIO:\n${profile.bio}\n\nLONG BIO:\n${profile.longBio || ''}`;
                  const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', `${nameStr}_Resume.txt`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-750 dark:text-neutral-300 text-xs font-bold px-6 py-3.5 rounded-2xl hover:scale-[1.02] transition-colors font-display cursor-pointer"
              >
                <Download className="h-4 w-4 text-neutral-500" />
                <span>Download CV</span>
              </button>
            </div>

            {/* Floating Social Rows */}
            <div className="flex items-center justify-center gap-3 pt-8">
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-550 dark:text-neutral-350 hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 hover:scale-105 transition-all duration-200" aria-label="GitHub">
                  <Github className="h-4.5 w-4.5" />
                </a>
              )}
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-550 dark:text-neutral-350 hover:bg-[#0077b5] hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 hover:scale-105 transition-all duration-200" aria-label="LinkedIn">
                  <Linkedin className="h-4.5 w-4.5" />
                </a>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-550 dark:text-neutral-350 hover:bg-orange-500 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 hover:scale-105 transition-all duration-200" aria-label="Email">
                  <Mail className="h-4.5 w-4.5" />
                </a>
              )}
            </div>
          </div>

          {/* Minimal About Card Layout */}
          <div id="about" className="space-y-8 pt-10 border-t border-neutral-200/50 dark:border-neutral-800">
            <div className="border border-neutral-200/50 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md rounded-3xl p-8 space-y-6 text-center max-w-3xl mx-auto">
              <span className="text-2xs font-extrabold uppercase tracking-widest text-neutral-400 font-mono">Biographical Narrative</span>
              
              <p className="text-sm md:text-base text-neutral-650 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto font-sans font-medium whitespace-pre-line">
                {profile.longBio}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-neutral-200/40 dark:border-neutral-850/60 font-display">
                <div>
                  <div className="text-2xl font-black" style={{ color: currentThemeHex }}>{projects.length}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mt-0.5">Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-black" style={{ color: currentThemeHex }}>{skills.length}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mt-0.5">Skills</div>
                </div>
                <div>
                  <div className="text-2xl font-black" style={{ color: currentThemeHex }}>2024</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mt-0.5">B.Tech Year</div>
                </div>
                <div>
                  <div className="text-2xl font-black" style={{ color: currentThemeHex }}>9+</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mt-0.5">Study Focus</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* C. EDITORIAL SPLIT LAYOUT */}
      {settings.layoutStyle === 'editorial' && (
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
          
          {/* Left Column (Sticky Bio Sidebar Card) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-6">
            <div className="border border-neutral-200/50 dark:border-neutral-800 rounded-[32px] p-6 bg-white dark:bg-neutral-900/60 backdrop-blur-md relative overflow-hidden">
              <div className="relative h-24 w-24 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.name} 
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="mt-6 space-y-3">
                <h1 className="text-3xl font-black tracking-tight font-display">{profile.name}</h1>
                <div className="text-[11px] font-extrabold uppercase tracking-wider font-mono text-neutral-600 dark:text-neutral-350">
                  <span>I'm a </span>
                  <span style={{ color: currentThemeHex }}>
                    <TypingEffect words={["Full-Stack Developer", "Machine Learning Student", "AI Solutions Builder"]} />
                  </span>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider font-mono bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded w-fit text-neutral-500 dark:text-neutral-400" style={{ color: currentThemeHex }}>{profile.title}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-450 leading-relaxed font-sans font-medium">{profile.bio}</p>
              </div>

              {/* social cluster */}
              <div className="flex gap-4 mt-6 border-t border-neutral-200/50 dark:border-neutral-800/40 pt-4">
                {profile.githubUrl && <a href={profile.githubUrl} className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors"><Github className="h-4.5 w-4.5" /></a>}
                {profile.linkedinUrl && <a href={profile.linkedinUrl} className="text-neutral-400 hover:text-blue-500 transition-colors"><Linkedin className="h-4.5 w-4.5" /></a>}
                {profile.email && <a href={`mailto:${profile.email}`} className="text-neutral-400 hover:text-orange-500 transition-colors"><Mail className="h-4.5 w-4.5" /></a>}
              </div>

              {/* Action Buttons in Left Panel */}
              <div className="flex flex-col gap-2.5 mt-6 w-full">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 bg-[#007a64] hover:bg-[#006250] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xs transition-colors cursor-pointer w-full text-center font-display"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Get In Touch</span>
                </a>
                
                <button
                  onClick={() => {
                    const nameStr = profile.name.replace(/\s+/g, '_');
                    const resumeText = `RESUME - ${profile.name.toUpperCase()}\n\nTitle: ${profile.title}\nEmail: ${profile.email}\nPhone: ${profile.phone}\nLocation: ${profile.location}\nGitHub: ${profile.githubUrl}\nLinkedIn: ${profile.linkedinUrl}\n\nBIO:\n${profile.bio}\n\nLONG BIO:\n${profile.longBio || ''}`;
                    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${nameStr}_Resume.txt`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-750 text-neutral-750 dark:text-neutral-250 text-xs font-bold px-4 py-3 rounded-xl shadow-xs transition-colors cursor-pointer w-full font-display"
                >
                  <Download className="h-4 w-4" />
                  <span>Download CV</span>
                </button>
              </div>
            </div>
            
            {/* Quick Metadata Info */}
            <div className="rounded-[24px] border border-neutral-200/50 dark:border-neutral-800/80 p-5 space-y-3 bg-white dark:bg-neutral-900/40 backdrop-blur-xs font-mono text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex justify-between items-center">
                <span>Location</span>
                <span className="font-bold text-neutral-850 dark:text-neutral-300 flex items-center gap-1"><MapPin className="h-3 w-3" /> {profile.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Email</span>
                <a href={`mailto:${profile.email}`} className="font-bold text-neutral-850 dark:text-neutral-300 truncate max-w-[170px] hover:underline">{profile.email}</a>
              </div>
            </div>
          </div>

          {/* Right Column Content */}
          <div id="about" className="lg:col-span-8 space-y-8">
            <div className="border border-neutral-200/50 dark:border-neutral-800 rounded-[32px] p-8 md:p-10 bg-white dark:bg-neutral-900/30 shadow-xs space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-450 dark:text-neutral-300 font-bold">In-Depth Overview</span>
                <h2 className="text-3xl font-bold font-display mt-2 pb-4 border-b border-neutral-100 dark:border-neutral-800">Biographical Narrative</h2>
              </div>
              <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans font-medium whitespace-pre-line">
                {profile.longBio}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-neutral-200/40 dark:border-neutral-800/40 font-display">
                <div>
                  <div className="text-2xl font-black" style={{ color: currentThemeHex }}>{projects.length}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mt-0.5">Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-black" style={{ color: currentThemeHex }}>{skills.length}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mt-0.5">Skills</div>
                </div>
                <div>
                  <div className="text-2xl font-black" style={{ color: currentThemeHex }}>2024</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mt-0.5">B.Tech Year</div>
                </div>
                <div>
                  <div className="text-2xl font-black" style={{ color: currentThemeHex }}>9+</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mt-0.5">Study Focus</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 4. ACADEMIC SHOWCASE (EDUCATION) */}
      <div id="education" className="mx-auto max-w-7xl px-6 py-12 scroll-mt-10">
        <div className="flex flex-col items-center text-center space-y-2 mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 rounded-full px-3 py-1 text-2xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
            Academics
          </div>
          <h2 className="text-3.5xl md:text-4.5xl font-black text-neutral-900 dark:text-white font-display tracking-tight flex items-center justify-center gap-2.5">
            <GraduationCap className="h-8 w-8 text-neutral-600 dark:text-neutral-300" style={{ color: currentThemeHex }} />
            Education & Academy
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base font-sans max-w-2xl leading-relaxed">
            Structuring foundational engineering concepts, algorithm analysis, and modern AI development.
          </p>
        </div>

        {/* Education grid list */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {education.map((edu, idx) => {
            const bulletPoints = edu.details 
              ? edu.details.split('\n').map(p => p.replace(/^[•\s*-]+/, '').trim()).filter(Boolean)
              : [];

            return (
              <motion.div
                layoutId={`edu-container-${edu.id}`}
                onClick={() => setActiveEducationModal(edu)}
                key={edu.id}
                className="group w-full bg-white dark:bg-neutral-900/40 border-2 border-neutral-250/20 dark:border-neutral-800/40 rounded-[32px] hover:border-neutral-300 dark:hover:border-neutral-700/80 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
              >
                {/* Header block with solid header or accent highlight */}
                <div className="bg-[#0b1e1b] dark:bg-neutral-950 px-8 py-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                      <GraduationCap className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xl font-display leading-tight">
                        {edu.degree}
                      </h3>
                      <p className="text-emerald-400/80 text-xs mt-1 font-medium font-mono uppercase tracking-wider">
                        CSE • DATA SCIENCE & MACHINE LEARNING
                      </p>
                    </div>
                  </div>
                  {edu.gpa && (
                    <span className="self-start sm:self-center bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold px-3.5 py-1 rounded-full whitespace-nowrap">
                      {edu.gpa}
                    </span>
                  )}
                </div>

                {/* Body details inside card */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8 bg-white/40 dark:bg-neutral-900/20 backdrop-blur-md">
                  <div className="md:col-span-5 space-y-6">
                    <div>
                      <h4 className="text-2xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">Institution</h4>
                      <p className="text-sm font-black text-neutral-950 dark:text-neutral-200 uppercase tracking-tight leading-snug font-display">{edu.institution}</p>
                    </div>

                    <div>
                      <h4 className="text-2xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">Tethered Duration</h4>
                      <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400 font-mono">{edu.startDate} – {edu.endDate}</p>
                    </div>
                  </div>

                  <div className="md:col-span-7 border-t border-neutral-200/50 dark:border-neutral-800 pt-6 md:pt-0 md:border-t-0 md:border-l md:border-neutral-200/50 dark:md:border-neutral-800/80 md:pl-8">
                    <h4 className="text-2xs font-bold text-neutral-400 uppercase tracking-widest mb-3.5 font-mono">Key Training focus areas</h4>
                    <div className="space-y-2">
                      {bulletPoints.length > 0 ? (
                        bulletPoints.map((point, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-200 leading-relaxed font-medium">
                            <span className="text-emerald-500 font-extrabold select-none">•</span>
                            <span className="font-sans">{point}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-neutral-400 italic">No specialization points added.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 5. INTERACTIVE TECHNICAL EXPERTISE (SKILLS METRICS) */}
      <div id="skills" className="mx-auto max-w-7xl px-6 py-12 scroll-mt-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-200 dark:border-neutral-800 pb-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 rounded-full px-3 py-1 text-2xs font-mono text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mb-2.5">
              Capabilities
            </div>
            <h2 className="text-3.5xl font-black tracking-tight font-display flex items-center gap-2.5 text-neutral-950 dark:text-white">
              <Database className="h-8 w-8 text-neutral-600 dark:text-neutral-300" style={{ color: currentThemeHex }} />
              Technical Stack & Expertise
            </h2>
          </div>

          {/* Elegant Filter chips */}
          <div className="flex flex-wrap gap-1.5 mt-6 sm:mt-0 overflow-x-auto">
            {['All', ...Array.from(new Set(skills.map(s => s.category))).sort()].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedSkillCategory(cat)}
                style={{
                  backgroundColor: selectedSkillCategory === cat ? currentThemeHex : undefined,
                  borderColor: selectedSkillCategory === cat ? 'transparent' : undefined,
                  color: selectedSkillCategory === cat ? '#ffffff' : undefined
                }}
                className={`rounded-full border px-4 py-1.5 text-2xs font-bold cursor-pointer transition-all duration-200 uppercase tracking-wider font-mono ${
                  selectedSkillCategory === cat 
                    ? 'shadow-md' 
                    : 'bg-white dark:bg-neutral-900 border-neutral-250 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills progress meters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((sk) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.15 }}
                key={sk.id}
                className="border border-neutral-200/50 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900/40 p-5 shadow-xs flex flex-col justify-between min-h-[110px] cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm font-display tracking-tight text-neutral-950 dark:text-white">{sk.name}</span>
                  <span className="text-[9px] font-mono font-bold uppercase text-neutral-500 dark:text-neutral-300 tracking-wider bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded border border-neutral-200/50 dark:border-neutral-700/50">{sk.category}</span>
                </div>

                <div className="space-y-1.5 mt-4">
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-300 font-mono font-bold">
                    <span>PROFICIENCY</span>
                    <span>{sk.level}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${sk.level}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{ backgroundColor: currentThemeHex }}
                      className="h-full rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Interactive Supplemental Tool shelf */}
        <div className="mt-14 flex justify-center w-full">
          <div className="w-full max-w-sm bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md border-2 border-emerald-500/10 dark:border-emerald-500/20 rounded-[32px] p-8 shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-3.5 mb-8">
              <Database className="h-8 w-8 text-[#00674f]" />
              <h3 className="text-3xl font-bold text-[#00674f] dark:text-[#34d399] font-display">Tools</h3>
            </div>
            
            <div className="flex flex-col gap-6 pl-1">
              {[
                "Node.js", "React.js", "Flask", "REST APIs", "Generative AI", "Git", "GitHub"
              ].map((name) => (
                <div 
                  key={name}
                  className="text-2xl font-medium text-neutral-800 dark:text-neutral-200 hover:text-[#00674f] dark:hover:text-[#34d399] transition-colors duration-150 tracking-tight"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. PROJECTS GALLERY (GLASS DETAILED VIEW) */}
      <div id="projects" className="mx-auto max-w-7xl px-6 py-12 scroll-mt-10">
        <div className="border-b border-neutral-200 dark:border-neutral-800/80 pb-6 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 rounded-full px-3 py-1 text-2xs font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider mb-2.5">
              Portfolio
            </div>
            <h2 className="text-3.5xl font-black tracking-tight font-display flex items-center gap-2.5 text-neutral-950 dark:text-white">
              <Code className="h-8 w-8 text-neutral-600 dark:text-neutral-300" style={{ color: currentThemeHex }} />
              Featured Projects Showcase
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-300 font-medium max-w-md">Click any project to expand interactive metrics, custom abstracts, and source repositories.</p>
        </div>

        {/* Projects card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <motion.div
              layoutId={`proj-container-${p.id}`}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => setActiveProjectModal(p)}
              key={p.id}
              className="group border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-950 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-150 dark:border-neutral-850">
                <img 
                  src={p.imageUrl} 
                  alt={p.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {p.featured && (
                  <span className="absolute left-3.5 top-3.5 bg-neutral-950 border border-neutral-800 rounded-full text-[9px] font-mono font-bold text-white px-2.5 py-1 shadow-sm flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" /> UNIQUE WORK
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <h3 className="font-extrabold text-lg text-neutral-950 dark:text-white font-display group-hover:opacity-85 transition-opacity line-clamp-1 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-300 text-xs sm:text-sm font-semibold leading-relaxed line-clamp-3">
                    {p.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 pt-3 border-t border-neutral-100 dark:border-neutral-900">
                  {p.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="bg-neutral-50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-350 border border-neutral-200 dark:border-neutral-800 rounded-md text-[10px] px-2 py-0.5 font-mono cursor-default hover:text-emerald-500 dark:hover:text-emerald-400 font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 7. SOFT SKILLS METRICS */}
      <div className="bg-neutral-50 dark:bg-neutral-900/20 py-20 border-t border-b border-neutral-200/50 dark:border-neutral-800/50 my-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center text-center space-y-2.5 mb-14">
            <div className="inline-flex items-center gap-2 bg-pink-500/10 dark:bg-pink-500/20 border border-pink-500/20 rounded-full px-3 py-1 text-2xs font-mono text-pink-650 dark:text-pink-400 font-bold uppercase tracking-wider">
              Synergies
            </div>
            <h2 className="text-3.5xl md:text-4.5xl font-black text-neutral-900 dark:text-white font-display tracking-tight">
              Personal Strengths & Values
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base font-sans max-w-2xl leading-relaxed">
              Essential professional attributes driving collaborative milestones and technical growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            {/* Quick Learner */}
            <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-850/40 rounded-3xl transition-all duration-300 hover:shadow-lg">
              <div className="bg-emerald-500/10 p-4 rounded-full mb-5 text-emerald-500 border border-emerald-500/20">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-base text-neutral-900 dark:text-neutral-100 font-display mb-1.5">Strong Learning Agility</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm font-semibold leading-relaxed">
                Adaptable to evolving technologies, methodologies, and framework lifecycles.
              </p>
            </div>

            {/* Effective Communicator */}
            <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-850/40 rounded-3xl transition-all duration-300 hover:shadow-lg">
              <div className="bg-blue-500/10 p-4 rounded-full mb-5 text-blue-500 border border-blue-500/20">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-base text-neutral-900 dark:text-neutral-100 font-display mb-1.5">Effective Communicator</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm font-semibold leading-relaxed">
                Translates engineering concepts into accessible terms for cross-functional stakeholders.
              </p>
            </div>

            {/* Enthusiastic */}
            <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-850/40 rounded-3xl transition-all duration-300 hover:shadow-lg">
              <div className="bg-pink-500/10 p-4 rounded-full mb-5 text-pink-500 border border-pink-500/20">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-base text-neutral-900 dark:text-neutral-100 font-display mb-1.5">Intellectual Curiosity</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm font-semibold leading-relaxed">
                Driven by continuous skill compounding, research, and technical iteration.
              </p>
            </div>

            {/* Collaborative */}
            <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-850/40 rounded-3xl transition-all duration-300 hover:shadow-lg">
              <div className="bg-amber-500/10 p-4 rounded-full mb-5 text-amber-500 border border-amber-500/20">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-base text-neutral-900 dark:text-neutral-100 font-display mb-1.5">Highly Collaborative</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm font-semibold leading-relaxed">
                Thrives in joint team environments, code reviews, and remote development workflows.
              </p>
            </div>
          </div>

          {/* Languages Section */}
          <div className="max-w-md mx-auto bg-white dark:bg-neutral-950 border border-neutral-250/50 dark:border-neutral-800 rounded-[24px] p-6 text-center shadow-xs">
            <h4 className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100 font-display mb-4 uppercase tracking-wider">Languages Profile</h4>
            <div className="flex justify-center items-center gap-10">
              <div className="flex flex-col items-center space-y-1">
                <span className="bg-[#0b1e1b] dark:bg-neutral-900 text-emerald-400 text-xs font-mono font-bold px-3.5 py-1.5 rounded-lg border border-emerald-500/20">
                  English
                </span>
                <span className="text-neutral-550 dark:text-neutral-400 text-xs font-semibold">Fluent</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <span className="bg-[#0b1e1b] dark:bg-neutral-900 text-emerald-400 text-xs font-mono font-bold px-3.5 py-1.5 rounded-lg border border-emerald-500/20">
                  Telugu
                </span>
                <span className="text-neutral-550 dark:text-neutral-400 text-xs font-semibold">Fluent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. NEW CONNECT & COLLABORATE LAYOUT */}
      <div id="contact" className="mx-auto max-w-7xl px-6 py-10 scroll-mt-10">
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white font-display tracking-tight leading-none">
            Let's Connect & Collaborate
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base max-w-3xl leading-relaxed font-semibold">
            Ready to create meaningful impact through innovation, collaboration, and continuous learning. Open to opportunities that challenge me to grow and contribute.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* What I Bring to the Table Card */}
          <div className="bg-emerald-500/5 dark:bg-emerald-950/10 border border-emerald-500/10 dark:border-emerald-500/20 rounded-3xl p-6 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-emerald-950 dark:text-emerald-300 font-display mb-4">
              What I Bring to the Table
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3.5 gap-x-6 text-left max-w-4xl mx-auto">
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 fill-emerald-500/10" />
                <span className="text-neutral-700 dark:text-neutral-300 font-semibold text-sm">Fresh perspective and innovative thinking</span>
              </div>
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 fill-emerald-500/10" />
                <span className="text-neutral-700 dark:text-neutral-300 font-semibold text-sm">Strong foundation in Computer Science(CS) and problem-solving.</span>
              </div>
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 fill-emerald-500/10" />
                <span className="text-neutral-700 dark:text-neutral-300 font-semibold text-sm">Passionate about learning</span>
              </div>
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 fill-emerald-500/10" />
                <span className="text-neutral-700 dark:text-neutral-300 font-semibold text-sm">Passionate about teamwork and problem-solving.</span>
              </div>
            </div>
          </div>

          {/* Contact Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* WhatsApp Card */}
            <div className="flex flex-col items-center text-center p-6 bg-emerald-500/5 dark:bg-neutral-900 border border-emerald-500/10 dark:border-emerald-500/20 rounded-3xl shadow-xs relative overflow-hidden group">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-[#00674f] dark:text-[#34d399] mb-3">
                <WhatsAppIcon className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-display mb-1">WhatsApp</h4>
              <p className="text-neutral-500 dark:text-neutral-400 font-mono text-sm mb-4">+91 93903 49899</p>
              <a 
                href="https://wa.me/919390349899" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#00674f] hover:bg-[#00523e] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-150 shadow-md active:scale-[0.98]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span>Chat Now</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Email Card */}
            <div className="flex flex-col items-center text-center p-6 bg-emerald-500/5 dark:bg-neutral-900 border border-emerald-500/10 dark:border-emerald-500/20 rounded-3xl shadow-xs relative overflow-hidden group">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-[#00674f] dark:text-[#34d399] mb-3">
                <Mail className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-display mb-1">Email</h4>
              <p className="text-neutral-500 dark:text-neutral-400 font-mono text-sm mb-4">nandagopaldudaka@gmail.com</p>
              <a 
                href="mailto:nandagopaldudaka@gmail.com"
                className="inline-flex items-center gap-2 bg-[#00674f] hover:bg-[#00523e] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-150 shadow-md active:scale-[0.98]"
              >
                <Mail className="h-4 w-4" />
                <span>Send Email</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Connect on Social Media */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 text-center space-y-4">
            <h4 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-display">
              Connect on Social Media
            </h4>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href={profile.githubUrl || "https://github.com"} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-850 border border-neutral-250 dark:border-neutral-850 rounded-xl px-5 py-2.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 transition-all duration-150"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
                <ExternalLink className="h-3 w-3 text-neutral-400" />
              </a>
              <a 
                href="https://www.instagram.com/nandagopal_9/" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-850 border border-neutral-250 dark:border-neutral-850 rounded-xl px-5 py-2.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 transition-all duration-150"
              >
                <Instagram className="h-4 w-4" />
                <span>Instagram</span>
                <ExternalLink className="h-3 w-3 text-neutral-400" />
              </a>
              <a 
                href={profile.linkedinUrl || "https://linkedin.com"} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-850 border border-neutral-250 dark:border-neutral-850 rounded-xl px-5 py-2.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 transition-all duration-150"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
                <ExternalLink className="h-3 w-3 text-neutral-400" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 8.5 RECRUITER FOOTER PANEL */}
      <footer className="bg-neutral-900 border-t border-neutral-800 text-neutral-300 py-16">
        <div className="mx-auto max-w-7xl px-6 flex flex-col items-center justify-between gap-8 text-center sm:text-left sm:flex-row">
          <div className="space-y-2.5">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <span 
                className="h-9 w-9 rounded-full flex items-center justify-center text-white font-black font-display text-xs"
                style={{ backgroundColor: currentThemeHex }}
              >
                DN
              </span>
              <span className="text-lg font-bold font-display text-white tracking-tight">
                {profile.name}
              </span>
            </div>
            <p className="text-neutral-350 text-xs sm:text-sm font-medium font-sans">
              Focusing on Computer Science, intelligent systems and robust APIs.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center sm:justify-end gap-5 text-neutral-350">
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              )}
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="hover:text-white transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              )}
            </div>
            
            <p className="text-neutral-400 text-2xs font-semibold uppercase tracking-wider font-mono">
              Copyright 2026 {profile.name} • All Rights Reserved
            </p>
          </div>
        </div>
      </footer>

      {/* 9. ACADEMIC DETAILS MODAL SHEET */}
      <AnimatePresence>
        {activeEducationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveEducationModal(null)}
              className="absolute inset-0 bg-neutral-950/50 backdrop-blur-md"
            />

            {/* Modal Body Card */}
            <motion.div
              layoutId={`edu-container-${activeEducationModal.id}`}
              className="relative max-w-2xl w-full rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 overflow-hidden md:p-8 z-10"
            >
              {/* Image banner */}
              <div className="h-44 md:h-56 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-950 relative">
                <img 
                  src={fallbackEduImages[education.findIndex(e => e.id === activeEducationModal.id) % fallbackEduImages.length] || fallbackEduImages[0]} 
                  alt={activeEducationModal.degree} 
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                
                {/* Close floating button */}
                <button
                  onClick={() => setActiveEducationModal(null)}
                  className="absolute right-3.5 top-3.5 bg-neutral-950/70 border border-white/10 rounded-full p-2 text-white cursor-pointer hover:bg-black transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Text content details */}
              <div className="mt-6 space-y-4 font-sans text-neutral-900 dark:text-neutral-100">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <h3 className="text-2xl font-black font-display tracking-tight leading-tight">{activeEducationModal.degree}</h3>
                  <span className="text-xs font-bold font-mono text-neutral-500 dark:text-neutral-300 uppercase tracking-widest">{activeEducationModal.startDate} – {activeEducationModal.endDate}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-neutral-500 dark:text-neutral-300">
                  <span className="uppercase text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200">{activeEducationModal.institution}</span>
                  <span className="text-neutral-300 dark:text-neutral-800">•</span>
                  <span>{activeEducationModal.location}</span>
                  {activeEducationModal.gpa && (
                    <>
                      <span className="text-neutral-300 dark:text-neutral-800">•</span>
                      <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md text-xs font-mono font-bold">GPA: {activeEducationModal.gpa}</span>
                    </>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans font-medium whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {activeEducationModal.details || "No additional records provided for this degree course."}
                </div>

                {/* Academic Focus tags */}
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2 font-semibold">Associated Focus disciplines</h4>
                  <div className="flex flex-wrap gap-1.55">
                    {getAcademicTags(activeEducationModal.degree).map(tag => (
                      <span 
                        key={tag} 
                        className="bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 rounded-md text-[10px] px-2.5 py-0.5 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 10. PROJECT DETAILS MODAL SHEET */}
      <AnimatePresence>
        {activeProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProjectModal(null)}
              className="absolute inset-0 bg-neutral-950/50 backdrop-blur-md"
            />

            {/* Modal Body Card */}
            <motion.div
              layoutId={`proj-container-${activeProjectModal.id}`}
              className="relative max-w-2xl w-full rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 overflow-hidden md:p-8 z-10"
            >
              {/* Image banner */}
              <div className="h-44 md:h-56 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-950 relative">
                <img 
                  src={activeProjectModal.imageUrl} 
                  alt={activeProjectModal.title} 
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                
                {/* Close floating button */}
                <button
                  onClick={() => setActiveProjectModal(null)}
                  className="absolute right-3.5 top-3.5 bg-neutral-950/70 border border-white/10 rounded-full p-2 text-white cursor-pointer hover:bg-black transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Text content details */}
              <div className="mt-6 space-y-4 font-sans text-neutral-900 dark:text-neutral-100">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <h3 className="text-2xl font-black font-display tracking-tight leading-tight">{activeProjectModal.title}</h3>
                  {activeProjectModal.featured && (
                    <span className="text-2xs font-mono font-bold bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded text-neutral-500 dark:text-neutral-300 uppercase tracking-widest">Featured Work</span>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans font-medium whitespace-pre-wrap max-h-48 overflow-y-auto pr-1">
                  {activeProjectModal.longDescription || activeProjectModal.description}
                </div>

                {/* External Action Links */}
                <div className="flex flex-wrap gap-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  {activeProjectModal.demoUrl && (
                    <a
                      href={activeProjectModal.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ backgroundColor: currentThemeHex }}
                      className="rounded-xl px-4.5 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer font-display"
                    >
                      <ExternalLink className="h-4 w-4" /> Demo Platform
                    </a>
                  )}
                  {activeProjectModal.githubUrl && (
                    <a
                      href={activeProjectModal.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-neutral-250 dark:border-neutral-800 hover:border-neutral-350 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900 px-4.5 py-2.5 text-xs text-neutral-750 dark:text-neutral-350 font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                    >
                      <Github className="h-4 w-4" /> View Repositories
                    </a>
                  )}
                </div>

                {/* Core Tools used */}
                <div className="pt-2">
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">Engineered stack details</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProjectModal.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800/80 rounded-md text-[10px] px-2.5 py-0.5 font-mono font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
