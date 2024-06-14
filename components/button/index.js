import React from 'react'
import {RotatingLines, TailSpin, ThreeDots} from 'react-loader-spinner'
import styles from './index.module.css'

function ButtonBase({value, onClick, style}) {
  const specificStyle = style === 'small' ? styles.smallButton : styles.button
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
  const LoadingIcon = (
    <ThreeDots
      height='25'
      width='25'
      color='#666'
      wrapperClass='loadingButton'
    />
  )
  return <ButtonBase onClick={onClick} value={LoadingIcon} />
}
