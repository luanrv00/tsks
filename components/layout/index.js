import React from 'react'
import {Header} from '..'
import styles from './index.module.css'

export function Layout({children}) {
  return (
    <div className={styles.wrapper}>
      <Header />
      {children}
    </div>
  )
}
