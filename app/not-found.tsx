"use client";

import AppImage from "@/components/ui/app-image";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { useRouter } from "next/navigation";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="flex-center flex-col h-screen">
      <AppImage
        src="/images/logo.svg"
        alt={`${APP_NAME} logo`}
        preload
        height={48}
        width={48}
      />
      <div className="flex-center flex-col p-6 w-1/3 rounded-lg shadow-md shadow-accent text-center">
        <h1 className="text-3xl font-bold mb-4">NotFound</h1>
        <p className="text-destructive">Could not find requested page</p>
        <Button
          variant="outline"
          className="mt-4 ml-2"
          onClick={() => router.push("/")}
        >Back Home</Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
