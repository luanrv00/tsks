import React from 'react'
import styles from './index.module.css'

function ButtonBase({value, onClick, style}) {
  const specificStyle = style === 'small' ? styles.smallButton : styles.button
  const btnStyles = `${styles.baseButton} ${specificStyle}`

  return (
    <button 
      className={btnStyles}
      onClick={onClick}>
      {value}
    </button>
  )
}

export function Button({value, onClick}) {
  return (
    <ButtonBase
      onClick={onClick}
      value={value}
    />
  )
}

export function SmallButton({value, onClick}) {
  return (
    <ButtonBase
      onClick={onClick}
      value={value}
      style='small'
    />
  )
}
