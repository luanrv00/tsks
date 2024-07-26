import {SmallInput} from '.'

export default {
  component: SmallInput,
  title: 'inputs/SmallInput',
  tags: ['autodocs'],
}

export const Primary = {
  args: {
    value: 'some value',
    placeholder: 'placeholder',
    type: 'any',
    onChange: () => {},
    hasEmptyError: false,
    hasInvalidEmailError: false,
  },
}

export const EmptyError = {
  args: {
    ...Primary.args,
    hasEmptyError: true,
  },
}

export const InvalidError = {
  args: {
    ...Primary.args,
    hasInvalidEmailError: true,
  },
}
