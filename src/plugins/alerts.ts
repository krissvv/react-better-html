import { AlertDuration } from "../types/alert";
import { BetterHtmlPluginConstructor } from "../types/plugin";

export type AlertsPluginOptions = {
   /** @default "bottom" */
   position?: "top" | "bottom";
   /** @default "right" */
   align?: "left" | "center" | "right";
   /** @default "auto" */
   defaultDuration?: AlertDuration;
   /** @default 460 */
   maxWidth?: number;
   /** @default true */
   withLoaderBar?: boolean;
   /** @default true */
   withCloseButton?: boolean;
};

export const defaultAlertsPluginOptions: Required<AlertsPluginOptions> = {
   position: "bottom",
   align: "right",
   defaultDuration: "auto",
   maxWidth: 460,
   withLoaderBar: true,
   withCloseButton: true,
};

export const alertsPlugin: BetterHtmlPluginConstructor<AlertsPluginOptions> = (options) => ({
   name: "alerts",
   initialize: () => {
      console.log("alerts plugin initialized");
   },
   getConfig: () => ({
      ...defaultAlertsPluginOptions,
      ...options,
   }),
});
