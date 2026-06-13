import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles, Terminal, ArrowRight, User, Briefcase, Mail, Code } from 'lucide-react';
import { PortfolioData } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  suggestions?: string[];
}

interface InteractiveInterviewerProps {
  portfolioData: PortfolioData;
}

export default function InteractiveInterviewer({ portfolioData }: InteractiveInterviewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: `Hi there! I am ${portfolioData.profile.name}'s virtual portfolio assistant. Ask me anything about their interactive projects, skill stack, educational background, or how to get in touch!`,
      timestamp: new Date(),
      suggestions: [
        "What is your core stack?",
        "Tell me about your projects",
        "Tell me about your education",
        "How do I contact you?"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [messages, isOpen]);

  // Handle preset suggestions
  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const currentThemeHex = portfolioData.settings.accentColor || '#3b82f6';

  // Process questions and match dynamic content from portfolioData
  const generateBotResponse = (userInput: string): { text: string; suggestions?: string[] } => {
    const text = userInput.toLowerCase().trim();
    const { profile, projects, education = [], skills } = portfolioData;

    // Help / Greetings
    if (text === 'hello' || text === 'hi' || text.includes('hey') || text.includes('greetings')) {
      return {
        text: `Hello! I hope you're having a wonderful day. What would you like to learn about ${profile.name} today?`,
        suggestions: ["What is your educational background?", "Show me your skills", "Tell me about your projects"]
      };
    }

    // Stack and Skills
    if (text.includes('stack') || text.includes('skill') || text.includes('tech') || text.includes('language') || text.includes('code')) {
      const frontendSkills = skills.filter(s => s.category === 'Frontend').map(s => s.name).slice(0, 5).join(', ');
      const backendSkills = skills.filter(s => s.category === 'Backend').map(s => s.name).slice(0, 5).join(', ');
      const designSkills = skills.filter(s => s.category === 'Design').map(s => s.name).slice(0, 4).join(', ');
      
      let responseText = `${profile.name}'s core stack stretches across multiple disciplines. `;
      if (frontendSkills) responseText += `\n\n• **Frontend**: ${frontendSkills}`;
      if (backendSkills) responseText += `\n• **Backend**: ${backendSkills}`;
      if (designSkills) responseText += `\n• **UI/UX & Design**: ${designSkills}`;
      
      responseText += `\n\nWould you like more details on their education or dynamic projects?`;

      return {
        text: responseText,
        suggestions: ["Tell me about your education", "Tell me about your projects"]
      };
    }

    // Projects keyword
    if (text.includes('project') || text.includes('portfolio') || text.includes('built') || text.includes('make') || text.includes('app')) {
      const featured = projects.filter(p => p.featured).slice(0, 3);
      const otherList = projects.filter(p => !p.featured).slice(0, 2);
      const allProjs = [...featured, ...otherList];

      if (allProjs.length === 0) {
        return {
          text: `We are currently setting up the project showcases. Keep an eye out for updates!`,
          suggestions: ["What are your skills?", "Contact info"]
        };
      }

      let responseText = `Here are some featured interactive platforms ${profile.name} has engineered:`;
      allProjs.forEach((p, idx) => {
        responseText += `\n\n**${idx + 1}. ${p.title}**\n${p.description}\n_Tech Stack:_ ${p.tags.join(', ')}`;
      });

      return {
        text: responseText,
        suggestions: allProjs.map(p => `Tell me about ${p.title}`)
      };
    }

    // Individual project matches
    for (const p of projects) {
      if (text.includes(p.title.toLowerCase()) || text.includes(p.id.toLowerCase())) {
        return {
          text: `**${p.title}**:\n${p.longDescription || p.description}\n\n**Main Tools:** ${p.tags.join(', ')}${p.demoUrl ? `\n🔗 [Live Preview](${p.demoUrl})` : ''}${p.githubUrl ? `\n💻 [Github Repository](${p.githubUrl})` : ''}`,
          suggestions: ["See more projects", "Tell me about your education"]
        };
      }
    }

    // Individual education degrees matches
    for (const edu of education) {
      if (text.includes(edu.degree.toLowerCase()) || text.includes(edu.institution.toLowerCase())) {
        return {
          text: `**${edu.degree}** from _${edu.institution}_\nTimeline: ${edu.startDate} - ${edu.endDate}\n\n**Key Accolades & Areas of Study:**\n${edu.details || 'Continuous improvement and technical coursework.'}${edu.gpa ? `\n• **Academic GPA:** ${edu.gpa}` : ''}\n• **Campus Location:** ${edu.location}`,
          suggestions: ["See all education", "Tell me about your projects"]
        };
      }
    }

    // Experience/Resume Info (Redirected to Projects since career is replaced)
    if (text.includes('experience') || text.includes('work') || text.includes('history') || text.includes('job') || text.includes('company') || text.includes('career')) {
      return {
        text: `Rather than traditional corporate work history, ${profile.name} demonstrates engineering capabilities directly via their active portfolio of bespoke web solutions, open-source utilities, and performance-optimized project builds. \n\nWould you like to explore their interactive project showcase?`,
        suggestions: ["Tell me about your projects", "Tell me about your education"]
      };
    }

    // Education
    if (text.includes('education') || text.includes('study') || text.includes('degree') || text.includes('university') || text.includes('college') || text.includes('academic') || text.includes('course')) {
      if (education.length === 0) {
        return {
          text: `${profile.name} is a self-taught innovator and continuous learner of computer science & interactive design.`,
          suggestions: ["What is your stack?", "Tell me about your projects"]
        };
      }

      let responseText = `Here is ${profile.name}'s comprehensive education and academic background:\n`;
      education.forEach(edu => {
        responseText += `\n• **${edu.degree}**\n  _${edu.institution}_ (${edu.startDate} - ${edu.endDate})${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}\n  ${edu.details || ''}\n`;
      });

      return {
        text: responseText,
        suggestions: ["What is your stack?", "Contact details"]
      };
    }

    // Contact/Hire/Relocation
    if (text.includes('contact') || text.includes('reach') || text.includes('email') || text.includes('hire') || text.includes('relo') || text.includes('opportunity') || text.includes('phone') || text.includes('touch')) {
      return {
        text: `Fantastic! ${profile.name} is currently open to engaging collaborations, full-time positions, and consulting opportunities.\n\nHere is how you can directly establish contact:\n\n• **Email**: ${profile.email}\n• **Phone**: ${profile.phone}\n• **Location**: ${profile.location}\n\nYou can also submit a quick note in the **Contact Form** at the bottom of the page, and it will show up directly in the portfolio workspace!`,
        suggestions: ["What are your skills?", "Tell me about your education"]
      };
    }

    // About me / Bio
    if (text.includes('who are you') || text.includes('about') || text.includes('profile') || text.includes('who is') || text.toLowerCase().includes(profile.name.toLowerCase())) {
      return {
        text: `**About ${profile.name}:**\n${profile.longBio || profile.bio}`,
        suggestions: ["Tell me about your education", "What is your stack?"]
      };
    }

    // Default Fallback Q&A NLP response
    return {
      text: `That is an interesting question! I am specializing in ${profile.name}'s professional achievements, interactive projects, and educational credentials. Feel free to query about their main skills, academic coursework, featured projects, or ask for direct contact information!`,
      suggestions: [
        "What is your core stack?",
        "Tell me about your education",
        "Tell me about your projects",
        "How to hire you"
      ]
    };
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate natural response latency
    setTimeout(() => {
      const reply = generateBotResponse(text);
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: reply.text,
        timestamp: new Date(),
        suggestions: reply.suggestions
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <motion.button
          id="chatbot-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          style={{ backgroundColor: currentThemeHex }}
          className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer focus:outline-none"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </motion.button>
        
        {/* Unread dot widget */}
        {!isOpen && messages.length <= 1 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[10px] text-white items-center justify-center font-bold font-sans">1</span>
          </span>
        )}
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-window-panel"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-40 flex h-[540px] w-full max-w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl font-sans"
          >
            {/* Header */}
            <div 
              style={{ backgroundColor: currentThemeHex }} 
              className="flex items-center justify-between p-4 text-white"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/12 border border-white/10">
                  <Terminal className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm font-display tracking-tight">Portfolio Co-Pilot</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[11px] text-white/80 font-mono">Interactive AI Console</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 hover:bg-white/10 active:bg-white/20 transition-colors"
                aria-label="Close Chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-neutral-950/20 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`flex items-start gap-1.5 max-w-[85%]`}>
                    {msg.sender === 'bot' && (
                      <div className="mt-1 flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                        <Sparkles className="h-3 w-3" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-xs ${
                        msg.sender === 'user'
                          ? 'bg-neutral-800 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium rounded-tr-none'
                          : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-gray-100 dark:border-neutral-700/60 shadow-sm rounded-tl-none whitespace-pre-wrap'
                      }`}
                    >
                      {/* Markdown links parser simulation */}
                      {msg.text.split('\n').map((line, i) => {
                        // Check for bold highlights
                        let renderedLine = line;
                        const boldRegex = /\*\*(.*?)\*\*/g;
                        
                        // Parse simple bold markdown
                        const parts = [];
                        let lastIdx = 0;
                        let match;
                        while ((match = boldRegex.exec(line)) !== null) {
                          if (match.index > lastIdx) {
                            parts.push(line.substring(lastIdx, match.index));
                          }
                          parts.push(<strong key={match.index} className="font-semibold text-neutral-900 dark:text-white">{match[1]}</strong>);
                          lastIdx = boldRegex.lastIndex;
                        }
                        if (lastIdx < line.length) {
                          parts.push(line.substring(lastIdx));
                        }

                        // Parse simple markdown links [Label](URL)
                        const linkRegex = /\[(.*?)\]\((.*?)\)/g;
                        const linkMatches = [...renderedLine.matchAll(linkRegex)];
                        if (linkMatches.length > 0) {
                          return (
                            <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
                              {renderedLine.replace(linkRegex, '$1')}
                            </p>
                          );
                        }

                        return (
                          <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
                            {parts.length > 0 ? parts : line}
                          </p>
                        );
                      })}
                    </div>
                  </div>

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 pl-7 max-w-[95%]">
                      {msg.suggestions.map((suggestion, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="rounded-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800/80 hover:border-gray-300 dark:hover:border-neutral-700 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 px-3 py-1 cursor-pointer transition-all active:scale-95 shadow-2xs"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Bot typing simulation panel */}
              {isTyping && (
                <div className="flex items-start gap-1.5">
                  <div className="mt-1 flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700">
                    <Sparkles className="h-3 w-3" />
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700/60 shadow-sm px-4 py-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: '0ms' }}></span>
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: '150ms' }}></span>
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="border-t border-gray-100 dark:border-neutral-800 p-3 bg-white dark:bg-neutral-900">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 pl-4 pr-11 py-2.5 text-xs bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-neutral-700 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  style={{ color: inputText.trim() ? currentThemeHex : '#9ca3af' }}
                  className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 text-neutral-400 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="text-[9px] text-center text-gray-400 dark:text-neutral-500 mt-2 font-mono flex items-center justify-center gap-1">
                <span>Self-Reflective Q&A Logic</span>
                <span>•</span>
                <span>Active Data Bound</span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
