"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { SalesData } from "@/types";

type ChartsProps = {
  data: {
    salesData: SalesData;
  };
};

const Charts = ({ data: { salesData } }: ChartsProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
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
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Bar dataKey="totalSales" fill="#FECA29" radius={[4, 4, 0, 0]} />
        </BarChart>
      ) : (
        <div className="w-30">
          <p>No orders found</p>
        </div>
      )}
    </ResponsiveContainer>
  );
};

export default Charts;
