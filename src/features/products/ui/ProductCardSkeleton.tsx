export default function ProductCardSkeleton() {
    return (
        <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
            <div className="h-40 w-full bg-gray-100 animate-pulse" />
            <div className="p-4 space-y-3">
                <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-gray-100 rounded animate-pulse" />
                <div className="flex gap-4 pt-1">
                    <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-10 bg-gray-100 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
}