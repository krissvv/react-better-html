import { BetterCoreConfig, OmitProps } from "react-better-core";

import { Alert } from "../types/alert";

import {
   BetterHtmlInternalConfig,
   externalBetterCoreContextValue,
   externalBetterHtmlContextValue,
} from "../components/BetterHtmlProvider";

export const checkBetterCoreContextValue = (
   value: BetterCoreConfig | undefined,
   functionsName: string,
): value is BetterCoreConfig => {
   if (value === undefined) {
      throw new Error(
         `\`${functionsName}()\` must be used within a \`<BetterCoreProvider>\`. Make sure to add one at the root of your component tree.`,
      );
   }

   return value !== undefined;
};
export const checkBetterHtmlContextValue = (
   value: BetterHtmlInternalConfig | undefined,
   functionsName: string,
): value is BetterHtmlInternalConfig => {
   if (value === undefined) {
      throw new Error(
         `\`${functionsName}()\` must be used within a \`<BetterHtmlProvider>\`. Make sure to add one at the root of your component tree.`,
      );
   }

   return value !== undefined;
};

export const alertControls = {
   createAlert: (alert: OmitProps<Alert, "id">): Alert => {
      if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "alertControls.createAlert"))
         return undefined as any;

      const readyAlert: Alert = {
         id: crypto.randomUUID(),
         ...alert,
      };
      externalBetterHtmlContextValue.setAlerts((oldValue) => [...oldValue, readyAlert]);

      return readyAlert;
   },
   removeAlert: (alertId: string) => {
      if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "alertControls.removeAlert")) return;

      externalBetterHtmlContextValue.setAlerts((oldValue) => oldValue.filter((alert) => alert.id !== alertId));
   },
};

export const sideMenuControls = {
   expand: () => {
      if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "sideMenuControls.expand")) return;

      externalBetterHtmlContextValue.setSideMenuIsCollapsed.setFalse();
   },
   collapse: () => {
      if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "sideMenuControls.collapse")) return;

      externalBetterHtmlContextValue.setSideMenuIsCollapsed.setTrue();
   },
   toggleExpanded: () => {
      if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "sideMenuControls.toggleExpanded")) return;

      externalBetterHtmlContextValue.setSideMenuIsCollapsed.toggle();
   },
   open: () => {
      if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "sideMenuControls.open")) return;

      externalBetterHtmlContextValue.setSideMenuIsOpenMobile.setTrue();
   },
   close: () => {
      if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "sideMenuControls.close")) return;

      externalBetterHtmlContextValue.setSideMenuIsOpenMobile.setFalse();
   },
   toggleOpened: () => {
      if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "sideMenuControls.toggleOpened")) return;

      externalBetterHtmlContextValue.setSideMenuIsOpenMobile.toggle();
   },
};

export const filterHover = (): Record<"z05" | "z1" | "z2" | "z3", React.CSSProperties["filter"]> => {
   if (!checkBetterCoreContextValue(externalBetterCoreContextValue, "filterHover")) return undefined as any;

   return {
      z05: externalBetterCoreContextValue.colorTheme === "dark" ? "brightness(1.2)" : "brightness(0.95)",
      z1: externalBetterCoreContextValue.colorTheme === "dark" ? "brightness(1.3)" : "brightness(0.9)",
      z2: externalBetterCoreContextValue.colorTheme === "dark" ? "brightness(1.6)" : "brightness(0.8)",
      z3: externalBetterCoreContextValue.colorTheme === "dark" ? "brightness(1.9)" : "brightness(0.7)",
   };
};
