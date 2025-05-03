import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Accounts table
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // total, main, savings, card
  name: text("name").notNull(),
  balance: text("balance"),
  status: text("status"),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Actions needed table
export const actions = pgTable("actions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  status: text("status").notNull(),
  icon: text("icon").notNull(),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: text("role").notNull(), // user or system
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  actions: many(actions),
  chatMessages: many(chatMessages)
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] })
}));

export const actionsRelations = relations(actions, ({ one }) => ({
  user: one(users, { fields: [actions.userId], references: [users.id] })
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, { fields: [chatMessages.userId], references: [users.id] })
}));

// Schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  username: (schema) => schema.min(3, "Username must be at least 3 characters"),
  password: (schema) => schema.min(6, "Password must be at least 6 characters"),
  name: (schema) => schema.min(2, "Name must be at least 2 characters")
});

export const insertAccountSchema = createInsertSchema(accounts);
export const insertActionSchema = createInsertSchema(actions);
export const insertChatMessageSchema = createInsertSchema(chatMessages);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Action = typeof actions.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
