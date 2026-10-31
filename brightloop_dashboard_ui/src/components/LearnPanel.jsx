import React from 'react'
import { ExternalLink, Play } from 'lucide-react'

export default function LearnPanel({ subject, topic, onPreview }) {
  const topicTitle = topic?.title || 'this topic'
  const subjectTitle = subject?.title || 'Operating Systems'

  const providers = [
    {
      id: 'youtube',
      name: 'YouTube',
      subtitle: 'Video lectures',
      icon: (
        <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
          <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
        </div>
      ),
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${topicTitle} ${subjectTitle} lecture`)}`,
      external: false,
    },
    {
      id: 'nptel',
      name: 'NPTEL',
      subtitle: 'Free course materials',
      icon: (
        <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center shrink-0 font-black text-[10px] tracking-tighter">
          NPTEL
        </div>
      ),
      url: `https://nptel.ac.in/courses?q=${encodeURIComponent(`${topicTitle} ${subjectTitle}`)}`,
      external: false,
    },
    {
      id: 'mit-ocw',
      name: 'MIT OpenCourseWare',
      subtitle: 'Open course materials',
      icon: (
        <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center shrink-0 font-black text-xs">
          M
        </div>
      ),
      url: `https://ocw.mit.edu/search/?q=${encodeURIComponent(`${topicTitle} ${subjectTitle}`)}`,
      external: true,
    },
  ]

  return (
    <section className="space-y-3" aria-label={`Free learning links for ${topicTitle}`}>
      {/* Header Row */}
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-black tracking-tight">Free learning links</h2>
          <p className="text-xs text-neutral-500">Continue learning about {topicTitle}</p>
        </div>
        <span className="text-[11px] text-neutral-400 hidden sm:inline">
          Opens the provider in a new tab
        </span>
      </div>

      {/* 3-Column Provider Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {providers.map((p) => (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-xl bg-white border border-neutral-300 hover:border-black transition-all flex items-center justify-between gap-3 shadow-xs hover:shadow-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              {p.icon}
              <div className="min-w-0">
                <p className="font-bold text-sm text-black group-hover:text-black truncate">
                  {p.name}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {p.subtitle}
                </p>
              </div>
            </div>
            {p.external && (
              <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black shrink-0 transition-colors" />
            )}
          </a>
        ))}
      </div>

      <p className="text-[11px] text-neutral-400 pt-1">
        Provider links are curated for university curriculums. Always verify with your syllabus objectives.
      </p>
    </section>
  )
}
