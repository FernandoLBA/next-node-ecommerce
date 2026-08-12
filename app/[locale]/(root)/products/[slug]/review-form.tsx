"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { StarIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
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
import { reviewFormDefaultValues } from "@/lib/constants";
import { insertReviewsSchema } from "@/lib/validators";

const RATINGS = [1, 2, 3, 4, 5];

type ReviewFormProps = {
  userId: string;
  productId: string;
  productSlug: string;
};

const ReviewForm = ({ productId, productSlug, userId }: ReviewFormProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.input<typeof insertReviewsSchema>>({
    resolver: zodResolver(insertReviewsSchema),
    defaultValues: {
      ...reviewFormDefaultValues,
      productId,
      userId,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleOpenForm = () => {
    setOpen(true);
  };

  const onSubmit: SubmitHandler<typeof reviewFormDefaultValues> = async (
    values: typeof reviewFormDefaultValues,
  ) => {
    console.log("🚀 ~ onSubmit ~ values:", [values]);

    return;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={handleOpenForm}>Write a review</Button>

      <DialogContent className="sm:max-w-[425px">
        <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>

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
                      items={RATINGS.map((rate) => ({
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
                          {RATINGS.map((rate) => (
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
