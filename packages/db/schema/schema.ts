import {
    pgTable as table,
    timestamp,
    uuid,
    varchar,
    pgEnum,
    text,
    integer,
    boolean,
    jsonb,
    bigint,
    numeric,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "assistant"]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
    "incomplete",
    "incomplete_expired",
    "trialing",
    "active",
    "past_due",
    "canceled",
    "unpaid",
]);

/** Application user id: for web accounts equals `auth.users.id` (Supabase); extension bootstrap supplies its own UUID. */
export const UserTable = table("users", {
    id: uuid("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Plan catalog (e.g. free, pro). */
export const PlanTable = table("plans", {
    key: varchar("key", { length: 64 }).primaryKey(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    stripePriceId: varchar("stripe_price_id", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const SubscriptionTable = table("subscriptions", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => UserTable.id, { onDelete: "cascade" }),
    planKey: varchar("plan_key", { length: 64 })
        .notNull()
        .references(() => PlanTable.key),
    stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
    stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }).unique(),
    status: subscriptionStatusEnum("status").notNull().default("incomplete"),
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const UsageEventTable = table("usage_events", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => UserTable.id, { onDelete: "cascade" }),
    kind: varchar("kind", { length: 64 }).notNull(),
    quantity: numeric("quantity", { precision: 24, scale: 8 }).notNull(),
    unit: varchar("unit", { length: 32 }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const InvoiceTable = table("invoices", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => UserTable.id, { onDelete: "cascade" }),
    stripeInvoiceId: varchar("stripe_invoice_id", { length: 255 }).notNull().unique(),
    amountDue: bigint("amount_due", { mode: "number" }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("usd"),
    status: varchar("status", { length: 32 }).notNull(),
    hostedInvoiceUrl: text("hosted_invoice_url"),
    periodStart: timestamp("period_start", { withTimezone: true }),
    periodEnd: timestamp("period_end", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** One-time codes to bind an extension bootstrap user to a Supabase-backed account. */
export const LinkCodeTable = table("link_codes", {
    id: uuid("id").primaryKey().defaultRandom(),
    codeHash: varchar("code_hash", { length: 128 }).notNull().unique(),
    userId: uuid("user_id")
        .notNull()
        .references(() => UserTable.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    consumedFromExtensionUserId: uuid("consumed_from_extension_user_id"),
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