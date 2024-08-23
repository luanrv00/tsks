import styles from './index.module.css'

export function FlashMessage({type, message}) {
  const specificStyle = type === 'success' ? styles.success : styles.error
  return <>{message ? <p className={`${styles.flash} ${specificStyle}`}>{message}</p> : null}</>
}
