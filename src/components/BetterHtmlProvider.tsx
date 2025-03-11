import { createContext, memo, useContext, useMemo } from "react";
import { BetterHtmlConfig, PartialBetterHtmlConfig } from "../types/config";

const betterHtmlContext = createContext<BetterHtmlConfig | undefined>(undefined);

export const useBetterHtmlContext = () => {
   const context = useContext(betterHtmlContext);

   if (context === undefined)
      throw new Error(
         "`useBetterHtmlContext()` must be used within a `<BetterHtmlProvider>`. Make sure to add one at the root of your component tree.",
      );

   return context;
};

export const useTheme = () => {
   const context = useContext(betterHtmlContext);

   if (context === undefined)
      throw new Error(
         "`useTheme()` must be used within a `<BetterHtmlProvider>`. Make sure to add one at the root of your component tree.",
      );

   return context.theme;
};

type BetterHtmlProviderProps = {
   value?: PartialBetterHtmlConfig;
   children?: React.ReactNode;
};

function BetterHtmlProvider({ value, children }: BetterHtmlProviderProps) {
   const readyValue = useMemo<BetterHtmlConfig>(
      () => ({
         theme: {
            styles: {
               space: 16,
               gap: 8,
               borderRadius: 10,
               fontFamily: "Arial, sans-serif",
               transition: "ease 0.2s",
               ...value?.theme?.styles,
            },
            colors: {
               textPrimary: "#111111",
               textSecondary: "#777777",
               label: "#111111",
               primary: "#6d466b",
               secondary: "#412234",
               success: "#28a745",
               info: "#17a2b8",
               warn: "#ffc107",
               error: "#dc3545",
               backgroundBase: "#f8f8f8",
               backgroundSecondary: "#e8e8e8",
               backgroundContent: "#ffffff",
               border: "#ced4da",
               ...value?.theme?.colors,
            },
         },
         icons: {
            ...value?.icons,
         },
         assets: {
            ...value?.assets,
         },
      }),
      [value],
   );

   return <betterHtmlContext.Provider value={readyValue}>{children}</betterHtmlContext.Provider>;
}

export default memo(BetterHtmlProvider);
