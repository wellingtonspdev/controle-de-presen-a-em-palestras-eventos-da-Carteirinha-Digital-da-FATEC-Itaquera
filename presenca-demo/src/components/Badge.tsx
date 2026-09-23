import styles from './Badge.module.css'

interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'gray'
  children: React.ReactNode
  size?: 'sm' | 'md'
}

export function Badge({ variant, children, size = 'md' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${size === 'sm' ? styles.sm : ''}`}>
      {children}
    </span>
  )
}
