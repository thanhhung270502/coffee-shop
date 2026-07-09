import { hash } from "bcryptjs";

import { PrismaClient, ProductType, Role } from "../src/generated/prisma";

const prisma = new PrismaClient();

const DEV_PASSWORD = "Password123!";
const SALT_ROUNDS = 12;

async function seedUsers() {
  const passwordHash = await hash(DEV_PASSWORD, SALT_ROUNDS);

  await prisma.user.upsert({
    where: { email: "admin@coffee.local" },
    update: {
      name: "Admin",
      role: Role.ADMIN,
      isActive: true,
      passwordHash,
    },
    create: {
      email: "admin@coffee.local",
      name: "Admin",
      role: Role.ADMIN,
      passwordHash,
    },
  });

  await prisma.user.upsert({
    where: { email: "staff@coffee.local" },
    update: {
      name: "Staff",
      role: Role.STAFF,
      isActive: true,
      passwordHash,
    },
    create: {
      email: "staff@coffee.local",
      name: "Staff",
      role: Role.STAFF,
      passwordHash,
    },
  });
}

async function seedCategories() {
  const categories = [
    { name: "Coffee", slug: "ca-phe", type: ProductType.DRINK, sortOrder: 1 },
    { name: "Tea", slug: "tra", type: ProductType.DRINK, sortOrder: 2 },
    { name: "Coffee Beans", slug: "hat-ca-phe", type: ProductType.PACKAGED, sortOrder: 1 },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }
}

async function seedToppings() {
  const toppings = [
    { name: "Boba Pearls", price: 5000 },
    { name: "Cream Cheese", price: 8000 },
  ];

  for (const topping of toppings) {
    const existing = await prisma.topping.findFirst({ where: { name: topping.name } });
    if (existing) {
      await prisma.topping.update({
        where: { id: existing.id },
        data: topping,
      });
    } else {
      await prisma.topping.create({ data: topping });
    }
  }
}

async function seedDrinks() {
  const coffeeCategory = await prisma.category.findUniqueOrThrow({ where: { slug: "ca-phe" } });
  const teaCategory = await prisma.category.findUniqueOrThrow({ where: { slug: "tra" } });

  const drinks = [
    {
      name: "Vietnamese Iced Coffee",
      slug: "ca-phe-sua-da",
      categoryId: coffeeCategory.id,
      description: "Traditional phin coffee with condensed milk",
      variants: [
        { name: "S", price: 25000 },
        { name: "M", price: 30000 },
        { name: "L", price: 35000 },
      ],
      toppingNames: ["Boba Pearls", "Cream Cheese"],
    },
    {
      name: "Bac Xiu",
      slug: "bac-xiu",
      categoryId: coffeeCategory.id,
      description: "More milk, less coffee",
      variants: [
        { name: "S", price: 28000 },
        { name: "M", price: 33000 },
        { name: "L", price: 38000 },
      ],
      toppingNames: ["Boba Pearls"],
    },
    {
      name: "Boba Milk Tea",
      slug: "tra-sua-tran-chau",
      categoryId: teaCategory.id,
      description: "Taiwanese-style milk tea",
      variants: [
        { name: "M", price: 35000 },
        { name: "L", price: 40000 },
      ],
      toppingNames: ["Boba Pearls", "Cream Cheese"],
    },
  ];

  for (const drink of drinks) {
    const product = await prisma.product.upsert({
      where: { slug: drink.slug },
      update: {
        name: drink.name,
        type: ProductType.DRINK,
        description: drink.description,
        categoryId: drink.categoryId,
        isActive: true,
      },
      create: {
        name: drink.name,
        slug: drink.slug,
        type: ProductType.DRINK,
        description: drink.description,
        categoryId: drink.categoryId,
      },
    });

    await prisma.productVariant.deleteMany({ where: { productId: product.id } });
    await prisma.productVariant.createMany({
      data: drink.variants.map((variant) => ({
        productId: product.id,
        name: variant.name,
        price: variant.price,
      })),
    });

    await prisma.productTopping.deleteMany({ where: { productId: product.id } });
    for (const toppingName of drink.toppingNames) {
      const topping = await prisma.topping.findFirstOrThrow({ where: { name: toppingName } });
      await prisma.productTopping.create({
        data: { productId: product.id, toppingId: topping.id },
      });
    }
  }
}

async function seedPackagedProducts() {
  const packagedCategory = await prisma.category.findUniqueOrThrow({ where: { slug: "hat-ca-phe" } });

  const products = [
    {
      name: "Ground Arabica Coffee",
      slug: "ca-phe-arabica-rang-xay",
      description: "Medium-roast Arabica beans",
      skus: [
        { label: "250g", sku: "ARA-250", price: 120000, stock: 20 },
        { label: "500g", sku: "ARA-500", price: 220000, stock: 10 },
      ],
    },
    {
      name: "Ground Robusta Coffee",
      slug: "ca-phe-robusta-rang-xay",
      description: "Bold Robusta beans",
      skus: [
        { label: "250g", sku: "ROB-250", price: 90000, stock: 15 },
        { label: "500g", sku: "ROB-500", price: 170000, stock: 8 },
      ],
    },
  ];

  for (const item of products) {
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        type: ProductType.PACKAGED,
        description: item.description,
        categoryId: packagedCategory.id,
        isActive: true,
      },
      create: {
        name: item.name,
        slug: item.slug,
        type: ProductType.PACKAGED,
        description: item.description,
        categoryId: packagedCategory.id,
      },
    });

    await prisma.productSku.deleteMany({ where: { productId: product.id } });
    await prisma.productSku.createMany({
      data: item.skus.map((sku) => ({
        productId: product.id,
        label: sku.label,
        sku: sku.sku,
        price: sku.price,
        stock: sku.stock,
      })),
    });
  }
}

async function main() {
  await seedUsers();
  await seedCategories();
  await seedToppings();
  await seedDrinks();
  await seedPackagedProducts();
  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
