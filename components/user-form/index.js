import React, {useState} from 'react'
import styles from './index.styles'
import {Input, Button} from '../'

export default function UserForm({handleSubmit}) {
  const [formValues, setFormValues] = useState({email: '', password: ''})

  const onSubmit = e => {
    e.preventDefault()
    handleSubmit(formValues)
  }

  return (
    <form onSubmit={onSubmit} style={styles.form}>
      <Input
        onChange={e => setFormValues(v => ({...v, email: e.target.value}))}
        value={formValues.email}
        placeholder='user@tsks.app'
        style={styles.input}
      />
      <Input
        onChange={e => setFormValues(v => ({...v, password: e.target.value}))}
        value={formValues.password}
        type='password'
        placeholder='******'
        style={styles.input}
      />
      <Button value='Send' />
    </form>
  )
}
