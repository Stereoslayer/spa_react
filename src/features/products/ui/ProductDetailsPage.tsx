import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import type { AppDispatch } from "@/app/store";
import { loadProductById } from "../model/thunks";
import { selectProductsState } from "../model/selectors";

export default function ProductDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { entities, status, error } = useSelector(selectProductsState);

    useEffect(() => {
        if (id && !entities[id]) dispatch(loadProductById(id));
    }, [id, entities, dispatch]);

    const product = id ? entities[id] : null;

    if (status === "loading" && !product) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <div className="h-8 w-1/2 bg-gray-100 rounded animate-pulse mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-80 bg-gray-100 rounded animate-pulse" />
                    <div className="space-y-3">
                        <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                        <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <p className="text-red-600 mb-4">
                    {error ? `Ошибка: ${error}` : "Товар не найден."}
                </p>
                <Link to="/products" className="text-indigo-600 hover:underline">
                    ← Вернуться к списку
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">{product.title}</h1>
                <button
                    onClick={() => navigate("/products")}
                    className="text-indigo-600 hover:underline"
                >
                    ← Назад к списку
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Превью */}
                <div className="w-full h-80 rounded-lg border bg-gray-50 flex items-center justify-center">
                    {product.thumbnail ? (
                        <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : (
                        <span className="text-gray-400 text-sm">No image</span>
                    )}
                </div>

                {/* Контент */}
                <div className="space-y-3">
                    <p className="text-gray-700">{product.description}</p>
                    <div className="flex gap-6 text-sm">
                        {product.price != null && <span className="font-medium">${product.price}</span>}
                        {product.rating != null && <span>★ {product.rating}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}