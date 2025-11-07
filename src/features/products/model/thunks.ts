import {createAsyncThunk} from "@reduxjs/toolkit";
import type {RootState} from "@/app/store";
import {fetchProductById, fetchProducts} from "./productsApi";
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

export const loadProducts = createAsyncThunk<
    { items: Product[]; total: number },
    void,
    { state: RootState; rejectValue: string }
>(
    "products/loadProducts",
    async (_: void, {getState, signal, rejectWithValue}) => {
        try {
            const {page, perPage} = getState().products;
            const skip = (page - 1) * perPage;

            const resp = await fetchProducts({limit: perPage, skip, signal});
            const items = resp.products.map(mapDummyToProduct) as Product[];
            const total = Number(resp.total) || items.length;

            return {items, total};
        } catch (e: any) {
            if (e?.name === "AbortError") throw e;
            return rejectWithValue(e?.message ?? "Не удалось загрузить продукты");
        }
    }
);

export const loadProductById = createAsyncThunk<
    Product,
    string | number,
    { state: RootState; rejectValue: string }
>(
    "products/loadProductById",
    async (id, {signal, rejectWithValue}) => {
        try {
            const resp = await fetchProductById(id, signal);
            return mapDummyToProduct(resp);
        } catch (e: any) {
            if (e?.name === "AbortError") throw e;
            return rejectWithValue(e?.message ?? "Не удалось загрузить продукт");
        }
    },
    {
        condition: (id, {getState}) => {
            const st = (getState() as RootState).products;
            return !st.entities[id as any];
        },
    }
);