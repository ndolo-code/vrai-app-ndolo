"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { Dashboard } from "@/components/ndolo/dashboard"
import { ServiceWorkerRegister } from "@/components/ndolo/sw-register"
import { CopyProtection } from "@/components/ndolo/copy-protection"

export default function Page() {
  const { darkMode, selectedClassId, setSelectedClassId } = useAppStore()

  useEffect(() => {
    if (selectedClassId !== "3e") {
      setSelectedClassId("3e")
    }
  }, [selectedClassId, setSelectedClassId])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  return (
    <>
      <CopyProtection />
      <ServiceWorkerRegister />
      <Dashboard />
    </>
  )
}
