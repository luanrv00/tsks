import React, {useState} from 'react'
import {Input, Button} from '../'
import styles from './index.module.css'

export default function UserForm({handleSubmit}) {
  const [formValues, setFormValues] = useState({email: '', password: ''})

  const onSubmit = e => {
    e.preventDefault()
    handleSubmit(formValues)
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <Input
        onChange={e => setFormValues(v => ({...v, email: e.target.value}))}
        value={formValues.email}
        placeholder='user@tsks.app'
      />
      <Input
        onChange={e => setFormValues(v => ({...v, password: e.target.value}))}
        value={formValues.password}
        type='password'
        placeholder='******'
      />
      <Button value='Send' />
    </form>
  )
}
