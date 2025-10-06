"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Copy, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTranslations } from "next-intl"

async function fetchProjects() {
  const response = await fetch("/api/admin/projects")
  if (!response.ok) throw new Error("Failed to fetch projects")
  return response.json()
}

async function createProject(data: { name: string; slug: string; domain?: string }) {
  const response = await fetch("/api/admin/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create project")
  return response.json()
}

export default function ProjectsPage() {
  const t = useTranslations("admin.projects")
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [domain, setDomain] = useState("")
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: fetchProjects,
  })

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] })
      setOpen(false)
      setName("")
      setSlug("")
      setDomain("")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({ name, slug, domain: domain || undefined })
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-gray-600 mt-2">{t("description")}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("newProject")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("createProject")}</DialogTitle>
              <DialogDescription>
                {t("createDescription")}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("projectName")}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                  }}
                  placeholder={t("projectNamePlaceholder")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">{t("slug")}</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder={t("slugPlaceholder")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">{t("domain")}</Label>
                <Input
                  id="domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder={t("domainPlaceholder")}
                />
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? t("creating") : t("createProject")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">{t("loading")}</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects?.data?.map((project: any) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>/{project.slug}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.domain && (
                  <div>
                    <p className="text-sm text-gray-600">{t("domain")}</p>
                    <p className="text-sm font-mono">{project.domain}</p>
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-600">{t("apiKey")}</p>
                    <button
                      onClick={() => copyToClipboard(project.apiKey, project.id)}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      {copiedKey === project.id ? (
                        <>
                          <Check className="h-3 w-3" />
                          {t("copied")}
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          {t("copy")}
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded truncate">
                    {project.apiKey}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-500">{t("feedbacks")}</p>
                    <p className="text-lg font-bold">{project._count?.feedbacks || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t("reviews")}</p>
                    <p className="text-lg font-bold">{project._count?.reviews || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t("issues")}</p>
                    <p className="text-lg font-bold">{project._count?.issues || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t("features")}</p>
                    <p className="text-lg font-bold">{project._count?.featureRequests || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
