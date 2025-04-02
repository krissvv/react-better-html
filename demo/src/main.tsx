import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

import "./main.css";
import BetterHtmlProvider from "../../src/components/BetterHtmlProvider.tsx";

import vite from "./assets/vite.svg";

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <BetterHtmlProvider
         value={{
            assets: {
               logo: vite,
            },
         }}
      >
         <App />
      </BetterHtmlProvider>
   </StrictMode>,
);
