"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"
import { AuthPage } from "@/components/ndolo/auth-page"
import { Dashboard } from "@/components/ndolo/dashboard"
import { ServiceWorkerRegister } from "@/components/ndolo/sw-register"
import { CopyProtection } from "@/components/ndolo/copy-protection"
import { createClient } from "@/lib/supabase/client"

export default function Page() {
  const { isAuthenticated, darkMode, login, logout } = useAppStore()
  const [checking, setChecking] = useState(true)

  // On mount, check Supabase session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
          login({
            name: profile?.full_name || user.user_metadata?.full_name || "",
            email: user.email || "",
            role: profile?.role || "eleve",
            country: profile?.country || "Cameroun",
            phone: profile?.phone || "",
            registeredClass: profile?.registered_class || "6e",
          })
        } else if (isAuthenticated) {
          // Session expired
          logout()
        }
      } catch {
        // Offline - use localStorage cached auth state
      }
      setChecking(false)
    }
    checkSession()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--ndolo-green)]">
        <div className="flex flex-col items-center gap-5">
          <img
            src="/icon-512.png"
            alt="Ndolomath"
            className="w-28 h-28 rounded-2xl shadow-lg animate-pulse"
          />
          <h1 className="text-2xl font-bold text-white tracking-tight">Ndolomath</h1>
          <div className="w-8 h-8 rounded-full border-3 border-white border-t-transparent animate-spin" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <CopyProtection />
        <ServiceWorkerRegister />
        <AuthPage />
      </>
    )
  }

  return (
    <>
      <CopyProtection />
      <ServiceWorkerRegister />
      <Dashboard />
    </>
  )
}
