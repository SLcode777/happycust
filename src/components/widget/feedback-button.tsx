"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

// Extend Window interface for TypeScript
declare global {
  interface Window {
    HappyCust?: {
      open: () => void
      close: () => void
      toggle: () => void
    }
  }
}

interface FeedbackButtonProps {
  children?: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function FeedbackButton({
  children = (
    <>
      <MessageSquare className="mr-2 h-4 w-4" />
      Support
    </>
  ),
  className,
  variant = "default",
  size = "default",
}: FeedbackButtonProps) {
  const handleClick = () => {
    if (typeof window !== "undefined" && window.HappyCust) {
      window.HappyCust.open()
    } else {
      console.warn("HappyCust widget is not loaded yet")
    }
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={className}
    >
      {children}
    </Button>
  )
}
