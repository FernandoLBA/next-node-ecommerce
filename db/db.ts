import { neonConfig, PoolConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

import { PrismaClient } from "@/lib/generated/prisma/client"; //* Import the generated Prisma client.

neonConfig.webSocketConstructor = ws; //* Set up the WebSocket constructor for Neon, required for Edge and serverless environments.

//* PostgreSQL connection pool configuration using 'pg'.
//* This allows efficient management of multiple connections and is required for database adapters.
const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
};

//* Initialize the Prisma adapter for PostgreSQL.
//* Adapters allow Prisma to use external drivers (like Neon) to communicate with the database,
//* ensuring compatibility with Edge environments or specific network configurations.
const adapter = new PrismaNeon(poolConfig);

//* Function to initialize a unique Prisma client instance (Singleton pattern).
const prismaClientSingleton = () => {
  return new PrismaClient({ adapter }).$extends({
    result: {
      product: {
        price: {
          //* Convert Decimal values to strings when fetching results.
          //* This avoids serialization errors when passing data from Server Components to Client Components.
          compute(product) {
            return product.price.toString();
          },
        },
        rating: {
          //* Apply the same logic to the rating field for consistency.
          compute(product) {
            return product.rating.toString();
          },
        },
      },
    },
  });
};

//* Extend the TypeScript global object to include the Prisma instance.
//* This prevents TypeScript from throwing errors when accessing globalThis.prisma.
declare global {
  var prisma: PrismaClient | ReturnType<typeof prismaClientSingleton>;
}

//* Retrieve the Prisma instance from the global object.
//* If it doesn't exist (first run), create a new one using the Singleton pattern.
const db = globalThis.prisma ?? prismaClientSingleton();

//* In development, store the instance globally to prevent exhausting database connections.
//* Next.js hot reloading would otherwise create a new Prisma instance on every change.
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

export default db;
