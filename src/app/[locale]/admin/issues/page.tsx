"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

async function fetchIssues() {
  const response = await fetch("/api/admin/issues")
  if (!response.ok) throw new Error("Failed to fetch issues")
  return response.json()
}

async function updateIssueStatus(id: string, status: string, priority?: string) {
  const response = await fetch(`/api/admin/issues/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, priority }),
  })
  if (!response.ok) throw new Error("Failed to update issue")
  return response.json()
}

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  RESOLVED: "bg-green-100 text-green-700",
  WONT_FIX: "bg-gray-100 text-gray-600",
  ARCHIVED: "bg-gray-100 text-gray-500",
}

const priorityColors: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-blue-100 text-blue-600",
  HIGH: "bg-orange-100 text-orange-600",
  URGENT: "bg-red-100 text-red-600",
}

export default function IssuesPage() {
  const t = useTranslations("admin.issues")
  const tStatus = useTranslations("admin.status")
  const tPriority = useTranslations("admin.priority")
  const tCommon = useTranslations("common")
  const queryClient = useQueryClient()
  const [filterStatus, setFilterStatus] = useState("all")

  const { data: issues, isLoading } = useQuery({
    queryKey: ["admin-issues"],
    queryFn: fetchIssues,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status, priority }: { id: string; status: string; priority?: string }) =>
      updateIssueStatus(id, status, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-issues"] })
    },
  })

  const filteredIssues = issues?.data?.filter((issue: any) => {
    if (filterStatus === "all") return true
    return issue.status === filterStatus
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-gray-600 mt-2">{t("description")}</p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allStatuses")}</SelectItem>
            <SelectItem value="NEW">{tStatus("new")}</SelectItem>
            <SelectItem value="IN_PROGRESS">{tStatus("inProgress")}</SelectItem>
            <SelectItem value="RESOLVED">{tStatus("resolved")}</SelectItem>
            <SelectItem value="WONT_FIX">{tStatus("wontFix")}</SelectItem>
            <SelectItem value="ARCHIVED">{tStatus("archived")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">{tCommon("loading")}</div>
      ) : filteredIssues?.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{t("noIssues")}</div>
      ) : (
        <div className="space-y-4">
          {filteredIssues?.map((issue: any) => (
            <Card key={issue.id}>
              <CardHeader>
                <CardTitle className="text-lg">{issue.description}</CardTitle>
                {issue.name && (
                  <CardDescription>
                    {t("reportedBy", { name: `${issue.name}${issue.email ? ` (${issue.email})` : ""}` })}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">{t("status")}</label>
                      <Select
                        value={issue.status}
                        onValueChange={(value) =>
                          updateMutation.mutate({ id: issue.id, status: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">{tStatus("new")}</SelectItem>
                          <SelectItem value="IN_PROGRESS">{tStatus("inProgress")}</SelectItem>
                          <SelectItem value="RESOLVED">{tStatus("resolved")}</SelectItem>
                          <SelectItem value="WONT_FIX">{tStatus("wontFix")}</SelectItem>
                          <SelectItem value="ARCHIVED">{tStatus("archived")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">{t("priority")}</label>
                      <Select
                        value={issue.priority}
                        onValueChange={(value) =>
                          updateMutation.mutate({ id: issue.id, status: issue.status, priority: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">{tPriority("low")}</SelectItem>
                          <SelectItem value="MEDIUM">{tPriority("medium")}</SelectItem>
                          <SelectItem value="HIGH">{tPriority("high")}</SelectItem>
                          <SelectItem value="URGENT">{tPriority("urgent")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">{t("project")}</label>
                      <p className="text-sm font-medium truncate">{issue.project?.name}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Badge className={statusColors[issue.status]}>
                      {issue.status.replace(/_/g, " ")}
                    </Badge>
                    <Badge className={priorityColors[issue.priority]}>
                      {issue.priority}
                    </Badge>
                  </div>
                </div>

                {issue.screenshotUrl && (
                  <div className="mt-4">
                    <label className="text-xs text-gray-600 mb-1 block">{t("screenshot")}</label>
                    <a
                      href={issue.screenshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {t("viewScreenshot")}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
