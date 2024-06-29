import React, {useState, useEffect} from 'react'
import styles from './index.module.css'
import {getCurrentUserAtBrowser} from '../../utils'

export function Header() {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    setCurrentUser(getCurrentUserAtBrowser())
  }, [])

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>tsks</h1>
      {currentUser && (
        <span className={styles.signed}>signed as {currentUser.email}</span>
      )}
    </header>
  )
}
