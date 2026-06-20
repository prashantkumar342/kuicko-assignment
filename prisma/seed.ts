import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const STORES = [
  "Domino's Pizza",
  "Pizza Hut",
  "La Pino'z Pizza",
  "Burger King",
  "McDonald's",
];

const ITEMS = [
  "Margherita Pizza",
  "Farmhouse Pizza",
  "Veg Supreme Pizza",
  "Paneer Tikka Pizza",
  "Garlic Bread",
  "Cheese Garlic Bread",
  "French Fries",
  "Veg Burger",
  "Chicken Burger",
  "Pepsi 500ml",
];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPrice(min: number, max: number): number {
  // Returns prices that usually end in 9 (e.g., 199, 249, 399)
  return Math.floor(getRandomInt(min, max) / 10) * 10 + 9;
}

async function main() {
  console.log('Starting production seeder...');

  try {
    // 1. Fetch existing records to enforce idempotency without hardcoding UUIDs
    const existingStores = await prisma.store.findMany();
    const existingStoreNames = new Set(existingStores.map((s) => s.name));

    const existingItems = await prisma.item.findMany();
    const existingItemNames = new Set(existingItems.map((i) => i.name));

    // 2. Build non-existing rows
    const storesToInsert = STORES.filter((name) => !existingStoreNames.has(name)).map((name) => ({ name }));
    const itemsToInsert = ITEMS.filter((name) => !existingItemNames.has(name)).map((name) => ({ name }));

    // 3. Insert Stores & Items
    if (storesToInsert.length > 0) {
      console.log(`Inserting ${storesToInsert.length} new stores...`);
      await prisma.store.createMany({
        data: storesToInsert,
        skipDuplicates: true,
      });
    } else {
      console.log('Stores already seeded. Skipping.');
    }

    if (itemsToInsert.length > 0) {
      console.log(`Inserting ${itemsToInsert.length} new items...`);
      await prisma.item.createMany({
        data: itemsToInsert,
        skipDuplicates: true,
      });
    } else {
      console.log('Items already seeded. Skipping.');
    }

    // 4. Fetch the fully inserted stores and items
    const stores = await prisma.store.findMany();
    const items = await prisma.item.findMany();

    console.log(`Total stores in DB: ${stores.length}`);
    console.log(`Total items in DB: ${items.length}`);

    // 5. Build StoreItems dynamically based on current DB state
    const existingStoreItems = await prisma.storeItem.findMany();
    const existingRelations = new Set(
      existingStoreItems.map((si) => `${si.storeId}-${si.itemId}`)
    );

    const storeItemsToInsert: { storeId: string; itemId: string; price: number; stock: number }[] = [];

    for (const store of stores) {
      // Pick 7 to 9 unique items per store
      const itemCount = getRandomInt(7, 9);
      
      // Shuffle items and pick a subset
      const shuffledItems = [...items].sort(() => 0.5 - Math.random());
      const selectedItems = shuffledItems.slice(0, itemCount);

      for (const item of selectedItems) {
        // Enforce idempotency locally
        if (!existingRelations.has(`${store.id}-${item.id}`)) {
          storeItemsToInsert.push({
            storeId: store.id,
            itemId: item.id,
            price: getRandomPrice(50, 400),
            stock: getRandomInt(10, 100),
          });
        }
      }
    }

    // 6. Bulk insert relations in a transaction
    if (storeItemsToInsert.length > 0) {
      console.log(`Preparing to seed ${storeItemsToInsert.length} StoreItem relations...`);
      await prisma.$transaction(async (tx) => {
        await tx.storeItem.createMany({
          data: storeItemsToInsert,
          // skipDuplicates natively supported because of @@unique([storeId, itemId])
          skipDuplicates: true, 
        });
      });
      console.log('StoreItem relations seeded successfully.');
    } else {
      console.log('StoreItem relations already fully seeded. Skipping.');
    }

    console.log('Seeder completed successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    // 7. Disconnect Prisma and Pool gracefully
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
