"use client"

import { useState, useCallback, type ReactNode } from "react"
import { Star, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Review } from "@/lib/types"

// Re-export Review type for convenience
export type { Review }

/**
 * Props for the ReviewsSection component
 */
export interface ReviewsSectionProps {
  /** Optional id for the section element (for anchor links) */
  id?: string
  /** Array of reviews to display */
  reviews: Review[]
  /** Section heading - defaults to "What Traders Are Saying" */
  heading?: string
  /** Section subheading/description */
  subheading?: string
  /** Additional CSS classes for the section */
  className?: string
  /** Number of reviews to show initially (default: 8) */
  initialCount?: number
  /** Number of reviews to load on each "Load More" click (default: 4) */
  loadMoreCount?: number
  /** Text for the load more button */
  loadMoreText?: string
  /** Text shown while loading */
  loadingText?: string
  /** Simulated loading delay in ms (for demo purposes, default: 800) */
  simulatedDelay?: number
  /** 
   * Optional async function to fetch more reviews
   * If provided, will be called instead of using local data
   * Should return the next batch of reviews
   */
  onLoadMore?: (currentCount: number) => Promise<Review[]>
  /** Total count of reviews (for showing "X of Y reviews") */
  totalCount?: number
  /** Optional content rendered below heading/subheading */
  headerContent?: ReactNode
  /** Optional content rendered after the review count */
  footerContent?: ReactNode
}

/**
 * Star rating component - displays filled/empty stars based on rating
 */
