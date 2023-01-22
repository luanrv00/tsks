import React from 'react'
import Header from '../header'
import styles from './index.module.css'

export default function Layout({children}) {
  return (
    <div className={styles.wrapper}>
      <Header />
      {children}
    </div>
  )
}
