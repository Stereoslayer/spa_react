import { useLocation, useNavigate } from "react-router-dom";
import type { Product } from "../model/types";
import { Heart, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store";
import { toggleLike, softDelete } from "../model/slice";
import { selectLikedMap } from "../model/selectors";
import { cn } from "@/utils/cn";
import React, {useState} from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import {notify} from "@/utils/notify";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const likedMap = useSelector(selectLikedMap);
    const isLiked = !!likedMap[product.id];
    const [confirmOpen, setConfirmOpen] = useState(false);

    const goDetails = () =>
        navigate(`/products/${product.id}`, { state: { background: location } });

    const onLike: React.MouseEventHandler = (e) => {
        e.stopPropagation();
        dispatch(toggleLike(product.id));
    };

    const onAskDelete: React.MouseEventHandler = (e) => {
        e.stopPropagation();
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        setConfirmOpen(false);
        dispatch(softDelete(product.id));
        notify.ok("Карточка удалена");
    };

    const cancelDelete = () => setConfirmOpen(false);

    return (
        <>
        <div
            onClick={goDetails}
            className="relative cursor-pointer rounded-xl border bg-white shadow-sm hover:shadow-md transition overflow-hidden"
        >
            <div className="absolute right-2 top-2 z-10 flex gap-1">
                <button
                    onClick={onLike}
                    className={cn(
                        "rounded-md p-2 bg-white/90 border hover:bg-white shadow",
                        isLiked && "text-red-600"
                    )}
                    aria-label="Like"
                    title="Like"
                >
                    <Heart size={18} className={cn(isLiked && "fill-red-600")} />
                </button>
                <button
                    onClick={onAskDelete}
                    className="rounded-md p-2 bg-white/90 border hover:bg-white text-gray-700 shadow"
                    aria-label="Delete"
                    title="Delete"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <div className="h-40 w-full bg-gray-50 flex items-center justify-center">
                {product.thumbnail ? (
                    <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                    />
                ) : (
                    <div className="text-gray-400 text-sm">No image</div>
                )}
            </div>

            <div className="p-4 space-y-2">
                <h3 className="font-medium line-clamp-1">{product.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
                <div className="text-sm text-gray-800 flex gap-4">
                    {product.price != null && <span>${product.price}</span>}
                    {product.rating != null && <span>★ {product.rating}</span>}
                </div>
            </div>
        </div>
    <ConfirmDialog
        open={confirmOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        title="Удалить карточку?"
        message={`Карточка «${product.title}» будет удалена из списка. Действие можно отменить только перезагрузкой данных.`}
        confirmText="Удалить"
        cancelText="Отмена"
    />
    </>
    );
}