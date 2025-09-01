export type PluginName = "alerts" | "react-router-dom" | "localStorage";

export type BetterHtmlPluginConstructor<T extends object = object> = (config?: T) => BetterHtmlPlugin<T>;

export type BetterHtmlPlugin<T = object> = {
   name: PluginName;
   initialize?: () => void;
   getConfig: () => T;
};
