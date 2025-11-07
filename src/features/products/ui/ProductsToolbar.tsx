import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store";
import { setFavoritesOnly, setQuery } from "../model/slice";
import { selectProductsState, selectFavoritesCount } from "../model/selectors";
import { Star, X } from "lucide-react";

export default function ProductsToolbar() {
    const dispatch = useDispatch<AppDispatch>();
    const { favoritesOnly, query } = useSelector(selectProductsState);
    const favCount = useSelector(selectFavoritesCount);

    const clearQuery = () => dispatch(setQuery(""));

    return (
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1">
                <input
                    value={query}
                    onChange={(e) => dispatch(setQuery(e.target.value))}
                    placeholder="Поиск по названию и описанию..."
                    className="w-full rounded-md border px-3 py-2 pr-8 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {query && (
                    <button
                        type="button"
                        onClick={clearQuery}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                        title="Очистить поиск"
                        aria-label="Очистить поиск"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <button
                onClick={() => dispatch(setFavoritesOnly(!favoritesOnly))}
                className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-gray-50 ${
                    favoritesOnly ? "bg-yellow-50 border-yellow-300" : ""
                }`}
                title="Показать только избранное"
            >
                <Star size={18} className={favoritesOnly ? "fill-yellow-500 text-yellow-600" : ""} />
                <span>Избранное {favCount ? `(${favCount})` : ""}</span>
            </button>
        </div>
    );
}