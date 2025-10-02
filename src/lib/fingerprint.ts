// Simple browser fingerprint generator
export function generateFingerprint(): string {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return generateFallbackFingerprint()
  }

  // Draw text with specific font
  ctx.textBaseline = "top"
  ctx.font = "14px 'Arial'"
  ctx.textBaseline = "alphabetic"
  ctx.fillStyle = "#f60"
  ctx.fillRect(125, 1, 62, 20)
  ctx.fillStyle = "#069"
  ctx.fillText("HappyCust", 2, 15)
  ctx.fillStyle = "rgba(102, 204, 0, 0.7)"
  ctx.fillText("HappyCust", 4, 17)

  const canvasFingerprint = canvas.toDataURL()

  // Combine with other browser properties
  const components = [
    canvasFingerprint,
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + "x" + screen.height,
    new Date().getTimezoneOffset(),
  ]

  return hashCode(components.join(""))
}

function generateFallbackFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + "x" + screen.height,
    new Date().getTimezoneOffset(),
  ]

  return hashCode(components.join(""))
}

function hashCode(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}
