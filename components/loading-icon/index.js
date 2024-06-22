import React from 'react'
import {ThreeDots} from 'react-loader-spinner'

export function LoadingIcon() {
  return (
    <ThreeDots
      width='25'
      height='25'
      color='#666'
      wrapperClass='loading-icon'
    />
  )
}
