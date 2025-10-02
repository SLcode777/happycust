"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";

interface Review {
  id: string;
  rating: number;
  content: string;
  name?: string | null;
  socialMediaProfile?: string | null;
  createdAt: string;
}

interface ReviewsWidgetProps {
  projectId: string;
  layout?: "grid" | "carousel" | "list";
  limit?: number;
  className?: string;
  apiUrl?: string; // URL of HappyCust server
}

export function ReviewsWidget({
  projectId,
  layout = "grid",
  limit,
  className = "",
  apiUrl = "http://localhost:3000",
}: ReviewsWidgetProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const url = new URL("/api/public/reviews", apiUrl);
        url.searchParams.set("projectId", projectId);
        if (limit) url.searchParams.set("limit", limit.toString());

        const response = await fetch(url.toString());
        const data = await response.json();

        if (data.success) {
          setReviews(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [projectId, limit, apiUrl]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-pulse text-gray-500">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 p-4 ${className}`}>Error: {error}</div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={`text-gray-500 p-4 ${className}`}>No reviews yet.</div>
    );
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const ReviewCard = ({ review }: { review: Review }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        {renderStars(review.rating)}
        <span className="text-sm text-gray-500">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>
      <div className="flex items-center justify-between">
        <div>
          {review.name && (
            <p className="font-semibold text-gray-900">{review.name}</p>
          )}
        </div>
        {review.socialMediaProfile && (
          <a
            href={review.socialMediaProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            View Profile
          </a>
        )}
      </div>
    </div>
  );

  if (layout === "grid") {
    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
      >
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    );
  }

  if (layout === "list") {
    return (
      <div className={`space-y-4 ${className}`}>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    );
  }

  if (layout === "carousel") {
    const nextReview = () => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    };

    const prevReview = () => {
      setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    return (
      <div className={`relative ${className}`}>
        <div className="overflow-hidden">
          <ReviewCard review={reviews[currentIndex]} />
        </div>
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={prevReview}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            aria-label="Previous review"
          >
            ←
          </button>
          <span className="text-sm text-gray-600">
            {currentIndex + 1} / {reviews.length}
          </span>
          <button
            onClick={nextReview}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            aria-label="Next review"
          >
            →
          </button>
        </div>
      </div>
    );
  }

  return null;
}
