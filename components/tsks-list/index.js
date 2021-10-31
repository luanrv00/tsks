import React from 'react'
import Tsk from '../tsk'

export default function TsksList({tsksData}) {
  const [ctx, tsksGroup] = tsksData

  return (
    <div className='tsks-group'>
      <h3 className='tsks-context'>{ctx}</h3>
      <ul className='tsks-list'>
        {tsksGroup.map(({id, tsk}) => <Tsk id={id} tsk={tsk}/>)}
      </ul>
    </div>
  )
}
