"use client";

import { SessionProvider } from "next-auth/react";
import { AppProvider } from "../context/AppContext";
import { LanguageProvider } from "../context/LanguageContext";
import { ToastProvider } from "../context/ToastContext";

export default function Providers({ children }) {
    return (
        <SessionProvider>
            <LanguageProvider>
                <ToastProvider>
                    <AppProvider>
                        {children}
                    </AppProvider>
                </ToastProvider>
            </LanguageProvider>
        </SessionProvider>
    );
}
