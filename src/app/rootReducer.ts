import { combineReducers } from "@reduxjs/toolkit";
import productsReducer from "@/features/products/model/slice";

export const rootReducer = combineReducers({
    products: productsReducer,
});