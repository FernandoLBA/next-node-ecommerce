"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoaderIcon from "@/components/ui/loader-icon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createUpdateReview,
  getReviewByProductId,
} from "@/lib/actions/review.actions";
import { RATING_REVIEW, reviewFormDefaultValues } from "@/lib/constants";
import { insertReviewsSchema } from "@/lib/validators";

type ReviewFormProps = {
  userId: string;
  productId: string;
  onReviewSubmitted: () => void;
};

const ReviewForm = ({
  productId,
  userId,
  onReviewSubmitted,
}: ReviewFormProps) => {
  const [open, setOpen] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const textReview = alreadyReviewed ? "Update review" : "Write a review";

  const form = useForm<z.input<typeof insertReviewsSchema>>({
    resolver: zodResolver(insertReviewsSchema),
    defaultValues: reviewFormDefaultValues,
  });

  const isSubmitting = form.formState.isSubmitting;

  /**
   * Open form handler
   */
  const handleOpenForm = async () => {
    form.setValue("userId", userId);
    form.setValue("productId", productId);

    const review = await getReviewByProductId({ productId });

    if (review) {
      setAlreadyReviewed(true);
      form.setValue("title", review.title);
      form.setValue("description", review.description);
      form.setValue("rating", review.rating);
    }

    setOpen(true);
  };

  /**
   * Submit form handler
   *
   * @param values
   * @returns
   */
  const onSubmit: SubmitHandler<z.infer<typeof insertReviewsSchema>> = async (
    values,
  ) => {
    const res = await createUpdateReview({ ...values, productId });

    if (!res.success) {
      return toast.error(res.message);
    }

    setOpen(false);

    onReviewSubmitted();

    toast.success(res.message);

    return;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={handleOpenForm}>{textReview}</Button>

      <DialogContent className="sm:max-w-[425px">
        <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{textReview}</DialogTitle>

            <DialogDescription>
              Share your thoughts with other curstomers
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input
                      {...field}
                      id="title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Insert the title"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                      {...field}
                      id="description"
                      aria-invalid={fieldState.invalid}
                      placeholder="Insert the description"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="rating"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="rating">Rating</FieldLabel>
                    <Select
                      items={RATING_REVIEW.map((rate) => ({
                        label: `${rate}`,
                        value: rate,
                      }))}
                      onValueChange={field.onChange}
                      value={String(field.value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {RATING_REVIEW.map((rate) => (
                            <SelectItem key={rate} value={rate}>
                              {`${rate}`}{" "}
                              {Array.from({ length: rate }).map((_, index) => (
                                <StarIcon
                                  key={index}
                                  className="inline h-4 w-4"
                                  color="#ecc70c"
                                  fill="#ecc70c"
                                />
                              ))}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderIcon />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
