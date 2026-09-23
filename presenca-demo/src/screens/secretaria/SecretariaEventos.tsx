import { useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import { Header } from '../../components/Header'
import { Badge } from '../../components/Badge'
import { Plus, CalendarDays, MapPin, Clock, Users, Settings } from 'lucide-react'
import styles from './SecretariaEventos.module.css'

export function SecretariaEventos() {
  const navigate = useNavigate()
  const { state, getEventAttendance } = useApp()
  const formatDate = (d: string) => { const [y, m, day] = d.split('-'); return `${day}/${m}/${y}` }

  return (
    <div className={styles.page}>
      <Header title="Eventos" backTo="/secretaria" rightContent={
        <button className={styles.addBtn} onClick={() => navigate('/secretaria/eventos/novo')}><Plus size={18} /> Novo evento</button>
      } />
      <div className={styles.content}>
        {state.events.map(event => {
          const attendance = getEventAttendance(event.id)
          const checkedIn = attendance.filter(a => a.checkInTime).length
          let statusVariant: 'info' | 'success' | 'warning' | 'gray' = 'info'
          let statusText = event.status
          if (event.checkInStatus === 'open') { statusVariant = 'success'; statusText = 'Check-in aberto' }
          else if (event.checkOutStatus === 'open') { statusVariant = 'warning'; statusText = 'Check-out aberto' }
          else if (event.checkOutStatus === 'finished') { statusVariant = 'gray'; statusText = 'Encerrado' }
          else if (event.checkInStatus === 'finished') { statusVariant = 'warning'; statusText = 'Check-in encerrado' }

          return (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.eventHeader}>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <Badge variant={statusVariant}>{statusText}</Badge>
              </div>
              <div className={styles.eventMeta}>
                <span><CalendarDays size={14} /> {formatDate(event.date)}</span>
                <span><Clock size={14} /> {event.startTime} às {event.endTime}</span>
                <span><MapPin size={14} /> {event.location}</span>
                <span><Users size={14} /> {checkedIn} participantes</span>
              </div>
              <button className={styles.manageBtn} onClick={() => navigate(`/secretaria/eventos/${event.id}`)}>
                <Settings size={16} /> Gerenciar evento
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
