"use client"

import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setError("")
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-c1">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-c4 p-8 flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-c3">My Dashboard</h1>
          <p className="text-sm text-c2">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <FormInput 
            type="email"
            label="Email"
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormInput 
            type="password"
            label="Password"
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            className="w-full py-2.5 cursor-pointer"
            onClick={handleLogin}
            disabled={loading || !email || !password}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </div>

      </div>
    </div>
  )
}