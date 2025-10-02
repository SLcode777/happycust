"use client"

import { CheckCircle } from "lucide-react"

interface SuccessAnimationProps {
  message: string
}

export function SuccessAnimation({ message }: SuccessAnimationProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-300">
      <div className="relative">
        <CheckCircle className="h-16 w-16 text-green-500 animate-in zoom-in duration-500" />
        <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
      </div>
      <p className="mt-4 text-lg font-medium text-center">{message}</p>
    </div>
  )
}
