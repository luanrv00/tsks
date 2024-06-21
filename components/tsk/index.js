import React, {useState} from 'react'
import styles from './index.module.css'
import {TskStatus, SmallButton, SmallLoadingButton} from '..'

export function Tsk({
  id,
  tsk,
  context,
  status,
  handleDoing,
  handleDone,
  handleDelete,
}) {
  const [isLoading, setIsLoading] = useState(null)
  const tskStatusStyle = status === 'done' ? styles.tskDone : null
  const tskWrapperStyle = `${styles.tskWrapper} ${tskStatusStyle}`

  function onClick(e) {
    if (e.target.textContent === 'delete') {
      setIsLoading(true)
      handleDelete(id)
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
        <div className={tskWrapperStyle}>
          <TskStatus status={status} />
          <p className={styles.tsk} data-testid='tsk'>
            {tsk}
          </p>
        </div>
      </div>
      {isLoading ? (
        <SmallLoadingButton value='delete' />
      ) : (
        <SmallButton onClick={onClick} value='delete' />
      )}
    </li>
  )
}
