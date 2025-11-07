import { z } from "zod";

export const productFormSchema = z.object({
    title: z.string().min(2, "Минимум 2 символа"),
    description: z.string().min(10, "Минимум 10 символов"),
    price: z.coerce.number().min(0, "Не меньше 0").optional(),
    rating: z.coerce.number().min(0).max(5).optional(),
    thumbnail: z
        .union([z.literal(""), z.string().url()])
        .transform((v) => (v === "" ? undefined : v))
        .optional(),
});

export type ProductFormValues = z.output<typeof productFormSchema>;