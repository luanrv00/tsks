import React from 'react'
import {render, screen} from '@testing-library/react'
import UserTsk from '.'

describe('UserTsk', () => {
  it('renders an input to enter tsk', () => {
    render(<UserTsk />)
    expect(screen.getByPlaceholderText('enter tsk')).toBeTruthy()
  })

  it('renders a button to send tsk', () => {
    render(<UserTsk />)
    expect(screen.getByRole('button')).toBeTruthy()
  })
})
