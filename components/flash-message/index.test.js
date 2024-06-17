import React from 'react'
import {render, screen} from '@testing-library/react'
import {FlashMessage} from '.'

describe('FlashMessage', () => {
  it('renders a message', () => {
    render(<FlashMessage message='test msg' />)
    expect(screen.getByText('test msg')).toBeTruthy()
  })

  it('renders an element with the message type as className value', () => {
    render(<FlashMessage type='error' message='test msg' />)
    expect(
      screen.getByText('test msg').classList.contains('error')
    ).toBeTruthy()
  })
})
