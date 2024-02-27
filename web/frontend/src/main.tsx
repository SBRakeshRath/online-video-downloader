import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import InputLinkContextProvider from "./context/inputLinkContextProvider.tsx";
import { BrowserRouter } from "react-router-dom";

import queryClient from "./reactQuery/reactQuery.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <InputLinkContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </InputLinkContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
