import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store";
import { loadProductById } from "../model/thunks";

export default function ProductDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (id) dispatch(loadProductById(id));
    }, [id, dispatch]);

    return (
        <div className="space-y-4">
            <Link to="/products" className="text-blue-600 underline">
                ← Back to products
            </Link>
            <h1 className="text-2xl font-semibold">Product #{id}</h1>
            <p className="text-gray-600">Позже выведем полные данные.</p>
        </div>
    );
}