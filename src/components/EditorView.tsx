import React, { useState } from 'react';
import { 
  User, Briefcase, Code, Palette, Inbox, Plus, Trash2, Save, Download, Upload, 
  Settings, CheckCircle, ExternalLink, RefreshCw, Mail, Eye, GraduationCap, ArrowUpDown
} from 'lucide-react';
import { PortfolioData, Project, Education, Skill, ContactMessage, PortfolioSettings } from '../types';

interface EditorViewProps {
  portfolioData: PortfolioData;
  onUpdateData: (newData: PortfolioData) => void;
  messages: ContactMessage[];
  onDeleteMessage: (id: string) => void;
  onMarkAsReadMessage: (id: string) => void;
  onResetToDefault: () => void;
  showToast?: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function EditorView({
  portfolioData,
  onUpdateData,
  messages,
  onDeleteMessage,
  onMarkAsReadMessage,
  onResetToDefault,
  showToast
}: EditorViewProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'education' | 'skills' | 'projects' | 'branding' | 'inbox'>('profile');
  const [saveToast, setSaveToast] = useState(false);

  const { profile, projects, education, skills, settings } = portfolioData;

  // Trigger toast notification
  const triggerToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
    if (showToast) {
      showToast("Changes successfully persistent and synchronized!", "success");
    }
  };

  // Profile Change Handler
  const handleProfileChange = (field: keyof typeof profile, value: string) => {
    const updated = {
      ...portfolioData,
      profile: {
        ...profile,
        [field]: value
      }
    };
    onUpdateData(updated);
  };

  // Theme Settings Handler
  const handleSettingsChange = (field: keyof PortfolioSettings, value: any) => {
    const updated = {
      ...portfolioData,
      settings: {
        ...settings,
        [field]: value
      }
    };
    onUpdateData(updated);
  };

