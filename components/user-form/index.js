import React, {useState} from 'react'

export default function UserForm({handleSubmit}) {
  const [formValues, setFormValues] = useState({email: '', password: ''})

  const onSubmit = e => {
    e.preventDefault()
    handleSubmit(formValues)
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        onChange={e => setFormValues(v => ({...v, email: e.target.value}))}
        value={formValues.email}
        placeholder='user@tsks.app'
        className='user-email'
      />
      <input
        onChange={e => setFormValues(v => ({...v, password: e.target.value}))}
        value={formValues.password}
        type='password'
        placeholder='******'
        className='user-password'
      />
      <input type='submit' value='Send' />
    </form>
  )
}
