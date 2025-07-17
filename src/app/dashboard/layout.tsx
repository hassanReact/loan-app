"use client"

import type React from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Home, CreditCard, FileText, User, HelpCircle, Zap, CurrencyIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Apply for Loan", url: "/dashboard/loan/apply", icon: CreditCard },
  { title: "Repay Loan", url: "/dashboard/loan/repay", icon: CurrencyIcon },
  { title: "Loan Status", url: "/dashboard/loan/status", icon: FileText },
  { title: "Profile", url: "/dashboard/profile", icon: User },
  { title: "Support", url: "/dashboard/support", icon: HelpCircle },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b px-6 py-4">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span>SwiftLoan</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-4 py-6">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} className="w-full justify-start">
                    <Link href={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-border mx-2" />
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </header>
          <main className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
