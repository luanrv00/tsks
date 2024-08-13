import {TskForm} from '.'

export default {
  component: TskForm,
  title: 'TskForm',
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
