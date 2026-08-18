import prisma from "@/db/db";
import sampleData from "./sample-data";

async function main() {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.appSetting.deleteMany();

  await prisma.appSetting.createMany({ data: sampleData.appSettings });
  await prisma.product.createMany({ data: sampleData.products });
  await prisma.category.createMany({ data: sampleData.categories });
  await prisma.user.createMany({ data: sampleData.users });

  console.info("🌱 Database has been seeded.");
}

main();
