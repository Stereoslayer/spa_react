export default function EmptyState({
                                       title = "Ничего не найдено",
                                       hint,
                                       actionText,
                                       onAction,
                                   }: {
    title?: string;
    hint?: string;
    actionText?: string;
    onAction?: () => void;
}) {
    return (
        <div className="rounded-xl border bg-white p-10 text-center text-gray-600">
            <div className="text-lg font-medium">{title}</div>
            {hint && <div className="mt-2 text-sm text-gray-500">{hint}</div>}
            {onAction && actionText && (
                <button
                    onClick={onAction}
                    className="mt-4 rounded-md border px-4 py-2 hover:bg-gray-50"
                >
                    {actionText}
                </button>
            )}
        </div>
    );
}