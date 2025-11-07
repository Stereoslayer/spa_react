import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export const selectProductsState = (s: RootState) => s.products;
export const selectStatus = (s: RootState) => s.products.status;
export const selectError = (s: RootState) => s.products.error;

export const selectVisibleBeforePaging = createSelector(selectProductsState, (st) => {
    const all = st.ids.map((id) => st.entities[id]!).filter(Boolean);

    const visible = all.filter((p) => !st.deleted[p.id]);

    const byFav = st.favoritesOnly ? visible.filter((p) => st.liked[p.id]) : visible;

    const q = st.query.trim().toLowerCase();
    const byQuery = q
        ? byFav.filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                (p.description ?? "").toLowerCase().includes(q)
        )
        : byFav;

    return byQuery;
});

export const selectVisibleCount = createSelector(
    selectVisibleBeforePaging,
    (list) => list.length
);

export const selectList = createSelector(
    selectProductsState,
    selectVisibleBeforePaging,
    (st, list) => {
        const start = (st.page - 1) * st.perPage;
        const end = st.page * st.perPage;
        return list.slice(start, end);
    }
);

export const selectLikedMap = (s: RootState) => s.products.liked;
export const selectFavoritesCount = createSelector(selectProductsState, (st) =>
    Object.values(st.liked).filter(Boolean).length
);