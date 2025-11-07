import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Modal from "@/components/Modal";
import type {AppDispatch} from "@/app/store";
import {loadProductById} from "../model/thunks";
import {selectProductsState} from "../model/selectors";
import {ProductFormValues} from "@/features/products/model/formSchema";
import {updateProduct} from "@/features/products/model/slice";
import ProductEditForm from "@/features/products/ui/ProductEditForm";
import {notify} from "@/utils/notify";

export default function ProductDetailsModal() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const {entities, status} = useSelector(selectProductsState);
    const [showImage, setShowImage] = useState(false);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (id && !entities[id]) dispatch(loadProductById(id));
    }, [id, entities, dispatch]);

    const product = id ? entities[id] : null;
    const onClose = () => navigate(-1);

    const initialForm = product
        ? {
            title: product.title,
            description: product.description ?? "",
            price: product.price,
            rating: product.rating,
            thumbnail: product.thumbnail ?? "",
        }
        : {
            title: "",
            description: "",
            price: undefined,
            rating: undefined,
            thumbnail: "",
        };

    const submitEdit = async (data: ProductFormValues) => {
        if (!product) return;
        dispatch(updateProduct({
            id: product.id, patch: {
                title: data.title.trim(),
                description: data.description.trim(),
                price: data.price,
                rating: data.rating,
                thumbnail: data.thumbnail,
            }
        }));
        setEditMode(false);
        notify.ok("Изменения сохранены");
    };


    return (
        <>
            <Modal
                open={true}
                onClose={onClose}
                unstyled
                centered
                className="w-full max-w-5xl rounded-2xl bg-white border border-gray-200 shadow-xl overflow-hidden"
                closeOnEsc={!showImage}>
                <div className="flex items-start justify-between px-4 py-3 border-b">
                    <h2 className="text-xl font-semibold">
                        {product?.title ?? (status === "loading" ? "Loading..." : "Not found")}
                    </h2>
                    <div className="flex gap-2">
                        {product && !editMode && (
                            <button
                                type="button"
                                onClick={() => setEditMode(true)}
                                className="rounded-md border px-3 py-2 hover:bg-gray-50"
                            >
                                Edit
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md p-2 hover:bg-gray-100"
                            aria-label="Close"
                            title="Close"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="relative">
                    {editMode ? (
                        <ProductEditForm
                            initial={initialForm}
                            onSubmit={submitEdit}
                            onCancel={() => setEditMode(false)}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            {product?.thumbnail ? (
                                <div
                                    className="w-full h-64 md:h-80 rounded-lg border bg-gray-50 flex items-center justify-center">
                                    <img
                                        src={product.thumbnail}
                                        alt={product.title}
                                        className="max-w-full max-h-full object-contain cursor-zoom-in"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowImage(true);
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-64 md:h-80 rounded-lg border bg-gray-50"/>
                            )}

                            <div className="space-y-3">
                                <p className="text-gray-700">{product?.description}</p>
                                <div className="flex gap-6 text-sm">
                                    {product?.price != null && <span className="font-medium">${product.price}</span>}
                                    {product?.rating != null && <span>★ {product.rating}</span>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            {product?.thumbnail && (
                <Modal
                    open={showImage}
                    onClose={() => setShowImage(false)}
                    unstyled
                    centered
                    overlayClassName="bg-black"
                    closeOnEsc={true}
                    className="relative bg-white rounded-2xl shadow-2xl aspect-square"
                    style={{width: "min(94vmin, 880px)", height: "min(94vmin, 880px)"} as any}
                >
                    <button
                        type="button"
                        onClick={() => setShowImage(false)}
                        className="absolute right-4 top-4 z-10 rounded-md p-2 text-gray-600 hover:bg-gray-100"
                        aria-label="Close image"
                        title="Close"
                    >
                        ✕
                    </button>

                    <div
                        className="w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-full h-full object-contain select-none rounded-xl"
                            draggable={false}
                        />
                    </div>
                </Modal>
            )}
        </>
    );
}