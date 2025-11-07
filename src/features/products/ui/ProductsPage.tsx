import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadProducts } from "../model/thunks";
import {
    selectList,
    selectStatus,
    selectError,
    selectProductsState,
    selectVisibleCount,
} from "../model/selectors";
import type { AppDispatch } from "@/app/store";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { Link } from "react-router-dom";
import ProductsToolbar from "./ProductsToolbar";
import ProductsPagination from "@/features/products/ui/ProductsPagination";
import { setPage } from "@/features/products/model/slice";
import toast from "react-hot-toast";

export default function ProductsPage() {
    const dispatch = useDispatch<AppDispatch>();

    const products = useSelector(selectList);
    const status = useSelector(selectStatus);
    const error = useSelector(selectError);
    const { page, perPage } = useSelector(selectProductsState);
    const visibleCount = useSelector(selectVisibleCount);


    useEffect(() => {
        dispatch(loadProducts());
    }, [dispatch, page, perPage]);


    useEffect(() => {
        const totalPages = Math.max(1, Math.ceil(visibleCount / perPage));
        if (page > totalPages) {
            dispatch(setPage(totalPages));
        }
    }, [visibleCount, perPage, page, dispatch]);


    useEffect(() => {
        if (status === "failed" && error) toast.error(error);
    }, [status, error]);

    const isLoading = status === "loading";
    const isFailed = status === "failed";
    const isEmpty = status === "succeeded" && products.length === 0;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Products</h1>
                <Link to="/create-product" className="text-indigo-600 hover:underline">
                    + Create product
                </Link>
            </div>

            <ProductsToolbar />

            {isFailed && (
                <div className="flex items-center gap-3 text-red-700 bg-red-50 border border-red-200 rounded p-3">
                    <span>Ошибка: {error ?? "unknown"}</span>
                    <button
                        onClick={() => dispatch(loadProducts())}
                        className="rounded-md border px-3 py-1 bg-white hover:bg-gray-50"
                    >
                        Повторить
                    </button>
                </div>
            )}

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading
                    ? Array.from({ length: perPage }).map((_, i) => (
                        <ProductCardSkeleton key={`sk-${i}`} />
                    ))
                    : products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>

            {isEmpty && <div className="text-gray-600">Ничего не найдено.</div>}

            <ProductsPagination />
        </div>
    );
}