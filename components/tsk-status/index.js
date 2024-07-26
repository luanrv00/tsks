import React from 'react'
import styles from './index.module.css'

export function TskStatus({status}) {
  const style = status === 'done' ? styles.doneStatus : null
  return <span className={style}>{availableStatus[status]}</span>
}

const availableStatus = {
  todo: '-',
  doing: '+',
  done: '*',
}
