import React from 'react'
import Tsk from '../tsk'
import styles from './index.module.css'

export default function TsksList({tsks, handleDoing, handleDone, handleDelete}) {
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