  // Add/Update/Delete Projects
  const handleAddProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: "New Platform Prototype",
      description: "Brief user-facing details about this custom software build.",
      longDescription: "Deeper technical review of the platform architectural design patterns, schema structures, and browser rendering optimization layers.",
      tags: ["React", "TypeScript", "Tailwind CSS"],
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      featured: false,
      order: projects.length + 1
    };

    onUpdateData({
      ...portfolioData,
      projects: [...projects, newProj]
    });
    if (showToast) {
      showToast("A new blank project draft has been appended!", "success");
    } else {
      triggerToast();
    }
  };

  const handleUpdateProject = (id: string, field: keyof Project, value: any) => {
    const updatedProjects = projects.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    });

    onUpdateData({
      ...portfolioData,
      projects: updatedProjects
    });
  };

  const handleDeleteProject = (id: string) => {
    onUpdateData({
      ...portfolioData,
      projects: projects.filter(p => p.id !== id)
    });
    if (showToast) {
      showToast("Selected project removed successfully.", "info");
    } else {
      triggerToast();
    }
  };

  // Add/Update/Delete Education
  const handleAddEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      degree: "B.S. in Software Systems",
      institution: "Tech University",
      location: "Seattle, WA",
      startDate: "2019",
      endDate: "2023",
      gpa: "3.9 / 4.0",
      details: "Focused on human-computer interfaces."
    };

    onUpdateData({
      ...portfolioData,
      education: [...education, newEdu]
    });
    if (showToast) {
      showToast("A new education history record was created!", "success");
    } else {
      triggerToast();
    }
  };

  const handleUpdateEducation = (id: string, field: keyof Education, value: any) => {
    const updatedEdu = education.map(e => {
      if (e.id === id) {
        return { ...e, [field]: value };
      }
      return e;
    });
    onUpdateData({
      ...portfolioData,
      education: updatedEdu
    });
  };

  const handleDeleteEducation = (id: string) => {
    onUpdateData({
      ...portfolioData,
      education: education.filter(e => e.id !== id)
    });
    if (showToast) {
      showToast("Education record removed successfully.", "info");
    } else {
      triggerToast();
    }
  };

  // Add/Update/Delete Skills
  const handleAddSkill = (category: Skill['category'] = "Languages") => {
    const defaultNames: Record<Skill['category'], string> = {
      Languages: "TypeScript",
      Frameworks: "React.js",
      Tools: "Docker",
      Frontend: "Tailwind CSS",
      Backend: "Node.js",
      Design: "Figma",
      Others: "Git"
    };

    const newSkill: Skill = {
      id: `sk-${Date.now()}`,
      name: defaultNames[category] || "New Skill",
      category,
      level: 80
    };
    onUpdateData({
      ...portfolioData,
      skills: [...skills, newSkill]
    });
    if (showToast) {
      showToast(`Added a new skills node under ${category}!`, "success");
    } else {
      triggerToast();
    }
  };

  const handleUpdateSkill = (id: string, field: keyof Skill, value: any) => {
    const updatedSkills = skills.map(s => {
      if (s.id === id) {
        return { ...s, [field]: value };
      }
      return s;
    });
    onUpdateData({
      ...portfolioData,
      skills: updatedSkills
    });
  };

  const handleDeleteSkill = (id: string) => {
    onUpdateData({
      ...portfolioData,
      skills: skills.filter(s => s.id !== id)
    });
    if (showToast) {
      showToast("Skill deleted successfully.", "info");
    } else {
      triggerToast();
    }
  };

  // Handle Export Portfolio JSON Backup
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(portfolioData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${profile.name.toLowerCase().replace(/\s+/g, '_')}_portfolio.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (showToast) {
      showToast("Backup configuration file successfully exported!", "success");
    }
  };

  // Handle Import Portfolio JSON Backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.profile && parsed.projects && parsed.skills) {
            onUpdateData(parsed);
            if (showToast) {
              showToast("Portfolio backup has been successfully imported!", "success");
            } else {
              triggerToast();
            }
          } else {
            alert("Error: Invalid portfolio JSON schema structure.");
          }
        } catch {
          alert("Error parsing file. Invalid JSON syntax.");
        }
      };
    }
  };

  // Presets of beautiful premium tailwind highlights
  const colorPresets = [
    { label: 'Slate Steel', name: 'slate', hex: '#64748b' },
    { label: 'Emerald Mint', name: 'emerald', hex: '#10b981' },
    { label: 'Royal Blue', name: 'blue', hex: '#3b82f6' },
    { label: 'Rose Wine', name: 'rose', hex: '#f43f5e' },
    { label: 'Cyber Violet', name: 'purple', hex: '#a855f7' },
    { label: 'Gold Amber', name: 'amber', hex: '#f59e0b' },
    { label: 'Monochrome', name: 'zinc', hex: '#71717a' },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-[600px] border border-gray-200 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-xl overflow-hidden font-sans">
      {/* Sidebar Tabs */}
      <div className="w-full lg:w-64 bg-gray-50 dark:bg-neutral-950 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-neutral-800 p-4 space-y-1.5 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible">
        <div className="hidden lg:block pb-4 mb-2 border-b border-gray-200 dark:border-neutral-800/80">
          <div className="flex items-center gap-2">
            <Settings className="h-4.5 w-4.5 text-neutral-400 dark:text-neutral-500" />
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Console Panel</h2>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Manage persistent JSON state metrics.</p>
        </div>

        {/* Tab Buttons */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl transition-all w-full flex-shrink-0 lg:w-auto ${
            activeTab === 'profile'
              ? 'bg-neutral-800 dark:bg-white text-white dark:text-neutral-950 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-900'
          }`}
        >
          <User className="h-4 w-4" />
          <span>General Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl transition-all w-full flex-shrink-0 lg:w-auto ${
            activeTab === 'education'
              ? 'bg-neutral-800 dark:bg-white text-white dark:text-neutral-950 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-900'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>Education ({education.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl transition-all w-full flex-shrink-0 lg:w-auto ${
            activeTab === 'skills'
              ? 'bg-neutral-800 dark:bg-white text-white dark:text-neutral-950 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-900'
          }`}
        >
          <Code className="h-4 w-4" />
          <span>Skills Stack ({skills.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl transition-all w-full flex-shrink-0 lg:w-auto ${
            activeTab === 'projects'
              ? 'bg-neutral-800 dark:bg-white text-white dark:text-neutral-950 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-900'
          }`}
        >
          <Code className="h-4 w-4" />
          <span>Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl transition-all w-full flex-shrink-0 lg:w-auto ${
            activeTab === 'branding'
              ? 'bg-neutral-800 dark:bg-white text-white dark:text-neutral-950 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-900'
          }`}
        >
          <Palette className="h-4 w-4" />
          <span>Branding & Styles</span>
        </button>

        <button
          onClick={() => setActiveTab('inbox')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl transition-all w-full relative flex-shrink-0 lg:w-auto ${
            activeTab === 'inbox'
              ? 'bg-neutral-800 dark:bg-white text-white dark:text-neutral-950 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-900'
          }`}
        >
          <Inbox className="h-4 w-4" />
          <span>Messages CRM</span>
          {messages.filter(m => !m.read).length > 0 && (
            <span className="absolute right-2 top-2.5 h-2 w-2 rounded-full bg-rose-500"></span>
          )}
        </button>

        {/* Global Controls */}
        <div className="hidden lg:block pt-6 border-t border-gray-200 dark:border-neutral-800/80 mt-auto space-y-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 w-full text-left px-2.5 py-1.5 text-[11px] text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 font-mono"
          >
            <Download className="h-3.5 w-3.5" />
            Export Portfolio JSON
          </button>

          <label className="flex items-center gap-1.5 w-full text-left px-2.5 py-1.5 text-[11px] text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 font-mono cursor-pointer">
            <Upload className="h-3.5 w-3.5" />
            Import Backup File
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>

          <button
            onClick={onResetToDefault}
            className="flex items-center gap-1.5 w-full text-left px-2.5 py-1.5 text-[11px] text-rose-500/80 hover:text-rose-600 font-mono bg-rose-50/10 hover:bg-rose-50/20 rounded-lg"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Factory Data
          </button>
        </div>
      </div>

      {/* Editor Main Form Area */}
      <div className="flex-1 p-6 lg:p-8 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white overflow-y-auto max-h-[660px]">
        {/* Save feedback banner */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100 dark:border-neutral-800">
          <div>
            <h3 className="font-bold text-lg font-display tracking-tight">
              {activeTab === 'profile' && 'General Profile Info'}
              {activeTab === 'education' && 'Education Directory'}
              {activeTab === 'skills' && 'Skills Taxonomy'}
              {activeTab === 'projects' && 'Projects Directory'}
              {activeTab === 'branding' && 'Styling Theme Studio'}
              {activeTab === 'inbox' && 'Recruiter Contact Mailbox'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Values are bound dynamically to your template preview.</p>
          </div>
          
          <div className="flex items-center gap-2">
            {saveToast && (
              <span className="text-xs text-emerald-500 flex items-center gap-1 animate-fade-in font-medium">
                <CheckCircle className="h-3.5 w-3.5" /> Checked & Saved
              </span>
            )}
          </div>
        </div>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Professional Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Meta Title / Role</label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => handleProfileChange('title', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Brief Deck Bio</label>
              <textarea
                rows={2}
                value={profile.bio}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Comprehensive Career Summary (Long Bio)</label>
              <textarea
                rows={4}
                value={profile.longBio}
                onChange={(e) => handleProfileChange('longBio', e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Direct Professional Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Direct Telephone</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Primary Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => handleProfileChange('location', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Professional Avatar Image URL</label>
                <input
                  type="text"
                  value={profile.avatarUrl}
                  onChange={(e) => handleProfileChange('avatarUrl', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-neutral-800/80">
              <div>
                <label className="block text-2xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">GitHub URL Link</label>
                <input
                  type="text"
                  value={profile.githubUrl}
                  onChange={(e) => handleProfileChange('githubUrl', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">LinkedIn Profile Link</label>
                <input
                  type="text"
                  value={profile.linkedinUrl}
                  onChange={(e) => handleProfileChange('linkedinUrl', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* EDUCATION TAB */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400">{education.length} Academic Records Configured</span>
              <button
                onClick={handleAddEducation}
                className="flex items-center gap-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 px-3.5 py-1.5 text-xs font-semibold cursor-pointer shadow-xs transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Academics Entry
              </button>
            </div>

            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={edu.id} className="border border-gray-200 dark:border-neutral-800 rounded-2xl p-4 bg-gray-50/10 space-y-4 relative font-sans">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-gray-400">Academic Node #{idx + 1}</span>
                    <button
                      onClick={() => handleDeleteEducation(edu.id)}
                      className="text-gray-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50/10 cursor-pointer transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-3xs font-bold tracking-wider text-gray-400 uppercase mb-1">Degree Title</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-3xs font-bold tracking-wider text-gray-400 uppercase mb-1">Institution Name</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleUpdateEducation(edu.id, 'institution', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-3xs font-bold tracking-wider text-gray-400 uppercase mb-1">Start Date</label>
                      <input
                        type="text"
                        value={edu.startDate}
                        onChange={(e) => handleUpdateEducation(edu.id, 'startDate', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-1.5 text-xs focus:outline-none"
                        placeholder="e.g. 2015"
                      />
                    </div>
                    <div>
                      <label className="block text-3xs font-bold tracking-wider text-gray-400 uppercase mb-1">End Date</label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => handleUpdateEducation(edu.id, 'endDate', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-1.5 text-xs focus:outline-none"
                        placeholder="e.g. 2019 or Present"
                      />
                    </div>
                    <div>
                      <label className="block text-3xs font-bold tracking-wider text-gray-400 uppercase mb-1">GPA Grade (Optional)</label>
                      <input
                        type="text"
                        value={edu.gpa || ''}
                        onChange={(e) => handleUpdateEducation(edu.id, 'gpa', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-1.5 text-xs focus:outline-none"
                        placeholder="e.g. 3.8 / 4.0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                    <div>
                      <label className="block text-3xs font-bold tracking-wider text-gray-400 uppercase mb-1">Campus / Location</label>
                      <input
                        type="text"
                        value={edu.location}
                        onChange={(e) => handleUpdateEducation(edu.id, 'location', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-3xs font-bold tracking-wider text-gray-400 uppercase mb-1">Academic Honors & Details</label>
                      <input
                        type="text"
                        value={edu.details || ''}
                        onChange={(e) => handleUpdateEducation(edu.id, 'details', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-1.5 text-xs focus:outline-none"
                        placeholder="e.g. Graduated Summa Cum Laude, Thesis: UI Systems"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-neutral-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-display">Skills Taxonomy</h3>
                <p className="text-[11px] text-gray-500 font-mono mt-0.5">{skills.length} Technical Skills Registered</p>
              </div>
              <button
                onClick={() => handleAddSkill('Languages')}
                className="flex items-center gap-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 px-3.5 py-1.5 text-xs font-semibold cursor-pointer shadow-xs transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Skill
              </button>
            </div>

            <div className="space-y-6">
              {(['Languages', 'Frameworks', 'Tools', 'Frontend', 'Backend', 'Design', 'Others'] as const).map((cat) => {
                const categorizedSkills = skills.filter((s) => s.category === cat);
                
                return (
                  <div key={cat} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#007a64] dark:text-[#10b981]">
                          {cat}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-500 font-mono border border-neutral-200/50 dark:border-neutral-800/50">
                          {categorizedSkills.length}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleAddSkill(cat)}
                        className="flex items-center gap-1 text-[10px] bg-[#f0fbf9] hover:bg-[#dff7f2] text-[#007a64] dark:bg-[#10b981]/10 dark:hover:bg-[#10b981]/20 dark:text-[10b981] px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer"
                      >
                        <Plus className="h-3 w-3" /> Add to {cat}
                      </button>
                    </div>

                    {categorizedSkills.length === 0 ? (
                      <div className="border border-dashed border-gray-200 dark:border-neutral-800 rounded-xl p-4 text-center bg-gray-50/10 dark:bg-neutral-900/5">
                        <p className="text-[11px] text-gray-500 font-sans font-medium">No skills defined in this section yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categorizedSkills.map((s) => (
                          <div key={s.id} className="border border-gray-200 dark:border-neutral-800 rounded-xl p-3 bg-white dark:bg-neutral-950 flex items-center gap-2 shadow-3xs hover:shadow-2xs transition-shadow">
                            <div className="flex-1 space-y-2">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={s.name}
                                  onChange={(e) => handleUpdateSkill(s.id, 'name', e.target.value)}
                                  className="font-semibold text-xs bg-gray-50/50 dark:bg-neutral-900/50 rounded-lg border border-gray-200/80 dark:border-neutral-800/80 px-2.5 py-1 flex-1 focus:outline-none focus:border-[#007a64]"
                                />
                                
                                <select
                                  value={s.category}
                                  onChange={(e) => handleUpdateSkill(s.id, 'category', e.target.value)}
                                  className="text-[10px] uppercase font-mono bg-gray-50/50 dark:bg-neutral-900/50 rounded-lg border border-gray-200/80 dark:border-neutral-800/80 px-2 py-1 focus:outline-none focus:border-[#007a64] max-w-[110px]"
                                >
                                  <option value="Languages">Languages</option>
                                  <option value="Frameworks">Frameworks</option>
                                  <option value="Tools">Tools</option>
                                  <option value="Frontend">Frontend</option>
                                  <option value="Backend">Backend</option>
                                  <option value="Design">Design</option>
                                  <option value="Others">Others</option>
                                </select>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-[11px] font-mono text-gray-400 w-8">{s.level}%</span>
                                <input
                                  type="range"
                                  min="10"
                                  max="100"
                                  step="5"
                                  value={s.level}
                                  onChange={(e) => handleUpdateSkill(s.id, 'level', parseInt(e.target.value))}
                                  className="flex-1 h-1 bg-gray-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer text-[#007a64]"
                                />
                              </div>
                            </div>

                            <button
                              onClick={() => handleDeleteSkill(s.id)}
                              className="text-gray-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50/20 transition-all cursor-pointer"
                              title="Remove Skill Record"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400">{projects.length} Total Projects Configured</span>
              <button
                onClick={handleAddProject}
                className="flex items-center gap-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 px-3.5 py-1.5 text-xs font-semibold cursor-pointer shadow-xs transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Project
              </button>
            </div>

            <div className="space-y-4">
              {projects.map((p, idx) => (
                <div key={p.id} className="border border-gray-200 dark:border-neutral-800 rounded-2xl p-4 bg-gray-50/10 space-y-4 relative font-sans">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-gray-400">Project #{idx + 1}</span>
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="text-gray-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50/10 cursor-pointer transition-colors"
                      title="Delete Project Entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-3xs font-bold tracking-wider text-gray-400 uppercase mb-1">Project Name</label>
                      <input
                        type="text"
                        value={p.title}
                        onChange={(e) => handleUpdateProject(p.id, 'title', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-3xs font-bold tracking-wider text-gray-400 uppercase mb-1">Banner Mockup URL</label>
                      <input
                        type="text"
                        value={p.imageUrl}
                        onChange={(e) => handleUpdateProject(p.id, 'imageUrl', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-1.5 text-xs font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-3xs font-bold tracking-wider text-gray-400 mb-1 uppercase">Brief Hook Description</label>
                    <input
                      type="text"
                      value={p.description}
                      onChange={(e) => handleUpdateProject(p.id, 'description', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-1.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-bold tracking-wider text-gray-400 mb-1 uppercase font-semibold">Deep Dive Technical Specifications</label>
                    <textarea
                      rows={3}
                      value={p.longDescription}
                      onChange={(e) => handleUpdateProject(p.id, 'longDescription', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-3xs font-bold tracking-wider text-gray-400 mb-1 uppercase">Core Tools & Tech (Comma Separated)</label>
                      <input
                        type="text"
                        value={p.tags.join(', ')}
                        onChange={(e) => handleUpdateProject(p.id, 'tags', e.target.value.split(',').map(tag => tag.trim()))}
                        className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-1.5 text-xs font-mono focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id={`featured-${p.id}`}
                        checked={p.featured}
                        onChange={(e) => handleUpdateProject(p.id, 'featured', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`featured-${p.id}`} className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer">
                        Featured Showcase
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-1">
                    <div>
                      <label className="block text-3xs font-bold tracking-wider text-gray-400 mb-1 uppercase">Live Demo Link (Optional)</label>
                      <input
                        type="text"
                        value={p.demoUrl || ''}
                        onChange={(e) => handleUpdateProject(p.id, 'demoUrl', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-1.5 text-xs font-mono focus:outline-none"
                        placeholder="https://example.com/demo"
                      />
                    </div>

                    <div>
                      <label className="block text-3xs font-bold tracking-wider text-gray-400 mb-1 uppercase">GitHub Repository (Optional)</label>
                      <input
                        type="text"
                        value={p.githubUrl || ''}
                        onChange={(e) => handleUpdateProject(p.id, 'githubUrl', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-1.5 text-xs font-mono focus:outline-none"
                        placeholder="https://github.com/profile/repo"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BRANDING TAB */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            {/* Theme Modes */}
            <div className="space-y-3">
              <label className="block text-2xs font-bold text-gray-400 uppercase tracking-wider">Interface Visual Shell</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleSettingsChange('themeMode', 'dark')}
                  className={`border rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                    settings.themeMode === 'dark'
                      ? 'border-neutral-900 bg-neutral-950 text-white ring-2 ring-blue-500/10'
                      : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="h-6 w-12 bg-neutral-800 rounded border border-neutral-700 flex items-center justify-center text-[9px] font-mono">DARK</div>
                  <span className="text-xs font-semibold">Pitch Obsidian Black</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSettingsChange('themeMode', 'light')}
                  className={`border rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                    settings.themeMode === 'light'
                      ? 'border-blue-500 bg-blue-50/10 text-neutral-900 ring-2 ring-blue-500/10'
                      : 'border-gray-200 bg-white dark:bg-neutral-950 text-gray-800 dark:text-neutral-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="h-6 w-12 bg-gray-100 rounded border border-gray-300 flex items-center justify-center text-[9px] text-gray-600 font-mono">LIGHT</div>
                  <span className="text-xs font-semibold">Chalk Editorial White</span>
                </button>
              </div>
            </div>

            {/* Primary Accent Color Palette Toggle */}
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-neutral-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="block text-2xs font-bold text-gray-400 uppercase tracking-wider">
                  Primary Theme Color Palette Toggle
                </label>
                <span className="text-[10px] text-gray-500 font-mono">
                  Currently active: <strong className="text-neutral-850 dark:text-neutral-200 capitalize">{settings.accentColorName || 'blue'}</strong>
                </span>
              </div>
              
              <div className="bg-gray-100/60 dark:bg-neutral-950 p-1.5 rounded-2xl border border-gray-200/60 dark:border-neutral-800/80 flex flex-col sm:flex-row gap-1.5 w-full justify-between">
                {[
                  { label: 'Slate steel', name: 'slate', hex: '#64748b', bgClass: 'bg-slate-500' },
                  { label: 'Royal Blue', name: 'blue', hex: '#3b82f6', bgClass: 'bg-blue-500' },
                  { label: 'Emerald Mint', name: 'emerald', hex: '#10b981', bgClass: 'bg-emerald-500' },
                ].map((palette) => {
                  const isActive = settings.accentColor === palette.hex;
                  return (
                    <button
                      key={palette.name}
                      type="button"
                      onClick={() => {
                        handleSettingsChange('accentColor', palette.hex);
                        handleSettingsChange('accentColorName', palette.name);
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-white dark:bg-neutral-900 shadow-sm border border-gray-200 dark:border-neutral-800 text-neutral-900 dark:text-white'
                          : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-gray-100/80 dark:hover:bg-neutral-900/60 border border-transparent'
                      }`}
                    >
                      <span className={`h-3 w-3 rounded-full shrink-0 ${palette.bgClass} shadow-xs`}></span>
                      <span>{palette.label}</span>
                      {isActive && (
                        <span className={`h-1.5 w-1.5 rounded-full ${palette.bgClass}`}></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Highlight Selection */}
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-neutral-800">
              <label className="block text-2xs font-bold text-gray-400 uppercase tracking-wider">All Accent Highlight Swatches</label>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                {colorPresets.map((palette) => (
                  <button
                    key={palette.name}
                    type="button"
                    onClick={() => {
                      handleSettingsChange('accentColor', palette.hex);
                      handleSettingsChange('accentColorName', palette.name);
                    }}
                    className={`rounded-xl border p-2 flex flex-col items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all text-center ${
                      settings.accentColor === palette.hex
                        ? 'border-neutral-800 dark:border-white ring-2 ring-neutral-300 dark:ring-neutral-700'
                        : 'border-gray-200 dark:border-neutral-800'
                    }`}
                  >
                    <span className="h-5 w-5 rounded-full shadow-inner" style={{ backgroundColor: palette.hex }}></span>
                    <span className="text-[10px] font-medium leading-none truncate w-full">{palette.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Aesthetics selection */}
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-neutral-800">
              <label className="block text-2xs font-bold text-gray-400 uppercase tracking-wider">Portfolio Layout Structure</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(['bento', 'minimal', 'editorial'] as const).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => handleSettingsChange('layoutStyle', style)}
                    className={`border rounded-xl p-3 text-left transition-all cursor-pointer ${
                      settings.layoutStyle === style
                        ? 'border-neutral-800 dark:border-white bg-neutral-50 dark:bg-neutral-950 font-semibold'
                        : 'border-gray-200 dark:border-neutral-800 bg-white hover:bg-gray-50 dark:bg-neutral-900'
                    }`}
                  >
                    <div className="text-xs uppercase font-mono mb-1 text-gray-400">
                      {style === 'bento' && 'Grid Matrix'}
                      {style === 'minimal' && 'Centered Column'}
                      {style === 'editorial' && 'Split Screen'}
                    </div>
                    <p className="text-[11px] text-gray-500 font-sans leading-relaxed">
                      {style === 'bento' && 'Fluid bento structures, dynamic metrics, and rich borders.'}
                      {style === 'minimal' && 'Centered typographic details, spacious negative spacing.'}
                      {style === 'editorial' && 'Left sticky profile details, scrollable structural cards.'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INBOX CRM TAB */}
        {activeTab === 'inbox' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2 dark:border-neutral-800">
              <span className="text-xs font-mono text-gray-400">{messages.length} Messages Logged</span>
              {messages.length > 0 && (
                <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
                  ● Virtual CRM Online
                </span>
              )}
            </div>

            {messages.length === 0 ? (
              <div className="text-center py-12 text-gray-400 font-sans border border-dashed rounded-2xl dark:border-neutral-800">
                <Mail className="h-8 w-8 mx-auto text-neutral-500 mb-2 opacity-40" />
                <h4 className="font-semibold text-sm text-neutral-700 dark:text-neutral-300">No Messages Yet</h4>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                  When a recruiter fills out the contact form, their message will appear instantly right here!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((m) => (
                  <div 
                    key={m.id} 
                    className={`border rounded-2xl p-4 transition-all ${
                      m.read 
                        ? 'border-gray-200 dark:border-neutral-800/80 bg-gray-50/20 dark:bg-neutral-950/20 opacity-80' 
                        : 'border-blue-200 dark:border-neutral-700/60 bg-blue-500/5 ring-1 ring-blue-500/10'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b dark:border-neutral-800/60 pb-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-neutral-990 dark:text-white">{m.name}</span>
                          <span className="text-[10px] font-mono text-gray-400">{m.email}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{m.subject}</h4>
                      </div>

                      <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1.5 flex-shrink-0">
                        <span>{m.timestamp}</span>
                        <button
                          onClick={() => onDeleteMessage(m.id)}
                          className="text-gray-400 hover:text-rose-500 p-0.5 rounded transition-all cursor-pointer"
                          title="Delete message log"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans mt-2 whitespace-pre-wrap">
                      {m.message}
                    </p>

                    {!m.read && (
                      <div className="flex justify-end mt-3 border-t dark:border-neutral-800/60 pt-2">
                        <button
                          onClick={() => onMarkAsReadMessage(m.id)}
                          className="flex items-center gap-1 text-[10px] font-bold text-blue-500 uppercase tracking-wider hover:underline cursor-pointer"
                        >
                          <CheckCircle className="h-3 w-3" /> Mark as Read
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
