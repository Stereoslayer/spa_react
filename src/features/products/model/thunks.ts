import {AppDispatch, RootState} from "@/app/store";
import {fetchProductById, fetchProducts} from "./productsApi";
import {upsertMany, setTotal, setStatus, setError} from "./slice";
import type {Product} from "./types";

function mapDummyToProduct(p: any): Product {
    return {
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        rating: p.rating,
        thumbnail: p.thumbnail,
    };
}

export const loadProducts =
    () => async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            dispatch(setStatus("loading"));
            const {page, perPage} = getState().products;
            const skip = (page - 1) * perPage;

            const data = await fetchProducts({limit: perPage, skip});
            const mapped = data.products.map(mapDummyToProduct);
            dispatch(upsertMany(mapped));
            dispatch(setTotal(data.total));
            dispatch(setStatus("succeeded"));
            dispatch(setError(null));
        } catch (e: any) {
            dispatch(setStatus("failed"));
            dispatch(setError(e?.message ?? "Unknown error"));
        }
    };

export const loadProductById =
    (id: number | string) => async (dispatch: AppDispatch) => {
        try {
            dispatch(setStatus("loading"));
            const p = await fetchProductById(id);
            dispatch(upsertMany([mapDummyToProduct(p)]));
            dispatch(setStatus("succeeded"));
            dispatch(setError(null));
        } catch (e: any) {
            dispatch(setStatus("failed"));
            dispatch(setError(e?.message ?? "Unknown error"));
        }
    };