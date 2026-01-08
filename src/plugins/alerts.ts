import { PartialRecord } from "react-better-core";

import { AlertDisplay, AlertDuration, AlertType } from "../types/alert";
import { BetterHtmlPluginConstructor } from "../types/plugin";

export type AlertsPluginOptions = {
   /** @default "bottom" */
   position?: "top" | "bottom";
   /** @default "right" */
   align?: "left" | "center" | "right";
   /** @default "auto" */
   defaultDuration?: AlertDuration;
   defaultDisplay?: PartialRecord<AlertType, AlertDisplay>;
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
   defaultDisplay: {},
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
