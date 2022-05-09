import React from 'react'
import styles from './index.styles'

export default function Tsk({tsk, context}) {
  return (
    <li className='tsks-item' style={styles}>
      <p className='tsk-content'>{tsk}</p>
      <span className='tsk-context'>{context}</span>
    </li>
  )
}
