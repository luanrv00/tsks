import {Header} from '.'

const userMocked = {
  id: 0,
  email: 'user@test.tsks',
  created_at: '',
  updated_at: '',
}

export default {
  component: Header,
  title: 'Header',
  tags: ['autodocs'],
}

export const Guest = {}

export const LoggedIn = {
  args: {
    currentUser: userMocked,
  },
}
