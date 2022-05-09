import React from 'react'
import Tsk from '../tsk'

export default function TsksList({tsksData}) {
  return (
    <ul className='tsks-list'>
      {tsksData.map(({id, tsk, context}) => (
        <Tsk key={id} tsk={tsk} context={context} />
      ))}
    </ul>
  )
}
