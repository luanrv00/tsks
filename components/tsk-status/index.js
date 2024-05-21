import React from 'react'

export function TskStatus({status}) {
  return <>{availableStatus[status]}</>
}

const availableStatus = {
  todo: '-',
  doing: '+',
  done: '*',
  freezed: '!',
  archived: 'x',
}
