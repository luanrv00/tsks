import React from 'react'
import Tsk from '../tsk'
import styles from './index.styles'

export default function TsksList({tsksData}) {
  return (
    <ul className='tsks-list' style={styles.tsks.list}>
      {tsksData.map(({id, tsk, context}) => (
        <Tsk key={id} tsk={tsk} context={context} />
      ))}
    </ul>
  )
}
