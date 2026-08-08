// import React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { apiUrl } from '../api'

const authContext = createContext()

const ContextProvider = ({children}) => {
    const [user, setUser] = useState(() => {
      try {
        const savedUser = localStorage.getItem('user')
        return savedUser ? JSON.parse(savedUser) : null
      } catch {
        localStorage.removeItem('user')
        return null
      }
    })
    const [loading, setLoading] = useState(true)

    const updateUser = (nextUser) => {
      setUser(nextUser)

      if (nextUser) {
        localStorage.setItem('user', JSON.stringify(nextUser))
      } else {
        localStorage.removeItem('user')
      }
    }

    useEffect(() => {
      const restoreSession = async () => {
        const token = localStorage.getItem('token')

        if (!token) {
          setLoading(false)
          return
        }

        try {
          const response = await fetch(apiUrl('/api/auth/me'), {
            headers: { Authorization: `Bearer ${token}` },
          })
          const data = await response.json()

          if (response.ok && data.success && data.user?.name) {
            updateUser(data.user)
          } else {
            localStorage.removeItem('token')
            updateUser(null)
          }
        } catch {
          // Keep the saved user during a temporary network failure.
        } finally {
          setLoading(false)
        }
      }

      restoreSession()
    }, [])

  return (
    <div>
      <authContext.Provider value={{user, setUser: updateUser, loading}}>{children}</authContext.Provider>
    </div>
  )
}
// The hook is intentionally exported alongside its provider for this small app.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(authContext)
export default ContextProvider
