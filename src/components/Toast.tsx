// src/components/Toast.tsx

import {
  useState,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
  type FC,
} from 'react'
import type { ToastType, ToastMessage } from '../types/movie'
import styles from './Toast.module.css'

type AddToast = (msg: string, type?: ToastType) => void

const ToastCtx = createContext<AddToast | null>(null)

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback<AddToast>((msg, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, msg, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200)
  }, [])

  return (
    <ToastCtx.Provider value={addToast}>
      {children}
      <div className={styles.container} role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast(): AddToast {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}