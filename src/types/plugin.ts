import { ComponentType } from "react";

export type PluginName = "alerts" | "react-router-dom" | "localStorage";

export type BetterHtmlPluginConstructor<T extends object = object> = (config?: T) => BetterHtmlPlugin<T>;

export type BetterHtmlPlugin<T = object> = {
   name: PluginName;
   components?: Record<string, ComponentType<any>>;
   initialize?: () => void;
   getConfig?: () => T;
};
