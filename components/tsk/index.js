import React from 'react'

export default function Tsk({id, tsk}) {
  return (
    <li key={id} className='tsks-item'>{tsk}</li>
  )
}
