import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import BetterHtmlProvider from "../../src/components/BetterHtmlProvider";
import { alertsPlugin, BetterHtmlPlugin, reactRouterDomPlugin } from "../../src/index.ts";

import vite from "./assets/vite.svg";

import App from "./App.tsx";
import Home from "./pages/Home.tsx";

import "./main.css";

const plugins: BetterHtmlPlugin[] = [reactRouterDomPlugin(), alertsPlugin()];

createRoot(document.getElementById("root")!).render(
   <BrowserRouter>
      <BetterHtmlProvider
         config={{
            assets: {
               logo: vite,
            },
            components: {
               button: {
                  tagReplacement: {
                     linkComponent: Link,
                  },
               },
            },
            devMode: true,
         }}
         plugins={plugins}
      >
         <Routes>
            <Route path="/" element={<App />}>
               <Route index element={<Home />} />
               <Route path="/submenu-item-1" element={<>submenu-item-1</>} />
               <Route path="/submenu-item-2" element={<>submenu-item-2</>} />
               <Route path="/main-2" element={<>main-2</>} />
            </Route>
         </Routes>
      </BetterHtmlProvider>
   </BrowserRouter>,
);
