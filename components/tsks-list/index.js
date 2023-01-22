import React from 'react'
import Tsk from '../tsk'
import styles from './index.module.css'

export default function TsksList({tsks}) {
  return (
    <ul className={styles.tsksList}>
      {tsks.map(({id, tsk, context, status}) => (
        <Tsk key={id} tsk={tsk} context={context} status={status} />
      ))}
    </ul>
  )
}
