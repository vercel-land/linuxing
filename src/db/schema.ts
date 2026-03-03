import { relations } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const distros = mysqlTable("distros", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  iconUrl: varchar("icon_url", { length: 255 }),
  family: varchar("family", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const packages = mysqlTable("packages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  homepageUrl: varchar("homepage_url", { length: 255 }),
  categoryId: int("category_id").references(() => categories.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const commands = mysqlTable("commands", {
  id: int("id").autoincrement().primaryKey(),
  packageId: int("package_id")
    .references(() => packages.id)
    .notNull(),
  distroId: int("distro_id")
    .references(() => distros.id)
    .notNull(),
  packageManager: varchar("package_manager", { length: 50 }).notNull(),
  installCommand: text("install_command").notNull(),
  uninstallCommand: text("uninstall_command"),
  notes: text("notes"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const tags = mysqlTable("tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
});

export const packageTags = mysqlTable("package_tags", {
  packageId: int("package_id")
    .references(() => packages.id)
    .notNull(),
  tagId: int("tag_id")
    .references(() => tags.id)
    .notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  packages: many(packages),
}));

export const distrosRelations = relations(distros, ({ many }) => ({
  commands: many(commands),
}));

export const packagesRelations = relations(packages, ({ one, many }) => ({
  category: one(categories, {
    fields: [packages.categoryId],
    references: [categories.id],
  }),
  commands: many(commands),
  packageTags: many(packageTags),
}));

export const commandsRelations = relations(commands, ({ one }) => ({
  package: one(packages, {
    fields: [commands.packageId],
    references: [packages.id],
  }),
  distro: one(distros, {
    fields: [commands.distroId],
    references: [distros.id],
  }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  packageTags: many(packageTags),
}));

export const packageTagsRelations = relations(packageTags, ({ one }) => ({
  package: one(packages, {
    fields: [packageTags.packageId],
    references: [packages.id],
  }),
  tag: one(tags, {
    fields: [packageTags.tagId],
    references: [tags.id],
  }),
}));
