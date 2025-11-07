import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { store, persistor } from "./app/store";
import { AppRoutes } from "./app/router";
import "./index.css";
import {Toaster} from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter basename="/spa_react">
                    <AppRoutes />
                </BrowserRouter>
            </PersistGate>
        </Provider>
        <Toaster position="top-right" />
    </React.StrictMode>
);