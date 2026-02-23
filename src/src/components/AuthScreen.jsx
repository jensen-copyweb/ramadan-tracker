import { useState } from 'react'
import { supabase } from '../supabase'
import { C, s } from '../styles/theme'

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ color: C.muted, fontSize: 12, display: 'block', marginBottom: 6, fontWeight: 600 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

export default function AuthScreen() {
  const [mode, setMode]   = useState('login')
  const [name, setName]   = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass]   = useState('')
  const [err, setErr]     = useState('')
  const [msg, setMsg]     = useState('')
  const [busy, setBusy]   = useState(false)

  const handleLogin = async () => {
    if (!email || !pass) return setErr('Please enter your email and password.')
    setBusy(true); setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (error) setErr(error.message)
    setBusy(false)
  }

  const handleRegister = async () => {
    if (!name || !email || !pass) return setErr('Please fill in all fields.')
    if (pass.length < 6) return setErr('Password must be at least 6 characters.')
    setBusy(true); setErr('')
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: { name } }
    })
    if (error) {
      setErr(error.message)
    } else {
      setMsg('✅ Account created! Check your email to confirm, then log in.')
      setMode('login')
    }
    setBusy(false)
  }

  const submit = mode === 'login' ? handleLogin : handleRegister

  return (
    <div style={{ ...s.app, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, minHeight: '100vh' }}>
      <div style={{ fontSize: 72, marginBottom: 4, textShadow: '0 0 40px rgba(168,85,247,0.6)' }}>🌙</div>
      <h1 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 900, textAlign: 'center', background: 'linear-gradient(135deg,#c084fc,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Ramadan Tracker
      </h1>
      <p style={{ color: C.muted, marginBottom: 4, textAlign: 'center', fontSize: 14 }}>Cape Town · SAST (UTC+2)</p>
      <p style={{ color: '#a855f7', marginBottom: 32, textAlign: 'center', fontSize: 13, fontWeight: 700 }}>1447 / 2026</p>

      <div style={{ ...s.card, width: '100%', maxWidth: 380, padding: 24 }}>
        {/* Toggle */}
        <div style={{ display: 'flex', background: 'rgba(13,8,32,0.6)', borderRadius: 12, padding: 4, marginBottom: 20 }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setErr(''); setMsg('') }}
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14, background: mode === m ? C.accent : 'transparent', color: mode === m ? '#fff' : C.muted, transition: 'all .2s' }}>
              {m === 'login' ? '🔐 Login' : '✨ Sign Up'}
            </button>
          ))}
        </div>

        {mode === 'register' && (
          <Field label="Your Name">
            <input style={s.inp} placeholder="e.g. Ahmed" value={name} onChange={e => setName(e.target.value)} />
          </Field>
        )}
        <Field label="Email Address">
          <input style={s.inp} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </Field>
        <Field label="Password">
          <input style={s.inp} type="password" placeholder="Min. 6 characters" value={pass}
            onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} />
        </Field>

        {err && (
          <div style={{ color: C.red, fontSize: 13, marginBottom: 12, padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: 8, textAlign: 'center' }}>
            {err}
          </div>
        )}
        {msg && (
          <div style={{ color: C.green, fontSize: 13, marginBottom: 12, padding: '8px 12px', background: 'rgba(16,185,129,0.1)', borderRadius: 8, textAlign: 'center' }}>
            {msg}
          </div>
        )}

        <button onClick={submit} disabled={busy} style={{ ...s.btn, opacity: busy ? .6 : 1 }}>
          {busy ? '⏳ Please wait…' : mode === 'login' ? 'Login →' : 'Create Account →'}
        </button>

        {mode === 'login'
          ? <p style={{ color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 12 }}>
              No account? <span onClick={() => setMode('register')} style={{ color: '#a855f7', cursor: 'pointer' }}>Sign up free</span>
            </p>
          : <p style={{ color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 12 }}>
              Already registered? <span onClick={() => setMode('login')} style={{ color: '#a855f7', cursor: 'pointer' }}>Login</span>
            </p>
        }
      </div>
    </div>
  )
}