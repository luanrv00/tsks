import {TskStatus} from '.'

export default {
  component: TskStatus,
  title: 'TskStatus',
  tags: ['autodocs'],
}

export const ToDo = {
  args: {
    status: '-',
  },
}

export const Doing = {
  args: {
    status: '+',
  },
}

export const Done = {
  args: {
    status: '*',
  },
}
