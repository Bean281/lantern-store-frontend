"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/components/language/language-context"
import { useToast } from "@/hooks/use-toast"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "login" | "register"
  onModeChange: (mode: "login" | "register") => void
}

export function AuthModal({ open, onOpenChange, mode, onModeChange }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { login, register } = useAuth()
  const { t } = useLanguage()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === "login") {
        await login({ email, password })
        toast({
          title: "Welcome back!",
          description: "You have been signed in.",
        })
      } else {
        await register({ email, password, name: name || undefined })
        toast({
          title: "Account created!",
          description: "Your account has been created successfully.",
        })
      }

      onOpenChange(false)
      setEmail("")
      setPassword("")
      setName("")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again."
      toast({
        title: t("error"),
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "login" ? t("signIn") : "Create Account"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Name (Optional)</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("loading") : mode === "login" ? t("signIn") : t("signUp")}
          </Button>
        </form>

        <div className="text-center text-sm">
          {mode === "login" ? (
            <p>
              {"Don't have an account? "}
              <Button variant="link" className="p-0 h-auto" onClick={() => onModeChange("register")}>
                {t("signUp")}
              </Button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => onModeChange("login")}>
                {t("signIn")}
              </Button>
            </p>
          )}
        </div>

        <div className="text-center">
          <Button variant="outline" className="w-full bg-transparent" onClick={() => onOpenChange(false)}>
            Continue as Guest
          </Button>
        </div>

        {mode === "login" && (
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>Demo credentials:</p>
            <p>Email: user@example.com</p>
            <p>Password: password123</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
