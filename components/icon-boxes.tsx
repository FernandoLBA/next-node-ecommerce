import { DollarSign, Headset, ShoppingBag, WalletCards } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const IconBoxes = () => {
  return (
    <div>
      <Card>
        <CardContent className="grid md:grid-cols-4 gap-4 p-4 text-muted-foreground">
          <div className="space-y-2">
            <ShoppingBag />

            <div className="text-sm font-bold">Envío Gratuito</div>

            <div className="text-sm">En compras mayores a S/. 100</div>
          </div>

          <div className="space-y-2">
            <DollarSign />

            <div className="text-sm font-bold">Garantía de devolución</div>

            <div className="text-sm">De hasta 30 días en tus compras.</div>
          </div>

          <div className="space-y-2">
            <WalletCards />

            <div className="text-sm font-bold">Pagos Flexibles</div>

            <div className="text-sm">Aceptamos pagos con Tarjeta o Yape.</div>
          </div>

          <div className="space-y-2">
            <Headset />

            <div className="text-sm font-bold">Soporte 24/7</div>

            <div className="text-sm">Obten ayuda en cualquier momento</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IconBoxes;
