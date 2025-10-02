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
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-600 mt-2">Manage your projects and API keys</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add a new project to start collecting feedback
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                  }}
                  placeholder="My Awesome App"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="my-awesome-app"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Domain (Optional)</Label>
                <Input
                  id="domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Project"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading projects...</div>
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
                    <p className="text-sm text-gray-600">Domain</p>
                    <p className="text-sm font-mono">{project.domain}</p>
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-600">API Key</p>
                    <button
                      onClick={() => copyToClipboard(project.apiKey, project.id)}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      {copiedKey === project.id ? (
                        <>
                          <Check className="h-3 w-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy
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
                    <p className="text-xs text-gray-500">Feedbacks</p>
                    <p className="text-lg font-bold">{project._count?.feedbacks || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Reviews</p>
                    <p className="text-lg font-bold">{project._count?.reviews || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Issues</p>
                    <p className="text-lg font-bold">{project._count?.issues || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Features</p>
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
