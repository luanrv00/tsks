import React from 'react'
import {render, screen} from '@testing-library/react'
import {UserForm} from '.'

describe('UserForm', () => {
  it('renders an input to enter email', () => {
    render(<UserForm />)
    expect(screen.getByPlaceholderText('user@tsks.app')).toBeTruthy()
  })

  it('renders an input to enter password', () => {
    render(<UserForm />)
    expect(screen.getByPlaceholderText('******')).toBeTruthy()
  })

  it('renders a button to send user data', () => {
    render(<UserForm />)
    expect(screen.getByRole('button')).toBeTruthy()
  })

  it('renders a loading button when isLoading', () => {
    render(<UserForm isLoading={true} />)
    expect(
      screen.getByRole('button').classList.contains('loading')
    ).toBeTruthy()
  })

  // it('renders an error for invalid e-mail format', async () => {
  //   render(<UserForm/>)
  //   fireEvent.click(screen.getByRole('button'))
  //   await waitFor(() => screen.getByText('e-mail can\'t be blank'))
  //   expect(screen.getByText('e-mail can\'t be blank')).toBeTruthy()
  // })
})
