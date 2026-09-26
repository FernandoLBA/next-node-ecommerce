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
  await prisma.category.createMany({ data: sampleData.categories });

  const categories = await prisma.category.findMany();
  const categoryIdByName = new Map(categories.map((c) => [c.name, c.id]));

  await prisma.product.createMany({
    data: sampleData.products.map((product) => {
      const { category, ...productData } = product;
      const categoryId = categoryIdByName.get(category);

      if (!categoryId)
        throw new Error(`Category not found for product: ${product.name}`);

      return { ...productData, categoryId };
    }),
  });
  await prisma.user.createMany({ data: sampleData.users });

  console.info("🌱 Database has been seeded.");
}

main();
