import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import BetterHtmlProvider from "../../src/components/BetterHtmlProvider.tsx";
import { reactRouterDomPlugin } from "../../src/index.ts";

import vite from "./assets/vite.svg";

import App from "./App.tsx";

import "./main.css";

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <BrowserRouter>
         <BetterHtmlProvider
            value={{
               assets: {
                  logo: vite,
               },
            }}
            plugins={[reactRouterDomPlugin]}
         >
            <Routes>
               <Route path="/" element={<App />} />
            </Routes>
         </BetterHtmlProvider>
      </BrowserRouter>
   </StrictMode>,
);
