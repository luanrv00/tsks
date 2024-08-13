import styles from './index.module.css'

export function Header({currentUser}) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>tsks</h1>
      {currentUser && (
        <span className={styles.signed}>signed as {currentUser.email}</span>
      )}
    </header>
  )
}
