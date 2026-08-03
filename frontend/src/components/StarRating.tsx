
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  totalRatings: number;
  size?: "sm" | "md" | "lg";
}

const StarRating = ({ rating, totalRatings, size = "sm" }: StarRatingProps) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
        {rating.toFixed(1)} ({totalRatings})
      </span>
    </div>
  );
};

export default StarRating;
