import React, { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, CheckCircle, Info, AlertTriangle, X, Eye, Edit3, FileText, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioData, ContactMessage, Toast } from './types';
import { defaultProfileData } from './data/defaultProfile';
import VisitorView from './components/VisitorView';
import EditorView from './components/EditorView';
import ResumeViewer from './components/ResumeViewer';
import InteractiveInterviewer from './components/InteractiveInterviewer';

export default function App() {
  const [viewMode, setViewMode] = useState<'visitor' | 'editor' | 'resume'>('visitor');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast: Toast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };
  
  // Profile Data state synced from localStorage
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() => {
    try {
      const stored = localStorage.getItem('io_portfolio_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        let updated = false;

        // Force migration for name change from Alex Rivera to Dudaka Nanda Gopal
        if (parsed?.profile) {
          if (!parsed.profile.name || parsed.profile.name === "Alex Rivera" || parsed.profile.name.includes("Alex")) {
            parsed.profile.name = "Dudaka Nanda Gopal";
            updated = true;
          }
          if (parsed.profile.title !== "Computer Science Student | Data Science & Machine Learning Enthusiast") {
            parsed.profile.title = "Computer Science Student | Data Science & Machine Learning Enthusiast";
            updated = true;
          }
          if (!parsed.profile.bio || parsed.profile.bio.includes("pixel-perfect design") || parsed.profile.bio.includes("bridge the gap")) {
            parsed.profile.bio = "I enjoy building modern web applications and leveraging data-driven approaches to solve real-world problems. With a strong interest in Machine Learning, Full-Stack Development, and Software Engineering, I focus on creating efficient, scalable, and user-centric solutions.";
            updated = true;
          }
          if (!parsed.profile.longBio || parsed.profile.longBio.includes("West Coast") || parsed.profile.longBio.includes("Over the past six years") || parsed.profile.longBio.includes("philosophy is simple")) {
            parsed.profile.longBio = "I believe great software is built on strong fundamentals, continuous learning, and attention to detail. Every project is an opportunity to improve problem-solving skills, write cleaner code, and create meaningful solutions. My goal is not just to build applications, but to understand how systems work, scale, and evolve.\n\nTechnology moves fast, but fundamentals last. I focus on mastering core concepts, building practical projects, and staying curious enough to keep learning. Every line of code is a chance to become a better engineer than yesterday.";
            updated = true;
          }
          if (parsed.profile.email !== "nandagopaldudaka@gmail.com") {
            parsed.profile.email = "nandagopaldudaka@gmail.com";
            updated = true;
          }
          if (parsed.profile.phone !== "+91 9390349899") {
            parsed.profile.phone = "+91 9390349899";
            updated = true;
          }
          if (parsed.profile.location !== "Hyderabad, India") {
            parsed.profile.location = "Hyderabad, India";
            updated = true;
          }
          if (parsed.profile.websiteUrl === "https://alexrivera.dev") {
            parsed.profile.websiteUrl = "https://nandagopal.dev";
            updated = true;
          }
          if (!parsed.profile.linkedinUrl || parsed.profile.linkedinUrl === "https://linkedin.com" || !parsed.profile.linkedinUrl.includes("nanda-gopal-dudaka")) {
            parsed.profile.linkedinUrl = "https://www.linkedin.com/in/nanda-gopal-dudaka-631b57322/";
            updated = true;
          }
          if (!parsed.profile.githubUrl || parsed.profile.githubUrl === "https://github.com" || !parsed.profile.githubUrl.includes("Nandagopal")) {
            parsed.profile.githubUrl = "https://github.com/Nandagopal2498";
            updated = true;
          }
        }

        // Revert core skills to standard 8 skills if any of the workspace/cart items are in there
        const hasExtraInSkills = parsed?.skills?.some((s: any) => ["Node.js", "Git", "GitHub", "Generative AI", "VS Code"].includes(s.name));
        if (hasExtraInSkills && parsed?.skills) {
          parsed.skills = defaultProfileData.skills;
          updated = true;
        }

        // Force and reorder C++, Python and React.js to match the decreasing order and swapped request
        if (parsed?.skills) {
          const pythonIndex = parsed.skills.findIndex((s: any) => s.name === "Python");
          const reactIndex = parsed.skills.findIndex((s: any) => s.name === "React.js");
          const cppIndex = parsed.skills.findIndex((s: any) => s.name === "C++");
          if (
            pythonIndex === -1 || 
            reactIndex === -1 || 
            cppIndex === -1 || 
            pythonIndex > reactIndex || 
            reactIndex > cppIndex
          ) {
            parsed.skills = defaultProfileData.skills;
            updated = true;
          } else {
            parsed.skills = parsed.skills.map((s: any) => {
              if (s.name === "C++" && s.level !== 75) {
                s.level = 75;
                updated = true;
              }
              if (s.name === "Python" && s.level !== 85) {
                s.level = 85;
                updated = true;
              }
              if (s.name === "React.js" && s.level !== 75) {
                s.level = 75;
                updated = true;
              }
              return s;
            });
          }
        }

        // Migrate education to NXTWAVE with the 9 specified key focus areas
        const hasOldEducation = !parsed?.education || 
                                !Array.isArray(parsed.education) || 
                                parsed.education.length === 0 || 
                                !parsed.education.some((edu: any) => edu.institution?.includes("NXTWAVE")) || 
                                !parsed.education.some((edu: any) => edu.details?.includes("Prompt Engineering"));
        if (hasOldEducation) {
          parsed.education = defaultProfileData.education;
          updated = true;
        }

        if (updated) {
          localStorage.setItem('io_portfolio_data', JSON.stringify(parsed));
        }
        return parsed;
      }
      return defaultProfileData;
    } catch {
      return defaultProfileData;
    }
  });

  // Contact messages state synced from localStorage
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const stored = localStorage.getItem('io_portfolio_messages');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Synchronize portfolioData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('io_portfolio_data', JSON.stringify(portfolioData));
  }, [portfolioData]);

  // Synchronize messages to localStorage
  useEffect(() => {
    localStorage.setItem('io_portfolio_messages', JSON.stringify(messages));
  }, [messages]);

  // Synchronize CSS Dark Mode class on the document node based on settings
  useEffect(() => {
    if (portfolioData.settings.themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [portfolioData.settings.themeMode]);

  // Support URL query parameters (?mode=editor/visitor/resume) and keyboard shortcuts to switch view modes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode === 'editor' || mode === 'visitor' || mode === 'resume') {
      setViewMode(mode);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Alt + E -> toggles Editor mode
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'e') {
        setViewMode('editor');
      }
      // Ctrl + Alt + V -> Visitor mode
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'v') {
        setViewMode('visitor');
      }
      // Ctrl + Alt + R -> Resume view
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'r') {
        setViewMode('resume');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdateData = (newData: PortfolioData) => {
    setPortfolioData(newData);
  };

  const handleSendContactMessage = (msg: Omit<ContactMessage, 'id' | 'timestamp' | 'read'>) => {
    const formatTimestamp = () => {
      const date = new Date();
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      timestamp: formatTimestamp(),
      read: false
    };

    setMessages(prev => [newMsg, ...prev]);
    showToast(`Thank you ${msg.name}! Your message was successfully dispatched.`, "success");
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    showToast("Message permanently removed from your mailbox", "info");
  };

  const handleMarkAsReadMessage = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    showToast("Message marked as read", "success");
  };

  const handleResetToDefault = () => {
    if (window.confirm("Are you sure you want to reset all data on your portfolio? Any manual changes made in the editor panel will be replaced with default layouts.")) {
      setPortfolioData(defaultProfileData);
      setMessages([]);
      showToast("Portfolio and records successfully restored to default templates!", "warning");
    }
  };

  const toggleTheme = () => {
    const currentTheme = portfolioData.settings.themeMode;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setPortfolioData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        themeMode: newTheme,
      },
    }));
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark Twilight' : 'Light Slate'} Mode!`, "info");
  };

  const currentThemeHex = portfolioData.settings.accentColor || '#3b82f6';
  const unreadMessageCount = messages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen bg-gray-50 text-neutral-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-100 selection:bg-neutral-800 dark:selection:bg-white selection:text-white dark:selection:text-neutral-950 text-wrap break-words">
      
      {/* CORE ACTIVE WORKSPACE PREVIEWS */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            {/* Visitor public presentation portfolio view */}
            {viewMode === 'visitor' && (
              <div>
                <VisitorView 
                  portfolioData={portfolioData}
                  onSendContactMessage={handleSendContactMessage}
                  onToggleTheme={toggleTheme}
                />

                {/* Float Recruiter Chatbot loaded on Visitor View */}
                <InteractiveInterviewer portfolioData={portfolioData} />
              </div>
            )}

            {/* Backend developer customization console panel */}
            {viewMode === 'editor' && (
              <div>
                <EditorView 
                  portfolioData={portfolioData}
                  onUpdateData={handleUpdateData}
                  messages={messages}
                  onDeleteMessage={handleDeleteMessage}
                  onMarkAsReadMessage={handleMarkAsReadMessage}
                  onResetToDefault={handleResetToDefault}
                  showToast={showToast}
                />
              </div>
            )}

            {/* Print-ready standard CV resume view layout */}
            {viewMode === 'resume' && (
              <div>
                <ResumeViewer portfolioData={portfolioData} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* GLOBAL FLOATING TOAST NOTIFICATION CORNER */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full p-4 sm:p-0">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === 'success';
            const isWarning = toast.type === 'warning';
            
            let bgClass = "bg-white/95 dark:bg-neutral-900/95 text-neutral-900 dark:text-neutral-100 border-neutral-200 dark:border-neutral-800 shadow-md";
            let iconColor = "text-blue-500 dark:text-blue-400";
            let IconComponent = Info;

            if (isSuccess) {
              bgClass = "bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-900/50 text-neutral-950 dark:text-neutral-100 shadow-md";
              iconColor = "text-emerald-600 dark:text-emerald-400";
              IconComponent = CheckCircle;
            } else if (isWarning) {
              bgClass = "bg-amber-50/95 dark:bg-amber-950/90 border-amber-200 dark:border-amber-900/50 text-neutral-955 dark:text-neutral-100 shadow-md";
              iconColor = "text-amber-600 dark:text-amber-400";
              IconComponent = AlertTriangle;
            }

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
                className={`pointer-events-auto flex items-start gap-2.5 p-3.5 rounded-2xl border backdrop-blur-xs transition-all duration-300 ${bgClass}`}
              >
                <IconComponent className={`h-4 w-4 shrink-0 ${iconColor} mt-0.5`} />
                <div className="flex-1 text-[11px] font-bold leading-relaxed font-sans pr-2">
                  {toast.message}
                </div>
                <button
                  onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors cursor-pointer shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
