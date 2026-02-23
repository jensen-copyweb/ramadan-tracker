import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { C, s } from '../styles/theme'
import { todayStr } from '../prayerTimes'

const icon = t => ({ water: '💧', coffee: '☕', salt: '🧂', supplement: '💊', gym: '💪', dayrating: '⭐' }[t] || '📌')

export default function ActivityTab({ user }) {
  const [todayLog, setTodayLog] = useState(null)
  const [history,  setHistory]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const today = todayStr()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [logRes, histRes] = await Promise.all([
        supabase.from('daily_logs').select('*').eq('user_id', user.id).eq('log_date', today).single(),
        supabase.from('daily_logs').select('log_date,water,coffees,day_rating,ramadan_day,activities')
          .eq('user_id', user.id).order('log_date', { ascending: false }).limit(30)
      ])
      if (logRes.data)  setTodayLog(logRes.data)
      if (histRes.data) setHistory(histRes.data)
      setLoading(false)
    }
    load()
  }, [user.id, today])

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: C.muted }}>⏳ Loading…</div>

  const activities = todayLog?.activities || []
  const pastDays   = history.filter(h => h.log_date !== today)

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 800 }}>📋 Activity Log</h2>

      {/* Today */}
      <div style={s.card}>
        <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>
          Today · {new Date(today + 'T12:00:00').toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        {activities.length === 0 ? (
          <div style={{ color: C.muted, textAlign: 'center', padding: '24px 0', fontSize: 14 }}>
            No activity logged yet today
          </div>
        ) : (
          [...activities].reverse().map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 22, flexShrink: 0, width: 28, textAlign: 'center' }}>{icon(a.type)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14 }}>{a.detail}</div>
                <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>
                  {new Date(a.ts).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Past days */}
      {pastDays.length > 0 && (
        <>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.muted, marginBottom: 8, marginTop: 4 }}>PREVIOUS DAYS</div>
          {pastDays.map(h => (
            <div key={h.log_date} style={{ ...s.card, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {new Date(h.log_date + 'T12:00:00').toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })}
                </div>
                {h.ramadan_day && (
                  <div style={{ fontSize: 12, color: '#a855f7', fontWeight: 800 }}>Day {h.ramadan_day}</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 14, fontSize: 13, color: C.muted }}>
                <span>💧 {h.water || 0}L</span>
                <span>☕ {h.coffees || 0}</span>
                {h.day_rating && <span>😊 {h.day_rating.mood}★</span>}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}