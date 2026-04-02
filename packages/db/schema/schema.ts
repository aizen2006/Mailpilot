import { pgTable as table, timestamp, uuid, varchar, pgEnum, text, integer } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "assistant"]);

export const UserTable = table("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const ConversationTable = table("conversations", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => UserTable.id),
    title: text("title").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const MessageTable = table("messages", {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id").references(() => ConversationTable.id),
    content: text("content").notNull(),
    role: roleEnum("role").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const UserGmailTokensTable = table("tokens",{
    id:uuid("id").primaryKey().defaultRandom(),
    userId:uuid("user_Id").references(() => UserTable.id ),
    accessToken:text("access_token").notNull(),
    refreshToken:text("refresh_token").notNull(),
    expiresIn:integer("expires_in").notNull(),
    createdAt: timestamp("created_at" , { withTimezone : true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at" , { withTimezone : true }).notNull().defaultNow()
})