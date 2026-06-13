import React, { useState } from 'react';
import { Mail, Phone, MapPin, ExternalLink, Printer, Clipboard, Check, FileText } from 'lucide-react';
import { PortfolioData } from '../types';

interface ResumeViewerProps {
  portfolioData: PortfolioData;
}

export default function ResumeViewer({ portfolioData }: ResumeViewerProps) {
  const { profile, projects, education = [], skills, settings } = portfolioData;
  const [copied, setCopied] = useState(false);

  const currentThemeHex = settings.accentColor || '#3b82f6';

  // Handle trigger native printer dialog
  const handlePrint = () => {
    window.print();
  };

  // Copy raw resume in markdown format
  const handleCopyMarkdown = () => {
    let markdown = `# RESUME - ${profile.name.toUpperCase()}\n`;
    markdown += `**${profile.title}**\n\n`;
    markdown += `* Email: ${profile.email}\n`;
    markdown += `* Phone: ${profile.phone}\n`;
    markdown += `* Location: ${profile.location}\n`;
    markdown += `* Website: ${profile.websiteUrl}\n`;
    markdown += `* Github: ${profile.githubUrl}\n`;
    markdown += `* LinkedIn: ${profile.linkedinUrl}\n\n`;
    
    markdown += `## EXECUTIVE SUMMARY\n${profile.longBio || profile.bio}\n\n`;
    
    markdown += `## FEATURED PROJECTS\n`;
    projects.forEach(p => {
      markdown += `### ${p.title}\n`;
      markdown += `${p.description}\n`;
      if (p.longDescription) markdown += `${p.longDescription}\n`;
      if (p.demoUrl) markdown += `Demo: ${p.demoUrl}\n`;
      if (p.githubUrl) markdown += `Source Code: ${p.githubUrl}\n`;
      markdown += `Technologies used: ${p.tags.join(', ')}\n\n`;
    });

    markdown += `## EDUCATION\n`;
    education.forEach(edu => {
      markdown += `### ${edu.degree}\n`;
      markdown += `${edu.institution} (${edu.startDate} – ${edu.endDate})\n`;
      if (edu.gpa) markdown += `- GPA: ${edu.gpa}\n`;
      if (edu.details) markdown += `- Details: ${edu.details}\n`;
      markdown += `\n`;
    });

    markdown += `## EXPERTISE & TECH STACK\n`;
    const cats = ['Languages', 'Frameworks', 'Tools', 'Frontend', 'Backend', 'Design', 'Others'];
    cats.forEach(c => {
      const items = skills.filter(sk => sk.category === c).map(sk => `${sk.name} (${sk.level}%)`);
      if (items.length > 0) {
        markdown += `* **${c}**: ${items.join(', ')}\n`;
      }
    });

    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Action Buttons Panel */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-neutral-900 dark:text-white font-display">Resume Sheet</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Print-ready standard grid layout</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Print Trigger */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 font-medium cursor-pointer transition-all active:scale-95 shadow-2xs"
          >
            <Printer className="h-3.5 w-3.5" />
            Print / Save PDF
          </button>

          {/* Copy Plaintext */}
          <button
            onClick={handleCopyMarkdown}
            style={{ borderColor: copied ? '#10b981' : undefined }}
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-medium cursor-pointer transition-all active:scale-95 shadow-2xs ${
              copied
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/20'
                : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Clipboard className="h-3.5 w-3.5" />}
            {copied ? 'Copied Markdown' : 'Copy Plaintext'}
          </button>
        </div>
      </div>

      {/* A4 Resume Canvas */}
      <div 
        id="printable-resume-card"
        className="w-full bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 border border-neutral-100 dark:border-neutral-900 rounded-2xl print:border-none print:shadow-none shadow-sm overflow-hidden font-sans p-8 md:p-12 print:p-0"
      >
        {/* Header Name & Tagline */}
        <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-neutral-100 dark:border-neutral-900 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-display">{profile.name}</h1>
            <p className="text-sm font-semibold tracking-wide mt-1" style={{ color: currentThemeHex }}>{profile.title}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 max-w-xl">{profile.bio}</p>
          </div>

          <div className="flex flex-col gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 font-mono flex-shrink-0">
            <span className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-neutral-400" />
              <a href={`mailto:${profile.email}`} className="hover:underline">{profile.email}</a>
            </span>
            <span className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-neutral-400" />
              <span>{profile.phone}</span>
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-neutral-400" />
              <span>{profile.location}</span>
            </span>
            {profile.websiteUrl && (
              <span className="flex items-center gap-2">
                <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                  {profile.websiteUrl.replace(/^https?:\/\//, '')}
                  <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                </a>
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          {/* Main Body Column (Experience, Education) */}
          <div className="md:col-span-2 space-y-8">
            {/* Projects */}
            <div>
              <h2 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 tracking-widest uppercase border-b border-neutral-100 dark:border-neutral-900 pb-2">Projects</h2>
              <div className="mt-4 space-y-6">
                {projects.map(p => (
                  <div key={p.id} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h3 className="font-bold text-[14px] text-neutral-900 dark:text-white font-display">{p.title}</h3>
                      <div className="flex gap-2 text-xs font-mono">
                        {p.demoUrl && <a href={p.demoUrl} target="_blank" rel="noreferrer" style={{ color: currentThemeHex }} className="hover:underline flex items-center gap-0.5">Demo <ExternalLink className="h-2.5 w-2.5" /></a>}
                        {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-neutral-500 hover:underline flex items-center gap-0.5">Source <ExternalLink className="h-2.5 w-2.5" /></a>}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">{p.description}</p>
                    {p.longDescription && (
                      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed font-sans italic">{p.longDescription}</p>
                    )}
                    {p.tags && p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {p.tags.map(tag => (
                          <span key={tag} className="bg-neutral-50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-800/80 rounded-sm text-[10px] px-1.5 py-0.5 font-mono">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 tracking-widest uppercase border-b border-neutral-100 dark:border-neutral-900 pb-2">Education</h2>
              <div className="mt-4 space-y-4">
                {education.map(edu => (
                  <div key={edu.id} className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h3 className="font-bold text-[13px] text-neutral-900 dark:text-white font-display">{edu.degree}</h3>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono font-medium">{edu.startDate} - {edu.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      <span>{edu.institution}</span>
                      {edu.gpa && (
                        <>
                          <span className="text-neutral-300 dark:text-neutral-700">•</span>
                          <span>GPA: {edu.gpa}</span>
                        </>
                      )}
                    </div>
                    {edu.details && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 italic font-sans">{edu.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Column (Summary metadata & Skills Grid) */}
          <div className="space-y-8">
            {/* Short Summary */}
            <div>
              <h2 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 tracking-widest uppercase border-b border-neutral-100 dark:border-neutral-900 pb-2">Summary</h2>
              <p className="mt-4 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 whitespace-pre-line">
                {profile.longBio || profile.bio}
              </p>
            </div>

            {/* Skills Breakdown */}
            <div>
              <h2 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 tracking-widest uppercase border-b border-neutral-100 dark:border-neutral-900 pb-2">Technical Skills</h2>
              <div className="mt-4 space-y-4">
                {(['Languages', 'Frameworks', 'Tools', 'Frontend', 'Backend', 'Design', 'Others'] as const).map(cat => {
                  const categorized = skills.filter(sk => sk.category === cat);
                  if (categorized.length === 0) return null;

                  return (
                    <div key={cat} className="space-y-1.5">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-mono">{cat}</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {categorized.map(sk => (
                          <span 
                            key={sk.id}
                            className="bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 px-2 py-1 text-2xs font-medium rounded-sm border border-neutral-200/40 dark:border-neutral-800/60 font-sans"
                          >
                            {sk.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Technologies Cart */}
            <div>
              <h2 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 tracking-widest uppercase border-b border-neutral-100 dark:border-neutral-900 pb-2">Tech Stack Cart</h2>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["Node.js", "MongoDB", "Prompt Engineering", "REST APIs", "Generative AI", "Git", "GitHub"].map(item => (
                  <span 
                    key={item}
                    className="bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 px-2 rounded-sm border border-blue-100/30 dark:border-blue-900/40 text-[10px] font-semibold font-sans"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Sign and Date Footer */}
            <div className="pt-2">
              <h2 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 tracking-widest uppercase border-b border-neutral-100 dark:border-neutral-900 pb-2">Attestation</h2>
              <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                I hereby declare that all details provided are correct and active.
              </p>
              <div className="mt-4 pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-800 font-mono text-[10px] text-neutral-400 flex justify-between">
                <span>Verification Ref</span>
                <span className="font-semibold text-neutral-600 dark:text-neutral-300">PORTFOLIO-REF-A</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
