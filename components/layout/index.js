import React, {useState, useEffect} from 'react'
import styles from './index.module.css'
import {Header} from '..'
import {getCurrentUserAtBrowser} from '../../utils'

export function Layout({children}) {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    setCurrentUser(getCurrentUserAtBrowser())
  }, [])

  return (
    <div className={styles.wrapper}>
      <Header currentUser={currentUser} />
      {children}
    </div>
  )
}
