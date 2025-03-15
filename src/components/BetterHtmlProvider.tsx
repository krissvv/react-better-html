import { createContext, memo, useContext, useEffect, useMemo, useState } from "react";
import { createGlobalStyle } from "styled-components";

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
               space: 16,
               gap: 8,
               borderRadius: 10,
               fontFamily: "Arial, sans-serif",
               transition: "ease 0.2s",
               ...value?.theme?.styles,
            },
            colors: {
               light: {
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
                  ...value?.theme?.colors?.light,
               },
               dark: {
                  textPrimary: "#f8f8f8",
                  textSecondary: "#e8e8e8",
                  label: "#111111",
                  primary: "#9b6499",
                  secondary: "#6c466b",
                  success: "#28a745",
                  info: "#17a2b8",
                  warn: "#ffc107",
                  error: "#dc3545",
                  backgroundBase: "#111111",
                  backgroundSecondary: "#222222",
                  backgroundContent: "#333333",
                  border: "#777777",
                  ...value?.theme?.colors?.dark,
               },
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

   return (
      <betterHtmlContext.Provider value={readyValue}>
         <BetterHtmlProviderContent>{children}</BetterHtmlProviderContent>
      </betterHtmlContext.Provider>
   );
}

export default memo(BetterHtmlProvider);
