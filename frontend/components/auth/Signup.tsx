"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, User, Mail, Lock, UserCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { API_AUTH_URL } from "@/constants/env"

export const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "HOMEOWNER", // default
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch(`${API_AUTH_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Signup failed")

      // Save tokens and user data
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      setMessage("Signup successful! Redirecting...")
      
      // Redirect to map
      setTimeout(() => {
        window.location.href = '/map';
      }, 500);
    } catch (err: any) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="bg-gray-900/80 border-gray-700/50 backdrop-blur-sm shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-white text-balance">Join RenoWise</CardTitle>
          <CardDescription className="text-gray-400">
            Create your account and start your renovation journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-300">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="pl-10 bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10 bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-10 bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                  placeholder="••••••••"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </motion.button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-gray-300">
                Account Type
              </Label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 z-10" />
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="pl-10 bg-gray-800/50 border-gray-600/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="HOMEOWNER" className="text-white hover:bg-gray-700">
                      Homeowner
                    </SelectItem>
                    <SelectItem value="COMPANY" className="text-white hover:bg-gray-700">
                      Company
                    </SelectItem>
                    <SelectItem value="CITY" className="text-white hover:bg-gray-700">
                      City
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
            <motion.div whileTap={{ scale: 0.98 }} transition={{ duration: 0.1 }} className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full font-semibold bg-blue-600 hover:bg-blue-700 text-white border-0 h-12 text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                size="lg"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </motion.div>
          </form>

          {/* Status Message */}
          {message && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Alert
                className={`mt-4 ${
                  message.includes("successful")
                    ? "border-green-500/50 bg-green-900/20 text-green-400"
                    : "border-red-500/50 bg-red-900/20 text-red-400"
                }`}
              >
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <motion.a
                href="/login"
                className="font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.1 }}
              >
                Sign in
              </motion.a>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
