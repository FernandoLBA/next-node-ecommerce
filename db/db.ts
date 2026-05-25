import { neonConfig, PoolConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

import { PrismaClient } from "../lib/generated/prisma/client"; // Importa el cliente de Prisma generado.

neonConfig.webSocketConstructor = ws;

// Configuración del pool de conexiones de PostgreSQL usando el paquete 'pg'.
// Esto permite gestionar múltiples conexiones de forma eficiente y es necesario para usar adaptadores.
const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
};

// Crea un adaptador de Prisma para PostgreSQL.
// Los adaptadores permiten que Prisma use controladores externos (como pg) para comunicarse
// con la base de datos. Esto es útil para compatibilidad con entornos Edge o configuraciones específicas de red.
const adapter = new PrismaNeon(poolConfig);

// Función que inicializa la instancia única del cliente de Prisma (Patrón Singleton).
const prismaClientSingleton = () => {
  return new PrismaClient({ adapter }).$extends({
    result: {
      product: {
        price: {
          // Convierte el valor de tipo Decimal a String al recuperar los resultados.
          // Esto evita errores de serialización al pasar datos desde el servidor a componentes del cliente.
          compute(product) {
            return product.price.toString();
          },
        },
        rating: {
          // Se aplica la misma lógica para el campo rating para mantener consistencia.
          compute(product) {
            return product.rating.toString();
          },
        },
      },
    },
  });
};

// Extendemos el objeto global de TypeScript para registrar la instancia de Prisma.
// Esto es necesario para que TypeScript no genere errores al intentar acceder a globalThis.prisma.
declare global {
  var prisma: PrismaClient | ReturnType<typeof prismaClientSingleton>;
}

// Intentamos obtener la instancia de Prisma del objeto global.
// Si no existe (es la primera vez que se ejecuta), creamos una nueva usando el patrón Singleton.
const db = globalThis.prisma ?? prismaClientSingleton();

// Si no estamos en producción, guardamos la instancia en el objeto global.
// En desarrollo, Next.js recarga los archivos con cada cambio; sin esto, Prisma
// crearía una nueva conexión en cada recarga, saturando rápidamente la base de datos.
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

export default db;
