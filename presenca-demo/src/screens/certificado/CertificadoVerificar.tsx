import { useParams } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import { ShieldCheck, ShieldX } from 'lucide-react'
import styles from './CertificadoVerificar.module.css'

export function CertificadoVerificar() {
  const { codigo } = useParams<{ codigo: string }>()
  const { getCertificates } = useApp()
  const cert = getCertificates().find(c => c.code === codigo)
  const formatDate = (d: string) => { const [y, m, day] = d.split('-'); return `${day}/${m}/${y}` }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {cert ? (
          <>
            <ShieldCheck size={56} color="var(--success)" className={styles.icon} />
            <h1 className={styles.title}>CERTIFICADO VÁLIDO</h1>
            <div className={styles.info}>
              <div className={styles.field}><label>Participante</label><p>{cert.studentName}</p></div>
              <div className={styles.field}><label>Palestra</label><p>{cert.eventTitle}</p></div>
              <div className={styles.field}><label>Data</label><p>{formatDate(cert.eventDate)}</p></div>
              <div className={styles.field}><label>Carga horária</label><p>{cert.workload}</p></div>
              <div className={styles.field}><label>Código</label><p className={styles.code}>{cert.code}</p></div>
              <div className={styles.field}><label>Emitido por</label><p>FATEC Itaquera - Centro Paula Souza</p></div>
            </div>
          </>
        ) : (
          <>
            <ShieldX size={56} color="var(--danger)" className={styles.icon} />
            <h1 className={`${styles.title} ${styles.invalid}`}>CERTIFICADO NÃO ENCONTRADO</h1>
            <p className={styles.notFoundText}>O código informado não corresponde a nenhum certificado válido.</p>
          </>
        )}
        <div className={styles.branding}><p>Carteirinha Digital - FATEC Itaquera</p></div>
      </div>
    </div>
  )
}
