import { useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import { GraduationCap, Building2, RotateCcw } from 'lucide-react'
import styles from './DemoSelector.module.css'

export function DemoSelector() {
  const navigate = useNavigate()
  const { setUserMode, resetDemo } = useApp()

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>CD</div>
          <h1 className={styles.title}>Carteirinha Digital</h1>
          <p className={styles.subtitle}>FATEC Itaquera</p>
        </div>
        <div className={styles.demoBadge}>MODO DEMONSTRAÇÃO</div>
        <p className={styles.description}>
          Selecione o modo de acesso para demonstrar o sistema de controle de presença em eventos.
        </p>
        <div className={styles.buttons}>
          <button className={styles.btnAluno} onClick={() => { setUserMode('aluno'); navigate('/aluno') }}>
            <GraduationCap size={24} />
            <span>Entrar como Aluno</span>
          </button>
          <button className={styles.btnSecretaria} onClick={() => { setUserMode('secretaria'); navigate('/secretaria') }}>
            <Building2 size={24} />
            <span>Entrar como Secretaria</span>
          </button>
        </div>
        <button className={styles.reset} onClick={resetDemo}>
          <RotateCcw size={16} />
          Resetar demonstração
        </button>
      </div>
    </div>
  )
}
