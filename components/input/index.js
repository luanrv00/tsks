import React from 'react'
import styles from './index.module.css'

export function Input({value, placeholder, type, onChange, hasEmptyError, hasInvalidEmailError}) {
  return (
    <>
    <input
      className={styles.input}
      value={value}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
    />
    {hasEmptyError && (<span>required</span>)}
    {hasInvalidEmailError && (<span>invalid email</span>)}
    </>
  )
}
