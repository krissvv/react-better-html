import { AnyOtherString, OmitProps } from "../types/app";
import { LoaderName } from "../types/loader";
import { ColorTheme } from "../types/theme";
import { Alert } from "../types/alert";

import { BetterHtmlInternalConfig, externalBetterHtmlContextValue } from "../components/BetterHtmlProvider";

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

export const loaderControls = {
   startLoading: (loaderName: LoaderName | AnyOtherString) => {
      if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "loaderControls.startLoading")) return;

      externalBetterHtmlContextValue.setLoaders((oldValue) => ({
         ...oldValue,
         [loaderName.toString()]: true,
      }));
   },
   stopLoading: (loaderName: LoaderName | AnyOtherString) => {
      if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "loaderControls.stopLoading")) return;

      externalBetterHtmlContextValue.setLoaders((oldValue) => ({
         ...oldValue,
         [loaderName.toString()]: false,
      }));
   },
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
   open: () => {
      if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "sideMenuControls.open")) return;

      externalBetterHtmlContextValue.setSideMenuIsOpenMobile.setTrue();
   },
   close: () => {
      if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "sideMenuControls.close")) return;

      externalBetterHtmlContextValue.setSideMenuIsOpenMobile.setFalse();
   },
};

export const colorThemeControls = {
   toggleTheme: (theme?: ColorTheme) => {
      if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "colorThemeControls.toggleTheme")) return;

      const currentColorTheme = externalBetterHtmlContextValue.colorTheme;
      const newColorTheme = theme ?? (currentColorTheme === "dark" ? "light" : "dark");

      setTimeout(() => {
         window.document.body.parentElement?.setAttribute("data-theme", newColorTheme);
         localStorage.setItem("theme", newColorTheme);
      }, 0.01 * 1000);
   },
};

export const filterHover = (): Record<"z05" | "z1" | "z2" | "z3", React.CSSProperties["filter"]> => {
   if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "filterHover")) return undefined as any;

   return {
      z05: externalBetterHtmlContextValue.colorTheme === "dark" ? "brightness(1.2)" : "brightness(0.95)",
      z1: externalBetterHtmlContextValue.colorTheme === "dark" ? "brightness(1.3)" : "brightness(0.9)",
      z2: externalBetterHtmlContextValue.colorTheme === "dark" ? "brightness(1.6)" : "brightness(0.8)",
      z3: externalBetterHtmlContextValue.colorTheme === "dark" ? "brightness(1.9)" : "brightness(0.7)",
   };
};
