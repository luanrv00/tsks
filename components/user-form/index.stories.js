import {UserForm} from '.'

export default {
  component: UserForm,
  title: 'UserForm',
  tags: ['autodocs'],
}

export const Primary = {
  args: {
    handleSubmit: () => {},
    isLoading: false,
  },
}

export const Loading = {
  args: {
    ...Primary.args,
    isLoading: true,
  },
}
