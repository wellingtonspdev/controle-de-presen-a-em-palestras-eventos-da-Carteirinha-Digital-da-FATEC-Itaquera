import { useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import { Header } from '../../components/Header'
import { Badge } from '../../components/Badge'
import { QrCode, CalendarDays, MapPin, Clock } from 'lucide-react'
import styles from './AlunoEventos.module.css'

export function AlunoEventos() {
  const navigate = useNavigate()
  const { state, getStudentAttendance } = useApp()

  const formatDate = (d: string) => { const [y, m, day] = d.split('-'); return `${day}/${m}/${y}` }

  const getStatus = (event: any, att: any) => {
    if (!att) {
      if (event.checkInStatus === 'open') return { variant: 'info' as const, text: 'Check-in disponível' }
      return { variant: 'gray' as const, text: 'Evento disponível' }
    }
    if (att.status === 'confirmed') return { variant: 'success' as const, text: 'Presença confirmada' }
    if (att.status === 'checked-in') {
      if (event.checkOutStatus === 'open') return { variant: 'info' as const, text: 'Check-out disponível' }
      return { variant: 'warning' as const, text: 'Entrada registrada' }
    }
    return { variant: 'gray' as const, text: 'Evento disponível' }
  }

  return (
    <div className={styles.page}>
      <Header title="Eventos" backTo="/aluno" />
      <div className={styles.content}>
        <button className={styles.scanBtn} onClick={() => navigate('/aluno/eventos/scanner')}>
          <QrCode size={22} /> Escanear presença
        </button>
        <h3 className={styles.sectionTitle}>Próximos eventos</h3>
        {state.events.map(event => {
          const att = getStudentAttendance(event.id)
          const badge = getStatus(event, att)
          return (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.eventHeader}>
                <h4 className={styles.eventTitle}>{event.title}</h4>
                <Badge variant={badge.variant}>{badge.text}</Badge>
              </div>
              <div className={styles.eventMeta}>
                <span><CalendarDays size={14} /> {formatDate(event.date)}</span>
                <span><Clock size={14} /> {event.startTime} às {event.endTime}</span>
                <span><MapPin size={14} /> {event.location}</span>
              </div>
              {att && att.checkInTime && (
                <div className={styles.attendanceInfo}>
                  <p>Entrada: {att.checkInTime}</p>
                  {att.checkOutTime && <p>Saída: {att.checkOutTime}</p>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
