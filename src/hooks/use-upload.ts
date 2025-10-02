import { useState } from "react"

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false)

  const uploadFile = async (file: File): Promise<string | null> => {
    setIsUploading(true)
    try {
      // Get presigned URL from UploadThing
      const presignedResponse = await fetch("/api/uploadthing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: [
            {
              name: file.name,
              size: file.size,
              type: file.type,
            },
          ],
        }),
      })

      if (!presignedResponse.ok) {
        throw new Error("Failed to get upload URL")
      }

      const presignedData = await presignedResponse.json()
      const uploadData = presignedData.data?.[0]

      if (!uploadData) {
        throw new Error("Invalid upload response")
      }

      // Upload file to the presigned URL
      const uploadResponse = await fetch(uploadData.url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file")
      }

      // Return the file URL
      return uploadData.fileUrl
    } catch (error) {
      console.error("Upload error:", error)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  return { uploadFile, isUploading }
}
