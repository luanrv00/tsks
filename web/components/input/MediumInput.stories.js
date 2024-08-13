import {MediumInput} from '.'

export default {
  component: MediumInput,
  title: 'inputs/MediumInput',
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
