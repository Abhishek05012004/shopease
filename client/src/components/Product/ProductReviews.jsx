"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { useNavigate } from "react-router-dom"
import { Star } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { productsAPI } from "../../services/api"
import toast from "react-hot-toast"

const ProductReviews = ({ productId, reviews = [] }) => {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
  })

  const { user, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const addReviewMutation = useMutation((data) => productsAPI.addReview(productId, data), {
    onSuccess: () => {
      toast.success("Review added successfully!")
      setShowReviewForm(false)
      setReviewData({ rating: 5, comment: "" })
      queryClient.invalidateQueries(["product", productId])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add review")
    },
  })

  const handleSubmitReview = (e) => {
    e.preventDefault()
    if (!reviewData.comment.trim()) {
      toast.error("Please write a review comment")
      return
    }
    addReviewMutation.mutate(reviewData)
  }

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type={interactive ? "button" : undefined}
        onClick={interactive ? () => onRatingChange?.(i + 1) : undefined}
        className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
      >
        <Star className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-current" : "text-slate-500"}`} />
      </button>
    ))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Customer Reviews ({reviews.length})</h3>
        {isAuthenticated && !showReviewForm && (
          <button onClick={() => setShowReviewForm(true)} className="btn-primary">
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-6 mb-8">
          <h4 className="text-lg font-semibold text-white mb-4">Write Your Review</h4>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Rating</label>
              <div className="flex items-center space-x-1">
                {renderStars(reviewData.rating, true, (rating) => setReviewData({ ...reviewData, rating }))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Your Review</label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-slate-400"
                placeholder="Share your thoughts about this product..."
                required
              />
            </div>

            <div className="flex space-x-4">
              <button type="submit" disabled={addReviewMutation.isLoading} className="btn-primary disabled:opacity-50">
                {addReviewMutation.isLoading ? "Submitting..." : "Submit Review"}
              </button>
              <button type="button" onClick={() => setShowReviewForm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-400">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-slate-700 pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h5 className="font-semibold text-white">{review.name}</h5>
                  <div className="flex items-center mt-1">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-sm text-slate-400">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {!isAuthenticated && (
        <div className="text-center py-8 bg-slate-700 border border-slate-600 rounded-lg">
          <p className="text-slate-300 mb-4">Please log in to write a review</p>
          <button onClick={() => navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)} className="btn-primary">
            Log In
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductReviews
