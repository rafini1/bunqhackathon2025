import { db } from "@db";
import { users, accounts, actions, chatMessages } from "@shared/schema";
import { eq } from "drizzle-orm";

export const storage = {
  // User operations
  async getUserById(id: number) {
    return await db.query.users.findFirst({
      where: eq(users.id, id)
    });
  },
  
  async getUserByUsername(username: string) {
    return await db.query.users.findFirst({
      where: eq(users.username, username)
    });
  },
  
  async insertUser(userData: any) {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  },
  
  // Account operations
  async getAccountsByUserId(userId: number) {
    return await db.query.accounts.findMany({
      where: eq(accounts.userId, userId)
    });
  },
  
  async insertAccount(accountData: any) {
    const [account] = await db.insert(accounts).values(accountData).returning();
    return account;
  },
  
  // Actions operations
  async getActionsByUserId(userId: number) {
    return await db.query.actions.findMany({
      where: eq(actions.userId, userId)
    });
  },
  
  async insertAction(actionData: any) {
    const [action] = await db.insert(actions).values(actionData).returning();
    return action;
  },
  
  async markActionCompleted(id: number) {
    return await db.update(actions)
      .set({ completed: true })
      .where(eq(actions.id, id))
      .returning();
  },
  
  // Chat operations
  async getChatHistoryByUserId(userId: number) {
    return await db.query.chatMessages.findMany({
      where: eq(chatMessages.userId, userId),
      orderBy: (chatMessages, { asc }) => [asc(chatMessages.timestamp)]
    });
  },
  
  async insertChatMessage(messageData: any) {
    const [message] = await db.insert(chatMessages).values(messageData).returning();
    return message;
  }
};
