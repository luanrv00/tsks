import React, {useState} from 'react'
import {Input, Button} from '../'
import styles from './index.module.css'

export default function TskForm({handleSubmit}) {
  const [formValues, setFormValues] = useState({tsk: ''})
  const [emptyTskError, setEmptyTskError] = useState(false)

  const onSubmit = e => {
    e.preventDefault()

    if (!formValues.tsk) {
      return setEmptyTskError(true)
    }

    setFormValues({tsk: ''})
    handleSubmit(formValues)
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.inputs}>
        <Input
          onChange={e => setFormValues(v => ({ ...v, tsk: e.target.value }))}
          value={formValues.tsk}
          placeholder='enter tsk'
        />
        <Input
          onChange={e => setFormValues(v => ({ ...v, context: e.target.value }))}
          value={formValues.context}
          placeholder='context'
        />
      </div>
      {emptyTskError && (<span>cannot without tsk</span>)}
      <Button value='Add' />
    </form>
  )
}
