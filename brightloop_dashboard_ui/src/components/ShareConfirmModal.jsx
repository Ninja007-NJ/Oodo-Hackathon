import React from 'react';
import { X, Users, Lock, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ShareConfirmModal({
  isOpen,
  resource,
  onClose,
  onConfirm,
}) {
  if (!isOpen || !resource) return null;

  const isShared = resource.visibility === 'shared';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-card max-w-md w-full p-6 shadow-card border border-line text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-btn bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-ink">
              {isShared ? 'Manage Class Sharing' : 'Share with Your Class?'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 text-ink">
          <p className="text-xs leading-relaxed">
            Resource: <strong className="text-ink">{resource.title}</strong>
          </p>

          <div className="p-3 bg-sky-50 border border-line rounded-btn space-y-1.5">
            <span className="font-bold text-brand block">PR003 Privacy & Attribution Safeguard:</span>
            <p className="text-[11px] text-ink-soft leading-relaxed">
              {isShared
                ? 'This material is currently visible to all students in Class 4-CS-A with your attribution. You can revoke it back to your private space at any time.'
                : 'Classmates will see your name (Niranjan) as the contributor. The link or upload will be indexed under this syllabus topic in the Class Shared Library.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-ink-soft">
            <ShieldCheck className="w-4 h-4 text-status-covered shrink-0" />
            <span>Moderated and version-controlled. Only share authorized learning materials.</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-line">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-ink-soft hover:text-ink cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(resource.id);
              onClose();
            }}
            className={`px-4 py-2 text-xs font-bold rounded-btn text-white transition-all cursor-pointer shadow-xs ${
              isShared
                ? 'bg-slate-700 hover:bg-slate-800'
                : 'bg-brand hover:bg-brand-dark'
            }`}
          >
            {isShared ? 'Make Private' : 'Confirm & Share with Class'}
          </button>
        </div>

      </div>
    </div>
  );
}
