import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  Lock, 
  Users, 
  HelpCircle,
  FileQuestion
} from 'lucide-react';

export default function SyllabusTree({
  treeData,
  selectedTopicId,
  onSelectTopic,
  currentSpace,
  setCurrentSpace,
  onPrefetchTopic,
}) {
  const [expandedModules, setExpandedModules] = useState({ 3: true, 1: true, 2: false, 4: false });

  const toggleModule = (modId) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const currentSemester = treeData[0];
  const currentSubject = currentSemester?.subjects[0];

  const renderStatusDot = (status) => {
    switch (status) {
      case 'Covered':
        return <span className="w-2.5 h-2.5 rounded-full bg-status-covered shrink-0" title="Covered (evidence verified)" />;
      case 'Partially Covered':
        return <span className="w-2.5 h-2.5 rounded-full bg-status-partial shrink-0" title="Partially covered (gaps detected)" />;
      case 'Needs Review':
        return <span className="w-2.5 h-2.5 rounded-full bg-status-review shrink-0" title="Needs review" />;
      default:
        return <span className="w-2.5 h-2.5 rounded-full bg-status-missing border border-slate-300 shrink-0" title="Not found (missing)" />;
    }
  };

  return (
    <aside className="w-full md:w-72 lg:w-80 bg-white border-r border-line flex flex-col shrink-0 min-h-[calc(100vh-3.75rem)] select-none">
      
      {/* 1. Connected Spaces Switcher */}
      <div className="p-3.5 border-b border-line bg-sky-50/50">
        <div className="text-[10px] uppercase font-bold tracking-wider text-ink-soft mb-1.5 px-0.5">
          Workspace Space
        </div>
        <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-btn border border-line shadow-xs">
          <button
            onClick={() => setCurrentSpace('private')}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-btn transition-all cursor-pointer ${
              currentSpace === 'private'
                ? 'bg-brand text-white shadow-xs'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>My Space</span>
          </button>
          <button
            onClick={() => setCurrentSpace('shared')}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-btn transition-all cursor-pointer ${
              currentSpace === 'shared'
                ? 'bg-brand text-white shadow-xs'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Class Library</span>
          </button>
        </div>
      </div>

      {/* 2. Course Header & Status Legend */}
      <div className="px-4 py-3 border-b border-line">
        <div className="flex items-center justify-between text-[11px] text-ink-soft font-medium mb-1">
          <span>Semester {currentSemester?.number || 4} • 2026</span>
          <span className="font-mono bg-sky-100 text-brand px-1.5 py-0.5 rounded text-[10px] font-bold">
            {currentSubject?.code || 'CS304'}
          </span>
        </div>
        <h2 className="font-bold text-ink text-sm leading-snug">
          {currentSubject?.name || 'Operating Systems'}
        </h2>

        {/* Status dots legend */}
        <div className="flex items-center justify-between text-[10px] text-ink-soft mt-2 pt-2 border-t border-line/60">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-status-covered" /> Covered
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-status-partial" /> Partial
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-status-missing" /> Missing
          </span>
        </div>
      </div>

      {/* 3. Syllabus Tree Modules & Topics */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="text-[10px] uppercase font-bold tracking-wider text-ink-soft px-1 mb-1">
          Syllabus Hierarchy
        </div>

        {currentSubject?.modules.map((mod) => {
          const isExpanded = !!expandedModules[mod.id];
          const isHero = mod.module_number === 3;

          return (
            <div
              key={mod.id}
              className={`rounded-card border transition-all ${
                isHero ? 'border-brand/40 bg-brand-light/20' : 'border-line bg-white'
              }`}
            >
              {/* Module Header */}
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center justify-between p-2.5 text-left hover:bg-sky-50 transition-colors rounded-card cursor-pointer"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-ink-soft shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-ink-soft shrink-0" />
                  )}
                  <span className={`text-xs font-bold truncate ${isHero ? 'text-brand' : 'text-ink'}`}>
                    Mod {mod.module_number}: {mod.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-ink-soft shrink-0 ml-1">
                  {mod.topics.length}
                </span>
              </button>

              {/* Topics List */}
              {isExpanded && (
                <div className="pl-4 pr-2 pb-2 pt-0.5 space-y-1">
                  {mod.topics.map((t) => {
                    const isSelected = t.id === selectedTopicId;

                    return (
                      <button
                        key={t.id}
                        onClick={() => onSelectTopic(t.id)}
                        onMouseEnter={() => onPrefetchTopic && onPrefetchTopic(t.id)}
                        onFocus={() => onPrefetchTopic && onPrefetchTopic(t.id)}
                        className={`w-full text-left p-2 rounded-btn text-xs transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-brand text-white font-semibold shadow-xs'
                            : 'text-ink hover:bg-sky-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {renderStatusDot(t.coverage_status)}
                          <span className="truncate">{t.title}</span>
                        </div>
                        <span className={`text-[10px] font-mono shrink-0 ${isSelected ? 'text-blue-100' : 'text-ink-soft'}`}>
                          {t.resources_count || 0}
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

      {/* Footer Info */}
      <div className="p-3 border-t border-line text-[11px] text-ink-soft bg-sky-50/40">
        <p className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-brand shrink-0" />
          <span>Curriculum: 2026 End-Sem Exam Spec</span>
        </p>
      </div>

    </aside>
  );
}
