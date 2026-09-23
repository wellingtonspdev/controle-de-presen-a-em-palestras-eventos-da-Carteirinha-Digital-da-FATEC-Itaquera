import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import { CheckCircle, XCircle, ArrowLeft, Scan } from 'lucide-react'
import styles from './AlunoScanner.module.css'

type ScanResult = { success: boolean; title: string; message: string; details?: string; showCerts?: boolean } | null

export function AlunoScanner() {
  const navigate = useNavigate()
  const { state, registerCheckIn, registerCheckOut, getStudentAttendance } = useApp()
  const [result, setResult] = useState<ScanResult>(null)
  const [scanning, setScanning] = useState(false)

  const simulateScan = () => {
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      const checkInEvent = state.events.find(e => e.checkInStatus === 'open')
      const checkOutEvent = state.events.find(e => e.checkOutStatus === 'open')

      if (checkInEvent) {
        const existing = getStudentAttendance(checkInEvent.id)
        if (existing && existing.checkInTime) {
          setResult({ success: false, title: 'Entrada já registrada', message: `Você já registrou entrada neste evento.`, details: `Entrada registrada às ${existing.checkInTime}` })
          return
        }
        registerCheckIn(checkInEvent.id)
        const now = new Date()
        const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`
        setResult({ success: true, title: '✓ Entrada registrada!', message: checkInEvent.title, details: `Entrada registrada às ${time}\nLembre-se de registrar sua saída ao final da palestra.` })
        return
      }

      if (checkOutEvent) {
        const existing = getStudentAttendance(checkOutEvent.id)
        if (!existing || !existing.checkInTime) {
          setResult({ success: false, title: 'Não foi possível registrar a saída', message: 'Nenhuma entrada foi encontrada para este evento.' })
          return
        }
        if (existing.checkOutTime) {
          setResult({ success: false, title: 'Saída já registrada', message: 'Você já registrou saída neste evento.' })
          return
        }
        registerCheckOut(checkOutEvent.id)
        const now = new Date()
        const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`
        setResult({ success: true, title: '✓ Presença confirmada!', message: checkOutEvent.title, details: `Entrada: ${existing.checkInTime}\nSaída: ${time}\n\nSeu certificado está disponível.`, showCerts: true })
        return
      }

      setResult({ success: false, title: 'QR Code inválido', message: 'QR Code inválido ou período de presença encerrado.' })
    }, 1500)
  }

  if (result) {
    return (
      <div className={styles.resultPage}>
        <div className={styles.resultCard}>
          {result.success ? <CheckCircle size={64} color="var(--success)" className={styles.resultIcon} /> : <XCircle size={64} color="var(--danger)" className={styles.resultIcon} />}
          <h2 className={styles.resultTitle}>{result.title}</h2>
          <p className={styles.resultMessage}>{result.message}</p>
          {result.details && <p className={styles.resultDetails}>{result.details}</p>}
          <div className={styles.resultActions}>
            <button className={styles.btnPrimary} onClick={() => navigate('/aluno/eventos')}>Voltar para Eventos</button>
            {result.showCerts && <button className={styles.btnSecondary} onClick={() => navigate('/aluno/certificados')}>Ver certificados</button>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.scanner}>
      <button className={styles.backBtn} onClick={() => navigate('/aluno/eventos')}><ArrowLeft size={22} /></button>
      <div className={styles.viewfinder}>
        <div className={styles.corners}>
          <div className={`${styles.corner} ${styles.tl}`} />
          <div className={`${styles.corner} ${styles.tr}`} />
          <div className={`${styles.corner} ${styles.bl}`} />
          <div className={`${styles.corner} ${styles.br}`} />
        </div>
        {scanning && <div className={styles.scanLine} />}
        <Scan size={48} className={styles.scanIcon} />
      </div>
      <p className={styles.instruction}>Aponte a câmera para o QR Code exibido na palestra</p>
      <button className={styles.simulateBtn} onClick={simulateScan} disabled={scanning}>
        {scanning ? 'Lendo QR Code...' : 'Simular leitura do QR'}
      </button>
      <p className={styles.demoNote}>Botão visível apenas na demonstração</p>
    </div>
  )
}
