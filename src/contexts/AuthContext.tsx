/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, getProfile, apiLogout } from '../lib/api/auth'

interface User {
  id: string
  email: string
  fullName: string
  phone?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (localStorage)
    const savedToken = localStorage.getItem('admin_token')
    const savedUser = localStorage.getItem('admin_user')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))

      // Vérifier et mettre à jour le profil depuis la base de données
      getProfile(savedToken)
        .then((fullProfile) => {
          const userData = {
            id: fullProfile.id,
            email: fullProfile.email,
            fullName:
              fullProfile.fullName ||
              fullProfile.firstName + ' ' + fullProfile.lastName ||
              fullProfile.email,
            phone: fullProfile.phone,
            role: fullProfile.role,
          }
          setUser(userData)
          localStorage.setItem('admin_user', JSON.stringify(userData))
        })
        .catch((error) => {
          console.warn('Erreur lors de la vérification du profil:', error)
          setUser(null)
          setToken(null)
          localStorage.removeItem('admin_user')
          localStorage.removeItem('admin_token')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      const response = await apiLogin({ email, password })

      if (response.access_token && response.user) {
        // Récupérer le profil complet depuis la base de données
        try {
          const fullProfile = await getProfile(response.access_token)
          const userData = {
            id: fullProfile.id,
            email: fullProfile.email,
            fullName: fullProfile.fullName,
            phone: fullProfile.phone,
            role: fullProfile.role,
          }

          setToken(response.access_token)
          setUser(userData)
          localStorage.setItem('admin_token', response.access_token)
          localStorage.setItem('admin_user', JSON.stringify(userData))
          setIsLoading(false)
          return { success: true }
        } catch (profileError) {
          console.warn(
            'Erreur lors de la récupération du profil:',
            profileError
          )
          // Fallback vers les données de base de la réponse de login
          const userData = {
            id: response.user.id,
            email: response.user.email,
            fullName: response.user.fullName,
            phone: response.user.phone,
            role: response.user.role,
          }

          setToken(response.access_token)
          setUser(userData)
          localStorage.setItem('admin_token', response.access_token)
          localStorage.setItem('admin_user', JSON.stringify(userData))
          setIsLoading(false)
          return { success: true }
        }
      } else {
        setIsLoading(false)
        return { success: false, error: 'Réponse invalide du serveur' }
      }
    } catch (error: any) {
      console.warn('API authentication failed:', error)

      // Extract error message from API response
      let errorMessage = 'Une erreur est survenue lors de la connexion'

      // Handle different types of errors
      if (error.response?.status === 401) {
        errorMessage = 'Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.'
      } else if (error.response?.status === 400) {
        errorMessage = 'Données de connexion invalides. Veuillez vérifier le format de votre email.'
      } else if (error.response?.status === 429) {
        errorMessage = 'Trop de tentatives de connexion. Veuillez réessayer dans quelques minutes.'
      } else if (error.response?.status === 500) {
        errorMessage = 'Erreur du serveur. Veuillez réessayer plus tard.'
      } else if (error.response?.status >= 500) {
        errorMessage = 'Le serveur est temporairement indisponible. Veuillez réessayer plus tard.'
      } else if (error.name === 'TypeError' || error.message?.includes('fetch')) {
        errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.'
      } else if (error.response?.data?.message) {
        // Use API error message if available
        if (Array.isArray(error.response.data.message)) {
          errorMessage = error.response.data.message.join(', ')
        } else {
          errorMessage = error.response.data.message
        }
      } else if (error.message && !error.message.includes('HTTP error')) {
        errorMessage = error.message
      }

      setIsLoading(false)
      return { success: false, error: errorMessage }
    }

    setIsLoading(false)
    return { success: false, error: 'Réponse inattendue du serveur' }
  }

  const logout = async () => {
    try {
      // Appeler l'API de déconnexion côté serveur si un token existe
      if (token) {
        await apiLogout(token)
      }
    } catch (error) {
      console.warn('Erreur lors de la déconnexion côté serveur:', error)
    } finally {
      // Nettoyer les données locales dans tous les cas
      setUser(null)
      setToken(null)
      localStorage.removeItem('admin_user')
      localStorage.removeItem('admin_token')
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
