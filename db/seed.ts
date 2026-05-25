import db from "@/db/db";
import sampleData from "./sample-data";

async function main() {
  await db.product.deleteMany();
  await db.product.createMany({
    data: sampleData.products,
  });

  console.log("🌱 Database has been seeded.");
}

main();
