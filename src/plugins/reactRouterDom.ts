import { Link as RouterLink, NavLink as RouterNavLink } from "react-router-dom";

import { BetterHtmlPluginConstructor } from "../types/plugin";

export type ReactRouterDomPluginOptions = {};

export const defaultReactRouterDomPluginOptions: Required<ReactRouterDomPluginOptions> = {};

export const reactRouterDomPlugin: BetterHtmlPluginConstructor<ReactRouterDomPluginOptions> = (options) => ({
   name: "react-router-dom",
   components: {
      Link: RouterLink,
      NavLink: RouterNavLink,
   },
   initialize: () => {
      console.log("react-router-dom plugin initialized");
   },
   getConfig: () => ({
      ...defaultReactRouterDomPluginOptions,
      ...options,
   }),
});
