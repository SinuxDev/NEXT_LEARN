import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  name: z.string().min(4, {
    message: "Name must be at least 4 characters long",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  token: z.string().nullable().optional(),
});

export const PasswordForgetEmailSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
});

export const UserSettingsSchema = z
  .object({
    name: z.optional(z.string()),
    image: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(8)),
    newPassword: z.optional(z.string().min(8)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required when changing password",
      path: ["newPassword"],
    }
  );

export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(5, {
    message: "Title must be at least 5 characters long",
  }),
  description: z.string().min(40, {
    message: "Description must be at least 40 characters long",
  }),
  price: z.coerce
    .number({
      invalid_type_error: "Price must be a number",
    })
    .positive({ message: "Price must be a positive number" }),
});

export const VariantSchema = z.object({
  productID: z.number(),
  id: z.number().optional(),
  editMode: z.boolean(),
  productType: z.string().min(3, {
    message: "Product type must be at least 3 characters long",
  }),
  color: z.string().min(3, {
    message: "Color must be at least 3 characters long",
  }),
  tags: z.array(z.string()).min(1, {
    message: "At least one tag is required",
  }),
  variantImages: z
    .array(
      z.object({
        url: z.string().refine((url) => url.search("blob") !== 0, {
          message: "Invalid image url",
        }),
        size: z.number(),
        key: z.string().optional(),
        id: z.number().optional(),
        name: z.string(),
      })
    )
    .min(1, { message: "You must provide at least one image" }),
});

export const ReviewSchema = z.object({
  productID: z.number(),
  rating: z
    .number()
    .min(1, { message: "Rate at least one star" })
    .max(5, { message: "Rate at most 5 stars" }),
  comment: z
    .string()
    .min(10, { message: "Comment must be at least 10 characters long" }),
});

export const PaymentIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string(),
  cart: z.array(
    z.object({
      quantity: z.number().positive(),
      productID: z.number(),
      title: z.string(),
      price: z.number().positive(),
      image: z.string(),
    })
  ),
});
