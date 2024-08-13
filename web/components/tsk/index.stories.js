import {Tsk} from '..'

export default {
  component: Tsk,
  title: 'Tsk',
  tags: ['autodocs'],
}

export const ToDo = {
  args: {
    id: 0,
    tsk: 'some tsk',
    context: 'context',
    status: 'todo',
    handleDoing: () => {},
    handleDone: () => {},
    handleDelete: () => {},
    isLoading: false,
  },
}

export const Doing = {
  args: {
    ...ToDo.args,
    status: 'doing',
  },
}

export const Done = {
  args: {
    ...ToDo.args,
    status: 'done',
  },
}

export const Loading = {
  args: {
    ...ToDo.args,
    isLoading: true,
  },
}
