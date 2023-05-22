import React, {useState} from 'react'
import {Input, Button} from '../'
import styles from './index.module.css'

export default function UserTsk({handleSubmit}) {
  const [formValues, setFormValues] = useState({tsk: ''})

  const onSubmit = e => {
    e.preventDefault()
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
      <Button value='Add' />
    </form>
  )
}
