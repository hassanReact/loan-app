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
  SidebarFooter,
} from "@/components/ui/sidebar"
import { LayoutDashboard, FileText, Users, HelpCircle, Settings, Shield, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "All Loans", url: "/admin/loans", icon: FileText },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Support Tickets", url: "/admin/support", icon: HelpCircle },
  { title: "Settings", url: "/admin/settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center space-x-2 text-xl font-bold text-blue-600">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span>Admin Panel</span>
            </div>
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
          <SidebarFooter className="border-t p-4">
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-border mx-2" />
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </header>
          <main className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
