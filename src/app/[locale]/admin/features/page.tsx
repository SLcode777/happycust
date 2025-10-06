"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronUp } from "lucide-react"

async function fetchFeatures() {
  const response = await fetch("/api/admin/features")
  if (!response.ok) throw new Error("Failed to fetch features")
  return response.json()
}

async function updateFeatureStatus(id: string, status: string, priority?: string) {
  const response = await fetch(`/api/admin/features/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, priority }),
  })
  if (!response.ok) throw new Error("Failed to update feature")
  return response.json()
}

const statusColors: Record<string, string> = {
  NEW: "bg-gray-100 text-gray-700",
  UNDER_CONSIDERATION: "bg-yellow-100 text-yellow-700",
  PLANNED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  ARCHIVED: "bg-gray-100 text-gray-500",
}

const priorityColors: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-blue-100 text-blue-600",
  HIGH: "bg-orange-100 text-orange-600",
  URGENT: "bg-red-100 text-red-600",
}

export default function FeaturesPage() {
  const t = useTranslations("admin.features")
  const tStatus = useTranslations("admin.status")
  const tPriority = useTranslations("admin.priority")
  const tCommon = useTranslations("common")
  const queryClient = useQueryClient()
  const [filterStatus, setFilterStatus] = useState("all")

  const { data: features, isLoading } = useQuery({
    queryKey: ["admin-features"],
    queryFn: fetchFeatures,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status, priority }: { id: string; status: string; priority?: string }) =>
      updateFeatureStatus(id, status, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-features"] })
    },
  })

  const filteredFeatures = features?.data?.filter((feature: any) => {
    if (filterStatus === "all") return true
    return feature.status === filterStatus
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
            <SelectItem value="UNDER_CONSIDERATION">{tStatus("underConsideration")}</SelectItem>
            <SelectItem value="PLANNED">{tStatus("planned")}</SelectItem>
            <SelectItem value="IN_PROGRESS">{tStatus("inProgress")}</SelectItem>
            <SelectItem value="COMPLETED">{tStatus("completed")}</SelectItem>
            <SelectItem value="REJECTED">{tStatus("rejected")}</SelectItem>
            <SelectItem value="ARCHIVED">{tStatus("archived")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">{tCommon("loading")}</div>
      ) : filteredFeatures?.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {t("noFeatures")}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFeatures?.map((feature: any) => (
            <Card key={feature.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
                        <ChevronUp className="h-4 w-4" />
                        <span className="text-sm font-medium">{feature._count?.votes || 0}</span>
                      </div>
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
                    {feature.name && (
                      <p className="text-sm text-gray-500 mt-2">
                        {t("submittedBy", { name: `${feature.name}${feature.email ? ` (${feature.email})` : ""}` })}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">{t("status")}</label>
                      <Select
                        value={feature.status}
                        onValueChange={(value) =>
                          updateMutation.mutate({ id: feature.id, status: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">{tStatus("new")}</SelectItem>
                          <SelectItem value="UNDER_CONSIDERATION">{tStatus("underConsideration")}</SelectItem>
                          <SelectItem value="PLANNED">{tStatus("planned")}</SelectItem>
                          <SelectItem value="IN_PROGRESS">{tStatus("inProgress")}</SelectItem>
                          <SelectItem value="COMPLETED">{tStatus("completed")}</SelectItem>
                          <SelectItem value="REJECTED">{tStatus("rejected")}</SelectItem>
                          <SelectItem value="ARCHIVED">{tStatus("archived")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">{t("priority")}</label>
                      <Select
                        value={feature.priority}
                        onValueChange={(value) =>
                          updateMutation.mutate({ id: feature.id, status: feature.status, priority: value })
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
                      <p className="text-sm font-medium truncate">{feature.project?.name}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Badge className={statusColors[feature.status]}>
                      {feature.status.replace(/_/g, " ")}
                    </Badge>
                    <Badge className={priorityColors[feature.priority]}>
                      {feature.priority}
                    </Badge>
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
