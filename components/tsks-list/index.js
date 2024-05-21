import React from 'react'
import {Tsk} from '..'
import styles from './index.module.css'

export function TsksList({tsks, handleDoing, handleDone, handleDelete}) {
  return (
    <ul className={styles.tsksList}>
      {tsks.map(({id, tsk, context, status}) => (
        <Tsk
          key={id}
          id={id}
          tsk={tsk}
          context={context}
          status={status}
          handleDoing={handleDoing}
          handleDone={handleDone}
          handleDelete={handleDelete}
        />
      ))}
    </ul>
  )
}
