import React, { useState } from 'react'
import { Button, focusRing, inputCls } from '../components/ui'
import { ShieldCheck, BookOpen, Lock } from 'lucide-react'

export default function LoginPage({ onLogin }) {
  const [name, setName] = useState('Demo Student')
  const [email, setEmail] = useState('demo@university.edu')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return setError('Enter your name.')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address.')
    if (password.length < 6) return setError('Use a password with at least 6 characters.')
    onLogin({ name: name.trim(), email: email.trim() })
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#F8FAFC]">
      <div className="border border-neutral-300 rounded-3xl bg-white shadow-sm grid md:grid-cols-2 max-w-3xl w-full overflow-hidden">
        {/* Left Information Side */}
        <div className="p-8 md:p-10 bg-neutral-50 border-r border-neutral-200 hidden md:flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-black">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H9M17 7V15" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-black leading-tight tracking-tight">
              Everything for a syllabus topic, in one secure place.
            </h1>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Organise notes, lecture videos, code simulations, textbook references, and past questions mapped directly to your university curriculum.
            </p>
          </div>

          <div className="space-y-2 pt-6 border-t border-neutral-200 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-black" />
              <span>Private-by-default in My Space</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Academic integrity & copyright screened</span>
            </div>
          </div>
        </div>

        {/* Right Sign-in Form */}
        <form onSubmit={submit} className="p-8 md:p-10 space-y-4 bg-white" noValidate>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
              Syllabus Hub Account
            </span>
            <h2 className="text-xl font-bold text-black mt-2">Sign in to study space</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Use your university credentials or demo access.</p>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-neutral-700">
              Student Name
              <input
                className={`${inputCls} mt-1`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </label>

            <label className="block text-xs font-bold text-neutral-700">
              University Email
              <input
                className={`${inputCls} mt-1`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>

            <label className="block text-xs font-bold text-neutral-700">
              Password
              <input
                className={`${inputCls} mt-1`}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
          </div>

          {error && <p className="text-xs font-bold text-red-600" role="alert">{error}</p>}

          <Button type="submit" variant="primary" className="w-full mt-2 !py-2.5">
            Continue to Syllabus Selection ➔
          </Button>

          <p className="text-[11px] text-neutral-400 text-center pt-2">
            Demo account is prefilled. Data is encrypted and stored locally.
          </p>
        </form>
      </div>
    </main>
  )
}
