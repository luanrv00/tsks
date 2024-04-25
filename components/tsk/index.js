import React from 'react'
import styles from './index.module.css'
import {TskStatus} from '../'

// NOTE: for handling tsk status:
// one tap to doing. one tap do done.
export default function Tsk({id, tsk, context, status, handleDoing, handleDone}) {
  function onClick() {
    if (status === 'todo') {
      return handleDoing(id)
    }

    if (status === 'doing') {
      return handleDone(id)
    }
  }

  return (
    <li className={styles.wrapper} onClick={onClick}>
      <div className={styles.status}>
        <TskStatus status={status} />
        <p className={styles.tsk} data-testid='tsk'>
          {tsk}
        </p>
      </div>
      <span className={styles.context}>@{context}</span>
    </li>
  )
}
