'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Mail, Lock, User, Building2 } from 'lucide-react'
import loginUser, { signupUser } from '@/utils/helper'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext';

interface AuthFormProps {
  type: 'signin' | 'signup'
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'HOMEOWNER' | 'COMPANY' | 'CITY'>('HOMEOWNER')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const { login } = useAuth();

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await loginUser(email, password);

      if (!response || !response.ok) {
        const err = await response?.json();
        setError(err?.message || "Login failed");
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      // Use context login
      login(data.accessToken, data.refreshToken, data.user);

      // Get redirect from URL or default to map
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect') || '/map';

      router.push(redirect);
    } catch (err: any) {
      setError(err?.message || "Login failed");
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await signupUser(name, email, password, role);

      if (!response || !response.ok) {
        const err = await response?.json();
        setError(err?.message || "Signup failed");
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      // Use context login
      login(data.accessToken, data.refreshToken, data.user);

      router.push('/map');
    } catch (err: any) {
      setError(err?.message || "Signup failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center px-4 py-12 relative z-20">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {type === 'signin' ? 'Welcome Back' : 'Join Renowise'}
          </h1>
          <p className="text-muted-foreground">
            {type === 'signin'
              ? 'Sign in to access your account'
              : 'Create an account to get started'}
          </p>
        </div>

        {/* Role Selection for Signup */}
        {type === 'signup' && (
          <div className="grid grid-cols-3 gap-3 mb-6 ">
            <button
              type="button"
              onClick={() => setRole('HOMEOWNER')}
              className={`p-4 rounded-lg border-2 hover:cursor-pointer transition-colors ${role === 'HOMEOWNER'
                ? 'border-primary bg-primary/10'
                : 'border-border/50 hover:border-border'
                }`}
            >
              <User className="w-5 h-5 mx-auto mb-2 hover:cursor-pointer text-white " />
              <p className="text-sm font-medium text-foreground">Homeowner</p>
            </button>
            <button
              type="button"
              onClick={() => setRole('COMPANY')}
              className={`p-4 rounded-lg border-2 hover:cursor-pointer transition-colors ${role === 'COMPANY'
                ? 'border-primary bg-primary/10'
                : 'border-border/50 hover:border-border'
                }`}
            >
              <Building2 className="w-5 h-5 mx-auto mb-2  text-white " />
              <p className="text-sm font-medium text-foreground">Company</p>
            </button>
            <button
              type="button"
              onClick={() => setRole('CITY')}
              className={`p-4 rounded-lg border-2 hover:cursor-pointer transition-colors ${role === 'CITY'
                ? 'border-primary bg-primary/10'
                : 'border-border/50 hover:border-border'
                }`}
            >
              <Building2 className="w-5 h-5 mx-auto mb-2 text-white " />
              <p className="text-sm font-medium text-foreground">City</p>
            </button>
          </div>
        )}

        {/* Form Card */}
        <Card className="bg-black/80 backdrop-blur-md border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field (Signup only) */}
            {type === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>
            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm text-center mb-2">
                {error}
              </p>
            )}
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={type === "signin" ? handleLogin : handleSignup}
            >
              {isLoading
                ? 'Loading...'
                : type === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
            </Button>
          </form>

          {/* Auth Link */}
          <div className="mt-6 text-center text-sm text-white">
            {type === 'signin' ? (
              <>
                Don't have an account?{' '}
                <Link href="/signup" className="text-blue-500 hover:text-blue-600 font-medium">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link href="/login" className="text-blue-500 hover:text-blue-600 font-medium">
                  Sign in
                </Link>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Social Auth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="border-border/50 hover:bg-secondary text-foreground"
            >
              Google
            </Button>
            <Button
              variant="outline"
              className="border-border/50 hover:bg-secondary text-foreground"
            >
              GitHub
            </Button>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-white mt-6">
          By signing {type === 'signin' ? 'in' : 'up'}, you agree to our{' '}
          <Link href="/terms" className="text-blue-600">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-blue-600">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
