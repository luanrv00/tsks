import React from 'react'
import styles from './index.module.css'

export default function Input({value, placeholder, type, onChange}) {
  return (
    <input
      className={styles.input}
      value={value}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
    />
  )
}
