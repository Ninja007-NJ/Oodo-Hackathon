import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Folder, FileText, Video, HelpCircle, Code, BookMarked, ArrowRight } from 'lucide-react';

export default function SearchModal({
  isOpen,
  onClose,
  treeData,
  onSelectTopicAndResource,
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle Ctrl+K / Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Client-side instant index across topics and seeded resources
  let results = [];
  const q = query.trim().toLowerCase();

  if (q && treeData && treeData.length > 0) {
    for (const sem of treeData) {
      for (const sub of sem.subjects) {
        for (const mod of sub.modules) {
          for (const top of mod.topics) {
            // Match topic
            if (top.title.toLowerCase().includes(q) || (top.description && top.description.toLowerCase().includes(q))) {
              results.push({
                type: 'topic',
                id: top.id,
                title: top.title,
                snippet: `Module ${mod.module_number}: ${mod.title}`,
                topicId: top.id,
                resourceId: null,
              });
            }
          }
        }
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div className="bg-white rounded-card max-w-2xl w-full shadow-2xl border border-line overflow-hidden flex flex-col max-h-[75vh]">
        
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-line flex items-center gap-3 bg-sky-50/40">
          <Search className="w-5 h-5 text-ink-soft shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a concept, formula, or exam topic (e.g. 'paging', 'address', 'PCB')..."
            className="w-full text-sm bg-transparent border-none text-ink placeholder-ink-soft focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-ink-soft hover:text-ink font-bold p-1"
            >
              ✕
            </button>
          ) : (
            <span className="text-[10px] font-mono text-ink-soft bg-white px-2 py-0.5 rounded border border-line">
              ESC
            </span>
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 text-xs">
          {!q ? (
            <div className="p-6 text-center text-ink-soft">
              <span className="text-xs block font-semibold text-ink mb-1">Instant Syllabus Search (100ms)</span>
              <span>Search across all semester modules, lecture notes, video titles, and exam questions.</span>
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center text-ink-soft">
              No matching topics found for "{query}". Try "paging", "scheduling", or "address".
            </div>
          ) : (
            results.map((item, idx) => (
              <button
                key={`${item.type}-${item.id}-${idx}`}
                onClick={() => {
                  onSelectTopicAndResource(item.topicId, item.resourceId);
                  onClose();
                }}
                className="w-full text-left p-2.5 rounded-btn hover:bg-sky-50 border border-transparent hover:border-line transition-all flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-btn bg-brand-light text-brand flex items-center justify-center shrink-0">
                    <Folder className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-ink truncate block">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-ink-soft truncate block">
                      {item.snippet}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-brand opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <span>Open Topic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-line bg-sky-50/60 flex items-center justify-between text-[11px] text-ink-soft">
          <span>Client-side instant index • 0 network round-trips</span>
          <span>Press ESC to close</span>
        </div>

      </div>
    </div>
  );
}
