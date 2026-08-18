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

  return (
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
            // tickFormatter={(value) => `${formatCurrency(value)}`}
            tick={({ x, y, payload }) => (
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
        <div className="w-40">
          <p>{t("overview.graph.emptyOrdersText")}</p>
        </div>
      )}
    </ResponsiveContainer>
  );
};

export default Charts;
