import React from 'react';
import { Search, ChevronRight, FileText, Video, HelpCircle, Code, BookMarked, Folder } from 'lucide-react';

export default function SearchResults({
  results,
  searchQuery,
  onSelectTopic,
  onClose,
}) {
  if (!searchQuery || !searchQuery.trim()) return null;

  return (
    <div className="bg-white border-b border-slate-200 shadow-md px-4 py-4 max-h-96 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-700">
            Search Results for <span className="text-blue-600">"{searchQuery}"</span>
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {results.length} {results.length === 1 ? 'match' : 'matches'} found
          </span>
        </div>

        {results.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No topics or resources matched your search query. Try searching for "paging", "address", or "CPU".
          </div>
        ) : (
          <div className="space-y-2">
            {results.map((item, index) => {
              const isTopic = item.type === 'topic';

              return (
                <button
                  key={`${item.type}-${item.id}-${index}`}
                  onClick={() => {
                    if (item.topic_id) {
                      onSelectTopic(item.topic_id);
                    }
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-50 border border-slate-100 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 text-slate-600">
                      {isTopic ? (
                        <Folder className="w-4 h-4 text-blue-600" />
                      ) : (
                        <FileText className="w-4 h-4 text-slate-600" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          {isTopic ? 'Syllabus Topic' : item.resource_type}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {item.subject_name} › {item.module_title}
                        {item.topic_title && ` › ${item.topic_title}`}
                      </div>

                      {item.snippet && (
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-1 italic">
                          "{item.snippet}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 shrink-0">
                    <span>Jump to Topic</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