function StarRating({ rating, maxRating = 5 }: { rating: number; maxRating?: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of ${maxRating} stars`}>
      {Array.from({ length: maxRating }, (_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 md:w-5 md:h-5 ${index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
            }`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

/**
 * Individual review card component
 */
function ReviewCard({ review }: { review: Review }) {
  return (
    <article
      className="h-full animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
      itemScope
      itemType="https://schema.org/Review"
    >
      <Card className="h-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-5 md:p-6 flex flex-col h-full">
          {/* Rating */}
          <div className="mb-3" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
            <meta itemProp="ratingValue" content={String(review.rating)} />
            <meta itemProp="bestRating" content="5" />
            <StarRating rating={review.rating} />
          </div>

          {/* Review text */}
          <blockquote className="flex-1 mb-4">
            <p
              className="text-sm md:text-base text-gray-700 leading-relaxed"
              itemProp="reviewBody"
            >
              {review.text}
            </p>
          </blockquote>

          {/* Reviewer name and date */}
          <footer className="mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between gap-2">
              <p
                className="text-sm md:text-base font-semibold text-gray-900"
                itemProp="author"
                itemScope
                itemType="https://schema.org/Person"
              >
                <span itemProp="name">{review.name}</span>
              </p>
              {review.date && (
                <time
                  className="text-xs text-gray-500"
                  itemProp="datePublished"
                  dateTime={review.date}
                >
                  {review.date}
                </time>
              )}
            </div>
            {review.verified && (
              <span className="text-xs text-green-600 font-medium">
                Verified Student
              </span>
            )}
          </footer>
        </CardContent>
      </Card>
    </article>
  )
}

/**
 * Skeleton loader for review cards
 */
function ReviewCardSkeleton() {
  return (
    <div className="h-full animate-pulse">
      <Card className="h-full bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-5 md:p-6 flex flex-col h-full">
          {/* Rating skeleton */}
          <div className="flex gap-1 mb-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="w-4 h-4 md:w-5 md:h-5 bg-gray-200 rounded" />
            ))}
          </div>

          {/* Text skeleton */}
          <div className="flex-1 mb-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>

          {/* Footer skeleton */}
          <div className="mt-auto pt-3 border-t border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-20 mt-1" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * ReviewsSection - A reusable, SEO-friendly reviews section component
 * 
 * Features:
 * - Semantic HTML structure (section, article, blockquote)
 * - Schema.org microdata for SEO
 * - Fully responsive grid layout
 * - Load more functionality with simulated server delay
 * - Accepts reviews via props for easy API integration
 * - Accessible with ARIA labels
 * 
 * @example
 * ```tsx
 * <ReviewsSection
 *   reviews={reviewsData}
 *   heading="What Our Students Say"
 *   subheading="Real feedback from real traders"
 *   initialCount={8}
 *   loadMoreCount={4}
 * />
 * ```
 */
export function ReviewsSection({
  id,
  reviews,
  heading = "What Traders Are Saying",
  subheading,
  className = "",
  initialCount = 8,
  loadMoreCount = 4,
  loadMoreText = "Load More Reviews",
  loadingText = "Loading...",
  simulatedDelay = 800,
  onLoadMore,
  totalCount,
  headerContent,
  footerContent,
}: ReviewsSectionProps) {
  const [displayedCount, setDisplayedCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)
  const [loadedReviews, setLoadedReviews] = useState<Review[]>([])

  // Combine initial reviews with any additionally loaded reviews
  const allReviews = onLoadMore ? [...reviews, ...loadedReviews] : reviews
  const visibleReviews = allReviews.slice(0, displayedCount)
  const effectiveTotalCount = totalCount ?? allReviews.length
  const hasMore = displayedCount < effectiveTotalCount

  const handleLoadMore = useCallback(async () => {
    setIsLoading(true)

    try {
      if (onLoadMore) {
        // Use provided async function for fetching
        const newReviews = await onLoadMore(displayedCount)
        setLoadedReviews((prev) => [...prev, ...newReviews])
        setDisplayedCount((prev) => prev + newReviews.length)
      } else {
        // Simulate server delay for static data
        await new Promise((resolve) => setTimeout(resolve, simulatedDelay))
        setDisplayedCount((prev) => Math.min(prev + loadMoreCount, allReviews.length))
      }
    } catch (error) {
      console.error("Error loading more reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }, [onLoadMore, displayedCount, simulatedDelay, loadMoreCount, allReviews.length])

  if (!reviews || reviews.length === 0) {
    return null
  }

  return (
    <section
      id={id}
      className={`w-full bg-white text-gray-900 py-12 md:py-16 lg:py-20 ${className}`}
      aria-labelledby="reviews-heading"
      itemScope
      itemType="https://schema.org/Product"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        {/* Section Header */}
        <header className="text-center mb-10 md:mb-12 lg:mb-16">
          <h2
            id="reviews-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3"
            itemProp="name"
          >
            {heading}
          </h2>
          {subheading && (
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-3">
              {subheading}
            </p>
          )}
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full" />
          {headerContent && <div className="mt-6">{headerContent}</div>}
        </header>

        {/* Reviews Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          itemProp="review"
        >
          {visibleReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}

          {/* Skeleton loaders while loading */}
          {isLoading &&
            Array.from({ length: loadMoreCount }, (_, i) => (
              <ReviewCardSkeleton key={`skeleton-${i}`} />
            ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-8 md:mt-12 flex flex-col items-center gap-3">
            <Button
              onClick={handleLoadMore}
              disabled={isLoading}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto min-w-[200px] bg-white hover:bg-gray-50 border-2 border-blue-600 text-blue-600 hover:text-blue-700 font-semibold px-8 py-6 text-base md:text-lg transition-all duration-200"
              aria-label={isLoading ? loadingText : `${loadMoreText}. Showing ${visibleReviews.length} of ${effectiveTotalCount} reviews`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                  {loadingText}
                </>
              ) : (
                loadMoreText
              )}
            </Button>

            {/* Review count indicator */}
            <p className="text-sm text-gray-500">
              Showing {visibleReviews.length} of {effectiveTotalCount} reviews
            </p>
            {footerContent && <div className="w-full mt-4">{footerContent}</div>}
          </div>
        )}

        {/* All loaded message */}
        {!hasMore && (
          <div className="mt-8 flex flex-col items-center gap-4">
            {visibleReviews.length > initialCount && (
              <p className="text-center text-sm text-gray-500">
                You've seen all {effectiveTotalCount} reviews
              </p>
            )}
            {footerContent && <div className="w-full">{footerContent}</div>}
          </div>
        )}
      </div>
    </section>
  )
}

export default ReviewsSection
