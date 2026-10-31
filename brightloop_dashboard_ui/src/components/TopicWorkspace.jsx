import React, { useState } from 'react';
import CoverageBanner from './CoverageBanner';
import ResourceCard from './ResourceCard';
import { Layers, Plus, Filter, FolderOpen, Star, Lock, Users } from 'lucide-react';

export default function TopicWorkspace({
  topicDetail,
  bookmarkedOnly,
  currentSpace,
  onOpenAddModal,
  onToggleBookmark,
  onToggleVisibility,
  onDeleteResource,
  onUpdateCoverage,
}) {
  const [selectedFormat, setSelectedFormat] = useState('all');

  if (!topicDetail) {
    return (
      <main className="flex-1 p-8 flex items-center justify-center text-slate-400">
        <div className="text-center">
          <FolderOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-semibold text-slate-700">Select a Topic</h3>
          <p className="text-xs text-slate-400 mt-1">
            Choose a module and topic from the syllabus tree on the left.
          </p>
        </div>
      </main>
    );
  }

  // Filter resources
  let resources = topicDetail.resources || [];
  if (bookmarkedOnly) {
    resources = resources.filter((r) => r.is_bookmarked);
  }
  if (currentSpace === 'shared') {
    resources = resources.filter((r) => r.visibility === 'shared' || !r.is_private);
  }
  if (selectedFormat !== 'all') {
    resources = resources.filter((r) => r.type === selectedFormat);
  }

  const rawResources = topicDetail.resources || [];
  const spaceFiltered = currentSpace === 'shared'
    ? rawResources.filter((r) => r.visibility === 'shared' || !r.is_private)
    : rawResources;

  const counts = {
    all: spaceFiltered.length,
    video: spaceFiltered.filter((r) => r.type === 'video').length,
    pdf: spaceFiltered.filter((r) => r.type === 'pdf').length,
    pyq: spaceFiltered.filter((r) => r.type === 'pyq').length,
    repo: spaceFiltered.filter((r) => r.type === 'repo').length,
    reference: spaceFiltered.filter((r) => r.type === 'reference').length,
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Breadcrumb Header & Active Space Indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>{topicDetail.subject_code}: {topicDetail.subject_name}</span>
              <span>›</span>
              <span>Module {topicDetail.module_number}: {topicDetail.module_title}</span>
              <span>›</span>
              <span className="text-blue-600 font-semibold">{topicDetail.title}</span>
            </div>

            <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              currentSpace === 'private'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-indigo-50 text-indigo-800 border-indigo-200'
            }`}>
              {currentSpace === 'private' ? <Lock className="w-3 h-3" /> : <Users className="w-3 h-3" />}
              <span>{currentSpace === 'private' ? 'My Study Space' : 'Class Shared Library'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1.5">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {topicDetail.title}
              </h1>
              {topicDetail.description && (
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  {topicDetail.description}
                </p>
              )}
            </div>

            <button
              onClick={() => onOpenAddModal(topicDetail.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm shadow-blue-500/20 transition-all cursor-pointer self-start sm:self-center shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource to Topic</span>
            </button>
          </div>
        </div>

        {/* Syllabus Coverage Validator Banner */}
        <CoverageBanner
          topic={topicDetail}
          onOpenAddModal={() => onOpenAddModal(topicDetail.id)}
          onUpdateCoverage={onUpdateCoverage}
        />

        {/* Multi-Format Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6 gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'All Resources', count: counts.all },
              { id: 'video', label: '🎥 Videos', count: counts.video },
              { id: 'pdf', label: '📄 Lecture Notes', count: counts.pdf },
              { id: 'pyq', label: '📝 Exam PYQs', count: counts.pyq },
              { id: 'repo', label: '💻 Code Repos', count: counts.repo },
              { id: 'reference', label: '📚 Textbooks', count: counts.reference },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFormat(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  selectedFormat === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedFormat === tab.id
                      ? 'bg-slate-800 text-slate-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {bookmarkedOnly && (
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Bookmarks Only
            </span>
          )}
        </div>

        {/* Resources Grid / Stack */}
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onToggleBookmark={onToggleBookmark}
                onToggleVisibility={onToggleVisibility}
                onDeleteResource={onDeleteResource}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              {bookmarkedOnly
                ? 'No bookmarked resources under this topic'
                : currentSpace === 'shared'
                ? 'No shared class resources published yet'
                : 'No resources found under this filter'}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              {bookmarkedOnly
                ? 'Star any lecture notes, video, or past questions to bookmark it for quick exam revision.'
                : 'Attach a PDF, paste a YouTube lecture link, or upload an exam question to complete your topic syllabus coverage.'}
            </p>
            <button
              onClick={() => onOpenAddModal(topicDetail.id)}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource to Topic</span>
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
