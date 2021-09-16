import React from 'react'

export default function FlashMessage({type, message}) {
  return (
    <>
      {message ? (<p className={type}>{message}</p>) : null}
    </>
  )
}
