"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

async function fetchFeedbacks() {
  const response = await fetch("/api/admin/feedbacks")
  if (!response.ok) throw new Error("Failed to fetch feedbacks")
  return response.json()
}

async function updateFeedbackStatus(id: string, status: string, priority?: string) {
  const response = await fetch(`/api/admin/feedbacks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, priority }),
  })
  if (!response.ok) throw new Error("Failed to update feedback")
  return response.json()
}

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  RESOLVED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-gray-100 text-gray-500",
}

const priorityColors: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-blue-100 text-blue-600",
  HIGH: "bg-orange-100 text-orange-600",
  URGENT: "bg-red-100 text-red-600",
}

export default function FeedbacksPage() {
  const queryClient = useQueryClient()
  const [filterStatus, setFilterStatus] = useState("all")

  const { data: feedbacks, isLoading } = useQuery({
    queryKey: ["admin-feedbacks"],
    queryFn: fetchFeedbacks,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status, priority }: { id: string; status: string; priority?: string }) =>
      updateFeedbackStatus(id, status, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-feedbacks"] })
    },
  })

  const filteredFeedbacks = feedbacks?.data?.filter((feedback: any) => {
    if (filterStatus === "all") return true
    return feedback.status === filterStatus
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Feedbacks</h1>
          <p className="text-gray-600 mt-2">Manage customer feedback</p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading feedbacks...</div>
      ) : filteredFeedbacks?.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No feedbacks found</div>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks?.map((feedback: any) => (
            <Card key={feedback.id}>
              <CardHeader>
                <CardTitle className="text-lg">{feedback.content}</CardTitle>
                {feedback.name && (
                  <CardDescription>
                    From: {feedback.name} {feedback.email && `(${feedback.email})`}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Status</label>
                      <Select
                        value={feedback.status}
                        onValueChange={(value) =>
                          updateMutation.mutate({ id: feedback.id, status: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">New</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="RESOLVED">Resolved</SelectItem>
                          <SelectItem value="ARCHIVED">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Priority</label>
                      <Select
                        value={feedback.priority}
                        onValueChange={(value) =>
                          updateMutation.mutate({
                            id: feedback.id,
                            status: feedback.status,
                            priority: value,
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="URGENT">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Project</label>
                      <p className="text-sm font-medium truncate">
                        {feedback.project?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Badge className={statusColors[feedback.status]}>
                      {feedback.status.replace(/_/g, " ")}
                    </Badge>
                    <Badge className={priorityColors[feedback.priority]}>
                      {feedback.priority}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Submitted: {new Date(feedback.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
