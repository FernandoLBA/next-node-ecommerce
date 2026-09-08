"use client";

import { useSearchParams } from "next/navigation";

import { useRouter } from "@/i18n/routing";
import { formUrlQuery } from "../../lib/utils";
import { AppButton } from "./app-button/app-button";

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (btnType: "previous" | "next") => {
    const pageValue = btnType === "next" ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: pageValue.toString(),
    });

    router.push(newUrl);
  };

  return (
    <div className="flex gap-2 mt-4">
      <AppButton
        size="lg"
        variant="outline"
        className="w-28"
        disabled={Number(page) <= 1}
        onClick={() => handleClick("previous")}
      >
        Previous
      </AppButton>

      <AppButton
        size="lg"
        variant="outline"
        className="w-28"
        disabled={Number(page) >= totalPages}
        onClick={() => handleClick("next")}
      >
        Next
      </AppButton>
    </div>
  );
};

export default Pagination;
