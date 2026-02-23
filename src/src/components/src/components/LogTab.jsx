import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase'
import { C, s } from '../styles/theme'
import { ALL_PT, todayStr } from '../prayerTimes'
import Modal from './Modal'

const WORKOUT_TYPES = ['Upper Body', 'Lower Body', 'Cardio', 'Skipping', 'Abs', 'Full Body']
const SUPPS = ['Vit D', 'Omega 3', 'Magnesium', 'Zinc', 'Iron', 'B12']

export default function LogTab({ user }) {
  const today = todayStr()
  const pt    = ALL_PT.find(d => d.date === today)

  const [log, setLog] = useState({
    id: null, water: 0, coffees: 0, salt: false,
    supplements: [], day_rating: null, activities: []
  })
  const [gymSessions, setGymSessions] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [showGym,     setShowGym]     = useState(false)
  const [showRating,  setShowRating]  = useState(false)
  const [gymF,        setGymF]        = useState({ types: [], rating: 0, duration: '', notes: '' })
  const [ratingF,     setRatingF]     = useState({ mood: 0, energy: 0, hunger: 0, sleep: 0 })

  // ── Load today's data ────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [logRes, gymRes] = await Promise.all([
        supabase.from('daily_logs').select('*').eq('user_id', user.id).eq('log_date', today).single(),
        supabase.from('gym_sessions').select('*').eq('user_id', user.id).eq('log_date', today).order('created_at')
      ])
      if (logRes.data) setLog({ ...logRes.data, activities: logRes.data.activities || [] })
      if (gymRes.data) setGymSessions(gymRes.data)
      setLoading(false)
    }
    load()
  }, [user.id, today])

  // ── Upsert log ───────────────────────────────────────
  const saveLog = useCallback(async (updates) => {
    const payload = { user_id: user.id, log_date: today, ramadan_day: pt?.day || null, ...updates }
    const { data, error } = await supabase
      .from('daily_logs')
      .upsert(payload, { onConflict: 'user_id,log_date' })
      .select().single()
    if (!error && data) setLog({ ...data, activities: data.activities || [] })
  }, [user.id, today, pt])

  const addAct = (type, detail) => [...(log.activities || []), { type, detail, ts: new Date().toISOString() }]

  const logWater   = ()          => saveLog({ ...log, water: log.water + 1,     activities: addAct('water',  `+1L (total: ${log.water + 1}L)`) })
  const adjWater   = d           => log.water + d >= 0 && saveLog({ ...log, water: log.water + d, activities: addAct('water', `${d > 0 ? '+' : ''}${d}L`) })
  const logCoffee  = ()          => saveLog({ ...log, coffees: log.coffees + 1, activities: addAct('coffee', `Coffee #${log.coffees + 1}`) })
  const toggleSalt = ()          => { const n = !log.salt; saveLog({ ...log, salt: n, activities: n ? addAct('salt', '🧂 Salt logged') : log.activities }) }
  const toggleSupp = sp          => {
    const has   = (log.supplements || []).includes(sp)
    const supps = has ? log.supplements.filter(x => x !== sp) : [...(log.supplements || []), sp]
    saveLog({ ...log, supplements: supps, activities: has ? log.activities : addAct('supplement', `💊 ${sp}`) })
  }

  // ── Gym session ──────────────────────────────────────
  const submitGym = async () => {
    if (!gymF.types.length || !gymF.rating) return
    const { data, error } = await supabase.from('gym_sessions').insert({
      user_id: user.id, log_date: today,
      types: gymF.types, rating: gymF.rating,
      duration: gymF.duration ? parseInt(gymF.duration) : null,
      notes: gymF.notes || null
    }).select().single()
    if (!error && data) {
      setGymSessions(g => [...g, data])
      saveLog({ ...log, activities: addAct('gym', `💪 ${gymF.types.join(' + ')} · ${gymF.duration}min · ${'★'.repeat(gymF.rating)}`) })
    }
    setGymF({ types: [], rating: 0, duration: '', notes: '' })
    setShowGym(false)
  }

  // ── Day rating ───────────────────────────────────────
  const submitRating = async () => {
    if (!ratingF.mood || !ratingF.energy) return
    await saveLog({ ...log, day_rating: ratingF, activities: addAct('dayrating', `⭐ Mood:${ratingF.mood} Energy:${ratingF.energy} Hunger:${ratingF.hunger} Sleep:${ratingF.sleep}`) })
    setShowRating(false)
  }

  const Section = ({ emoji, title, right, children }) => (
    <div style={s.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{emoji} {title}</div>
        {right}
      </div>
      {children}
    </div>
  )

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: C.muted }}>⏳ Loading today's log…</div>

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 800 }}>📝 Today's Log</h2>

      {/* Water */}
      <Section emoji="💧" title="Water" right={<span style={{ fontSize: 28, fontWeight: 900, color: C.blue }}>{log.water}<span style={{ fontSize: 14 }}>L</span></span>}>
        <div style={{ background: 'rgba(13,8,32,0.5)', borderRadius: 8, height: 10, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ background: `linear-gradient(90deg,${C.blue},#38bdf8)`, height: '100%', width: `${Math.min(100, (log.water / 3) * 100)}%`, borderRadius: 8, transition: 'width .5s' }} />
        </div>
        <div style={{ color: C.muted, fontSize: 12, marginBottom: 12 }}>{log.water} / 3L post-Iftar goal</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={logWater} style={{ ...s.btn, flex: 3, background: 'linear-gradient(135deg,#1e40af,#2563eb)' }}>+ 1 Litre</button>
          <button onClick={() => adjWater(-1)} style={{ ...s.btnSm, flex: 1 }} disabled={log.water <= 0}>−1L</button>
        </div>
      </Section>

      {/* Coffee */}
      <Section emoji="☕" title="Coffee" right={<span style={{ fontSize: 28, fontWeight: 900, color: '#d97706' }}>{log.coffees}<span style={{ fontSize: 14 }}> cups</span></span>}>
        {log.coffees >= 2 && (
          <div style={{ color: C.gold, fontSize: 12, marginBottom: 10, padding: '8px 12px', background: 'rgba(245,158,11,0.1)', borderRadius: 8, border: '1px solid rgba(245,158,11,0.2)' }}>
            ⚠️ 2+ coffees — consider limiting caffeine during Ramadan
          </div>
        )}
        <button onClick={logCoffee} style={{ ...s.btn, background: 'linear-gradient(135deg,#78350f,#b45309)' }}>+ 1 Coffee</button>
      </Section>

      {/* Salt & Supplements */}
      <Section emoji="💊" title="Salt & Supplements">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button onClick={toggleSalt} style={{ ...s.btnSm, background: log.salt ? 'rgba(124,58,237,0.4)' : 'transparent', borderColor: log.salt ? C.accent : C.border }}>
            {log.salt ? '✅' : '◻️'} 🧂 Salt
          </button>
          {SUPPS.map(sp => (
            <button key={sp} onClick={() => toggleSupp(sp)}
              style={{ ...s.btnSm, background: (log.supplements || []).includes(sp) ? 'rgba(124,58,237,0.4)' : 'transparent', borderColor: (log.supplements || []).includes(sp) ? C.accent : C.border }}>
              {(log.supplements || []).includes(sp) ? '✅' : '◻️'} {sp}
            </button>
          ))}
        </div>
      </Section>

      {/* Gym */}
      <Section emoji="💪" title="Gym Session" right={<span style={{ color: C.muted, fontSize: 13 }}>{gymSessions.length} today</span>}>
        {gymSessions.map(gs => (
          <div key={gs.id} style={{ background: 'rgba(13,8,32,0.5)', borderRadius: 10, padding: '10px 12px', marginBottom: 8, border: `1px solid ${C.border}` }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{gs.types.join(' + ')}</div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>{'★'.repeat(gs.rating)}{'☆'.repeat(5 - gs.rating)} · {gs.duration}min{gs.notes ? ' · ' + gs.notes : ''}</div>
          </div>
        ))}
        <button onClick={() => setShowGym(true)} style={{ ...s.btn, background: 'linear-gradient(135deg,#065f46,#059669)' }}>+ Log Gym Session</button>
      </Section>

      {/* Day Rating */}
      <Section emoji="⭐" title="End of Day Rating">
        {log.day_rating ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
            {[['😊', 'mood'], ['⚡', 'energy'], ['🍽️', 'hunger'], ['😴', 'sleep']].map(([em, k]) => (
              <div key={k} style={{ background: 'rgba(13,8,32,0.5)', borderRadius: 10, padding: 10, textAlign: 'center', border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>{em} {k}</div>
                <div style={{ color: C.gold, fontSize: 16 }}>{'★'.repeat(log.day_rating[k] || 0)}{'☆'.repeat(5 - (log.day_rating[k] || 0))}</div>
              </div>
            ))}
          </div>
        ) : (
          <button onClick={() => setShowRating(true)} style={{ ...s.btn, background: 'linear-gradient(135deg,#1e3a5f,#1d4ed8)' }}>Rate My Day →</button>
        )}
        {log.day_rating && <button onClick={() => setShowRating(true)} style={{ ...s.btnSm, width: '100%' }}>✏️ Edit Rating</button>}
      </Section>

      {/* Gym Modal */}
      {showGym && (
        <Modal onClose={() => setShowGym(false)}>
          <h3 style={{ margin: '0 0 16px' }}>💪 Log Gym Session</h3>
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: C.muted, fontSize: 12, display: 'block', marginBottom: 8, fontWeight: 700 }}>Workout Type(s)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {WORKOUT_TYPES.map(t => (
                <button key={t} onClick={() => setGymF(f => ({ ...f, types: f.types.includes(t) ? f.types.filter(x => x !== t) : [...f.types, t] }))}
                  style={{ ...s.btnSm, background: gymF.types.includes(t) ? 'rgba(16,185,129,0.3)' : 'transparent', borderColor: gymF.types.includes(t) ? C.green : C.border }}>
                  {gymF.types.includes(t) ? '✅ ' : ''}{t}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: C.muted, fontSize: 12, display: 'block', marginBottom: 6, fontWeight: 700 }}>Session Rating</label>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setGymF(f => ({ ...f, rating: n }))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 34, color: n <= gymF.rating ? C.gold : '#2d1b69', lineHeight: 1 }}>★</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: C.muted, fontSize: 12, display: 'block', marginBottom: 6, fontWeight: 700 }}>Duration (minutes)</label>
            <input style={s.inp} type="number" placeholder="e.g. 45" value={gymF.duration} onChange={e => setGymF(f => ({ ...f, duration: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ color: C.muted, fontSize: 12, display: 'block', marginBottom: 6, fontWeight: 700 }}>Notes (optional)</label>
            <input style={s.inp} placeholder="How did it feel?" value={gymF.notes} onChange={e => setGymF(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowGym(false)} style={{ ...s.btnSm, flex: 1 }}>Cancel</button>
            <button onClick={submitGym} style={{ ...s.btn, flex: 2 }}>Save Session</button>
          </div>
        </Modal>
      )}

      {/* Day Rating Modal */}
      {showRating && (
        <Modal onClose={() => setShowRating(false)}>
          <h3 style={{ margin: '0 0 16px' }}>⭐ Rate Your Day</h3>
          {[['😊', 'mood', 'Mood'], ['⚡', 'energy', 'Energy'], ['🍽️', 'hunger', 'Hunger (how manageable?)'], ['😴', 'sleep', "Last night's Sleep"]].map(([em, k, label]) => (
            <div key={k} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>{em} {label}</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setRatingF(r => ({ ...r, [k]: n }))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 36, color: n <= ratingF[k] ? C.gold : '#2d1b69', lineHeight: 1 }}>★</button>
                ))}
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={() => setShowRating(false)} style={{ ...s.btnSm, flex: 1 }}>Cancel</button>
            <button onClick={submitRating} style={{ ...s.btn, flex: 2 }}>Save Rating</button>
          </div>
        </Modal>
      )}
    </div>
  )
}