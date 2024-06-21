import React, {useState} from 'react'
import {Input, SmallInput, Button, Subtitle, LoadingButton} from '..'
import styles from './index.module.css'

export function TskForm({handleSubmit, isLoading}) {
  const [formValues, setFormValues] = useState({tsk: '', context: ''})
  const [emptyTskError, setEmptyTskError] = useState(false)

  const onSubmit = e => {
    e.preventDefault()

    if (!formValues.tsk) {
      return setEmptyTskError(true)
    }

    setFormValues({tsk: '', context: ''})
    handleSubmit(formValues)
  }

  return (
    <>
      <Subtitle value='add a new tsk' />
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.inputs}>
          <Input
            onChange={e => setFormValues(v => ({...v, tsk: e.target.value}))}
            value={formValues.tsk}
            placeholder='enter tsk'
          />
          <SmallInput
            onChange={e =>
              setFormValues(v => ({...v, context: e.target.value}))
            }
            value={formValues.context}
            placeholder='context'
          />
        </div>
        {emptyTskError && <span>cannot without tsk</span>}
        {isLoading ? <LoadingButton /> : <Button value='Add' />}
      </form>
    </>
  )
}
