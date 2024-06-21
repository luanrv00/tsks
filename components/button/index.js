import React from 'react'
import {ThreeDots} from 'react-loader-spinner'
import styles from './index.module.css'

function ButtonBase({value, onClick, style}) {
  const specificStyle =
    style === 'small'
      ? styles.smallButton
      : style === 'small loading'
      ? `${styles.smallButton} loading`
      : style
  const btnStyles = `${styles.baseButton} ${specificStyle}`

  return (
    <button className={btnStyles} onClick={onClick}>
      {value}
    </button>
  )
}

export function Button({value, onClick}) {
  return <ButtonBase onClick={onClick} value={value} />
}

export function SmallButton({value, onClick}) {
  return <ButtonBase onClick={onClick} value={value} style='small' />
}

export function LoadingButton({onClick}) {
  const LoadingIcon = <ThreeDots height='25' width='25' color='#666' />
  return <ButtonBase onClick={onClick} value={LoadingIcon} style='loading' />
}

export function SmallLoadingButton({onClick}) {
  const LoadingIcon = <ThreeDots height='25' width='25' color='#666' />
  return (
    <ButtonBase onClick={onClick} value={LoadingIcon} style='small loading' />
  )
}
