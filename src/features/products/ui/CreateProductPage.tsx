import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store";
import { createProduct } from "../model/slice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {ProductFormValues, productFormSchema} from "../model/formSchema";

export default function CreateProductPage() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema) as Resolver<ProductFormValues>,
        defaultValues: {
            title: "",
            description: "",
            price: undefined,
            rating: undefined,
            thumbnail: "",
        },
        mode: "onBlur",
    });

    const thumb = watch("thumbnail");
    useEffect(() => {
        setPreviewUrl(thumb && /^https?:\/\//i.test(thumb) ? thumb : undefined);
    }, [thumb]);

    const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
        dispatch(
            createProduct({
                title: data.title.trim(),
                description: data.description.trim(),
                price: data.price,
                rating: data.rating,
                thumbnail: data.thumbnail || undefined,
            })
        );
        navigate("/products");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Create product</h1>
                <Link to="/products" className="text-blue-600 hover:underline">
                    ← Back
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Title *</label>
                        <input
                            {...register("title")}
                            type="text"
                            className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Например, Wooden Chair"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Description *</label>
                        <textarea
                            {...register("description")}
                            rows={5}
                            className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Короткое описание товара…"
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                inputMode="decimal"
                                {...register("price")}
                                className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Rating (0–5)</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                inputMode="decimal"
                                {...register("rating")}
                                className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.rating && (
                                <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Thumbnail URL</label>
                        <input
                            {...register("thumbnail")}
                            type="url"
                            className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="https://…"
                        />
                        {errors.thumbnail && (
                            <p className="mt-1 text-sm text-red-600">{errors.thumbnail.message}</p>
                        )}
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
                        >
                            {isSubmitting ? "Saving…" : "Create"}
                        </button>
                    </div>
                </div>

                <div className="rounded-xl border bg-white p-4">
                    <div className="text-sm text-gray-700 mb-2">Preview</div>
                    <div className="h-64 w-full bg-gray-50 border rounded-lg flex items-center justify-center">
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="preview"
                                className="max-w-full max-h-full object-contain rounded-md"
                            />
                        ) : (
                            <span className="text-gray-400 text-sm">No image</span>
                        )}
                    </div>
                    <p className="mt-3 text-xs text-gray-500">
                        Картинка вписывается в карточку без обрезки (object-contain).
                    </p>
                </div>
            </form>
        </div>
    );
}