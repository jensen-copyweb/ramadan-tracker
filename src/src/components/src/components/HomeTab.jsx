import { useState, useEffect, useRef } from 'react'
import { C, s } from '../styles/theme'
import { ALL_PT, todayStr, toSecs, secsToHMS } from '../prayerTimes'

const MILESTONES = [
  { pct: 25,  msg: '25% there! 💪 SubhanAllah — keep going!' },
  { pct: 50,  msg: "Halfway! 🌟 Alhamdulillah! You're doing amazing!" },
  { pct: 75,  msg: '75% done! 🔥 Maghrib is close — stay strong!' },
  { pct: 90,  msg: 'Almost there! 🌅 Prepare your dates & water!' },
  { pct: 100, msg: '🎉 Iftar time! Allahu Akbar! Break your fast!' },
]

export default function HomeTab({ user }) {
  const [now, setNow]           = useState(new Date())
  const [milestone, setMilestone] = useState(null)
  const seenRef = useRef(new Set())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const today = todayStr()
  const pt    = ALL_PT.find(d => d.date === today)

  let phase = 'outside', secs = 0, pct = 0, label = ''

  if (pt) {
    const cur    = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
    const suhoor = toSecs(pt.suhoor)
    const fajr   = toSecs(pt.fajr)
    const mag    = toSecs(pt.maghrib)
    const isha   = toSecs(pt.isha)

    if (cur >= isha)       { phase = 'night-done' }
    else if (cur >= mag)   { phase = 'night';   secs = Math.max(0, isha - cur);  label = 'Isha in' }
    else if (cur >= fajr)  { phase = 'fasting'; secs = Math.max(0, mag - cur);   label = 'Iftar in'; pct = Math.min(100, ((cur - fajr) / (mag - fajr)) * 100) }
    else if (cur >= suhoor){ phase = 'suhoor';  secs = Math.max(0, fajr - cur);  label = 'Fast starts in' }
    else                   { phase = 'pre';     secs = Math.max(0, suhoor - cur); label = 'Suhoor ends in' }
  }

  // Milestone pop-ups
  useEffect(() => {
    if (phase !== 'fasting') return
    for (const m of MILESTONES) {
      const key = `${today}-${m.pct}`
      if (pct >= m.pct && !seenRef.current.has(key)) {
        seenRef.current.add(key)
        setMilestone(m.msg)
        setTimeout(() => setMilestone(null), 6000)
      }
    }
  }, [pct, phase, today])

  const fastHours = pt ? ((toSecs(pt.maghrib) - toSecs(pt.fajr)) / 3600).toFixed(1) : 0

  const phaseLabel = {
    fasting:    '🌅 Currently Fasting',
    suhoor:     '⚠️ Eat before Fajr!',
    night:      '🌃 Fast Complete — Alhamdulillah!',
    'night-done': '✅ Isha time — JazakAllah!',
    pre:        '🌙 Prepare for Suhoor',
    outside:    '',
  }[phase]

  const phaseColour = phase === 'suhoor' ? C.gold : phase === 'night' ? C.green : '#c084fc'

  return (
    <div style={{ padding: 16 }}>

      {/* Milestone banner */}
      {milestone && (
        <div style={{ background: 'linear-gradient(135deg,#7c3aed,#f59e0b)', padding: '14px 18px', borderRadius: 14, marginBottom: 12, textAlign: 'center', fontWeight: 700, fontSize: 16, animation: 'fadeIn .4s ease', boxShadow: '0 4px 24px rgba(124,58,237,0.4)' }}>
          {milestone}
        </div>
      )}

      {!pt ? (
        /* ── Outside Ramadan ── */
        <div style={{ ...s.card, textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🌙</div>
          <h2 style={{ margin: '0 0 8px', color: '#a855f7' }}>Outside Ramadan Period</h2>
          <p style={{ color: C.muted }}>Ramadan 1447 runs 19 Feb – 20 Mar 2026</p>
        </div>
      ) : (
        <>
          {/* Day banner */}
          <div style={{ ...s.card, background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(147,51,234,0.15))', textAlign: 'center', padding: '22px 16px', border: '1px solid rgba(168,85,247,0.3)' }}>
            <div style={{ color: '#a855f7', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Ramadan 1447 · Cape Town</div>
            <div style={{ fontSize: 80, fontWeight: 900, color: '#c084fc', lineHeight: 1, margin: '6px 0', textShadow: '0 0 30px rgba(192,132,252,0.4)' }}>{pt.day}</div>
            <div style={{ color: C.muted, fontSize: 14, marginBottom: 4 }}>
              Day of 30 · {new Date(pt.date + 'T12:00:00').toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <div style={{ color: C.gold, fontSize: 13, fontWeight: 700 }}>⏳ Fast length today: {fastHours} hours</div>
          </div>

          {/* Countdown */}
          <div style={{ ...s.card, textAlign: 'center', padding: '20px 16px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6, color: phaseColour }}>
              {phaseLabel}
            </div>
            {secs > 0 && <div style={{ fontSize: 12, color: C.muted, marginBottom: 3 }}>{label}</div>}
            <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: 4, fontVariantNumeric: 'tabular-nums', color: phaseColour, textShadow: '0 0 20px rgba(168,85,247,0.3)' }}>
              {secs > 0 ? secsToHMS(secs) : '——:——:——'}
            </div>
            {phase === 'fasting' && (
              <>
                <div style={{ margin: '14px 0 4px', background: 'rgba(13,8,32,0.6)', borderRadius: 10, height: 12, overflow: 'hidden' }}>
                  <div style={{ background: `linear-gradient(90deg,${C.accent},${C.gold})`, height: '100%', width: `${pct}%`, borderRadius: 10, transition: 'width 1s linear', boxShadow: '0 0 8px rgba(245,158,11,0.5)' }} />
                </div>
                <div style={{ color: C.muted, fontSize: 13, fontWeight: 600 }}>{pct.toFixed(1)}% of fast complete</div>
              </>
            )}
          </div>

          {/* Prayer times */}
          <div style={s.card}>
            <div style={{ fontWeight: 800, marginBottom: 14, fontSize: 16 }}>🕌 Today's Prayer Times</div>
            {[
              { label: '🌙 Suhoor ends',        time: pt.suhoor,  hi: true,  gold: true,  sub: 'Stop eating — Fast begins soon' },
              { label: '🌅 Fajr — Fast begins', time: pt.fajr,    hi: true,  gold: false, sub: 'Make your Niyyah' },
              { label: '☀️ Sunrise',             time: pt.sunrise, hi: false },
              { label: '☀️ Dhuhr',               time: pt.dhuhr,   hi: false },
              { label: '🌤 Asr',                 time: pt.asr,     hi: false },
              { label: '🌇 Maghrib — Iftar!',    time: pt.maghrib, hi: true,  gold: true,  sub: 'Break your fast now!' },
              { label: '🌃 Esha',                time: pt.isha,    hi: false },
            ].map(({ label, time, hi, gold, sub }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: hi ? '12px 12px' : '9px 2px',
                borderRadius: hi ? 12 : 0,
                background: hi ? (gold ? 'rgba(245,158,11,0.08)' : 'rgba(124,58,237,0.1)') : 'transparent',
                border: hi ? `1px solid ${gold ? 'rgba(245,158,11,0.25)' : 'rgba(124,58,237,0.25)'}` : 'none',
                borderBottom: !hi ? `1px solid ${C.border}` : undefined,
                marginBottom: 8,
              }}>
                <div>
                  <div style={{ fontSize: 14, color: hi ? C.text : C.muted, fontWeight: hi ? 700 : 400 }}>{label}</div>
                  {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</div>}
                </div>
                <div style={{ fontWeight: 900, fontSize: 20, color: gold && hi ? C.gold : hi ? '#c084fc' : C.text }}>{time}</div>
              </div>
            ))}
            <div style={{ textAlign: 'center', fontSize: 11, color: C.muted, marginTop: 4, padding: 6, background: 'rgba(13,8,32,0.4)', borderRadius: 8 }}>
              📍 Islamic Relief Cape Town 1447 / 2026 Timetable
            </div>
          </div>

          {/* Niyyah */}
          {(phase === 'pre' || phase === 'suhoor') && (
            <div style={{ ...s.card, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <div style={{ fontWeight: 800, color: C.gold, marginBottom: 10, fontSize: 15 }}>🤲 Niyyah (Intention)</div>
              <p style={{ fontSize: 17, lineHeight: 2, margin: '0 0 8px', fontStyle: 'italic', color: '#fde68a', textAlign: 'center', direction: 'rtl' }}>
                نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى
              </p>
              <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.7, fontStyle: 'italic' }}>
                "Nawaitu sawma ghadin 'an adā'i farḍi shahri Ramaḍāna hādhihi s-sanati lillāhi ta'āla"<br />
                <span style={{ color: '#c084fc' }}>I intend to fast tomorrow, fulfilling the obligation of Ramadan this year, for Allah the Exalted.</span>
              </p>
            </div>
          )}

          {/* Iftar dua */}
          {(phase === 'night' || phase === 'night-done' || (phase === 'fasting' && pct > 88)) && (
            <div style={{ ...s.card, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <div style={{ fontWeight: 800, color: C.green, marginBottom: 10, fontSize: 15 }}>🤲 Dua al-Iftar</div>
              <p style={{ fontSize: 15, lineHeight: 2, margin: '0 0 8px', color: '#6ee7b7', textAlign: 'center', direction: 'rtl' }}>
                اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ
              </p>
              <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.7 }}>
                O Allah! I fasted for You, I believe in You, I put my trust in You, and I break my fast with Your sustenance.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}