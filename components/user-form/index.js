import React, {useState} from 'react'
import {MediumInput, Button, LoadingButton} from '..'
import styles from './index.module.css'

export function UserForm({handleSubmit, isLoading}) {
  const [formValues, setFormValues] = useState({email: '', password: ''})
  const [hasEmailError, setHasEmailError] = useState(false)
  const [hasPasswordError, setHasPasswordError] = useState(false)
  const [hasInvalidEmailError, setHasInvalidEmailError] = useState(false)

  const onSubmit = e => {
    e.preventDefault()

    if (!formValues.email) {
      return setHasEmailError(true)
    }

    if (!formValues.password) {
      return setHasPasswordError(true)
    }

    const isValidEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
      formValues.email
    )

    if (!isValidEmail) {
      return setHasInvalidEmailError(true)
    }

    handleSubmit(formValues)
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <MediumInput
        onChange={e => setFormValues(v => ({...v, email: e.target.value}))}
        value={formValues.email}
        placeholder='user@tsks.app'
        hasEmptyError={hasEmailError}
        hasInvalidEmailError={hasInvalidEmailError}
      />
      <MediumInput
        onChange={e => setFormValues(v => ({...v, password: e.target.value}))}
        value={formValues.password}
        type='password'
        placeholder='******'
        hasEmptyError={hasPasswordError}
      />
      {isLoading ? <LoadingButton /> : <Button value='Send' />}
    </form>
  )
}
