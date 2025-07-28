"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name?: string
  isAdmin?: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name?: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("lantern-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("lantern-user", JSON.stringify(user))
    } else {
      localStorage.removeItem("lantern-user")
    }
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in a real app, this would call an API
    if (email === "admin@lanternstore.com" && password === "admin123") {
      setUser({
        id: "admin",
        email: "admin@lanternstore.com",
        name: "Admin User",
        isAdmin: true,
      })
      return true
    } else if (email && password) {
      setUser({
        id: Date.now().toString(),
        email,
        name: email.split("@")[0],
        isAdmin: false,
      })
      return true
    }
    return false
  }

  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    // Mock registration - in a real app, this would call an API
    if (email && password) {
      setUser({
        id: Date.now().toString(),
        email,
        name: name || email.split("@")[0],
        isAdmin: false,
      })
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
