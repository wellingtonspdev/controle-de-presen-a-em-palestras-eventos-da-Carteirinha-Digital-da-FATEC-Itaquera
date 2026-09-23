import { useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import { Header } from '../../components/Header'
import { Award, ChevronRight } from 'lucide-react'
import styles from './AlunoCertificados.module.css'

export function AlunoCertificados() {
  const navigate = useNavigate()
  const { getCertificates } = useApp()
  const certs = getCertificates()
  const formatDate = (d: string) => { const [y, m, day] = d.split('-'); return `${day}/${m}/${y}` }

  return (
    <div className={styles.page}>
      <Header title="Meus Certificados" backTo="/aluno" />
      <div className={styles.content}>
        {certs.length === 0 ? (
          <div className={styles.empty}>
            <Award size={56} color="var(--gray-300)" />
            <h3>Nenhum certificado disponível</h3>
            <p>Participe de eventos e registre sua presença para receber certificados.</p>
          </div>
        ) : (
          certs.map(cert => (
            <button key={cert.id} className={styles.certCard} onClick={() => navigate(`/aluno/certificados/${cert.id}`)}>
              <div className={styles.certIcon}><Award size={28} color="var(--success)" /></div>
              <div className={styles.certInfo}>
                <p className={styles.certLabel}>Certificado de Participação</p>
                <h4 className={styles.certTitle}>{cert.eventTitle}</h4>
                <p className={styles.certMeta}>{formatDate(cert.eventDate)} • {cert.workload}</p>
              </div>
              <ChevronRight size={20} color="var(--gray-400)" />
            </button>
          ))
        )}
      </div>
    </div>
  )
}
