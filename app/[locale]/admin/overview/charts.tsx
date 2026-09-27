"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { formatCurrency } from "@/lib/utils";
import { SalesData } from "@/types";
import { useTranslations } from "next-intl";

type ChartsProps = {
  data: {
    salesData: SalesData;
  };
};

const Charts = ({ data: { salesData } }: ChartsProps) => {
  const t = useTranslations("AdminPages");

  //? min-w-0 lets this container shrink below the chart's intrinsic width
  //? instead of overflowing its parent (a flex/grid item) on narrow screens
  return (
    <div className="min-w-0 w-full">
      <ResponsiveContainer width="100%" height={300}>
        {salesData.length >= 1 ? (
          <BarChart data={salesData}>
            <XAxis
              dataKey="month"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              width={80}
              tick={({ y, payload }) => (
                <g transform={`translate(${0},${y})`}>
                  <text
                    fontSize={13}
                    x={0}
                    y={2}
                    textAnchor="start"
                    fill="#888888"
                  >
                    {formatCurrency(payload.value)}
                  </text>
                </g>
              )}
            />

            <Bar dataKey="totalSales" fill="#FECA29" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-center text-muted-foreground">
            <p>{t("overview.graph.emptyOrdersText")}</p>
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;
