"use client";

import { store } from "./store";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <Provider store={store}>
                <Router>
                    {children}
                </Router>
            </Provider>
        </SessionProvider>
    )

};

