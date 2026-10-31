import React, { useMemo, useState } from 'react'
import { CURRICULUM, STATUS } from '../data'
import { Button, Toggle, focusRing, inputCls } from '../components/ui'

export default function SelectPage({ user, initial, onDone }) {
  const [courseId, setCourseId] = useState(initial?.courseId ?? CURRICULUM[0].id)
  const [semester, setSemester] = useState(initial?.semester ?? 4)
  const [subjectId, setSubjectId] = useState(initial?.subjectId ?? 'os')
  const course = CURRICULUM.find((c) => c.id === courseId) || CURRICULUM[0]
  const subjects = course.semesters[semester] ?? []
  const subject = subjects.find((s) => s.id === subjectId) ?? subjects[0] ?? null
  const allIds = useMemo(() => subject?.modules.flatMap((m) => m.topics.map((t) => t.id)) ?? [], [subject])
  const [topicIds, setTopicIds] = useState(initial?.topicIds?.length ? initial.topicIds : allIds)

  const pickSubject = (s) => {
    setSubjectId(s.id)
    setTopicIds(s.modules.flatMap((m) => m.topics.map((t) => t.id)))
  }
  const toggle = (id) => setTopicIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))
  const toggleModule = (m) => {
    const ids = m.topics.map((t) => t.id)
    const all = ids.every((id) => topicIds.includes(id))
    setTopicIds((cur) => (all ? cur.filter((x) => !ids.includes(x)) : [...new Set([...cur, ...ids])]))
  }

  const handleDone = () => {
    if (!subject || topicIds.length === 0) return
    onDone({ courseId, semester, subjectId: subject.id, topicIds })
  }

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-6 bg-[#F8FAFC]">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
          Course Setup & Syllabus Selection
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-2">
          Hi {user?.name?.split(' ')[0] || 'Student'}, what are you studying?
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Choose your course, semester, and the syllabus topics you want in your study workspace.
        </p>
      </div>

      {/* 1. Class */}
      <section className="bg-white border border-neutral-300 rounded-2xl p-5 shadow-xs">
        <h2 className="font-bold text-black text-sm mb-3">1. Your class & curriculum</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="text-xs font-bold text-neutral-700">Course
            <select
              className={`${inputCls} mt-1`}
              value={courseId}
              onChange={(e) => { setCourseId(e.target.value); setSubjectId(null); setTopicIds([]) }}
            >
              {CURRICULUM.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-neutral-700">Semester
            <select
              className={`${inputCls} mt-1`}
              value={semester}
              onChange={(e) => { setSemester(Number(e.target.value)); setSubjectId(null); setTopicIds([]) }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>Semester {n}</option>)}
            </select>
          </label>
        </div>
      </section>

      {/* 2. Subject */}
      <section className="bg-white border border-neutral-300 rounded-2xl p-5 shadow-xs">
        <h2 className="font-bold text-black text-sm mb-3">2. Subject</h2>
        {subjects.length === 0 ? (
          <div className="border border-dashed border-neutral-300 rounded-xl p-5 text-xs text-neutral-500">
            No syllabus is loaded for {course.name}, semester {semester} yet. Pick another semester, or ask your class representative to add this syllabus.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {subjects.map((s) => (
              <button
                key={s.id}
                onClick={() => pickSubject(s)}
                aria-pressed={s.id === subject?.id}
                className={`text-left rounded-xl p-4 transition-all cursor-pointer ${focusRing} ${
                  s.id === subject?.id
                    ? 'border-2 border-black bg-white shadow-xs'
                    : 'border border-neutral-200 bg-neutral-50 hover:border-black'
                }`}
              >
                <p className="font-bold text-sm text-black">{s.title}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  {s.modules.length} modules, {s.modules.reduce((n, m) => n + m.topics.length, 0)} topics
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 3. Topics */}
      {subject && (
        <section className="bg-white border border-neutral-300 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between gap-3 border-b border-neutral-200 pb-3">
            <div>
              <h2 className="font-bold text-black text-sm">3. Syllabus topics for {subject.title}</h2>
              <p className="text-xs text-neutral-500">{topicIds.length} of {allIds.length} topics selected</p>
            </div>
            <label className="flex items-center gap-2 text-xs text-black font-bold cursor-pointer">
              <span>Select all</span>
              <Toggle label="Select all topics" checked={topicIds.length === allIds.length} onChange={(on) => setTopicIds(on ? allIds : [])} />
            </label>
          </div>

          <div className="space-y-4">
            {subject.modules.map((m) => {
              const ids = m.topics.map((t) => t.id)
              const every = ids.every((id) => topicIds.includes(id))
              return (
                <div key={m.id} className="rounded-xl bg-neutral-50 p-3.5 border border-neutral-200">
                  <label className="flex items-center gap-2 font-bold text-xs text-black mb-2 cursor-pointer">
                    <input type="checkbox" checked={every} onChange={() => toggleModule(m)} className="accent-black w-4 h-4 rounded" />
                    <span>{m.title}</span>
                  </label>
                  <ul className="ml-6 grid sm:grid-cols-2 gap-1.5">
                    {m.topics.map((t) => (
                      <li key={t.id}>
                        <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-colors text-xs ${
                          topicIds.includes(t.id) ? 'bg-white border border-neutral-300 font-bold text-black shadow-xs' : 'hover:bg-neutral-200/50 text-neutral-700'
                        }`}>
                          <input type="checkbox" checked={topicIds.includes(t.id)} onChange={() => toggle(t.id)} className="accent-black w-3.5 h-3.5 rounded" />
                          <span>{STATUS[t.status].icon}</span>
                          <span className="truncate">{t.title}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end pt-3">
            <Button onClick={handleDone} disabled={topicIds.length === 0} className="!px-7 !py-2.5">
              Open syllabus workspace ➔
            </Button>
          </div>
        </section>
      )}
    </main>
  )
}
