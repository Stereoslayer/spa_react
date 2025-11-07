import Modal from "@/components/Modal";

type ConfirmDialogProps = {
    open: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmDialog({
                                          open,
                                          title = "Confirm",
                                          message = "Are you sure?",
                                          confirmText = "Delete",
                                          cancelText = "Cancel",
                                          onConfirm,
                                          onCancel,
                                      }: ConfirmDialogProps) {
    return (
        <Modal
            open={open}
            onClose={onCancel}
            centered
            unstyled
            className="w-full max-w-sm rounded-xl bg-white border border-gray-200 shadow-xl overflow-hidden"
        >
            <div className="px-4 py-3 border-b">
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <div className="px-4 py-4 text-gray-700">
                {message}
            </div>
            <div className="px-4 py-3 border-t flex justify-end gap-2 bg-gray-50">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-md border px-4 py-2 hover:bg-white"
                >
                    {cancelText}
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
}