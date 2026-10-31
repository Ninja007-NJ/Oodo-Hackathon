import React, { useState, useMemo } from 'react'
import { Button, focusRing, inputCls } from './ui'
import { X, Calculator, Calendar, Plus, Trash2, ShieldAlert, CheckCircle2, AlertTriangle, Info } from 'lucide-react'

// Standard KTU Grade Points
const KTU_GRADES = [
  { grade: 'S', point: 10.0, label: 'Outstanding (90%+)' },
  { grade: 'A+', point: 9.0, label: 'Excellent (85-89%)' },
  { grade: 'A', point: 8.5, label: 'Very Good (80-84%)' },
  { grade: 'B+', point: 8.0, label: 'Good (75-79%)' },
  { grade: 'B', point: 7.0, label: 'Above Average (70-74%)' },
  { grade: 'C', point: 6.0, label: 'Average (60-69%)' },
  { grade: 'P', point: 5.0, label: 'Pass (50-59%)' },
  { grade: 'F', point: 0.0, label: 'Fail / Absent (<50%)' },
]

// Default KTU Semester 4 Computer Science course scheme
const DEFAULT_S4_COURSES = [
  { id: 'cs304', code: 'CST202', name: 'Operating Systems', credits: 4, grade: 'A+' },
  { id: 'cs305', code: 'CST204', name: 'Database Management Systems', credits: 4, grade: 'A' },
  { id: 'cs202', code: 'CST206', name: 'Operating Systems Lab', credits: 2, grade: 'S' },
  { id: 'cs334', code: 'CSL204', name: 'Digital Lab / DBMS Lab', credits: 2, grade: 'S' },
  { id: 'mat206', code: 'MAT206', name: 'Graph Theory & Math', credits: 4, grade: 'B+' },
  { id: 'mcn202', code: 'MCN202', name: 'Constitution of India', credits: 2, grade: 'A' },
]

