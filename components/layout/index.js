import {useState, useEffect} from 'react'
import {Inder} from 'next/font/google'
import styles from './index.module.css'
import {Header} from '..'
import {getCurrentUserAtBrowser} from '../../utils'

const inder = Inder({
  subsets: ['latin'],
  weight: '400',
})

export function Layout({children}) {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    setCurrentUser(getCurrentUserAtBrowser())
  }, [])

  return (
    <div className={`${styles.wrapper} ${inder.className}`}>
      <Header currentUser={currentUser} />
      {children}
    </div>
  )
}
