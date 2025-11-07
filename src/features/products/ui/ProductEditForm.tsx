import {useForm, type SubmitHandler, type Resolver} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {productFormSchema, type ProductFormValues} from "../model/formSchema";
import {useEffect, useState} from "react";

type Props = {
    initial: ProductFormValues;
    onSubmit: (data: ProductFormValues) => Promise<void> | void;
    onCancel: () => void;
};

export default function ProductEditForm({initial, onSubmit, onCancel}: Props) {
    const {register, handleSubmit, formState: {errors, isSubmitting}, watch, reset} =
        useForm<ProductFormValues>({
            resolver: zodResolver(productFormSchema) as Resolver<ProductFormValues>,
            defaultValues: initial,
            mode: "onBlur",
        });

    useEffect(() => reset(initial), [initial, reset]);

    const [previewUrl, setPreviewUrl] = useState<string | undefined>(initial.thumbnail);
    const thumb = watch("thumbnail");
    useEffect(() => {
        setPreviewUrl(thumb && /^https?:\/\//i.test(thumb) ? thumb : undefined);
    }, [thumb]);

    const submit: SubmitHandler<ProductFormValues> = async (data) => {
        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="p-6">
            <div className="grid gap-8 grid-cols-1 md:grid-cols-[minmax(360px,1fr)_420px]">
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Title *</label>
                        <input
                            {...register("title", {
                                required: "Обязательное поле",
                                minLength: {value: 2, message: "Минимум 2 символа"}
                            })}
                            type="text"
                            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Например, Wooden Chair"
                        />
                        {errors.title && <p className="text-sm text-red-600">{String(errors.title.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Description *</label>
                        <textarea
                            {...register("description", {
                                required: "Обязательное поле",
                                minLength: {value: 10, message: "Минимум 10 символов"}
                            })}
                            rows={6}
                            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Короткое описание товара…"
                        />
                        {errors.description &&
                            <p className="text-sm text-red-600">{String(errors.description.message)}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                {...register("price", {
                                    min: {value: 0, message: "Не меньше 0"},
                                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                                })}
                                type="number"
                                step="0.01"
                                min="0"
                                inputMode="decimal"
                                className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="0.00"
                            />
                            {errors.price && <p className="text-sm text-red-600">{String(errors.price.message)}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Rating (0–5)</label>
                            <input
                                {...register("rating", {
                                    min: {value: 0, message: "Не меньше 0"},
                                    max: {value: 5, message: "Не больше 5"},
                                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                                })}
                                type="number"
                                step="0.01"
                                min="0"
                                max="5"
                                inputMode="decimal"
                                className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="4.5"
                            />
                            {errors.rating && <p className="text-sm text-red-600">{String(errors.rating.message)}</p>}
                        </div>
                    </div>
                </div>

                <aside className="rounded-xl border bg-white">
                    <div className="p-4 border-b">
                        <h3 className="text-sm font-medium text-gray-700">Preview</h3>
                    </div>
                    <div className="p-4">
                        <div className="h-64 w-full bg-gray-50 border rounded-lg flex items-center justify-center">
                            {previewUrl ? (
                                <img src={previewUrl} alt="preview"
                                     className="max-w-full max-h-full object-contain rounded-md"/>
                            ) : (
                                <span className="text-gray-400 text-sm">No image</span>
                            )}
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
                            <input
                                {...register("thumbnail", {
                                    validate: (v) => !v || /^https?:\/\//i.test(v) || "Введите корректный URL",
                                })}
                                type="url"
                                className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="https://…"
                            />
                            {errors.thumbnail &&
                                <p className="text-sm text-red-600">{String(errors.thumbnail.message)}</p>}
                        </div>
                    </div>
                </aside>
            </div>

            <div className="sticky bottom-0 -mx-6 mt-6 border-t bg-white px-6 py-4 flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="inline-flex items-center justify-center rounded-md border px-4 py-2 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                    {isSubmitting ? "Saving…" : "Save"}
                </button>
            </div>
        </form>
    );
}