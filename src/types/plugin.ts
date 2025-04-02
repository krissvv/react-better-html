import { ComponentType } from "react";

export type PluginName = "react-router-dom";

export type BetterHtmlPlugin = {
   name: PluginName;
   components?: Record<string, ComponentType<any>>;
   initialize?: () => void;
};
