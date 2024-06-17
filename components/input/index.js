import React from 'react'
import styles from './index.module.css'

function InputBase({
  value,
  placeholder,
  type,
  onChange,
  hasEmptyError,
  hasInvalidEmailError,
  style,
}) {
  const specificStyle =
    style === 'small'
      ? styles.smallInput
      : style === 'medium'
      ? styles.mediumInput
      : null

  const inputStyles = `${styles.input} ${specificStyle}`

  return (
    <>
      <input
        className={inputStyles}
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
      />
      {hasEmptyError && <span>required</span>}
      {hasInvalidEmailError && <span>invalid email</span>}
    </>
  )
}

export function Input({
  value,
  placeholder,
  type,
  onChange,
  hasEmptyError,
  hasInvalidEmailError,
}) {
  return (
    <InputBase
      value={value}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      hasEmptyError={hasEmptyError}
      hasInvalidEmailError={hasInvalidEmailError}
    />
  )
}

export function MediumInput({
  value,
  placeholder,
  type,
  onChange,
  hasEmptyError,
  hasInvalidEmailError,
}) {
  return (
    <InputBase
      value={value}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      hasEmptyError={hasEmptyError}
      hasInvalidEmailError={hasInvalidEmailError}
      style='medium'
    />
  )
}

export function SmallInput({
  value,
  placeholder,
  type,
  onChange,
  hasEmptyError,
  hasInvalidEmailError,
}) {
  return (
    <InputBase
      value={value}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      hasEmptyError={hasEmptyError}
      hasInvalidEmailError={hasInvalidEmailError}
      style='small'
    />
  )
}
