import { format } from "date-fns";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";

function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 bg-primary-900/50 border border-primary-800 rounded-lg">
        <p className="text-primary-400 text-lg">No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-primary-800 pb-8 last:border-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center text-primary-950 font-bold text-xl">
                {review.firstName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-lg text-accent-100">
                  {review.firstName} {review.lastName}
                </p>
                <p className="text-primary-400 text-sm">
                  {format(new Date(review.createdAt), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                i < review.rating ? (
                  <StarIcon key={i} className="h-5 w-5 text-accent-500" />
                ) : (
                  <StarOutlineIcon key={i} className="h-5 w-5 text-primary-600" />
                )
              ))}
            </div>
          </div>
          <p className="text-primary-200 leading-relaxed italic">
            &ldquo;{review.comment}&rdquo;
          </p>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
