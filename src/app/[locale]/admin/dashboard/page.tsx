"use client"

import { useSession } from "@/lib/auth-client"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Star, AlertCircle, Lightbulb } from "lucide-react"

async function fetchStats() {
  const response = await fetch("/api/admin/stats")
  if (!response.ok) throw new Error("Failed to fetch stats")
  return response.json()
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchStats,
  })

  const statCards = [
    {
      title: "Total Feedbacks",
      value: stats?.feedbacks || 0,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Reviews",
      value: stats?.reviews || 0,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Total Issues",
      value: stats?.issues || 0,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Feature Requests",
      value: stats?.features || 0,
      icon: Lightbulb,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {session?.user?.name || session?.user?.email}
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading statistics...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {stats && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New Feedback</p>
                    <p className="text-xs text-gray-500">{stats.recentFeedbacks || 0} in the last 7 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <Star className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New Reviews</p>
                    <p className="text-xs text-gray-500">{stats.recentReviews || 0} in the last 7 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New Issues</p>
                    <p className="text-xs text-gray-500">{stats.recentIssues || 0} in the last 7 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Lightbulb className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Feature Requests</p>
                    <p className="text-xs text-gray-500">{stats.recentFeatures || 0} in the last 7 days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">New Feature Requests</span>
                  <span className="text-sm font-bold text-purple-600">{stats.pendingFeatures || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Unresolved Issues</span>
                  <span className="text-sm font-bold text-red-600">{stats.unresolvedIssues || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Unpublished Reviews</span>
                  <span className="text-sm font-bold text-yellow-600">{stats.unpublishedReviews || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">New Feedbacks</span>
                  <span className="text-sm font-bold text-blue-600">{stats.newFeedbacks || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
