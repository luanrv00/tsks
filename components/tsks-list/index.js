import React from 'react'
import Tsk from '../tsk'
import styles from './index.styles'

export default function TsksList({tsks}) {
  return (
    <ul className='tsks-list' style={styles.tsks.list}>
      {tsks.map(({id, tsk, context, status}) => (
        <Tsk key={id} tsk={tsk} context={context} status={status} />
      ))}
    </ul>
  )
}
