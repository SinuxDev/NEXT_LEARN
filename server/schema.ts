import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

export const RoleEnum = pgEnum("roles", ["user", "admin"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false),
  role: RoleEnum("roles").default("user"),
  customerID: text("customerID"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const email_verificationTokens = pgTable(
  "email_verificationToken",
  {
    identifier: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").unique().notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const NewPasswordToken = pgTable(
  "new_password_reset_token",
  {
    identifier: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").unique().notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const TwoFactorTokens = pgTable(
  "two_factor_tokens",
  {
    identifier: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").unique().notNull(),
    userID: text("userID").references(() => users.id, { onDelete: "cascade" }),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  created: timestamp("created", { mode: "date" }).defaultNow(),
});

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  color: text("color").notNull(),
  productType: text("productType").notNull(),
  updated: timestamp("updated", { mode: "date" }).defaultNow(),
  productID: serial("productID").references(() => products.id, {
    onDelete: "cascade",
  }),
});

export const VariantsImages = pgTable("images_variants", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  size: real("size").notNull(),
  name: text("name").notNull(),
  order: real("order").notNull(),
  variantID: serial("variantID")
    .notNull()
    .references(() => productVariants.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const VariantsTags = pgTable("tags_variants", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  variantID: serial("variantID")
    .notNull()
    .references(() => productVariants.id, {
      onDelete: "cascade",
    }),
});

export const productRelations = relations(products, ({ many }) => ({
  productVariants: many(productVariants, { relationName: "product_variants" }),
  reviews: many(reviews, { relationName: "reviews" }),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ many, one }) => ({
    product: one(products, {
      fields: [productVariants.productID],
      references: [products.id],
      relationName: "product_variants",
    }),
    variantImages: many(VariantsImages, { relationName: "images_variants" }),
    variantTags: many(VariantsTags, { relationName: "tags_variants" }),
  })
);

export const VariantsImagesRelations = relations(VariantsImages, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [VariantsImages.variantID],
    references: [productVariants.id],
    relationName: "images_variants",
  }),
}));

export const VariantTagsRealations = relations(VariantsTags, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [VariantsTags.variantID],
    references: [productVariants.id],
    relationName: "tags_variants",
  }),
}));

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    rating: real("rating").notNull(),
    userID: text("userID")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productID: serial("productID")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    comment: text("comment").notNull(),
    created: timestamp("created").defaultNow(),
  },
  (table) => {
    return {
      productIdx: index("productIdx").on(table.productID),
      userIdx: index("userIdx").on(table.userID),
    };
  }
);

export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userID],
    references: [users.id],
    relationName: "user_reviews",
  }),
  product: one(products, {
    fields: [reviews.productID],
    references: [products.id],
    relationName: "reviews",
  }),
}));

export const userRelations = relations(users, ({ many }) => ({
  reviews: many(reviews, { relationName: "user_reviews" }),
  orders: many(orders, { relationName: "user_orders" }),
}));

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userID: text("userID")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  total: real("total").notNull(),
  status: text("status").notNull(),
  created: timestamp("created").defaultNow(),
  receiptURL: text("receiptURL"),
  paymentIntentID: text("paymentIntentID"),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userID],
    references: [users.id],
    relationName: "user_orders",
  }),
  orderItems: many(orderProduct, { relationName: "orderProduct" }),
}));

export const orderProduct = pgTable("orderProduct", {
  id: serial("id").primaryKey(),
  quantity: integer("quantity").notNull(),
  productVariantID: serial("productVariantID")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  productID: serial("productID")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  orderID: serial("orderID")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
});

export const orderProductRelations = relations(orderProduct, ({ one }) => ({
  order: one(orders, {
    fields: [orderProduct.orderID],
    references: [orders.id],
    relationName: "orderProduct",
  }),
  product: one(products, {
    fields: [orderProduct.productID],
    references: [products.id],
    relationName: "products",
  }),
  productVariant: one(productVariants, {
    fields: [orderProduct.productVariantID],
    references: [productVariants.id],
    relationName: "product_variants",
  }),
}));
