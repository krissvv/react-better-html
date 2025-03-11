import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

import "./main.css";
import BetterHtmlProvider from "../../src/components/BetterHtmlProvider.tsx";

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <BetterHtmlProvider>
         <App />
      </BetterHtmlProvider>
   </StrictMode>,
);
