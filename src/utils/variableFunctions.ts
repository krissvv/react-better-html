import { AnyOtherString } from "../types/app";
import { LoaderName } from "../types/loader";

import { BetterHtmlInternalConfig, externalBetterHtmlContextValue } from "../components/BetterHtmlProvider";

const checkBetterHtmlContextValue = (
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
