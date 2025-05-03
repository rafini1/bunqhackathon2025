import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("Starting seed...");
    
    // Check if default user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.username, "demo")
    });
    
    // Create default user if not exists
    let userId = existingUser?.id;
    
    if (!existingUser) {
      console.log("Creating default user...");
      const [user] = await db.insert(schema.users).values({
        username: "demo",
        password: "demo123", // In a real app, this would be hashed
        name: "Rafi"
      }).returning();
      userId = user.id;
    }
    
    if (!userId) {
      throw new Error("Failed to get or create user");
    }
    
    // Check if accounts already exist for this user
    const existingAccounts = await db.query.accounts.findMany({
      where: eq(schema.accounts.userId, userId)
    });
    
    // Create default accounts if none exist
    if (existingAccounts.length === 0) {
      console.log("Creating default accounts...");
      await db.insert(schema.accounts).values([
        {
          userId,
          type: "total",
          name: "Total Balance",
          balance: "€ 0,00",
          color: "purple",
          icon: "wallet"
        },
        {
          userId,
          type: "main",
          name: "Main",
          balance: "€ 0,00",
          color: "orange",
          icon: "circle"
        },
        {
          userId,
          type: "savings",
          name: "Savings Account",
          status: "Pending",
          color: "blue",
          icon: "piggy-bank"
        },
        {
          userId,
          type: "card",
          name: "Credit Card",
          color: "credit-card",
          icon: "credit-card"
        }
      ]);
    }
    
    // Check if actions already exist for this user
    const existingActions = await db.query.actions.findMany({
      where: eq(schema.actions.userId, userId)
    });
    
    // Create default actions if none exist
    if (existingActions.length === 0) {
      console.log("Creating default actions...");
      await db.insert(schema.actions).values([
        {
          userId,
          title: "Verify Your Identity",
          status: "Awaiting",
          icon: "id-card",
          completed: false
        }
      ]);
    }
    
    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
