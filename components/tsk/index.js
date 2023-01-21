import React from 'react'
import styles from './index.module.css'
import {TskStatus} from '../'

export default function Tsk({tsk, context, status}) {
  return (
    <li className={styles.wrapper}>
      <div className={styles.status}>
        <TskStatus status={status} />
        <p className={styles.tsk}>{tsk}</p>
      </div>
      <span className={styles.context}>@{context}</span>
    </li>
  )
}
