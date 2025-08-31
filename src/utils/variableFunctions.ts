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
