import React from 'react'
import styles from './index.module.css'

export default function Input({value, placeholder, type, onChange, hasEmptyError, hasInvalidEmailError}) {
  return (
    <>
    <input
      className={styles.input}
      value={value}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
    />
    {hasEmptyError && (<span>Required</span>)}
    {hasInvalidEmailError && (<span>Invalid email</span>)}
    </>
  )
}
