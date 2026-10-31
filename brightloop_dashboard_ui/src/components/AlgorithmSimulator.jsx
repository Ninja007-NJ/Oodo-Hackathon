import React, { useState, useMemo } from 'react'
import { Button, focusRing, inputCls } from './ui'
import { Play, RotateCcw, Plus, Trash2, Cpu, HardDrive, Info, CheckCircle2, AlertCircle } from 'lucide-react'

// Initial default process dataset for CPU scheduling
const DEFAULT_PROCESSES = [
  { id: 'P1', arrival: 0, burst: 5 },
  { id: 'P2', arrival: 1, burst: 3 },
  { id: 'P3', arrival: 2, burst: 8 },
  { id: 'P4', arrival: 3, burst: 6 },
]

// Initial default reference string for Page Replacement
const DEFAULT_REF_STRING = '7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2'

export default function AlgorithmSimulator({ notify }) {
  const [activeTab, setActiveTab] = useState('cpu') // 'cpu' | 'page'

  // ==========================================
  // 1. CPU SCHEDULING STATE & LOGIC
  // ==========================================
  const [processes, setProcesses] = useState(DEFAULT_PROCESSES)
  const [algo, setAlgo] = useState('fcfs') // 'fcfs' | 'sjf' | 'rr'
  const [quantum, setQuantum] = useState(2)

  const handleAddProcess = () => {
    const nextNum = processes.length + 1
    setProcesses([...processes, { id: `P${nextNum}`, arrival: 0, burst: 4 }])
  }

  const handleRemoveProcess = (idx) => {
    if (processes.length <= 1) return
    setProcesses(processes.filter((_, i) => i !== idx))
  }

  const handleUpdateProcess = (idx, field, val) => {
    const num = Math.max(0, parseInt(val) || 0)
    setProcesses(processes.map((p, i) => (i === idx ? { ...p, [field]: num } : p)))
  }

  // CPU Simulation Engine
  const cpuResult = useMemo(() => {
    const procs = processes.map((p) => ({ ...p, remaining: p.burst }))
    let time = 0
    const gantt = []
    const completion = {}
    const n = procs.length

    if (algo === 'fcfs') {
      // Sort by arrival time
      const queue = [...procs].sort((a, b) => a.arrival - b.arrival)
      queue.forEach((p) => {
        if (time < p.arrival) {
          gantt.push({ id: 'IDLE', start: time, end: p.arrival })
          time = p.arrival
        }
        gantt.push({ id: p.id, start: time, end: time + p.burst })
        time += p.burst
        completion[p.id] = time
      })
    } else if (algo === 'sjf') {
      // Non-preemptive Shortest Job First
      let completed = 0
      const visited = new Set()
      while (completed < n) {
        const available = procs.filter((p) => p.arrival <= time && !visited.has(p.id))
        if (available.length === 0) {
          const nextArrival = Math.min(...procs.filter((p) => !visited.has(p.id)).map((p) => p.arrival))
          gantt.push({ id: 'IDLE', start: time, end: nextArrival })
          time = nextArrival
          continue
        }
        available.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival)
        const chosen = available[0]
        gantt.push({ id: chosen.id, start: time, end: time + chosen.burst })
        time += chosen.burst
        completion[chosen.id] = time
        visited.add(chosen.id)
        completed++
      }
    } else if (algo === 'rr') {
      // Round Robin with Quantum
      const readyQueue = []
      const remainingMap = {}
      procs.forEach((p) => (remainingMap[p.id] = p.burst))
      const arrivedSet = new Set()

      // Find first arrived
      let remainingProcesses = procs.length
      while (remainingProcesses > 0) {
        procs.forEach((p) => {
          if (p.arrival <= time && !arrivedSet.has(p.id)) {
            readyQueue.push(p.id)
            arrivedSet.add(p.id)
          }
        })

        if (readyQueue.length === 0) {
          const nextArr = Math.min(...procs.filter((p) => remainingMap[p.id] > 0).map((p) => p.arrival))
          gantt.push({ id: 'IDLE', start: time, end: nextArr })
          time = nextArr
          continue
        }

        const curId = readyQueue.shift()
        const runTime = Math.min(remainingMap[curId], quantum)
        gantt.push({ id: curId, start: time, end: time + runTime })
        time += runTime
        remainingMap[curId] -= runTime

        // Add newly arrived processes during this quantum
        procs.forEach((p) => {
          if (p.arrival <= time && !arrivedSet.has(p.id)) {
            readyQueue.push(p.id)
            arrivedSet.add(p.id)
          }
        })

        if (remainingMap[curId] > 0) {
          readyQueue.push(curId)
        } else {
          completion[curId] = time
          remainingProcesses--
        }
      }
    }

    // Calculate TAT and WT
    const rows = procs.map((p) => {
      const ct = completion[p.id] || 0
      const tat = ct - p.arrival
      const wt = tat - p.burst
      return { id: p.id, arrival: p.arrival, burst: p.burst, ct, tat, wt }
    })

    const avgTat = (rows.reduce((sum, r) => sum + r.tat, 0) / n).toFixed(2)
    const avgWt = (rows.reduce((sum, r) => sum + r.wt, 0) / n).toFixed(2)

    return { gantt, rows, avgTat, avgWt }
  }, [processes, algo, quantum])

  // ==========================================
  // 2. PAGE REPLACEMENT STATE & LOGIC
  // ==========================================
  const [refStringInput, setRefStringInput] = useState(DEFAULT_REF_STRING)
  const [frameCount, setFrameCount] = useState(3)
  const [pageAlgo, setPageAlgo] = useState('fifo') // 'fifo' | 'lru' | 'optimal'

  const pageResult = useMemo(() => {
    const pages = refStringInput
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !isNaN(s))
      .map((s) => parseInt(s, 10))

    if (pages.length === 0) return { steps: [], hits: 0, faults: 0, hitRatio: 0 }

    const steps = []
    let frames = []
    let hits = 0
    let faults = 0

    // FIFO tracking
    const fifoQueue = []
    // LRU tracking: map page -> lastUsedIndex
    const lastUsed = new Map()

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]
      const isHit = frames.includes(page)

      if (isHit) {
        hits++
        if (pageAlgo === 'lru') {
          lastUsed.set(page, i)
        }
      } else {
        faults++
        if (frames.length < frameCount) {
          frames.push(page)
          if (pageAlgo === 'fifo') fifoQueue.push(page)
          if (pageAlgo === 'lru') lastUsed.set(page, i)
        } else {
          // Replacement needed
          let victim = null
          if (pageAlgo === 'fifo') {
            victim = fifoQueue.shift()
            const victimIdx = frames.indexOf(victim)
            frames[victimIdx] = page
            fifoQueue.push(page)
          } else if (pageAlgo === 'lru') {
            // Find frame with minimum lastUsed
            let minTime = Infinity
            frames.forEach((f) => {
              const t = lastUsed.get(f) ?? -1
              if (t < minTime) {
                minTime = t
                victim = f
              }
            })
            const victimIdx = frames.indexOf(victim)
            frames[victimIdx] = page
            lastUsed.set(page, i)
          } else if (pageAlgo === 'optimal') {
            // Find frame not used for longest future duration
            let farthest = -1
            frames.forEach((f) => {
              let nextUse = Infinity
              for (let j = i + 1; j < pages.length; j++) {
                if (pages[j] === f) {
                  nextUse = j
                  break
                }
              }
              if (nextUse > farthest) {
                farthest = nextUse
                victim = f
              }
            })
            const victimIdx = frames.indexOf(victim)
            frames[victimIdx] = page
          }
        }
      }

      steps.push({
        step: i + 1,
        page,
        isHit,
        frames: [...frames],
      })
    }

    const hitRatio = ((hits / pages.length) * 100).toFixed(1)
    return { steps, hits, faults, hitRatio, total: pages.length }
  }, [refStringInput, frameCount, pageAlgo])

  return (
    <div className="border border-neutral-300 rounded-2xl bg-white p-5 space-y-6 shadow-xs max-w-4xl mx-auto">
      {/* Header with Simulator Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Interactive Concept Simulators
          </span>
          <h2 className="text-xl font-black text-black mt-1">
            Core Operating System Simulators
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs">
          <button
            onClick={() => setActiveTab('cpu')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'cpu' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>CPU Scheduling</span>
          </button>

          <button
            onClick={() => setActiveTab('page')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'page' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Page Replacement</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: CPU SCHEDULING SIMULATOR */}
      {/* ============================================================== */}
      {activeTab === 'cpu' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-50 border border-neutral-200 p-3 rounded-xl text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-neutral-700">Algorithm:</span>
              <button
                onClick={() => setAlgo('fcfs')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  algo === 'fcfs' ? 'bg-black text-white' : 'bg-white border border-neutral-300 text-neutral-700'
                }`}
              >
                FCFS
              </button>
              <button
                onClick={() => setAlgo('sjf')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  algo === 'sjf' ? 'bg-black text-white' : 'bg-white border border-neutral-300 text-neutral-700'
                }`}
              >
                SJF (Non-Preemptive)
              </button>
              <button
                onClick={() => setAlgo('rr')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  algo === 'rr' ? 'bg-black text-white' : 'bg-white border border-neutral-300 text-neutral-700'
                }`}
              >
                Round Robin
              </button>
            </div>

            {algo === 'rr' && (
              <div className="flex items-center gap-2">
                <label className="font-bold text-neutral-700">Time Quantum (q):</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantum}
                  onChange={(e) => setQuantum(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 px-2 py-1 bg-white border border-neutral-300 rounded-lg text-center font-bold"
                />
              </div>
            )}
          </div>

          {/* Process Inputs Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Process Parameters (Arrival & Burst Time)
              </h3>
              <button
                onClick={handleAddProcess}
                className="inline-flex items-center gap-1 text-xs font-bold text-black border border-neutral-300 bg-white hover:bg-neutral-100 px-2.5 py-1 rounded-lg cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Process</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-neutral-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-100 text-neutral-600 font-bold border-b border-neutral-200">
                  <tr>
                    <th className="p-2.5">Process ID</th>
                    <th className="p-2.5">Arrival Time (AT)</th>
                    <th className="p-2.5">Burst Time (BT)</th>
                    <th className="p-2.5">Completion Time (CT)</th>
                    <th className="p-2.5">Turnaround Time (TAT)</th>
                    <th className="p-2.5">Waiting Time (WT)</th>
                    <th className="p-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {cpuResult.rows.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-neutral-50">
                      <td className="p-2.5 font-bold text-black">{row.id}</td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          value={row.arrival}
                          onChange={(e) => handleUpdateProcess(idx, 'arrival', e.target.value)}
                          className="w-16 px-2 py-1 border border-neutral-300 rounded font-mono text-xs"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="1"
                          value={row.burst}
                          onChange={(e) => handleUpdateProcess(idx, 'burst', e.target.value)}
                          className="w-16 px-2 py-1 border border-neutral-300 rounded font-mono text-xs"
                        />
                      </td>
                      <td className="p-2.5 font-mono font-bold text-neutral-700">{row.ct}</td>
                      <td className="p-2.5 font-mono font-bold text-neutral-700">
                        {row.tat} <span className="text-[10px] text-neutral-400 font-normal">({row.ct}-{row.arrival})</span>
                      </td>
                      <td className="p-2.5 font-mono font-bold text-neutral-700">
                        {row.wt} <span className="text-[10px] text-neutral-400 font-normal">({row.tat}-{row.burst})</span>
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={() => handleRemoveProcess(idx)}
                          disabled={processes.length <= 1}
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

          {/* Gantt Chart Display */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Generated Gantt Chart
            </h3>

            <div className="p-4 bg-neutral-900 text-white rounded-xl overflow-x-auto shadow-inner">
              <div className="flex items-center min-w-[500px]">
                {cpuResult.gantt.map((block, i) => {
                  const duration = block.end - block.start
                  const flexBasis = `${Math.max(duration * 36, 48)}px`
                  const isIdle = block.id === 'IDLE'
                  return (
                    <div
                      key={i}
                      style={{ flexGrow: duration, minWidth: flexBasis }}
                      className={`relative border-r border-neutral-700 py-3 text-center transition-all ${
                        isIdle ? 'bg-neutral-800 text-neutral-400 italic' : 'bg-amber-600/90 text-white font-bold'
                      }`}
                    >
                      <span className="text-xs">{block.id}</span>
                      {/* Start and end time labels */}
                      <span className="absolute left-1 bottom-0.5 text-[9px] font-mono text-neutral-300">
                        {block.start}
                      </span>
                      {i === cpuResult.gantt.length - 1 && (
                        <span className="absolute right-1 bottom-0.5 text-[9px] font-mono text-neutral-300">
                          {block.end}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Summary Performance Metrics */}
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
              <p className="text-[11px] font-semibold text-neutral-500">Average Turnaround Time</p>
              <p className="text-xl font-black text-black mt-0.5 font-mono">{cpuResult.avgTat} units</p>
              <p className="text-[10px] text-neutral-400 mt-1">Formula: Total TAT / Number of Processes</p>
            </div>

            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
              <p className="text-[11px] font-semibold text-neutral-500">Average Waiting Time</p>
              <p className="text-xl font-black text-black mt-0.5 font-mono">{cpuResult.avgWt} units</p>
              <p className="text-[10px] text-neutral-400 mt-1">Formula: Total WT / Number of Processes</p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PAGE REPLACEMENT SIMULATOR */}
      {/* ============================================================== */}
      {activeTab === 'page' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Controls Bar */}
          <div className="grid sm:grid-cols-2 gap-4 bg-neutral-50 border border-neutral-200 p-3 rounded-xl text-xs">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">
                Reference String (Comma or space separated):
              </label>
              <input
                type="text"
                value={refStringInput}
                onChange={(e) => setRefStringInput(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg font-mono text-xs"
                placeholder="7, 0, 1, 2, 0, 3..."
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Algorithm:</label>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPageAlgo('fifo')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      pageAlgo === 'fifo' ? 'bg-black text-white' : 'bg-white border border-neutral-300 text-neutral-700'
                    }`}
                  >
                    FIFO
                  </button>
                  <button
                    onClick={() => setPageAlgo('lru')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      pageAlgo === 'lru' ? 'bg-black text-white' : 'bg-white border border-neutral-300 text-neutral-700'
                    }`}
                  >
                    LRU
                  </button>
                  <button
                    onClick={() => setPageAlgo('optimal')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      pageAlgo === 'optimal' ? 'bg-black text-white' : 'bg-white border border-neutral-300 text-neutral-700'
                    }`}
                  >
                    Optimal
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Frames:</label>
                <select
                  value={frameCount}
                  onChange={(e) => setFrameCount(parseInt(e.target.value, 10))}
                  className="px-3 py-1 bg-white border border-neutral-300 rounded-lg font-bold"
                >
                  <option value={3}>3 Frames</option>
                  <option value={4}>4 Frames</option>
                  <option value={5}>5 Frames</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stepper Matrix Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Frame Allocation Matrix
              </h3>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Page Hit
                </span>
                <span className="flex items-center gap-1 font-semibold text-red-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Page Fault
                </span>
              </div>
            </div>

            <div className="overflow-x-auto border border-neutral-200 rounded-xl">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-neutral-100 border-b border-neutral-200 font-bold text-neutral-700">
                    <th className="p-2 border-r border-neutral-200 text-left">Ref Page</th>
                    {pageResult.steps.map((st, idx) => (
                      <th key={idx} className="p-2 min-w-[36px] font-mono border-r border-neutral-200 bg-neutral-50">
                        {st.page}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: frameCount }).map((_, frameIdx) => (
                    <tr key={frameIdx} className="border-b border-neutral-200">
                      <td className="p-2 text-left font-bold text-neutral-500 bg-neutral-50 border-r border-neutral-200">
                        Frame {frameIdx + 1}
                      </td>
                      {pageResult.steps.map((st, idx) => {
                        const val = st.frames[frameIdx]
                        return (
                          <td key={idx} className="p-2 font-mono border-r border-neutral-200">
                            {val !== undefined ? val : '·'}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                  <tr className="bg-neutral-50 font-bold">
                    <td className="p-2 text-left font-bold text-neutral-700 border-r border-neutral-200">Status</td>
                    {pageResult.steps.map((st, idx) => (
                      <td
                        key={idx}
                        className={`p-1.5 text-[10px] font-black border-r border-neutral-200 ${
                          st.isHit ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {st.isHit ? 'HIT' : 'FAULT'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Page Replacement Summary */}
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-[11px] font-semibold text-red-700">Total Page Faults</p>
              <p className="text-xl font-black text-red-900 mt-0.5 font-mono">{pageResult.faults}</p>
              <p className="text-[10px] text-red-600 mt-1">Requires disk frame allocation</p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-[11px] font-semibold text-emerald-700">Total Page Hits</p>
              <p className="text-xl font-black text-emerald-900 mt-0.5 font-mono">{pageResult.hits}</p>
              <p className="text-[10px] text-emerald-600 mt-1">Direct memory resolution</p>
            </div>

            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
              <p className="text-[11px] font-semibold text-neutral-500">Hit Ratio</p>
              <p className="text-xl font-black text-black mt-0.5 font-mono">{pageResult.hitRatio}%</p>
              <p className="text-[10px] text-neutral-400 mt-1">Formula: (Hits / Total) × 100</p>
            </div>
          </div>
        </div>
      )}

      {/* Honest Pedagogical Notice */}
      <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-start gap-2 text-xs text-neutral-600">
        <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
        <p>
          <span className="font-bold text-black">Pedagogical Note:</span> These simulators model the standard mathematical algorithms taught for university exams. Real operating system kernels implement approximated variants (e.g. Multi-Level Feedback Queue for CPU, and the Clock / Second-Chance algorithm for memory) to minimize hardware overhead.
        </p>
      </div>
    </div>
  )
}
