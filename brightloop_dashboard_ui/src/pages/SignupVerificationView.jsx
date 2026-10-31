// SignupVerificationView.jsx - Buildly Orange Dark Theme Security Test Harness
import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  X,
  Lock,
  Mail,
  User,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function SignupVerificationView() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password Rules Live Evaluation (9+ characters, upper, lower, special)
  const isLengthValid = password.length > 8; // Strictly > 8 (so 9+)
  const isUpperValid = /[A-Z]/.test(password);
  const isLowerValid = /[a-z]/.test(password);
  const isSpecialValid = /[^a-zA-Z0-9]/.test(password);
  const isPasswordAllValid = isLengthValid && isUpperValid && isLowerValid && isSpecialValid;

  // Duplicate email check
  const existingEmails = [
    'admin@brightloop.test',
    'staff.alex@brightloop.test',
    'billing@acmesoftware.test',
    'finance@betaenterprises.test',
  ];

  const handleSignup = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (existingEmails.includes(email.trim().toLowerCase())) {
      setErrorMessage('Validation Error: An account with this email address already exists. Duplicate emails are rejected.');
      return;
    }

    if (!isPasswordAllValid) {
      setErrorMessage('Validation Error: Password does not satisfy all security complexity rules.');
      return;
    }

    setSubmitted(true);
  };

  const handleFastFill = (type) => {
    setSubmitted(false);
    setErrorMessage('');
    if (type === '8char_fail') {
      setEmail('tester8@brightloop.test');
      setPassword('P@sswor1'); // 8 chars with all classes -> MUST FAIL!
    } else if (type === '9char_pass') {
      setEmail('newuser@company.test');
      setPassword('P@ssword1'); // 9 chars with all classes -> PASSES!
    } else if (type === 'dup_fail') {
      setEmail('billing@acmesoftware.test'); // Existing email -> MUST FAIL!
      setPassword('P@ssword123!');
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-950/60 px-3 py-1 rounded-full border border-orange-800/60">
          Security Test Harness
        </span>
        <h1 className="text-2xl font-black text-white">Live Website Sign-Up &amp; Password Policy</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Interactive evaluation of the hackathon security rules: strict email uniqueness, 9+ character password length, uppercase, lowercase, and special characters.
        </p>
      </div>

      {/* Preset Test Scenarios Quick Bar */}
      <div className="p-3 bg-[#121620]/90 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-400 text-[10px] uppercase">One-Click Test Scenarios:</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => handleFastFill('8char_fail')}
            className="px-2.5 py-1 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800 font-bold hover:bg-rose-900 cursor-pointer"
          >
            Test 8 Chars (Fails)
          </button>
          <button
            onClick={() => handleFastFill('9char_pass')}
            className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800 font-bold hover:bg-emerald-900 cursor-pointer"
          >
            Test 9 Chars (Passes)
          </button>
          <button
            onClick={() => handleFastFill('dup_fail')}
            className="px-2.5 py-1 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-800 font-bold hover:bg-amber-900 cursor-pointer"
          >
            Test Duplicate Email
          </button>
        </div>
      </div>

      {/* Main Signup Card */}
      <div className="rounded-3xl border border-slate-800 bg-[#121620]/90 p-6 sm:p-8 shadow-xl space-y-5">
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-black text-white">Registration Successful</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Portal customer user created successfully with compliant password hash. User is assigned to <strong className="font-mono text-orange-400">base.group_portal</strong> and strictly isolated from other customers' data.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-4 py-2 rounded-xl bg-orange-500 text-slate-950 text-xs font-bold hover:bg-orange-400 cursor-pointer shadow-md"
            >
              Test Another Registration
            </button>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4 text-xs">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Full Business Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Acme Innovations"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Business Email (Unique Account ID)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. billing@acme.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Account Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter test password..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Live Password Rules Checklist */}
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Live Security Policy Checklist
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className={`flex items-center gap-1.5 ${isLengthValid ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                  {isLengthValid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                  <span>Strictly &gt; 8 characters ({password.length})</span>
                </div>
                <div className={`flex items-center gap-1.5 ${isUpperValid ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                  {isUpperValid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                  <span>At least 1 uppercase letter</span>
                </div>
                <div className={`flex items-center gap-1.5 ${isLowerValid ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                  {isLowerValid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                  <span>At least 1 lowercase letter</span>
                </div>
                <div className={`flex items-center gap-1.5 ${isSpecialValid ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                  {isSpecialValid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                  <span>At least 1 special char (!@#$)</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-xs font-bold hover:brightness-110 cursor-pointer shadow-md shadow-orange-500/20"
            >
              Verify Sign-Up Submission
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
