"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { useNavigate } from "react-router-dom"
import { Star, Trash2 } from "lucide-react"
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

  const deleteReviewMutation = useMutation((reviewId) => productsAPI.deleteReview(productId, reviewId), {
    onSuccess: () => {
      toast.success("Review deleted successfully!")
      queryClient.invalidateQueries(["product", productId])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete review")
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
        <Star className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-slate-500"}`} />
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
        <h3 className="text-base sm:text-lg font-semibold text-white">Customer Reviews ({reviews.length})</h3>
        {isAuthenticated && !showReviewForm && (
          <button onClick={() => setShowReviewForm(true)} className="btn-primary text-xs sm:text-sm py-1.5 px-3">
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-5 mb-6">
          <h4 className="text-base font-semibold text-white mb-3">Write Your Review</h4>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-3">
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">Rating</label>
              <div className="flex items-center space-x-1">
                {renderStars(reviewData.rating, true, (rating) => setReviewData({ ...reviewData, rating }))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">Your Review</label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 text-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-slate-400"
                placeholder="Share your thoughts about this product..."
                required
              />
            </div>

            <div className="flex space-x-3">
              <button type="submit" disabled={addReviewMutation.isLoading} className="btn-primary text-xs sm:text-sm py-1.5 px-3 disabled:opacity-50">
                {addReviewMutation.isLoading ? "Submitting..." : "Submit Review"}
              </button>
              <button type="button" onClick={() => setShowReviewForm(false)} className="btn-secondary text-xs sm:text-sm py-1.5 px-3">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xs sm:text-sm text-slate-450">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const isOwner = user && (review.user === user._id || review.user?._id === user._id);
            const isAdmin = user && user.role === "admin";
            const initials = review.name ? review.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "U";
            
            return (
              <div key={review._id} className="bg-slate-700/40 p-5 rounded-2xl border border-slate-600 shadow-sm transition-all hover:border-slate-500 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {/* Initials Avatar */}
                    <div className="w-8 h-8 rounded-full bg-yellow-500/15 border border-yellow-400/20 text-yellow-400 font-bold flex items-center justify-center shrink-0 mr-3 text-xs shadow-sm">
                      {initials}
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-xs sm:text-sm leading-tight">{review.name}</h5>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="flex items-center space-x-0.5">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-[10px] text-slate-500">•</span>
                        <span className="text-[10px] text-slate-400">{formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  {(isOwner || isAdmin) && (
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete your review?")) {
                          deleteReviewMutation.mutate(review._id);
                        }
                      }}
                      disabled={deleteReviewMutation.isLoading}
                      className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-slate-600/80 transition-colors shrink-0"
                      title="Delete Review"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed whitespace-pre-line pl-11">
                  {review.comment}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {!isAuthenticated && (
        <div className="text-center py-8 bg-slate-700 border border-slate-600 rounded-lg">
          <p className="text-xs sm:text-sm text-slate-300 mb-3">Please log in to write a review</p>
          <button onClick={() => navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)} className="btn-primary text-xs sm:text-sm py-1.5 px-3">
            Log In
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductReviews
