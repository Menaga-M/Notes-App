// import React from 'react'
import { createContext, useContext, useState } from 'react'

const authContext = createContext()

const ContextProvider = ({children}) => {
    const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem('user')

      return savedUser ? JSON.parse(savedUser) : null
    })

    const updateUser = (nextUser) => {
      setUser(nextUser)

      if (nextUser) {
        localStorage.setItem('user', JSON.stringify(nextUser))
      } else {
        localStorage.removeItem('user')
      }
    }

  return (
    <div>
      <authContext.Provider value={{user, setUser: updateUser}}>{children}</authContext.Provider>
    </div>
  )
}
export const useAuth = () => useContext(authContext)
export default ContextProvider
