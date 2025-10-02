import { db } from "./db"

/**
 * Resolve API key to project ID
 * @param apiKey - The API key from the widget config
 * @returns The project ID or null if not found
 */
export async function resolveApiKeyToProjectId(
  apiKey: string
): Promise<string | null> {
  const project = await db.project.findUnique({
    where: { apiKey },
    select: { id: true },
  })

  return project?.id || null
}
