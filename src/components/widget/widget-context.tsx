"use client"

import { createContext, useContext, ReactNode } from "react"

interface WidgetConfig {
  projectId: string
  apiKey?: string
  hideBranding?: boolean
}

const WidgetContext = createContext<WidgetConfig | null>(null)

export function WidgetProvider({
  children,
  config,
}: {
  children: ReactNode
  config: WidgetConfig
}) {
  return (
    <WidgetContext.Provider value={config}>{children}</WidgetContext.Provider>
  )
}

export function useWidgetConfig() {
  const context = useContext(WidgetContext)
  if (!context) {
    throw new Error("useWidgetConfig must be used within WidgetProvider")
  }
  return context
}
