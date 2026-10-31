import React, { useState, useMemo } from 'react'
import { Button, focusRing } from './ui'
import { X, Moon, Clock, CheckCircle2, AlertTriangle, ArrowRight, Printer, Download, Sparkles, BookOpen } from 'lucide-react'

export default function NightBeforeSheetModal({
  isOpen,
  onClose,
  subject,
  topics,
  notes,
  resources,
  confidenceRatings = {},
  notify,
}) {
  const [tab, setTab] = useState('sheet') // 'sheet' | 'skip'
  const [hoursLeft, setHoursLeft] = useState(6)
  const [targetGoal, setTargetGoal] = useState('pass') // 'pass' | 'solid' | 'top'

  // ==========================================
  // NIGHT SHEET COMPILATION
  // ==========================================
  const revisionItems = useMemo(() => {
    return topics.map((t) => {
      const topicNotes = notes[t.id] || ''
      const topicResources = resources.filter((r) => r.topic === t.id && r.type === 'notes')
      const conf = confidenceRatings[t.id] || 'not_started'

      return {
        id: t.id,
        title: t.title,
        status: t.status,
        confidence: conf,
        typedNotes: topicNotes,
        curatedExcerpts: topicResources.map((r) => ({
          title: r.title,
          source: r.source,
          snippet: r.text ? r.text.slice(0, 240) + '…' : 'Review lecture slides and diagrams.',
        })),
      }
    })
  }, [topics, notes, resources, confidenceRatings])

  // ==========================================
  // "WHAT DO I SKIP?" TRIAGE LOGIC
  // ==========================================
  const triagePlan = useMemo(() => {
    // Historical importance weights (mock based on university past papers)
    const importance = {
      'os-sched': { weight: 'High', freq: 'Every Year (Module 2)', marks: 14 },
      'os-paging': { weight: 'High', freq: 'Every Year (Module 3)', marks: 14 },
      'os-seg': { weight: 'Medium', freq: 'Alternate Years', marks: 7 },
      'os-vm': { weight: 'High', freq: 'Every Year (Demand Paging)', marks: 10 },
      'os-fs': { weight: 'Medium', freq: 'Alternate Years (Module 4)', marks: 7 },
    }

    const mustRevise = []
    const quickSkim = []
    const safeToSkip = []

    topics.forEach((t) => {
      const info = importance[t.id] || { weight: 'Medium', freq: 'Frequent', marks: 7 }
      const conf = confidenceRatings[t.id] || 'not_started'

      if (info.weight === 'High' && (conf === 'shaky' || conf === 'not_started')) {
        mustRevise.push({ ...t, ...info, conf, reason: 'High exam marks weight but low confidence.' })
      } else if (info.weight === 'High' && conf === 'confident') {
        quickSkim.push({ ...t, ...info, conf, reason: 'High weight, but already confident. Quick 15-min skim only.' })
      } else if (hoursLeft <= 6 && info.weight === 'Medium' && conf === 'not_started') {
        safeToSkip.push({ ...t, ...info, conf, reason: 'Insufficient time to learn from scratch with lower exam mark density.' })
      } else {
        mustRevise.push({ ...t, ...info, conf, reason: 'Core syllabus concept.' })
      }
    })

    return { mustRevise, quickSkim, safeToSkip }
  }, [topics, confidenceRatings, hoursLeft, targetGoal])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadMarkdown = () => {
    let md = `# Night-Before Exam Revision Sheet: ${subject?.title || 'Operating Systems'}\n`
    md += `Generated: ${new Date().toLocaleDateString()}\n\n---\n\n`

    revisionItems.forEach((item) => {
      md += `## ${item.title} [Confidence: ${item.confidence.toUpperCase()}]\n\n`
      if (item.typedNotes) {
        md += `### My Personal Notes\n${item.typedNotes}\n\n`
      }
      if (item.curatedExcerpts.length > 0) {
        md += `### Syllabus Key Summaries\n`
        item.curatedExcerpts.forEach((ex) => {
          md += `- **${ex.title}** (${ex.source}):\n  ${ex.snippet}\n\n`
        })
      }
      md += `---\n\n`
    })

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${subject?.code || 'CS304'}_Night_Before_Sheet.md`
    a.click()
    URL.revokeObjectURL(url)
    notify('Downloaded revision sheet as Markdown.')
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white border-2 border-black rounded-3xl max-w-3xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl border border-neutral-300 hover:border-black text-neutral-500 hover:text-black cursor-pointer shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
            Pre-Exam Triage & Rapid Recall
          </span>
          <h2 className="text-xl font-black text-black mt-1">
            Night-Before Mode: {subject?.title || 'Operating Systems'}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            A condensed, distraction-free revision sheet synthesized from your own notes and verified syllabus formulas.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center justify-between gap-2 border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs">
            <button
              onClick={() => setTab('sheet')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                tab === 'sheet' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Revision Sheet</span>
            </button>

            <button
              onClick={() => setTab('skip')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                tab === 'skip' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>"What Do I Skip?" Planner</span>
            </button>
          </div>

          {tab === 'sheet' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-neutral-700 border border-neutral-300 hover:border-black bg-white px-3 py-1.5 rounded-xl shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                onClick={handleDownloadMarkdown}
                className="inline-flex items-center gap-1 text-xs font-bold text-white bg-black hover:bg-neutral-800 px-3 py-1.5 rounded-xl shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .md</span>
              </button>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: REVISION SHEET */}
        {/* ========================================================= */}
        {tab === 'sheet' && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            {revisionItems.map((item) => (
              <div
                key={item.id}
                className="border-2 border-black rounded-2xl p-4 bg-neutral-50/70 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-black">{item.title}</h3>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                        item.confidence === 'confident'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.confidence === 'shaky'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {item.confidence}
                    </span>
                  </div>
                </div>

                {/* Personal Notes Section */}
                {item.typedNotes ? (
                  <div className="p-3 bg-white border border-neutral-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      Your Personal Summary Note:
                    </span>
                    <p className="text-neutral-800 leading-relaxed font-sans">{item.typedNotes}</p>
                  </div>
                ) : (
                  <p className="text-neutral-400 italic text-[11px]">
                    No personal notes entered yet for this topic.
                  </p>
                )}

                {/* Grounded Excerpts */}
                {item.curatedExcerpts.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      Key Exam Summaries & Sources:
                    </span>
                    <div className="space-y-1.5">
                      {item.curatedExcerpts.map((ex, idx) => (
                        <div key={idx} className="p-2.5 bg-white border border-neutral-200 rounded-xl">
                          <div className="flex items-center justify-between text-[11px] font-bold text-black mb-1">
                            <span>{ex.title}</span>
                            <span className="text-[10px] text-neutral-500 font-normal">Source: {ex.source}</span>
                          </div>
                          <p className="text-neutral-600 leading-relaxed">{ex.snippet}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: "WHAT DO I SKIP?" PLANNER */}
        {/* ========================================================= */}
        {tab === 'skip' && (
          <div className="space-y-5 text-xs animate-in fade-in duration-150">
            {/* Triage Inputs Bar */}
            <div className="grid sm:grid-cols-2 gap-4 p-4 bg-neutral-100 rounded-2xl border border-neutral-200">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Hours Left Before Exam:
                </label>
                <div className="flex items-center gap-2">
                  {[3, 6, 12, 24].map((h) => (
                    <button
                      key={h}
                      onClick={() => setHoursLeft(h)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        hoursLeft === h ? 'bg-black text-white' : 'bg-white border border-neutral-300 text-neutral-700'
                      }`}
                    >
                      {h} Hours
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Target Exam Score:
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTargetGoal('pass')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      targetGoal === 'pass' ? 'bg-black text-white' : 'bg-white border border-neutral-300 text-neutral-700'
                    }`}
                  >
                    Just Clear (Pass)
                  </button>
                  <button
                    onClick={() => setTargetGoal('solid')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      targetGoal === 'solid' ? 'bg-black text-white' : 'bg-white border border-neutral-300 text-neutral-700'
                    }`}
                  >
                    Solid (70%+)
                  </button>
                </div>
              </div>
            </div>

            {/* Triage Results: 3 Tiers */}
            <div className="space-y-4">
              {/* Tier 1: Must Revise */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-red-700 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>1. Must Revise First (High Frequency & Shaky Confidence)</span>
                </div>

                <div className="space-y-2">
                  {triagePlan.mustRevise.map((item) => (
                    <div key={item.id} className="p-3 bg-red-50/60 border border-red-200 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="font-bold text-black">{item.title}</p>
                        <p className="text-[11px] text-red-800 mt-0.5">{item.reason}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-black font-mono">~{item.marks} marks</span>
                        <span className="block text-[10px] text-neutral-500">{item.freq}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tier 2: Quick Skim */}
              {triagePlan.quickSkim.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>2. Quick Skim (High Weight, Already Confident)</span>
                  </div>

                  <div className="space-y-2">
                    {triagePlan.quickSkim.map((item) => (
                      <div key={item.id} className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-black">{item.title}</p>
                          <p className="text-[11px] text-emerald-800 mt-0.5">{item.reason}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-black font-mono">~{item.marks} marks</span>
                          <span className="block text-[10px] text-neutral-500">{item.freq}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tier 3: Safe to Deprioritize */}
              {triagePlan.safeToSkip.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-neutral-600 font-bold">
                    <ArrowRight className="w-4 h-4" />
                    <span>3. Safe to Deprioritize (If running out of time)</span>
                  </div>

                  <div className="space-y-2">
                    {triagePlan.safeToSkip.map((item) => (
                      <div key={item.id} className="p-3 bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-neutral-700">{item.title}</p>
                          <p className="text-[11px] text-neutral-500 mt-0.5">{item.reason}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-neutral-600 font-mono">~{item.marks} marks</span>
                          <span className="block text-[10px] text-neutral-400">{item.freq}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Triage Disclaimer */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">Honest Disclaimer:</span> This triage suggestion is generated by cross-referencing your personal self-rated confidence against past question patterns. It does not predict future exam questions; the university exam board can evaluate any portion of the syllabus.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
