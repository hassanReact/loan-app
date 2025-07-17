"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout")
    router.push("/login")
  }

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      size="sm"
      className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  )
}
