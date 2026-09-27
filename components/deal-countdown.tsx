"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { appRoutes } from "@/lib/constants";
import { AppLinkButton } from "./shared/app-link-button/app-link-button";
import AppImage from "./ui/app-image";
import { Card } from "./ui/card";

//? Static target date (replace with desired date)
const TARGET_DATE = new Date("2027-08-18T01:13:00");

//? Function to calculate the time remaining
const calculateTimeRemaining = (targetDate: Date) => {
  const currentTime = new Date();
  const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0);

  return {
    days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    ),
    minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
  };
};

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <li className="p-4 w-full text-center">
    <p className="text-3xl font-bold">{value.toString()}</p>

    <p>{label}</p>
  </li>
);

const DealCountdown = () => {
  const t = useTranslations("DealCountdown");
  const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>(
    () => {
      return calculateTimeRemaining(TARGET_DATE);
    },
  );

  useEffect(() => {
    const timeInterval = setInterval(() => {
      const newTime = calculateTimeRemaining(TARGET_DATE);

      setTime(newTime);

      if (
        newTime.days === 0 &&
        newTime.hours === 0 &&
        newTime.minutes === 0 &&
        newTime.seconds === 0
      ) {
        clearInterval(timeInterval);
      }
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  if (!time) {
    <section className="grid grid-cols-1 md:grid-cols-2 my-20">
      <div className="flex flex-col gap-2 justify-center">
        <h3 className="text-3xl font-bold">{t("loading")}</h3>
      </div>
    </section>;
  }

  if (
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0
  ) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 my-20 text-primary">
        <div className="flex justify-center">
          <AppImage
            src={`${appRoutes.IMAGES}/promo.jpg`}
            alt={t("promotion")}
            width={300}
            height={200}
          />
        </div>

        <div className="flex flex-col gap-4 justify-center items-start">
          <h3 className="text-3xl font-bold">{t("ended")} :/</h3>

          <p>{t("endedDescription")}</p>

          <div className="text-center">
            <AppLinkButton href={appRoutes.SEARCH}>
              {t("viewProducts")}
            </AppLinkButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <Card className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 bg-gray-950 p-4 text-primary">
        <div className="flex-center w-full md:w-fit">
          <AppImage
            className="w-full h-auto md:w-auto"
            src={`${appRoutes.IMAGES}/promo.jpg`}
            alt={t("promotion")}
            width={300}
            height={200}
          />
        </div>

        <div className="flex flex-col gap-4 justify-center items-start">
          <h3 className="text-3xl font-bold mt-8 md:mt-0">{t("title")}</h3>

          <p>{t("description")}</p>

          <ul className="grid grid-cols-4 bg-primary w-full rounded-md text-accent-foreground">
            <StatBox label={t("days")} value={time.days} />
            <StatBox label={t("hours")} value={time.hours} />
            <StatBox label={t("minutes")} value={time.minutes} />
            <StatBox label={t("seconds")} value={time.seconds} />
          </ul>

          <div className="text-center w-full md:w-fit">
            <AppLinkButton
              className="w-full text-accent-foreground"
              href={appRoutes.SEARCH}
            >
              {t("viewProducts")}
            </AppLinkButton>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default DealCountdown;
