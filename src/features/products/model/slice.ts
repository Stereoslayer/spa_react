import {createSlice, createEntityAdapter, nanoid} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {Product} from "./types";
import {loadProductById, loadProducts} from "@/features/products/model/thunks";

const adapter = createEntityAdapter<Product>();

type ProductsState = ReturnType<typeof adapter.getInitialState> & {
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    page: number;
    perPage: number;
    total: number;
    query: string;
    favoritesOnly: boolean;
    liked: Record<string | number, boolean>;
    deleted: Record<string | number, boolean>;
    createdLocal: Record<string | number, Product>;
    editedLocal: Record<string | number, Partial<Product>>;
};

const initialState: ProductsState = {
    ...adapter.getInitialState(),
    status: "idle",
    error: null,
    page: 1,
    perPage: 12,
    total: 0,
    query: "",
    favoritesOnly: false,
    liked: {},
    deleted: {},
    createdLocal: {},
    editedLocal: {},
};

const slice = createSlice({
    name: "products",
    initialState,
    reducers: {
        toggleLike(state, action: PayloadAction<Product["id"]>) {
            const id = action.payload;
            state.liked[id] = !state.liked[id];
        },
        softDelete(state, action: PayloadAction<Product["id"]>) {
            state.deleted[action.payload] = true;
        },
        setQuery(state, action: PayloadAction<string>) {
            state.query = action.payload;
            state.page = 1;
        },
        setFavoritesOnly(state, action: PayloadAction<boolean>) {
            state.favoritesOnly = action.payload;
            state.page = 1;
        },
        setPage(state, action: PayloadAction<number>) {
            state.page = action.payload;
        },
        setPerPage(state, action: PayloadAction<number>) {
            state.perPage = action.payload;
            state.page = 1; // сбрасываем на первую при смене лимита
        },
        createProduct(state, action: PayloadAction<Omit<Product, "id">>) {
            const id = nanoid();
            const product: Product = {id, ...action.payload};
            state.createdLocal[id] = product;
            adapter.addOne(state, product);
            state.total += 1;
        },
        updateProduct(
            state,
            action: PayloadAction<{ id: Product["id"]; patch: Partial<Product> }>
        ) {
            const {id, patch} = action.payload;
            if (!state.entities[id]) return;
            state.editedLocal[id] = {...(state.editedLocal[id] ?? {}), ...patch};
            adapter.updateOne(state, {id, changes: patch});
        },
        upsertMany(state, action: PayloadAction<Product[]>) {
            adapter.upsertMany(state, action.payload);
        },
        setTotal(state, action: PayloadAction<number>) {
            state.total = action.payload;
        },
        setStatus(state, action: PayloadAction<ProductsState["status"]>) {
            state.status = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadProducts.pending, (st) => {
                st.status = "loading";
                st.error = null;
            })
            .addCase(loadProducts.fulfilled, (st, {payload}) => {
                st.status = "succeeded";
                st.error = null;
                adapter.upsertMany(st, payload.items);
                st.total = payload.total;
            })
            .addCase(loadProducts.rejected, (st, action) => {
                st.status = "failed";
                st.error = String(action.payload ?? action.error.message ?? "Ошибка загрузки");
            })

            .addCase(loadProductById.pending, (st) => {
                st.status = "loading";
                st.error = null;
            })
            .addCase(loadProductById.fulfilled, (st, {payload}) => {
                st.status = "succeeded";
                st.error = null;
                adapter.upsertOne(st, payload)
            })
            .addCase(loadProductById.rejected, (st, action) => {
                st.status = "failed";
                st.error = String(action.payload ?? action.error.message ?? "Ошибка загрузки");
            });
    },
});

export const {
    toggleLike,
    softDelete,
    setQuery,
    setFavoritesOnly,
    setPage,
    setPerPage,
    createProduct,
    updateProduct,
    upsertMany,
    setTotal,
    setStatus,
    setError,
} = slice.actions;

export default slice.reducer;