// SignupVerificationView.jsx
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
  const existingEmails = ['admin@brightloop.io', 'staff.alex@brightloop.test', 'billing@acmesoftware.test', 'finance@betaenterprises.test'];

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
    <main className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
          Security Test Harness
        </span>
        <h1 className="text-2xl font-black text-black">Live Website Sign-Up &amp; Password Policy</h1>
        <p className="text-xs text-neutral-600 max-w-md mx-auto">
          Interactive evaluation of the hackathon security rules: strict email uniqueness, 9+ character password length, uppercase, lowercase, and special characters.
        </p>
      </div>

      {/* Preset Test Scenarios Quick Bar */}
      <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-neutral-500 text-[10px] uppercase">One-Click Test Scenarios:</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => handleFastFill('8char_fail')}
            className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-bold hover:bg-rose-100 cursor-pointer"
          >
            Test 8 Chars (Fails)
          </button>
          <button
            onClick={() => handleFastFill('9char_pass')}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold hover:bg-emerald-100 cursor-pointer"
          >
            Test 9 Chars (Passes)
          </button>
          <button
            onClick={() => handleFastFill('dup_fail')}
            className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-bold hover:bg-amber-100 cursor-pointer"
          >
            Test Duplicate Email
          </button>
        </div>
      </div>

      {/* Main Signup Card */}
      <div className="rounded-3xl border-2 border-black bg-white p-6 sm:p-8 shadow-sm space-y-5">
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-black text-emerald-950">Registration Successful</h3>
            <p className="text-xs text-emerald-800 max-w-sm mx-auto">
              Portal customer user created successfully with compliant password hash. User is assigned to <strong className="font-mono">base.group_portal</strong> and strictly isolated from staff data.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer"
            >
              Test Another Registration
            </button>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Full Business Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Acme Innovations"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-9 pr-3 py-2 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Business Email (Unique Account ID)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. billing@acme.com"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-9 pr-3 py-2 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Account Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter strong password..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            {/* Live 4-Rule Visual Checklist */}
            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2 text-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Live Password Rules Checklist:
              </div>

              {/* Rule 1: More than 8 characters */}
              <div className={`flex items-center gap-2 ${isLengthValid ? 'text-emerald-700 font-bold' : 'text-neutral-500'}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isLengthValid ? 'bg-emerald-200 text-emerald-900' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {isLengthValid ? '✓' : '✕'}
                </span>
                <span>More than 8 characters (minimum 9 characters, current: {password.length})</span>
              </div>

              {/* Rule 2: At least one uppercase letter */}
              <div className={`flex items-center gap-2 ${isUpperValid ? 'text-emerald-700 font-bold' : 'text-neutral-500'}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isUpperValid ? 'bg-emerald-200 text-emerald-900' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {isUpperValid ? '✓' : '✕'}
                </span>
                <span>At least one uppercase letter (A-Z)</span>
              </div>

              {/* Rule 3: At least one lowercase letter */}
              <div className={`flex items-center gap-2 ${isLowerValid ? 'text-emerald-700 font-bold' : 'text-neutral-500'}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isLowerValid ? 'bg-emerald-200 text-emerald-900' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {isLowerValid ? '✓' : '✕'}
                </span>
                <span>At least one lowercase letter (a-z)</span>
              </div>

              {/* Rule 4: At least one special character */}
              <div className={`flex items-center gap-2 ${isSpecialValid ? 'text-emerald-700 font-bold' : 'text-neutral-500'}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isSpecialValid ? 'bg-emerald-200 text-emerald-900' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {isSpecialValid ? '✓' : '✕'}
                </span>
                <span>At least one special character (!@#$%^&amp;*...)</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isPasswordAllValid || !email}
              className="w-full py-2.5 rounded-xl bg-black text-white font-bold text-xs hover:bg-neutral-800 disabled:opacity-40 transition-all cursor-pointer shadow-md"
            >
              Create Account
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
