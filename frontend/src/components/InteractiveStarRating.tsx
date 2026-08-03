import { useState } from "react";
import { Star } from "lucide-react";

interface InteractiveStarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  onRatingChange: (rating: number) => void;
}

const InteractiveStarRating = ({
  rating,
  size = "sm",
  onRatingChange,
}: InteractiveStarRatingProps) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState(rating);

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const handleClick = (star: number) => {
    setSelectedRating(star);
    onRatingChange(star);
  };

  return (
    <div className="flex items-center space-x-1 cursor-pointer">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = hoveredStar !== null ? star <= hoveredStar : star <= selectedRating;
        return (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(null)}
            onClick={() => handleClick(star)}
          />
        );
      })}
    </div>
  );
};

export default InteractiveStarRating;
