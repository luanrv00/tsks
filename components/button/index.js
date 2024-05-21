import React from 'react'
import styles from './index.module.css'

export function Button({value, onClick}) {
  return (
    <button 
      className={`${styles.baseButton} ${styles.button}`} 
      onClick={onClick}>
      {value}
    </button>
  )
}

export function SmallButton({value, onClick}) {
  return (
    <button 
      className={`${styles.baseButton} ${styles.smallButton}`} 
      onClick={onClick}>
      {value}
    </button>
  )
}
