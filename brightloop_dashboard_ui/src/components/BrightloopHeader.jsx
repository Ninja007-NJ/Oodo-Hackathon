// BrightloopHeader.jsx - Buildly Orange Theme Header with Active Profile and Sign Out
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
  Sparkles,
  LogOut,
  UserCheck
} from 'lucide-react';
import { THEMES, applyTheme } from '../theme';

export default function BrightloopHeader({
  currentRole,
  setCurrentRole,
  currentUser,
  onLogout,
  onOpenBillingModal,
  searchQuery,
  setSearchQuery,
  loadTimeMs = 38,
  activeTheme = 'orange',
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
    <header className="sticky top-0 z-30 w-full bg-[#0D1017]/95 backdrop-blur-xl border-b border-slate-800 text-slate-100 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
      {/* Brand Identity & Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Buildly Orange Diamond Logo */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/25 ring-1 ring-orange-400/30">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-black tracking-tight text-white">BRIGHTLOOP</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-950/80 px-2.5 py-0.5 rounded-full border border-orange-800/80">
              Subscription Engine
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span>Subscription Management &amp; Recurring Billing</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Local State Reactive Store
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
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all"
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

        {/* Quick Action: Run Billing Now (Buildly Orange Button) - Staff and Admin Only */}
        {currentRole !== 'customer' && (
          <button
            onClick={onOpenBillingModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>⚡ Run Billing</span>
          </button>
        )}

        {/* Active Profile Pill with Sign Out */}
        {currentUser && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
              <span className="text-sm">{currentUser.avatar || '👤'}</span>
              <div className="hidden sm:block text-left text-[11px] leading-tight">
                <div className="font-bold text-slate-200">{currentUser.name}</div>
                <div className="text-[9px] uppercase tracking-wider text-orange-400 font-mono font-bold">
                  {currentUser.roleLabel || currentUser.role}
                </div>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Sign Out / Switch Profile"
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition-colors cursor-pointer border border-slate-700"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-semibold hover:bg-slate-700/80 transition-all cursor-pointer"
          >
            <div className={`w-2 h-2 rounded-full ${currentRole === 'admin' ? 'bg-orange-400' : currentRole === 'staff' ? 'bg-amber-400' : 'bg-blue-400'}`} />
            <span className="capitalize hidden md:inline">{currentRole === 'customer' ? 'Customer Portal' : currentRole}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Switch Operational Role
              </div>
              <button
                onClick={() => { setCurrentRole('admin'); setRoleDropdownOpen(false); }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 ${currentRole === 'admin' ? 'text-orange-400 font-bold bg-orange-950/40' : 'text-slate-300'}`}
              >
                <div>
                  <div className="font-semibold">Administrator</div>
                  <div className="text-[10px] text-slate-400">Full control &amp; config</div>
                </div>
                {currentRole === 'admin' && <Check className="w-3.5 h-3.5 text-orange-400" />}
              </button>
              <button
                onClick={() => { setCurrentRole('staff'); setRoleDropdownOpen(false); }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 ${currentRole === 'staff' ? 'text-amber-400 font-bold bg-amber-950/40' : 'text-slate-300'}`}
              >
                <div>
                  <div className="font-semibold">Staff (Operations)</div>
                  <div className="text-[10px] text-slate-400">Quotes, billing, payments</div>
                </div>
                {currentRole === 'staff' && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
              <button
                onClick={() => { setCurrentRole('customer'); setRoleDropdownOpen(false); }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 ${currentRole === 'customer' ? 'text-blue-400 font-bold bg-blue-950/40' : 'text-slate-300'}`}
              >
                <div>
                  <div className="font-semibold">Customer (Portal)</div>
                  <div className="text-[10px] text-slate-400">Isolated customer view</div>
                </div>
                {currentRole === 'customer' && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </button>
            </div>
          )}
        </div>

        {/* Theme Picker */}
        <div className="relative">
          <button
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            className="p-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Switch Neon Theme"
          >
            <Palette className="w-4 h-4 text-orange-400" />
          </button>

          {themeDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Color Themes
              </div>
              {Object.entries(THEMES).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => handleSelectTheme(key)}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 ${activeTheme === key ? 'text-white font-bold' : 'text-slate-300'}`}
                >
                  <span className="capitalize">{item.name}</span>
                  {activeTheme === key && <Check className="w-3.5 h-3.5 text-orange-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
