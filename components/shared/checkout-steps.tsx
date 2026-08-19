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
    <div>
      <div className="hidden md:flex justify-between items-center space-x-2 space-y-2 mb-10">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div
              className={cn(
                "p-2 w-44 border-2 border-muted rounded-md text-center text-sm font-medium",
                index === current ? "bg-primary text-primary-foreground" : "bg-input",
              )}
            >
              {step}
            </div>

            {index !== steps.length - 1 && (
              <hr className="w-16 border-t border-gray-300 mx-2" />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex justify-between items-center md:hidden space-x-2 space-y-2">
        {steps.map((_, index) => (
          <React.Fragment key={index}>
            <div
              className={cn(
                "p-2 w-9 h-9 flex-center rounded-full text-sm font-medium",
                index == current ? "bg-primary text-primary-foreground" : "bg-muted",
              )}
            >
              {index + 1}
            </div>

            {index !== steps.length - 1 && (
              <hr className="w-10 border-t border-gray-300 mx-2" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;
