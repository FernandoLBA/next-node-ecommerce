"use client";

import { useState } from "react";

import { Link } from "@/i18n/routing";
import { appRoutes } from "@/lib/constants";
import { Review } from "@/types";
import ReviewForm from "./review-form";

type ReviewListProps = {
  userId: string;
  productId: string;
  productSlug: string;
};

const ReviewList = ({ userId, productId, productSlug }: ReviewListProps) => {
  const [revies, setReviews] = useState<Review[]>([]);

  return (
    <div className="space-y-4">
      {revies.length === 0 && <div>No reviews yet...</div>}

      {userId ? (
        <ReviewForm
          productId={productId}
          productSlug={productSlug}
          userId={userId}
        />
      ) : (
        <div>
          Please
          <Link
            className="text-blue-700 px-2"
            href={`${appRoutes.SIGN_IN}?callbackUrl=${appRoutes.PRODUCTS}/${productSlug}`}
          >
            Sign in
          </Link>
          to write a review
        </div>
      )}

      <div className="flex flex-col gap-3">{/* REVIEWS HERE */}</div>
    </div>
  );
};

export default ReviewList;
