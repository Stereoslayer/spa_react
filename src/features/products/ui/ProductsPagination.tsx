import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store";
import { setPage, setPerPage } from "../model/slice";
import { selectProductsState, selectTotalForPaging } from "../model/selectors";

export default function ProductsPagination() {
    const dispatch = useDispatch<AppDispatch>();
    const { page, perPage, status } = useSelector(selectProductsState);
    const totalForPaging = useSelector(selectTotalForPaging);

    const totalPages = Math.max(1, Math.ceil((totalForPaging || 0) / perPage));
    const canPrev = page > 1;
    const canNext = page < totalPages;

    const go = (p: number) => dispatch(setPage(Math.min(Math.max(1, p), totalPages)));

    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) pages.push(i);

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">На странице:</span>
                <select
                    value={perPage}
                    onChange={(e) => dispatch(setPerPage(Number(e.target.value)))}
                    className="rounded-md border px-2 py-1"
                    disabled={status === "loading"}
                >
                    {[6, 12, 24].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <span className="text-sm text-gray-500">
          Всего: {totalForPaging ?? 0}
        </span>
            </div>

            <div className="inline-flex items-center gap-1">
                <button onClick={() => go(page - 1)} disabled={!canPrev || status === "loading"} className="rounded-md border px-3 py-1 disabled:opacity-50">Назад</button>
                {start > 1 && (<><PageBtn n={1} cur={page} go={go} disabled={status === "loading"} />{start > 2 && <span className="px-1">…</span>}</>)}
                {pages.map((n) => <PageBtn key={n} n={n} cur={page} go={go} disabled={status === "loading"} />)}
                {end < totalPages && (<>{end < totalPages - 1 && <span className="px-1">…</span>}<PageBtn n={totalPages} cur={page} go={go} disabled={status === "loading"} /></>)}
                <button onClick={() => go(page + 1)} disabled={!canNext || status === "loading"} className="rounded-md border px-3 py-1 disabled:opacity-50">Вперёд</button>
            </div>
        </div>
    );
}

function PageBtn({ n, cur, go, disabled }: { n: number; cur: number; go: (p: number) => void; disabled?: boolean }) {
    const active = n === cur;
    return (
        <button
            onClick={() => go(n)}
            disabled={disabled}
            className={"min-w-9 rounded-md border px-3 py-1 " + (active ? "bg-indigo-600 text-white border-indigo-600" : "hover:bg-gray-50")}
            aria-current={active ? "page" : undefined}
        >
            {n}
        </button>
    );
}