import React from 'react'

export default function TskStatus({status}) {
  return <>{availableStatus[status]}</>
}

const availableStatus = {
  todo: '-',
  doing: '+',
  done: '*',
  freezed: '!',
  archived: 'x',
}
