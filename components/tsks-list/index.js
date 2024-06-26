import React from 'react'
import {Tsk, LoadingIcon} from '..'
import styles from './index.module.css'

export function TsksList({
  tsks,
  handleDoing,
  handleDone,
  handleDelete,
  fallbackMsg,
  isLoading,
  isTskLoading,
}) {
  if (isLoading) {
    return <LoadingIcon />
  }

  if (!tsks?.length) {
    return <p>{fallbackMsg}</p>
  }

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
          isLoading={isTskLoading}
        />
      ))}
    </ul>
  )
}
