import { getLocale } from "next-intl/server";
import React from "react";

import { cn } from "@/lib/utils";

const CheckoutSteps = async ({ current = 0 }) => {
  const locale = await getLocale();

  const steps =
    locale === "en"
      ? ["User Login", "Shipping Address", "Payment Method", "Place Order"]
      : [
          "Inicio de sesión",
          "Dirección de envío",
          "Método de pago",
          "Crear orden",
        ];

  return (
    <div className="flex-between flex-col md:flex-row space-x-2 space-y-2 mb-10">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              "p-2 w-44 border-2 border-muted rounded-md text-center text-sm md:text-md",
              index === current ? "bg-primary" : "bg-input",
            )}
          >
            {step}
          </div>
          {step !== "Place Order" && (
            <hr className="w-16 border-t border-gray-300 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
