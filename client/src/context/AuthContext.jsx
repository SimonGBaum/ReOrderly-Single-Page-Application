import { createContext, useContext, useReducer, useEffect } from 'react'
import { getSession, getUserById, clearSession, saveSession } from '../data/userStore'

const AuthContext = createContext(null)

const initialState = { user: null, isLoading: true }

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload, isLoading: false }
    case 'LOGOUT':
      clearSession()
      return { user: null, isLoading: false }
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } }
    case 'HYDRATE_DONE':
      return { ...state, isLoading: false }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const userId = getSession()
    if (userId) {
      const user = getUserById(userId)
      if (user) {
        saveSession(user.userId)
        dispatch({ type: 'LOGIN', payload: user })
      } else {
        dispatch({ type: 'HYDRATE_DONE' })
      }
    } else {
      dispatch({ type: 'HYDRATE_DONE' })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
