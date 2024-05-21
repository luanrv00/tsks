import React from 'react'

export function FlashMessage({type, message}) {
  return (
    <>
      {message ? (<p className={type}>{message}</p>) : null}
    </>
  )
}
