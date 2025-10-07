import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import BetterHtmlProvider from "../../src/components/BetterHtmlProvider";
import { alertsPlugin, BetterHtmlPlugin, reactRouterDomPlugin } from "../../src/index.ts";

import vite from "./assets/vite.svg";

import App from "./App.tsx";

import "./main.css";

const plugins: BetterHtmlPlugin[] = [reactRouterDomPlugin(), alertsPlugin()];

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <BrowserRouter>
         <BetterHtmlProvider
            config={{
               assets: {
                  logo: vite,
               },
            }}
            plugins={plugins}
         >
            <Routes>
               <Route path="/" element={<App />} />
            </Routes>
         </BetterHtmlProvider>
      </BrowserRouter>
   </StrictMode>,
);
