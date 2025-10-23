import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Verificar se usuário está autenticado ao carregar a página
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        try {
          // Verificar se o token ainda é válido
          const response = await api.get('/users/profile')
          if (response.data.success) {
            setUser(response.data.data)
            setToken(storedToken)
          } else {
            // Token inválido, limpar storage
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            setToken(null)
          }
        } catch (error) {
          // Token inválido ou expirado
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          setToken(null)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        senha: password
      })

      if (response.data.success) {
        const { user: userData, token: userToken, refreshToken } = response.data.data
        
        // Salvar tokens no localStorage
        localStorage.setItem('token', userToken)
        localStorage.setItem('refreshToken', refreshToken)
        
        // Atualizar estado
        setUser(userData)
        setToken(userToken)
        
        return { success: true, data: userData }
      } else {
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao fazer login'
      return { success: false, message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)

      if (response.data.success) {
        const { user: newUser, token: userToken, refreshToken } = response.data.data
        
        // Salvar tokens no localStorage
        localStorage.setItem('token', userToken)
        localStorage.setItem('refreshToken', refreshToken)
        
        // Atualizar estado
        setUser(newUser)
        setToken(userToken)
        
        return { success: true, data: newUser }
      } else {
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao criar conta'
      return { success: false, message }
    }
  }

  const logout = () => {
    // Limpar localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    
    // Limpar estado
    setUser(null)
    setToken(null)
  }

  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }))
  }

  const isAuthenticated = () => {
    return !!token && !!user
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
