import {FlashMessage} from '.'

export default {
  component: FlashMessage,
  tags: ['autodocs'],
  title: 'FlashMessage',
}

export const Error = {
  args: {
    type: 'error',
    message: 'flash message',
  },
}

export const Success = {
  args: {
    ...Error.args,
    type: 'success',
  },
}
