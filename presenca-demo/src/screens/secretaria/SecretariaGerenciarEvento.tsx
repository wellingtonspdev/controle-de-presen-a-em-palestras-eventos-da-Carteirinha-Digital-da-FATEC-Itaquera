import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import { Header } from '../../components/Header'
import { Badge } from '../../components/Badge'
import { QRCodeSVG } from 'qrcode.react'
import {
  CalendarDays, Clock, MapPin, User, Users, UserCheck,
  LogIn, LogOut, RefreshCw, Trophy, Sparkles, XCircle, Loader2
} from 'lucide-react'
import styles from './SecretariaGerenciarEvento.module.css'

export function SecretariaGerenciarEvento() {
  const { id } = useParams<{ id: string }>()
  const {
    state, openCheckIn, closeCheckIn, openCheckOut, closeCheckOut,
    refreshQrToken, getEventAttendance, simulateNextStudent, showToast
  } = useApp()

  const event = state.events.find(e => e.id === id)
  const [raffleResult, setRaffleResult] = useState<{ name: string; ra: string } | null>(null)
  const [raffleAnimating, setRaffleAnimating] = useState(false)
  const [qrCountdown, setQrCountdown] = useState(15)

  useEffect(() => {
    if (!event || !id) return
    if (event.checkInStatus !== 'open' && event.checkOutStatus !== 'open') return
    const interval = setInterval(() => {
      setQrCountdown(prev => {
        if (prev <= 1) { refreshQrToken(id); return 15 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [event?.checkInStatus, event?.checkOutStatus, id])

  useEffect(() => { setQrCountdown(15) }, [event?.checkInStatus, event?.checkOutStatus])

  if (!event) return (<div className={styles.page}><Header title="Evento" backTo="/secretaria/eventos" /><div className={styles.notFound}>Evento não encontrado.</div></div>)

  const attendance = getEventAttendance(event.id)
  const checkedIn = attendance.filter(a => a.checkInTime).length
  const checkedOut = attendance.filter(a => a.checkOutTime).length
  const confirmed = attendance.filter(a => a.status === 'confirmed').length
  const eligible = attendance.filter(a => a.status === 'confirmed')
  const formatDate = (d: string) => { const [y, m, day] = d.split('-'); return `${day}/${m}/${y}` }

  const handleRaffle = () => {
    if (eligible.length === 0) { showToast('Nenhum participante elegível para o sorteio.', 'error'); return }
    setRaffleAnimating(true); setRaffleResult(null)
    setTimeout(() => {
      const winner = eligible[Math.floor(Math.random() * eligible.length)]
      setRaffleResult({ name: winner.studentName, ra: winner.studentRa })
      setRaffleAnimating(false)
    }, 2000)
  }

  const isQrActive = event.checkInStatus === 'open' || event.checkOutStatus === 'open'
  const qrLabel = event.checkInStatus === 'open' ? 'Escaneie este QR Code para registrar sua entrada' : 'Escaneie este QR Code para registrar sua saída'

  return (
    <div className={styles.page}>
      <Header title="Gerenciar Evento" backTo="/secretaria/eventos" />
      <div className={styles.content}>
        <div className={styles.infoCard}>
          <h2 className={styles.eventTitle}>{event.title}</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}><User size={16} /><span>{event.speaker}</span></div>
            <div className={styles.infoItem}><CalendarDays size={16} /><span>{formatDate(event.date)}</span></div>
            <div className={styles.infoItem}><MapPin size={16} /><span>{event.location}</span></div>
            <div className={styles.infoItem}><Clock size={16} /><span>{event.startTime} às {event.endTime} ({event.workload})</span></div>
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.stat}><LogIn size={20} color="var(--info)" /><div><span className={styles.statValue}>{checkedIn}</span><span className={styles.statLabel}>Entradas</span></div></div>
          <div className={styles.stat}><LogOut size={20} color="var(--warning)" /><div><span className={styles.statValue}>{checkedOut}</span><span className={styles.statLabel}>Saídas</span></div></div>
          <div className={styles.stat}><UserCheck size={20} color="var(--success)" /><div><span className={styles.statValue}>{confirmed}</span><span className={styles.statLabel}>Confirmadas</span></div></div>
        </div>

        <div className={styles.controlCard}>
          <h3 className={styles.sectionTitle}>Controle de Presença</h3>
          <div className={styles.checkpoints}>
            <div className={styles.checkpoint}>
              <span className={styles.checkpointLabel}>CHECK-IN</span>
              <Badge variant={event.checkInStatus === 'open' ? 'success' : event.checkInStatus === 'finished' ? 'gray' : 'info'}>
                {event.checkInStatus === 'open' ? 'Aberto' : event.checkInStatus === 'finished' ? 'Encerrado' : 'Fechado'}
              </Badge>
            </div>
            <div className={styles.checkpoint}>
              <span className={styles.checkpointLabel}>CHECK-OUT</span>
              <Badge variant={event.checkOutStatus === 'open' ? 'success' : event.checkOutStatus === 'finished' ? 'gray' : 'info'}>
                {event.checkOutStatus === 'open' ? 'Aberto' : event.checkOutStatus === 'finished' ? 'Encerrado' : 'Fechado'}
              </Badge>
            </div>
          </div>
          <div className={styles.controlActions}>
            {event.checkInStatus === 'closed' && event.checkOutStatus === 'closed' && (
              <button className={styles.btnSuccess} onClick={() => openCheckIn(event.id)}><LogIn size={18} /> Abrir Check-in</button>
            )}
            {event.checkInStatus === 'open' && (
              <button className={styles.btnDanger} onClick={() => closeCheckIn(event.id)}><XCircle size={18} /> Encerrar Check-in</button>
            )}
            {event.checkInStatus === 'finished' && event.checkOutStatus === 'closed' && (
              <button className={styles.btnSuccess} onClick={() => openCheckOut(event.id)}><LogOut size={18} /> Abrir Check-out</button>
            )}
            {event.checkOutStatus === 'open' && (
              <button className={styles.btnDanger} onClick={() => closeCheckOut(event.id)}><XCircle size={18} /> Encerrar Check-out</button>
            )}
          </div>
        </div>

        {isQrActive && (
          <div className={styles.qrCard}>
            <div className={styles.qrContainer}>
              <QRCodeSVG value={event.currentQrToken || 'demo'} size={240} level="M" bgColor="white" fgColor="#1a1a1a" />
            </div>
            <p className={styles.qrLabel}>{qrLabel}</p>
            <div className={styles.qrMeta}>
              <div className={styles.countdown}><RefreshCw size={14} className={qrCountdown <= 3 ? styles.spinning : ''} /> Próxima atualização em {qrCountdown}s</div>
              <p className={styles.qrNote}>QR atualizado automaticamente</p>
            </div>
          </div>
        )}

        <div className={styles.participantsCard}>
          <div className={styles.participantsHeader}>
            <h3 className={styles.sectionTitle}><Users size={18} /> Participantes ({attendance.length})</h3>
            <button className={styles.simulateBtn} onClick={() => { simulateNextStudent(event.id); showToast('Aluno simulado adicionado!', 'info') }}>
              <Sparkles size={14} /> Simular próximo aluno
            </button>
          </div>
          {attendance.length === 0 ? (
            <p className={styles.emptyList}>Nenhum participante registrado</p>
          ) : (
            <div className={styles.participantsList}>
              {attendance.map(a => (
                <div key={a.id} className={styles.participant}>
                  <div className={styles.participantInfo}>
                    <h4>{a.studentName}</h4>
                    <p>RA: {a.studentRa}</p>
                    <div className={styles.participantTimes}>
                      {a.checkInTime && <span>Entrada: {a.checkInTime}</span>}
                      {a.checkOutTime && <span>Saída: {a.checkOutTime}</span>}
                      {!a.checkInTime && <span>Sem registro</span>}
                    </div>
                  </div>
                  <Badge variant={a.status === 'confirmed' ? 'success' : a.status === 'checked-in' ? 'warning' : 'gray'} size="sm">
                    {a.status === 'confirmed' ? 'Presença confirmada' : a.status === 'checked-in' ? 'Aguardando saída' : 'Não registrado'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.raffleCard}>
          <h3 className={styles.sectionTitle}><Trophy size={18} /> Sorteio</h3>
          <p className={styles.raffleEligible}>{eligible.length} participante{eligible.length !== 1 ? 's' : ''} elegíve{eligible.length !== 1 ? 'is' : 'l'}</p>
          <button className={styles.raffleBtn} onClick={handleRaffle} disabled={raffleAnimating || eligible.length === 0}>
            {raffleAnimating ? (<><Loader2 size={18} className={styles.spinning} /> Sorteando...</>) : (<><Trophy size={18} /> Realizar sorteio</>)}
          </button>
          {raffleResult && (
            <div className={styles.raffleResult}>
              <Sparkles size={24} color="var(--warning)" />
              <h4>Vencedor:</h4>
              <p className={styles.winnerName}>{raffleResult.name}</p>
              <p className={styles.winnerRa}>RA: {raffleResult.ra}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
