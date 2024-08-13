import {TsksList} from '.'

const mockedTsks = [
  {
    id: 1,
    tsk: 'this is a tsk',
    context: 'Inbox',
    status: 'todo',
    created_at: '000',
    updated_at: '000',
  },
  {
    id: 2,
    tsk: 'this is a tsk',
    context: 'Inbox',
    status: 'todo',
    created_at: '000',
    updated_at: '000',
  },
  {
    id: 3,
    tsk: 'this is a tsk',
    context: 'Today',
    status: 'todo',
    created_at: '000',
    updated_at: '000',
  },
]

export default {
  component: TsksList,
  title: 'TsksList',
  tags: ['autodocs'],
}

export const Primary = {
  args: {
    tsks: mockedTsks,
    handleDoing: () => {},
    handleDone: () => {},
    handleDelete: () => {},
    fallbackMsg: 'fallback message',
    isLoading: false,
    isTskLoading: false,
  },
}

export const Loading = {
  args: {
    ...Primary.args,
    isLoading: true,
  },
}

export const TskLoading = {
  args: {
    ...Primary.args,
    isTskLoading: true,
  },
}
