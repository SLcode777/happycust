"use client"

import { useSession } from "@/lib/auth-client"
import { usePathname } from "next/navigation"
import { useRouter } from "@/i18n/routing"
import { useEffect } from "react"
import { Sidebar } from "@/components/admin/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  // Check if current path ends with /login or /signup
  const isPublicPage = pathname.endsWith("/admin/login") || pathname.endsWith("/admin/signup")

  useEffect(() => {
    if (!isPending && !session && !isPublicPage) {
      router.push("/admin/login")
    }
  }, [session, isPending, router, isPublicPage])

  // Public pages (login, signup) - no sidebar
  if (isPublicPage) {
    return <>{children}</>
  }

  // Loading state
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  // Not authenticated
  if (!session) {
    return null
  }

  // Authenticated - show sidebar
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
