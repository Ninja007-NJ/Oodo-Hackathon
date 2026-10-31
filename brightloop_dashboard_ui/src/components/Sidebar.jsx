import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  Layers, 
  Star, 
  AlertCircle, 
  Trophy, 
  LayoutDashboard, 
  Lock, 
  Users, 
  GraduationCap
} from 'lucide-react';

export default function Sidebar({
  treeData,
  selectedTopicId,
  onSelectTopic,
  activeView,
  setActiveView,
  currentSpace,
  setCurrentSpace,
  stats,
}) {
  const [expandedModules, setExpandedModules] = useState({ 3: true, 1: false, 2: false, 4: false });

  const toggleModule = (id) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentSemester = treeData[0];
  const currentSubject = currentSemester?.subjects[0];

  return (
    <aside className="w-full md:w-72 lg:w-80 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800 selection:bg-blue-600 selection:text-white">
      
      {/* 1. TWO CONNECTED SPACES SWITCHER (From PR003 Page 2) */}
      <div className="p-3 border-b border-slate-800">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5 px-1">
          Active Workspace
        </div>
        <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setCurrentSpace('private')}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              currentSpace === 'private'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>My Space</span>
          </button>

          <button
            onClick={() => setCurrentSpace('shared')}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              currentSpace === 'shared'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Shared Library</span>
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 px-1 text-center">
          {currentSpace === 'private' ? '🔒 Private by default: only you can access' : '👥 Class 4-CS-A shared resources & past exams'}
        </p>
      </div>

      {/* 2. PRIMARY NAVIGATION VIEWS */}
      <div className="p-3 border-b border-slate-800 space-y-1">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            activeView === 'dashboard'
              ? 'bg-slate-800 text-white font-bold'
              : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-blue-400" />
            <span>Course Dashboard</span>
          </div>
          <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded font-mono font-bold">
            {stats?.coverage_percent || 70}%
          </span>
        </button>

        <button
          onClick={() => setActiveView('topic')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            activeView === 'topic'
              ? 'bg-slate-800 text-white font-bold'
              : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Topic Workspace</span>
          </div>
          <span className="text-[10px] text-blue-400 font-mono">Hero View</span>
        </button>

        <button
          onClick={() => setActiveView('missing')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            activeView === 'missing'
              ? 'bg-slate-800 text-white font-bold'
              : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Missing Topics Hub</span>
          </div>
          <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.2 rounded font-bold">
            {stats?.not_found || 1} gaps
          </span>
        </button>

        <button
          onClick={() => setActiveView('competitor')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            activeView === 'competitor'
              ? 'bg-slate-800 text-white font-bold'
              : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Track A: Competitor Matrix</span>
          </div>
          <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.2 rounded font-bold">
            Step 2
          </span>
        </button>
      </div>

      {/* 3. SYLLABUS ACCORDION TREE */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="flex items-center justify-between px-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
          <span>Syllabus Hierarchy</span>
          <span className="text-slate-400 font-mono">{currentSubject?.code}</span>
        </div>

        {currentSubject?.modules.map((mod) => {
          const isExpanded = !!expandedModules[mod.id];
          const isDemoModule = mod.module_number === 3;

          return (
            <div
              key={mod.id}
              className={`rounded-xl border transition-all ${
                isDemoModule ? 'border-blue-500/40 bg-slate-950' : 'border-slate-800 bg-slate-950/60'
              }`}
            >
              {/* Module Header */}
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center justify-between p-2.5 text-left hover:bg-slate-800/40 transition-colors rounded-xl cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span className={`text-xs font-bold truncate ${isDemoModule ? 'text-blue-300' : 'text-slate-200'}`}>
                    Mod {mod.module_number}: {mod.title}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-1">
                  {mod.topics.length}
                </span>
              </button>

              {/* Topics inside Module */}
              {isExpanded && (
                <div className="pl-4 pr-2 pb-2 space-y-1">
                  {mod.topics.map((t) => {
                    const isSelected = t.id === selectedTopicId && activeView === 'topic';

                    let dotColor = 'bg-slate-400';
                    if (t.coverage_status === 'Covered') dotColor = 'bg-emerald-400';
                    if (t.coverage_status === 'Partially Covered') dotColor = 'bg-amber-400';
                    if (t.coverage_status === 'Not Found') dotColor = 'bg-rose-400';

                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          onSelectTopic(t.id);
                          setActiveView('topic');
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white font-semibold shadow-xs'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                          <span className="truncate">{t.title}</span>
                        </div>
                        <span className={`text-[10px] font-mono shrink-0 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                          {t.resources_count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. FOOTER: USER INFO */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            N
          </div>
          <div>
            <span className="font-semibold text-slate-200 block text-xs leading-none">Niranjan</span>
            <span className="text-[10px] text-slate-400 leading-none">Semester 4 • CS-A</span>
          </div>
        </div>
        <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
          Online
        </span>
      </div>

    </aside>
  );
}
