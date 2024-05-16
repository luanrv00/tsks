import React from 'react'
import styles from './index.module.css'
import {TskStatus, Button} from '../'

export default function Tsk({id, tsk, context, status, handleDoing, handleDone, handleDelete}) {
  function onClick(e) {
    if (e.target.textContent === 'delete') {
      return handleDelete(id)
    }

    if (status === 'todo') {
      return handleDoing(id)
    }

    if (status === 'doing') {
      return handleDone(id)
    }
  }

  return (
    <li className={styles.wrapper} onClick={onClick}>
      <div>
        <span className={styles.context}>@{context}</span>
        <div className={styles.tskWrapper}>
          <TskStatus status={status} />
          <p className={styles.tsk} data-testid='tsk'>
            {tsk}
          </p>
        </div>
      </div>
      <Button onClick={onClick} value='delete'/>
    </li>
  )
}
