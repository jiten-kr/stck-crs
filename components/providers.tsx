"use client";

import type React from "react";

import { Provider } from "react-redux";
import { persistor, store } from "@/lib/store";

import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
        <Toaster />
      </PersistGate>
    </Provider>
  );
}
