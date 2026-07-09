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
    {
      name: "Espresso",
      slug: "espresso",
      categoryId: coffeeCategory.id,
      description: "Single shot espresso",
      variants: [{ name: "S", price: 20000 }],
      toppingNames: [],
    },
    {
      name: "Americano",
      slug: "americano",
      categoryId: coffeeCategory.id,
      description: "Espresso with hot water",
      variants: [
        { name: "M", price: 28000 },
        { name: "L", price: 32000 },
      ],
      toppingNames: [],
    },
    {
      name: "Cappuccino",
      slug: "cappuccino",
      categoryId: coffeeCategory.id,
      description: "Espresso with steamed milk foam",
      variants: [
        { name: "M", price: 35000 },
        { name: "L", price: 40000 },
      ],
      toppingNames: ["Cream Cheese"],
    },
    {
      name: "Latte",
      slug: "latte",
      categoryId: coffeeCategory.id,
      description: "Espresso with steamed milk",
      variants: [
        { name: "M", price: 38000 },
        { name: "L", price: 43000 },
      ],
      toppingNames: ["Cream Cheese"],
    },
    {
      name: "Matcha Latte",
      slug: "matcha-latte",
      categoryId: teaCategory.id,
      description: "Japanese matcha with milk",
      variants: [
        { name: "M", price: 40000 },
        { name: "L", price: 45000 },
      ],
      toppingNames: ["Boba Pearls"],
    },
    {
      name: "Peach Tea",
      slug: "tra-dao",
      categoryId: teaCategory.id,
      description: "Refreshing peach iced tea",
      variants: [
        { name: "M", price: 30000 },
        { name: "L", price: 35000 },
      ],
      toppingNames: ["Boba Pearls"],
    },
    {
      name: "Lemon Tea",
      slug: "tra-chanh",
      categoryId: teaCategory.id,
      description: "Vietnamese lemon tea",
      variants: [
        { name: "M", price: 25000 },
        { name: "L", price: 30000 },
      ],
      toppingNames: [],
    },
    {
      name: "Coconut Coffee",
      slug: "ca-phe-cot-dua",
      categoryId: coffeeCategory.id,
      description: "Coffee with coconut milk",
      variants: [
        { name: "M", price: 35000 },
        { name: "L", price: 40000 },
      ],
      toppingNames: ["Boba Pearls"],
    },
    {
      name: "Salt Coffee",
      slug: "ca-phe-muoi",
      categoryId: coffeeCategory.id,
      description: "Hue-style salted cream coffee",
      variants: [
        { name: "M", price: 38000 },
        { name: "L", price: 43000 },
      ],
      toppingNames: [],
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
    {
      name: "Whole Bean Arabica",
      slug: "hat-arabica-nguyen-chat",
      description: "Unroasted Arabica whole beans",
      skus: [
        { label: "500g", sku: "ARA-WB-500", price: 180000, stock: 12 },
        { label: "1kg", sku: "ARA-WB-1000", price: 340000, stock: 6 },
      ],
    },
    {
      name: "Drip Bag Coffee",
      slug: "ca-phe-tui-loc",
      description: "Convenient drip bag packs",
      skus: [{ label: "10 bags", sku: "DRIP-10", price: 85000, stock: 30 }],
    },
    {
      name: "Instant Coffee Mix",
      slug: "ca-phe-hoa-tan",
      description: "3-in-1 instant coffee mix",
      skus: [
        { label: "20 sachets", sku: "INST-20", price: 65000, stock: 25 },
        { label: "40 sachets", sku: "INST-40", price: 120000, stock: 15 },
      ],
    },
    {
      name: "Oolong Tea Leaves",
      slug: "tra-oolong",
      description: "Premium Taiwanese oolong",
      skus: [{ label: "100g", sku: "OOL-100", price: 95000, stock: 18 }],
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

async function seedShopSettings() {
  await prisma.shopSettings.upsert({
    where: { id: "default" },
    update: {
      shopName: "Coffee Shop",
      address: "123 Nguyen Hue, District 1, HCMC",
      phone: "0901234567",
      openTime: "07:00",
      closeTime: "22:00",
      baseShipping: 15000,
    },
    create: {
      id: "default",
      shopName: "Coffee Shop",
      address: "123 Nguyen Hue, District 1, HCMC",
      phone: "0901234567",
      openTime: "07:00",
      closeTime: "22:00",
      baseShipping: 15000,
    },
  });
}

async function seedSampleOrders() {
  const drink = await prisma.product.findFirst({ where: { type: ProductType.DRINK } });
  const packaged = await prisma.product.findFirst({
    where: { type: ProductType.PACKAGED },
    include: { skus: true },
  });

  if (drink) {
    const variant = await prisma.productVariant.findFirst({ where: { productId: drink.id } });
    if (variant) {
      await prisma.order.upsert({
        where: { orderNumber: "#001" },
        update: {},
        create: {
          orderNumber: "#001",
          type: "DRINK_ORDER",
          channel: "ONLINE",
          status: "PENDING",
          customerName: "Nguyen Van A",
          customerPhone: "0901111111",
          fulfillment: "PICKUP",
          subtotal: variant.price,
          total: variant.price,
          items: {
            create: {
              productId: drink.id,
              variantId: variant.id,
              quantity: 1,
              unitPrice: variant.price,
            },
          },
        },
      });
    }
  }

  if (packaged && packaged.skus[0]) {
    const sku = packaged.skus[0];
    await prisma.order.upsert({
      where: { orderNumber: "#002" },
      update: {},
      create: {
        orderNumber: "#002",
        type: "PRODUCT_ORDER",
        channel: "ONLINE",
        status: "PENDING",
        customerName: "Tran Thi B",
        customerPhone: "0902222222",
        shippingAddress: "456 Le Loi, District 3, HCMC",
        subtotal: sku.price,
        shippingFee: 15000,
        total: sku.price + 15000,
        items: {
          create: {
            productId: packaged.id,
            skuId: sku.id,
            quantity: 1,
            unitPrice: sku.price,
          },
        },
      },
    });
  }
}

async function main() {
  await seedUsers();
  await seedCategories();
  await seedToppings();
  await seedDrinks();
  await seedPackagedProducts();
  await seedShopSettings();
  await seedSampleOrders();
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
