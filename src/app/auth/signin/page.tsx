'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Bot, Github, Mail, Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid credentials')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      setError('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderSignIn = async (provider: string) => {
    setIsLoading(true)
    try {
      await signIn(provider, { callbackUrl: '/' })
    } catch (error) {
      setError('Something went wrong')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border-purple-500/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">ODARK AI</h1>
          </div>
          <CardTitle className="text-white">Welcome Back</CardTitle>
          <CardDescription className="text-gray-300">
            Sign in to your AI assistant account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Provider Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => handleProviderSignIn('github')}
              disabled={isLoading}
              className="w-full bg-black/40 border-purple-500/20 text-white hover:bg-purple-600/20"
            >
              <Github className="h-4 w-4 mr-2" />
              Continue with GitHub
            </Button>
            <Button
              variant="outline"
              onClick={() => handleProviderSignIn('google')}
              disabled={isLoading}
              className="w-full bg-black/40 border-purple-500/20 text-white hover:bg-purple-600/20"
            >
              <Mail className="h-4 w-4 mr-2" />
              Continue with Google
            </Button>
          </div>

          <div className="relative">
            <Separator className="bg-purple-500/20" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 px-2">
              <span className="text-gray-400 text-xs">OR</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-black/40 border-purple-500/20 text-white placeholder:text-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-black/40 border-purple-500/20 text-white placeholder:text-gray-400 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300">
                Sign up
              </Link>
            </p>
            <p className="text-gray-400 text-sm">
              <Link href="/auth/forgot-password" className="text-purple-400 hover:text-purple-300">
                Forgot your password?
              </Link>
            </p>
          </div>

          <div className="flex justify-center">
            <Badge variant="outline" className="border-purple-500/30 text-purple-300">
              Secure Authentication
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}