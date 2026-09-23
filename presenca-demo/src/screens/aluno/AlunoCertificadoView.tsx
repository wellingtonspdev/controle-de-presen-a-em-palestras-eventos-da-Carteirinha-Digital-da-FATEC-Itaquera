import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import { Header } from '../../components/Header'
import { QRCodeSVG } from 'qrcode.react'
import { Download } from 'lucide-react'
import styles from './AlunoCertificadoView.module.css'

export function AlunoCertificadoView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getCertificates, showToast } = useApp()
  const cert = getCertificates().find(c => c.id === id)
  const formatDate = (d: string) => { const [y, m, day] = d.split('-'); return `${day}/${m}/${y}` }

  if (!cert) return (<div className={styles.page}><Header title="Certificado" backTo="/aluno/certificados" /><div className={styles.notFound}><p>Certificado não encontrado.</p></div></div>)

  return (
    <div className={styles.page}>
      <Header title="Certificado" backTo="/aluno/certificados" />
      <div className={styles.content}>
        <div className={styles.certificate}>
          <div className={styles.certBorder}>
            <div className={styles.certHeader}>
              <p className={styles.institution}>FACULDADE DE TECNOLOGIA DE ITAQUERA</p>
              <p className={styles.cps}>Centro Paula Souza</p>
            </div>
            <h2 className={styles.certTitle}>CERTIFICADO</h2>
            <div className={styles.certBody}>
              <p className={styles.certText}>
                Certificamos que <strong>{cert.studentName}</strong> participou da palestra{' '}
                <strong>"{cert.eventTitle}"</strong>, realizada pela Faculdade de Tecnologia de Itaquera,
                em {formatDate(cert.eventDate)}, com carga horária total de <strong>{cert.workload}</strong>.
              </p>
            </div>
            <div className={styles.certFooter}>
              <div className={styles.certQr}>
                <QRCodeSVG value={`${window.location.origin}/certificado/verificar/${cert.code}`} size={80} level="M" />
                <p className={styles.certCode}>Código: {cert.code}</p>
              </div>
              <div className={styles.certSignature}>
                <div className={styles.signatureLine} />
                <p>Coordenação de Eventos</p>
                <p>FATEC Itaquera</p>
              </div>
            </div>
          </div>
        </div>
        <button className={styles.downloadBtn} onClick={() => showToast('Certificado preparado para download.', 'success')}>
          <Download size={20} /> Baixar certificado
        </button>
        <button className={styles.verifyLink} onClick={() => navigate(`/certificado/verificar/${cert.code}`)}>
          Verificar autenticidade
        </button>
      </div>
    </div>
  )
}
