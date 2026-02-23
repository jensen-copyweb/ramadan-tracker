import { C, s } from '../styles/theme'

export default function Modal({ onClose, children }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        zIndex: 100
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          ...s.card,
          width: '100%', maxWidth: 430,
          borderRadius: '20px 20px 0 0',
          padding: 22,
          maxHeight: '85vh',
          overflowY: 'auto'
        }}
      >
        {children}
      </div>
    </div>
  )
}