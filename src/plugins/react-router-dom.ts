import { Link as RouterLink, NavLink as RouterNavLink } from "react-router-dom";

import { BetterHtmlPluginConstructor } from "../types/plugin";

export const reactRouterDomPlugin: BetterHtmlPluginConstructor = () => ({
   name: "react-router-dom",
   components: {
      Link: RouterLink,
      NavLink: RouterNavLink,
   },
   initialize: () => {
      console.log("react-router-dom plugin initialized");
   },
});
