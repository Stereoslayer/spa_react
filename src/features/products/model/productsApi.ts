import {DummyListResponse, DummyProduct} from "@/features/products/model/types";

const BASE = "https://dummyjson.com";

export async function fetchProducts(params?: {
    limit?: number;
    skip?: number;
    signal?: AbortSignal;
}) {
    const url = new URL(`${BASE}/products`);
    if (params?.limit != null) url.searchParams.set("limit", String(params.limit));
    if (params?.skip != null) url.searchParams.set("skip", String(params.skip));

    const res = await fetch(url.toString(), {
        signal: params?.signal,
    });

    if (!res.ok) throw new Error(`Failed to load products: ${res.status}`);
    return (await res.json()) as DummyListResponse<DummyProduct>;
}

export async function fetchProductById(id: number | string, signal?: AbortSignal) {
    const res = await fetch(`${BASE}/products/${id}`, { signal });
    if (!res.ok) throw new Error(`Product ${id} not found`);
    return (await res.json()) as DummyProduct;
}
