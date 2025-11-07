import React from "react";
import {Routes, Route, Navigate, useLocation} from "react-router-dom";
import ProductsPage from "@/features/products/ui/ProductsPage";
import ProductDetailsPage from "@/features/products/ui/ProductDetailsPage";   // ⚠️ добавь
import ProductDetailsModal from "@/features/products/ui/ProductDetailsModal";
import CreateProductPage from "@/features/products/ui/CreateProductPage";
import Container from "@/components/Container";

const withLayout = (node: React.ReactNode) => (
    <Container className="py-6">{node}</Container>
);

export function AppRoutes() {
    const location = useLocation();
    const state = location.state as { background?: Location } | undefined;
    const backgroundLocation = state?.background;

    return (
        <>
            <Routes location={backgroundLocation || location}>
                <Route path="/" element={<Navigate to="/products" replace/>}/>
                <Route path="/products" element={withLayout(<ProductsPage/>)}/>
                <Route
                    path="/products/:id"
                    element={withLayout(<ProductDetailsPage/>)}
                />
                <Route path="/create-product" element={withLayout(<CreateProductPage/>)}/>
                <Route path="*" element={<Navigate to="/products" replace/>}/>
            </Routes>

            {backgroundLocation && (
                <Routes>
                    <Route path="/products/:id" element={<ProductDetailsModal/>}/>
                </Routes>
            )}
        </>
    );
}