export default function KtuUtilitiesModal({ isOpen, onClose, notify }) {
  const [tab, setTab] = useState('sgpa') // 'sgpa' | 'attendance' | 'cgpa'

  // ==========================================
  // SGPA CALCULATOR STATE
  // ==========================================
  const [courses, setCourses] = useState(DEFAULT_S4_COURSES)

  const handleAddCourse = () => {
    setCourses([
      ...courses,
      { id: `c-${Date.now()}`, code: 'ELECTIVE', name: 'New Course', credits: 3, grade: 'B+' },
    ])
  }

  const handleRemoveCourse = (id) => {
    if (courses.length <= 1) return
    setCourses(courses.filter((c) => c.id !== id))
  }

  const handleUpdateCourse = (id, field, value) => {
    setCourses(
      courses.map((c) =>
        c.id === id ? { ...c, [field]: field === 'credits' ? Number(value) : value } : c
      )
    )
  }

  const sgpaResult = useMemo(() => {
    let totalCredits = 0
    let totalPoints = 0
    let hasFailed = false

    courses.forEach((c) => {
      const g = KTU_GRADES.find((item) => item.grade === c.grade) || { point: 0 }
      totalCredits += c.credits
      totalPoints += c.credits * g.point
      if (c.grade === 'F') hasFailed = true
    })

    const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00'
    return { sgpa, totalCredits, totalPoints, hasFailed }
  }, [courses])

  // ==========================================
  // CGPA CALCULATOR STATE
  // ==========================================
  const [semesters, setSemesters] = useState([
    { sem: 1, credits: 20, sgpa: 8.4 },
    { sem: 2, credits: 20, sgpa: 8.6 },
    { sem: 3, credits: 24, sgpa: 8.2 },
  ])

  const cgpaResult = useMemo(() => {
    let totalCredits = 0
    let totalProduct = 0

    semesters.forEach((s) => {
      totalCredits += s.credits
      totalProduct += s.credits * s.sgpa
    })

    const cgpa = totalCredits > 0 ? (totalProduct / totalCredits).toFixed(2) : '0.00'
    return { cgpa, totalCredits }
  }, [semesters])

  // ==========================================
  // ATTENDANCE PLANNER STATE ("Bunk Calculator")
  // ==========================================
  const [conducted, setConducted] = useState(48)
  const [attended, setAttended] = useState(38)
  const [targetPct, setTargetPct] = useState(75)

  const attendanceResult = useMemo(() => {
    const t = Math.max(0, conducted)
    const a = Math.min(t, Math.max(0, attended))
    const pct = t > 0 ? ((a / t) * 100).toFixed(1) : '100.0'
    const reqFraction = targetPct / 100

    let canMiss = 0
    let mustAttend = 0

    if (t === 0) {
      return { pct: '100.0', canMiss: 0, mustAttend: 0, isSafe: true }
    }

    if (a / t >= reqFraction) {
      // Safe: how many future classes can be skipped
      // a / (t + m) >= reqFraction => a >= reqFraction * (t + m) => m <= (a - reqFraction * t) / reqFraction
      canMiss = Math.floor((a - reqFraction * t) / reqFraction)
    } else {
      // In danger: how many consecutive classes must be attended
      // (a + c) / (t + c) >= reqFraction => a + c >= reqFraction * t + reqFraction * c
      // c * (1 - reqFraction) >= reqFraction * t - a => c >= (reqFraction * t - a) / (1 - reqFraction)
      mustAttend = Math.ceil((reqFraction * t - a) / (1 - reqFraction))
    }

    return {
      pct,
      canMiss: Math.max(0, canMiss),
      mustAttend: Math.max(0, mustAttend),
      isSafe: a / t >= reqFraction,
    }
  }, [conducted, attended, targetPct])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white border-2 border-black rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl border border-neutral-300 hover:border-black text-neutral-500 hover:text-black cursor-pointer shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            KTU B.Tech Engineering Suite
          </span>
          <h2 className="text-xl font-black text-black mt-1">
            Academic Performance & Attendance Planner
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Calculate your semester SGPA/CGPA and plan your class attendance around the 75% rule.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs">
          <button
            onClick={() => setTab('sgpa')}
            className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === 'sgpa' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>SGPA Calculator</span>
          </button>

          <button
            onClick={() => setTab('attendance')}
            className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === 'attendance' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Attendance Planner</span>
          </button>

          <button
            onClick={() => setTab('cgpa')}
            className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === 'cgpa' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
            }`}
          >
            <span>CGPA Tracker</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: SGPA CALCULATOR */}
        {/* ========================================================= */}
        {tab === 'sgpa' && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            {/* Score Banner */}
            <div className="p-4 bg-neutral-900 text-white rounded-2xl flex items-center justify-between border-2 border-black">
              <div>
                <p className="text-[11px] font-semibold text-neutral-400">Estimated SGPA</p>
                <p className="text-3xl font-black font-mono text-emerald-400 mt-0.5">{sgpaResult.sgpa}</p>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Total Credits: <span className="font-bold text-white">{sgpaResult.totalCredits}</span> · Total Points: <span className="font-bold text-white">{sgpaResult.totalPoints}</span>
                </p>
              </div>

              {sgpaResult.hasFailed ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-900/60 border border-red-500 text-red-200 text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>Includes F Grade</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/60 border border-emerald-500 text-emerald-200 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>All Passed</span>
                </div>
              )}
            </div>

            {/* Courses Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-700">Course & Grade Breakdown</span>
                <button
                  onClick={handleAddCourse}
                  className="inline-flex items-center gap-1 text-xs font-bold text-black border border-neutral-300 bg-white hover:bg-neutral-100 px-2.5 py-1 rounded-lg cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Subject</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                <table className="w-full text-left">
                  <thead className="bg-neutral-100 font-bold text-neutral-600 border-b border-neutral-200">
                    <tr>
                      <th className="p-2.5">Code</th>
                      <th className="p-2.5">Course Name</th>
                      <th className="p-2.5">Credits</th>
                      <th className="p-2.5">Expected Grade</th>
                      <th className="p-2.5 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 bg-white">
                    {courses.map((c) => (
                      <tr key={c.id}>
                        <td className="p-2.5">
                          <input
                            type="text"
                            value={c.code}
                            onChange={(e) => handleUpdateCourse(c.id, 'code', e.target.value)}
                            className="w-20 px-2 py-1 border border-neutral-300 rounded font-mono font-bold"
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            type="text"
                            value={c.name}
                            onChange={(e) => handleUpdateCourse(c.id, 'name', e.target.value)}
                            className="w-full px-2 py-1 border border-neutral-300 rounded font-medium"
                          />
                        </td>
                        <td className="p-2.5">
                          <select
                            value={c.credits}
                            onChange={(e) => handleUpdateCourse(c.id, 'credits', e.target.value)}
                            className="px-2 py-1 border border-neutral-300 rounded font-bold"
                          >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                          </select>
                        </td>
                        <td className="p-2.5">
                          <select
                            value={c.grade}
                            onChange={(e) => handleUpdateCourse(c.id, 'grade', e.target.value)}
                            className="px-2 py-1 border border-neutral-300 rounded font-bold"
                          >
                            {KTU_GRADES.map((g) => (
                              <option key={g.grade} value={g.grade}>
                                {g.grade} ({g.point} pts)
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={() => handleRemoveCourse(c.id)}
                            disabled={courses.length <= 1}
                            className="p-1 text-red-500 hover:text-red-700 disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: ATTENDANCE PLANNER */}
        {/* ========================================================= */}
        {tab === 'attendance' && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            {/* Status Card */}
            <div
              className={`p-5 rounded-2xl border-2 border-black ${
                attendanceResult.isSafe ? 'bg-emerald-50 text-emerald-950' : 'bg-red-50 text-red-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    Current Attendance Ratio
                  </p>
                  <p className="text-3xl font-black font-mono mt-0.5">{attendanceResult.pct}%</p>
                  <p className="text-xs mt-1">
                    Target: <span className="font-bold">{targetPct}%</span> threshold
                  </p>
                </div>

                <div className="text-right">
                  {attendanceResult.isSafe ? (
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-200/60 px-2.5 py-1 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" /> Attendance Safe
                      </span>
                      <p className="text-xs font-bold text-emerald-900 mt-1">
                        You can safely miss <span className="text-base font-black underline">{attendanceResult.canMiss}</span> more classes
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1 font-bold text-red-800 bg-red-200/60 px-2.5 py-1 rounded-lg">
                        <AlertTriangle className="w-4 h-4" /> Attendance Shortage
                      </span>
                      <p className="text-xs font-bold text-red-900 mt-1">
                        Must attend next <span className="text-base font-black underline">{attendanceResult.mustAttend}</span> classes consecutively
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Inputs Form */}
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Total Classes Held:
                </label>
                <input
                  type="number"
                  min="1"
                  value={conducted}
                  onChange={(e) => setConducted(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl font-mono text-sm font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Classes Attended:
                </label>
                <input
                  type="number"
                  min="0"
                  max={conducted}
                  value={attended}
                  onChange={(e) => setAttended(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl font-mono text-sm font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Required Minimum (%):
                </label>
                <select
                  value={targetPct}
                  onChange={(e) => setTargetPct(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl font-bold text-sm"
                >
                  <option value={75}>75% (Standard KTU)</option>
                  <option value={80}>80%</option>
                  <option value={85}>85% (Internal Merit)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CGPA TRACKER */}
        {/* ========================================================= */}
        {tab === 'cgpa' && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <div className="p-4 bg-neutral-900 text-white rounded-2xl flex items-center justify-between border-2 border-black">
              <div>
                <p className="text-[11px] font-semibold text-neutral-400">Cumulative Grade Point Average</p>
                <p className="text-3xl font-black font-mono text-amber-400 mt-0.5">{cgpaResult.cgpa}</p>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Cumulative Earned Credits: <span className="font-bold text-white">{cgpaResult.totalCredits}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-neutral-700">Completed Semesters</span>
              <div className="grid grid-cols-3 gap-2">
                {semesters.map((s, idx) => (
                  <div key={s.sem} className="p-3 border border-neutral-200 rounded-xl bg-neutral-50">
                    <p className="font-bold text-black">Semester {s.sem}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-neutral-500">Credits: {s.credits}</span>
                      <span className="font-mono font-bold text-emerald-700">SGPA {s.sgpa}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Academic Integrity Disclaimer */}
        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-start gap-2 text-xs text-neutral-600">
          <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
          <p>
            <span className="font-bold text-black">Academic Disclaimer:</span> Calculations provided are estimates for personal semester planning based on KTU B.Tech regulations. Final grades, duty leaves, and official eligibility are determined exclusively by the university exam cell.
          </p>
        </div>
      </div>
    </div>
  )
}
