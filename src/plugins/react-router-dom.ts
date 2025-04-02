import { Link as RouterLink, NavLink as RouterNavLink } from "react-router-dom";

import { BetterHtmlPlugin } from "../types/plugin";

export const reactRouterDomPlugin: BetterHtmlPlugin = {
   name: "react-router-dom",
   components: {
      Link: RouterLink,
      NavLink: RouterNavLink,
   },
   initialize: () => {
      console.log("react-router-dom plugin initialized");
   },
};
