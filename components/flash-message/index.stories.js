import {FlashMessage} from '.'

export default {
  component: FlashMessage,
  tags: ['autodocs'],
  title: 'FlashMessage',
}

export const Error = {
  args: {
    type: 'error',
    message: 'error flash message',
  },
}

export const Success = {
  args: {
    type: 'success',
    message: 'success flash message',
  },
}
