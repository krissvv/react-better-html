import { BetterHtmlPluginConstructor } from "../types/plugin";

export type LocalStoragePluginOptions = {
   encryption?:
      | {
           /** @default false */
           enabled?: false;
        }
      | {
           /** @default false */
           enabled?: true;
           secretKey: string;
           iv: string;
        };
};

export const defaultLocalStoragePluginOptions: Required<LocalStoragePluginOptions> = {
   encryption: {},
};

export const localStoragePlugin: BetterHtmlPluginConstructor<LocalStoragePluginOptions> = (options) => ({
   name: "localStorage",
   initialize: () => {
      console.log("localStorage plugin initialized");
   },
   getConfig: () => ({
      ...defaultLocalStoragePluginOptions,
      ...options,
   }),
});
