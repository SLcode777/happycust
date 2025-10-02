"use client"

import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/routing"
import {
  LayoutDashboard,
  MessageSquare,
  Star,
  AlertCircle,
  Lightbulb,
  FolderKanban,
  LogOut
} from "lucide-react"
import { signOut } from "@/lib/auth-client"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations("admin.navigation")

  const navigation = [
    { name: t("dashboard"), href: "/admin/dashboard", icon: LayoutDashboard },
    { name: t("projects"), href: "/admin/projects", icon: FolderKanban },
    { name: t("features"), href: "/admin/features", icon: Lightbulb },
    { name: t("issues"), href: "/admin/issues", icon: AlertCircle },
    { name: t("reviews"), href: "/admin/reviews", icon: Star },
    { name: t("feedbacks"), href: "/admin/feedbacks", icon: MessageSquare },
  ]

  const handleSignOut = async () => {
    await signOut()
    router.push("/admin/login")
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center px-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">HappyCust</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-800 p-4">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5" />
          {t("signOut")}
        </button>
      </div>
    </div>
  )
}
