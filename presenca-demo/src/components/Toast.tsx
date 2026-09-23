import { useApp } from '../contexts/AppContext'
import styles from './Toast.module.css'

export function Toast() {
  const { state } = useApp()
  if (!state.toast) return null

  const typeClass = {
    success: styles.success,
    error: styles.error,
    info: styles.info,
  }[state.toast.type]

  return (
    <div className={`${styles.toast} ${typeClass}`} key={state.toast.id}>
      {state.toast.message}
    </div>
  )
}
