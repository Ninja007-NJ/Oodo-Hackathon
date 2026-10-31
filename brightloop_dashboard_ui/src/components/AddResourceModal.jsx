import React, { useState, useEffect } from 'react';
import { X, Link2, Upload, Video, FileText, HelpCircle, Code, BookMarked, Lock, Users, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AddResourceModal({
  isOpen,
  onClose,
  treeData,
  currentTopicId,
  onSubmit,
}) {
  const [step, setStep] = useState(1); // Step 1: Resource info, Step 2: Topic assignment & Visibility
  const [mode, setMode] = useState('url'); // 'url' or 'file'
  const [type, setType] = useState('video');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('');
  const [notes, setNotes] = useState('');
  const [metadataInfo, setMetadataInfo] = useState('');
  const [visibility, setVisibility] = useState('private'); // 'private' or 'shared'
  const [selectedTopicId, setSelectedTopicId] = useState(currentTopicId || 2);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentTopicId) setSelectedTopicId(currentTopicId);
  }, [currentTopicId]);

  if (!isOpen) return null;

  // Flatten topics list for topic selector
  const topicsList = [];
  if (treeData && treeData.length > 0) {
    for (const sem of treeData) {
      for (const sub of sem.subjects) {
        for (const mod of sub.modules) {
          for (const top of mod.topics) {
            topicsList.push({
              id: top.id,
              moduleNumber: mod.module_number,
              moduleTitle: mod.title,
              title: top.title,
              label: `Mod ${mod.module_number}: ${top.title}`,
            });
          }
        }
      }
    }
  }

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a title');
      return;
    }

    if (mode === 'url' && !url.trim()) {
      setError('Please paste a valid URL link');
      return;
    }

    if (mode === 'file' && !selectedFile) {
      setError('Please choose a file to upload');
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('type', type);
      formData.append('original_source', source.trim() || 'Student Contribution');
      formData.append('notes', notes.trim());
      formData.append('metadata_info', metadataInfo.trim());
      formData.append('visibility', visibility);
      formData.append('topic_ids', String(selectedTopicId));

      if (mode === 'file' && selectedFile) {
        formData.append('file', selectedFile);
      } else {
        formData.append('url_or_filepath', url.trim());
      }

      await onSubmit(formData);
      // Reset form
      setStep(1);
      setTitle('');
      setUrl('');
      setNotes('');
      setSource('');
      setSelectedFile(null);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Add Learning Resource</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {step === 1 ? 'Step 1 of 2: Resource Content & Source' : 'Step 2 of 2: Syllabus Assignment & Permissions'}
            </p>
          </div>
          <button
            onClick={() => {
              setStep(1);
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-2 gap-2 my-3">
          <div className={`h-1.5 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
          <div className={`h-1.5 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
        </div>

        {error && (
          <div className="mb-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* STEP 1: Content details */}
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-3.5 text-xs">
            {/* Mode Switch: URL vs File */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setMode('url')}
                className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'url' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Paste Web / Video URL</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('file');
                  setType('pdf');
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'file' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload PDF / File</span>
              </button>
            </div>

            {/* Type selector */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Format Type
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'video', label: 'Video', icon: Video },
                  { id: 'pdf', label: 'PDF / Notes', icon: FileText },
                  { id: 'pyq', label: 'Exam PYQ', icon: HelpCircle },
                  { id: 'repo', label: 'GitHub Repo', icon: Code },
                  { id: 'reference', label: 'Textbook', icon: BookMarked },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setType(item.id)}
                      className={`flex items-center gap-1.5 p-2 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                        type === item.id
                          ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Resource Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Inverted Page Table Architecture Summary"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>

            {/* URL or File */}
            {mode === 'url' ? (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Source URL Link *
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://github.com/..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>
            ) : (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select File (PDF, Word, or Notes) *
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            )}

            {/* Source & Metadata */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Source Attribution
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. Gate Smashers / Class Notes"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Metadata / Tag
                </label>
                <input
                  type="text"
                  value={metadataInfo}
                  onChange={(e) => setMetadataInfo(e.target.value)}
                  placeholder="e.g. 10 Marks • Exam 2024"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Key Concept Takeaways / Summary
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Important formulas, page numbers, or quick summary for exam revision..."
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer"
              >
                <span>Continue to Step 2</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Topic Assignment & Visibility */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Topic Assignment */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Assign to Syllabus Topic *
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Every learning resource in LearnHub must be mapped to an exact syllabus topic.
              </p>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(Number(e.target.value))}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
              >
                {topicsList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Visibility: Private by default vs Shared with Class */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Visibility & Privacy Setting
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVisibility('private')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    visibility === 'private'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    <span>My Study Space (Private)</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Private by default. Only visible to you in your personal study space.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility('shared')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    visibility === 'shared'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Shared Library (Class)</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Share with Class 4-CS-A classmates with your attribution.
                  </p>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Step 1</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Adding to Syllabus...' : 'Save & Assign to Topic'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
