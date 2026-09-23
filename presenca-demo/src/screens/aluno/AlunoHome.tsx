import { useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import { Header } from '../../components/Header'
import { CalendarDays, Award, QrCode, User } from 'lucide-react'
import { currentStudent } from '../../mocks/students'
import styles from './AlunoHome.module.css'

export function AlunoHome() {
  const navigate = useNavigate()
  const { getCertificates } = useApp()
  const certs = getCertificates()

  return (
    <div className={styles.page}>
      <Header title="Carteirinha Digital" rightContent={
        <button className={styles.switchBtn} onClick={() => navigate('/demo')}>Trocar modo</button>
      } />
      <div className={styles.content}>
        <div className={styles.welcome}>
          <div className={styles.avatar}><User size={32} /></div>
          <div>
            <p className={styles.greeting}>Olá,</p>
            <h2 className={styles.name}>{currentStudent.name}</h2>
            <p className={styles.ra}>RA: {currentStudent.ra}</p>
          </div>
        </div>
        <div className={styles.grid}>
          <button className={styles.card} onClick={() => navigate('/aluno/eventos')}>
            <div className={styles.cardIcon} style={{background: 'var(--primary)'}}><CalendarDays size={28} color="white" /></div>
            <span className={styles.cardLabel}>Eventos</span>
            <span className={styles.cardDesc}>Palestras e presença</span>
          </button>
          <button className={styles.card} onClick={() => navigate('/aluno/eventos/scanner')}>
            <div className={styles.cardIcon} style={{background: '#8B5CF6'}}><QrCode size={28} color="white" /></div>
            <span className={styles.cardLabel}>Escanear</span>
            <span className={styles.cardDesc}>Registrar presença</span>
          </button>
          <button className={styles.card} onClick={() => navigate('/aluno/certificados')}>
            <div className={styles.cardIcon} style={{background: 'var(--success)'}}><Award size={28} color="white" /></div>
            <span className={styles.cardLabel}>Certificados</span>
            {certs.length > 0 && <span className={styles.cardBadge}>{certs.length}</span>}
            <span className={styles.cardDesc}>Meus certificados</span>
          </button>
        </div>
      </div>
    </div>
  )
}
