import { useInRouterContext, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { BetterHtmlPluginConstructor } from "../types/plugin";

export type ReactRouterDomPluginOptions = {
   useNavigate: typeof useNavigate;
   useLocation: typeof useLocation;
   useInRouterContext: typeof useInRouterContext;
   useSearchParams: typeof useSearchParams;
};

export const defaultReactRouterDomPluginOptions: Required<ReactRouterDomPluginOptions> = {
   useNavigate,
   useLocation,
   useInRouterContext,
   useSearchParams,
};

export const reactRouterDomPlugin: BetterHtmlPluginConstructor<ReactRouterDomPluginOptions> = (options) => ({
   name: "react-router-dom",
   initialize: () => {
      console.log("react-router-dom plugin initialized");
   },
   getConfig: () => ({
      ...defaultReactRouterDomPluginOptions,
      ...options,
   }),
});
