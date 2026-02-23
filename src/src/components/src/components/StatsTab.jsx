import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { C, s } from '../styles/theme'
import { todayStr } from '../prayerTimes'

export default function StatsTab({ user }) {
  const [hist,    setHist]    = useState([])
  const [gym,     setGym]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [logRes, gymRes] = await Promise.all([
        supabase.from('daily_logs').select('*').eq('user_id', user.id).order('log_date'),
        supabase.from('gym_sessions').select('*').eq('user_id', user.id).order('log_date'),
      ])
      if (logRes.data) setHist(logRes.data)
      if (gymRes.data) setGym(gymRes.data)
      setLoading(false)
    }
    load()
  }, [user.id])

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: C.muted }}>⏳ Loading stats…</div>

  const n        = hist.length
  const avgWater = n ? (hist.reduce((s, h) => s + (h.water || 0), 0) / n).toFixed(1) : 0
  const avgGym   = gym.length ? (gym.reduce((s, g) => s + g.rating, 0) / gym.length).toFixed(1) : 0
  const rated    = hist.filter(h => h.day_rating)
  const avg      = k => rated.length ? (rated.reduce((s, h) => s + (h.day_rating[k] || 0), 0) / rated.length).toFixed(1) : '—'

  // Streak
  const dates  = hist.map(h => h.log_date).sort()
  let best = 0, cur = 0
  for (let i = 0; i < dates.length; i++) {
    if (i === 0) { cur = 1 } else {
      const diff = (new Date(dates[i]) - new Date(dates[i - 1])) / 86400000
      cur = diff === 1 ? cur + 1 : 1
    }
    if (cur > best) best = cur
  }
  const streak = dates.length && dates[dates.length - 1] === todayStr() ? cur : 0

  const StatCard = ({ emoji, label, val, sub, col }) => (
    <div style={{ ...s.card, textAlign: 'center', padding: '16px 10px', marginBottom: 0 }}>
      <div style={{ fontSize: 30, marginBottom: 4 }}>{emoji}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: col || '#c084fc' }}>{val}</div>
      <div style={{ fontWeight: 700, fontSize: 12, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{sub}</div>}
    </div>
  )

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800 }}>📊 My Progress</h2>
      <p style={{ color: C.muted, fontSize: 13, margin: '0 0 16px' }}>{user.name}'s personal Ramadan stats</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <StatCard emoji="📅" label="Days Logged"    val={n}             sub="this Ramadan" />
        <StatCard emoji="🔥" label="Current Streak" val={streak}        sub={`Best: ${best} days`} col={C.gold} />
        <StatCard emoji="💧" label="Avg Water"       val={`${avgWater}L`} sub="per day"     col={C.blue} />
        <StatCard emoji="💪" label="Gym Sessions"    val={gym.length}   sub={avgGym > 0 ? `Avg ${avgGym}★` : 'none yet'} col={C.green} />
        <StatCard emoji="😊" label="Avg Mood"        val={avg('mood')}  sub="out of 5" />
        <StatCard emoji="⚡" label="Avg Energy"      val={avg('energy')} sub="out of 5" />
        <StatCard emoji="😴" label="Avg Sleep"       val={avg('sleep')} sub="out of 5" />
        <StatCard emoji="🍽️" label="Avg Hunger"      val={avg('hunger')} sub="lower = easier" />
      </div>

      {/* Mood trend chart */}
      {rated.length >= 3 && (
        <div style={s.card}>
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>📈 Mood Trend (last 10 days)</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 60 }}>
            {rated.slice(-10).map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ background: 'linear-gradient(180deg,#a855f7,#7c3aed)', borderRadius: '3px 3px 0 0', height: `${(h.day_rating.mood / 5) * 52}px`, width: '100%', minHeight: 4 }} />
                <div style={{ color: C.muted, fontSize: 9 }}>D{h.ramadan_day || '?'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fast history */}
      <div style={s.card}>
        <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>📜 Fast History</div>
        {hist.length === 0 ? (
          <div style={{ color: C.muted, textAlign: 'center', padding: '20px 0', fontSize: 14 }}>
            No history yet — start logging!
          </div>
        ) : (
          [...hist].reverse().map(h => (
            <div key={h.log_date} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>
                  {h.ramadan_day ? `Day ${h.ramadan_day}` : h.log_date}
                  <span style={{ color: C.muted, fontWeight: 400, fontSize: 12, marginLeft: 8 }}>
                    {new Date(h.log_date + 'T12:00:00').toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
                  💧{h.water || 0}L · ☕{h.coffees || 0} · 💪{gym.filter(g => g.log_date === h.log_date).length}
                </div>
              </div>
              {h.day_rating && (
                <div style={{ color: C.gold, fontSize: 15 }}>
                  {'★'.repeat(Math.round((h.day_rating.mood + h.day_rating.energy) / 2))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Notifications info */}
      <div style={{ ...s.card, background: 'rgba(124,58,237,0.07)', border: `1px solid ${C.accent}` }}>
        <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 15 }}>🔔 Notifications</div>
        <div style={{ fontSize: 13, lineHeight: 2, color: C.muted }}>
          <div>Method: <span style={{ color: C.text, fontWeight: 700 }}>📧 Email</span></div>
          <div>Address: <span style={{ color: C.text, fontWeight: 700 }}>{user.email}</span></div>
        </div>
        <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(13,8,32,0.5)', borderRadius: 10, fontSize: 12, color: C.muted, lineHeight: 1.8 }}>
          💡 <strong style={{ color: '#a855f7' }}>n8n automations:</strong><br />
          · Suhoor reminder 30 min before Fajr<br />
          · Iftar alert 10 min before Maghrib<br />
          · End-of-day rating prompt after Esha<br />
          · Weekly Friday progress summary
        </div>
      </div>
    </div>
  )
}