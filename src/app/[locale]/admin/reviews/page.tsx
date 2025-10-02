"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

async function fetchReviews() {
  const response = await fetch("/api/admin/reviews")
  if (!response.ok) throw new Error("Failed to fetch reviews")
  return response.json()
}

async function togglePublish(id: string, isPublished: boolean) {
  const response = await fetch(`/api/admin/reviews/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPublished }),
  })
  if (!response.ok) throw new Error("Failed to update review")
  return response.json()
}

export default function ReviewsPage() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<"all" | "published" | "unpublished">("all")

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: fetchReviews,
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      togglePublish(id, isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] })
    },
  })

  const filteredReviews = reviews?.data?.filter((review: any) => {
    if (filter === "published") return review.isPublished
    if (filter === "unpublished") return !review.isPublished
    return true
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Reviews</h1>
          <p className="text-gray-600 mt-2">Manage customer reviews</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "published" ? "default" : "outline"}
            onClick={() => setFilter("published")}
          >
            Published
          </Button>
          <Button
            variant={filter === "unpublished" ? "default" : "outline"}
            onClick={() => setFilter("unpublished")}
          >
            Unpublished
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading reviews...</div>
      ) : filteredReviews?.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No reviews found</div>
      ) : (
        <div className="space-y-4">
          {filteredReviews?.map((review: any) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{review.rating}/5</span>
                    </div>
                    <CardTitle className="text-lg">{review.name || "Anonymous"}</CardTitle>
                    <CardDescription>{review.email}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={review.isPublished ? "default" : "secondary"}>
                      {review.isPublished ? "Published" : "Unpublished"}
                    </Badge>
                    {review.consentForMarketing && (
                      <Badge variant="outline">Marketing OK</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">{review.content}</p>

                {review.socialMediaProfile && (
                  <p className="text-xs text-gray-500 mb-4">
                    Social: {review.socialMediaProfile}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    <p>Project: {review.project?.name}</p>
                    <p>
                      Submitted: {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <Button
                    variant={review.isPublished ? "outline" : "default"}
                    onClick={() =>
                      toggleMutation.mutate({
                        id: review.id,
                        isPublished: !review.isPublished,
                      })
                    }
                    disabled={toggleMutation.isPending}
                  >
                    {review.isPublished ? "Unpublish" : "Publish"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
