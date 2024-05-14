import React from 'react'
import {render, screen} from '@testing-library/react'
import TskForm from '.'

describe('TskForm', () => {
  it('renders an input to enter tsk', () => {
    render(<TskForm />)
    expect(screen.getByPlaceholderText('enter tsk')).toBeTruthy()
  })

  it('renders a button to send tsk', () => {
    render(<TskForm />)
    expect(screen.getByRole('button')).toBeTruthy()
  })
})
