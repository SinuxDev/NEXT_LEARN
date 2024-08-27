"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

type StarsProps = {
  rating: number;
  totalReviews?: number;
  size?: number;
};

export default function Stars({ rating, totalReviews, size = 14 }: StarsProps) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "text-primary bg-transparent transition-all duration-300 ease-in-out",
            rating >= star ? "fill-primary" : "fill-muted"
          )}
          size={size}
        />
      ))}
      <span className="text-secondary-foreground font-bold text-sm ml-2">
        {totalReviews}
      </span>
    </div>
  );
}
