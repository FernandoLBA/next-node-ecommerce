"use client";

import { Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";

import { AppLink } from "@/components/shared/app-link/app-link";
import Rating from "@/components/shared/products/rating";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getReviews } from "@/lib/actions/review.actions";
import { appRoutes } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import { Review } from "@/types";
import ReviewForm from "./review-form";

type ReviewListProps = {
  userId: string;
  productId: string;
  productSlug: string;
};

const ReviewList = ({ userId, productId, productSlug }: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
      const res = await getReviews({ productId });

      setReviews(res.data as Review[]);
    };

    loadReviews();
  }, [productId, userId]);

  /**
   * Reloads reviews after created or updated
   */
  const reload = async () => {
    const res = await getReviews({ productId });
    setReviews(res.data as Review[]);
  };

  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div>No reviews yet...</div>}

      {userId ? (
        <ReviewForm
          productId={productId}
          userId={userId}
          onReviewSubmitted={reload}
        />
      ) : (
        <div>
          Please{" "}
          <AppLink
            href={`${appRoutes.SIGN_IN}?callbackUrl=${appRoutes.PRODUCTS}/${productSlug}`}
            isUnderlined
            className="hover:text-accent-foreground!"
          >
            Sign in
          </AppLink>{" "}
          to write a review
        </div>
      )}

      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <Card className="rounded-md" key={review.id}>
            <CardHeader>
              <CardTitle>{review.title}</CardTitle>

              <CardDescription>{review.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex justify-between sm:justify-start space-x-4 text-sm text-muted-foreground">
                {/* RATING */}
                <Rating value={review.rating} />

                <div className="flex-center text-xs md:text-sm">
                  <User className="mr-1 h-3 w-3" />
                  {review.user ? review.user.name : "User"}
                </div>

                {/* SHOWS ON BIG SCREENS */}
                <div className="hidden sm:flex sm:items-center text-sm">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDateTime(review.createdAt).dateTime}
                </div>

                {/* SHOWS ON SMALL SCREENS */}
                <div className="flex-center sm:hidden! text-xs">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDateTime(review.createdAt).dateOnly}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
