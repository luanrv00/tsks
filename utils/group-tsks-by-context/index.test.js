import groupTsksByContext from '.'

describe('groupTsksByContext', () => {
  it('returns an array containing all tsks grouped by context', () => {
    const allTsks = [
      {id: 0, t: 'whatever', context: 'contexto 1'},
      {id: 1, t: 'other', context: 'contexto 2'},
      {id: 3, t: 'ok', context: 'contexto 1'},
    ]

    const grouped = {
      'contexto 1': [
        {id: 0, t: 'whatever', context: 'contexto 1'},
        {id: 3, t: 'ok', context: 'contexto 1'},
      ],
      'contexto 2': [
        {id: 1, t: 'other', context: 'contexto 2'},
      ]
    }

    expect(groupTsksByContext(allTsks)).toEqual(grouped)
  })
})
