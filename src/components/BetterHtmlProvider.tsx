import { createContext, memo, useContext, useEffect, useMemo, useState } from "react";
import { createGlobalStyle } from "styled-components";

import { theme } from "../constants/theme";
import { icons } from "../constants/icons";
import { assets } from "../constants/assets";

import { BetterHtmlConfig } from "../types/config";
import { DeepPartialRecord } from "../types/app";
import { ColorTheme } from "../types/theme";

const GlobalStyle = createGlobalStyle<{ fontFamily: string; color: string; backgroundColor: string }>`
   body {
      font-family: ${(props) => props.fontFamily};
      color: ${(props) => props.color};
      background-color: ${(props) => props.backgroundColor};
   }

   * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
   }

   a {
      text-decoration: none;
      color: inherit;
   }
`;

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

   const [currentTheme, setCurrentTheme] = useState<ColorTheme>("light");

   if (context === undefined)
      throw new Error(
         "`useTheme()` must be used within a `<BetterHtmlProvider>`. Make sure to add one at the root of your component tree.",
      );

   useEffect(() => {
      const html = document.querySelector("html");

      if (!html) return;

      const observer = new MutationObserver((mutations) => {
         mutations.forEach((mutation) => {
            if (mutation.type === "attributes") {
               setCurrentTheme(html.getAttribute("data-theme") as ColorTheme);
            }
         });
      });

      observer.observe(html, {
         attributes: true,
      });

      return () => {
         observer.disconnect();
      };
   }, []);

   return {
      ...context.theme,
      colors: context.theme.colors[currentTheme] ?? context.theme.colors.light,
   };
};

type BetterHtmlProviderContentProps = {
   children?: React.ReactNode;
};

function BetterHtmlProviderContent({ children }: BetterHtmlProviderContentProps) {
   const theme = useTheme();

   return (
      <>
         <GlobalStyle
            fontFamily={theme.styles.fontFamily}
            color={theme.colors.textPrimary}
            backgroundColor={theme.colors.backgroundBase}
         />

         {children}
      </>
   );
}

type BetterHtmlProviderProps = {
   value?: DeepPartialRecord<BetterHtmlConfig>;
   children?: React.ReactNode;
};

function BetterHtmlProvider({ value, children }: BetterHtmlProviderProps) {
   const readyValue = useMemo<BetterHtmlConfig>(
      () => ({
         theme: {
            styles: {
               ...theme.styles,
               ...value?.theme?.styles,
            },
            colors: {
               light: {
                  ...theme.colors.light,
                  ...value?.theme?.colors?.light,
               },
               dark: {
                  ...theme.colors.dark,
                  ...value?.theme?.colors?.dark,
               },
            },
         },
         icons: {
            ...icons,
            ...value?.icons,
         },
         assets: {
            ...assets,
            ...value?.assets,
         },
      }),
      [value],
   );

   return (
      <betterHtmlContext.Provider value={readyValue}>
         <BetterHtmlProviderContent>{children}</BetterHtmlProviderContent>
      </betterHtmlContext.Provider>
   );
}

export default memo(BetterHtmlProvider);
