import { useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header'
import { CalendarDays } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import styles from './SecretariaHome.module.css'

export function SecretariaHome() {
  const navigate = useNavigate()
  const { state } = useApp()

  return (
    <div className={styles.page}>
      <Header title="Secretaria" rightContent={
        <button className={styles.switchBtn} onClick={() => navigate('/demo')}>Trocar modo</button>
      } />
      <div className={styles.content}>
        <div className={styles.stats}>
          <div className={styles.statCard}><span className={styles.statValue}>{state.events.length}</span><span className={styles.statLabel}>Eventos</span></div>
          <div className={styles.statCard}><span className={styles.statValue}>{state.attendance.length}</span><span className={styles.statLabel}>Presenças</span></div>
        </div>
        <div className={styles.menu}>
          <button className={styles.menuItem} onClick={() => navigate('/secretaria/eventos')}>
            <div className={styles.menuIcon}><CalendarDays size={24} /></div>
            <div className={styles.menuText}><h3>Eventos</h3><p>Gerenciar eventos e palestras</p></div>
          </button>
        </div>
      </div>
    </div>
  )
}
