"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { createReview } from "@/app/_lib/data-service-shared";
import { useRouter } from "next/navigation";
import SpinnerMini from "@/app/_components/SpinnerMini";

function ReviewForm({ roomId, hotelId, accessToken }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (comment.length < 10) {
      setError("Comment must be at least 10 characters long.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createReview({ roomId, hotelId, rating, comment }, accessToken);
      setRating(0);
      setComment("");
      router.refresh(); // To refresh the server component with new reviews
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-primary-900 py-8 px-10 border border-primary-800 rounded-lg">
      <h3 className="text-2xl font-semibold mb-6 text-accent-100">Leave a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-primary-300 mb-2">Rating</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                {(hoverRating || rating) >= star ? (
                  <StarIcon className="h-8 w-8 text-accent-500" />
                ) : (
                  <StarOutlineIcon className="h-8 w-8 text-primary-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="block text-primary-300 mb-2">
            Your Comment
          </label>
          <textarea
            id="comment"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-primary-950 border border-primary-800 rounded-lg py-3 px-4 text-primary-100 focus:outline-none focus:border-accent-500 transition-colors"
            placeholder="Share your experience in this room..."
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          disabled={isSubmitting}
          className="bg-accent-500 px-8 py-3 text-primary-950 font-semibold rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
        >
          {isSubmitting ? (
            <>
              <SpinnerMini /> Submitting...
            </>
          ) : (
            "Post Review"
          )}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;
