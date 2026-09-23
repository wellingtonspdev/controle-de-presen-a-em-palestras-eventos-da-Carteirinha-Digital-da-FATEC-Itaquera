import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import styles from './Header.module.css'

interface HeaderProps {
  title: string
  backTo?: string
  rightContent?: ReactNode
  variant?: 'primary' | 'white'
}

export function Header({ title, backTo, rightContent, variant = 'primary' }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className={`${styles.header} ${variant === 'white' ? styles.white : ''}`}>
      <div className={styles.inner}>
        {backTo && (
          <button className={styles.back} onClick={() => navigate(backTo)}>
            <ArrowLeft size={22} />
          </button>
        )}
        <h1 className={styles.title}>{title}</h1>
        {rightContent && <div className={styles.right}>{rightContent}</div>}
      </div>
    </header>
  )
}
