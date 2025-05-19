// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `linktree-clone_${name}`);

export const link = createTable(
  "link",
  (d) => ({
    id: d.uuid("id").primaryKey().defaultRandom(),
    name: d.varchar({ length: 256 }),
    userId: d.uuid("user_id").notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const linkRelations = relations(link, ({ one }) => ({
  user: one(user, {
    fields: [link.userId],
    references: [user.id],
  }),
}));

export const user = createTable("user", (d) => ({
  id: d.uuid("id").primaryKey().defaultRandom(),
  clerkId: d.text("clerk_id").notNull().unique(),

  firstName: d.varchar("first_name", { length: 256 }),
  lastName: d.varchar("last_name", { length: 256 }),

  imageUrl: d.text("image_url").notNull(),

  createdAt: d
    .timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp("updated_at", { withTimezone: true })
    .$onUpdate(() => new Date())
    .notNull(),
}));

export const usersRelations = relations(user, ({ many }) => ({
  links: many(link),
}));
