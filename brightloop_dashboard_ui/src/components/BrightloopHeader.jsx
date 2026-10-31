// BrightloopHeader.jsx
import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Users, 
  Search, 
  Palette, 
  Check, 
  ChevronDown, 
  Clock, 
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { THEMES, applyTheme } from '../theme';

export default function BrightloopHeader({
  currentRole,
  setCurrentRole,
  onOpenBillingModal,
  searchQuery,
  setSearchQuery,
  loadTimeMs = 38,
  activeTheme = 'cyan',
  setActiveTheme,
}) {
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleSelectTheme = (key) => {
    setActiveTheme(key);
    applyTheme({ theme: key });
    setThemeDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 text-slate-100 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
      {/* Brand Identity & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-dark to-brand flex items-center justify-center shadow-lg shadow-brand/20 ring-1 ring-white/20">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-black tracking-tight text-white">BRIGHTLOOP</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-800/80">
              Odoo 17 Platform
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span>Subscription Management &amp; Recurring Billing</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              PostgreSQL Sync
            </span>
          </div>
        </div>
      </div>

      {/* Global Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subscriptions, invoices, plans, customers... (Ctrl+K)"
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Actions, Performance & Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Load Time Benchmark Label (<2s Requirement) */}
        <div 
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300"
          title="Odoo Hackathon benchmark: Response under 2.0 seconds"
        >
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>⚡ Load:</span>
          <span className="font-bold text-emerald-400">{loadTimeMs}ms</span>
          <span className="text-slate-500 text-[10px]">(&lt;2.0s)</span>
        </div>

        {/* Quick Action: Run Billing Now */}
        <button
          onClick={onOpenBillingModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>⚡ Run Billing</span>
        </button>

        {/* Role Switcher with Server-Side Guard Simulation */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-semibold hover:bg-slate-700/80 transition-all cursor-pointer"
          >
            <div className={`w-2 h-2 rounded-full ${currentRole === 'admin' ? 'bg-purple-400' : currentRole === 'staff' ? 'bg-cyan-400' : 'bg-amber-400'}`} />
            <span className="capitalize">{currentRole === 'customer' ? 'Customer Portal' : currentRole}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Switch Operational Role
              </div>
              <button
                onClick={() => { setCurrentRole('admin'); setRoleDropdownOpen(false); }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 ${currentRole === 'admin' ? 'text-brand-light font-bold bg-brand/20' : 'text-slate-300'}`}
              >
                <div>
                  <div className="font-semibold">Administrator</div>
                  <div className="text-[10px] text-slate-400">Full control &amp; config</div>
                </div>
                {currentRole === 'admin' && <Check className="w-3.5 h-3.5 text-brand-light" />}
              </button>
              <button
                onClick={() => { setCurrentRole('staff'); setRoleDropdownOpen(false); }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 ${currentRole === 'staff' ? 'text-cyan-300 font-bold bg-cyan-950/40' : 'text-slate-300'}`}
              >
                <div>
                  <div className="font-semibold">Staff (Operations)</div>
                  <div className="text-[10px] text-slate-400">Quotes, billing, payments</div>
                </div>
                {currentRole === 'staff' && <Check className="w-3.5 h-3.5 text-cyan-300" />}
              </button>
              <button
                onClick={() => { setCurrentRole('customer'); setRoleDropdownOpen(false); }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 ${currentRole === 'customer' ? 'text-amber-300 font-bold bg-amber-950/40' : 'text-slate-300'}`}
              >
                <div>
                  <div className="font-semibold">Customer (Portal)</div>
                  <div className="text-[10px] text-slate-400">Isolated customer view</div>
                </div>
                {currentRole === 'customer' && <Check className="w-3.5 h-3.5 text-amber-300" />}
              </button>
            </div>
          )}
        </div>

        {/* Neon Theme Picker */}
        <div className="relative">
          <button
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            className="p-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Switch Neon Theme"
          >
            <Palette className="w-4 h-4 text-glow" />
          </button>

          {themeDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Neon Themes
              </div>
              {Object.entries(THEMES).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => handleSelectTheme(key)}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 ${activeTheme === key ? 'text-white font-bold' : 'text-slate-300'}`}
                >
                  <span className="capitalize">{item.name}</span>
                  {activeTheme === key && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
