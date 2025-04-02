import { createContext, memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createGlobalStyle } from "styled-components";

import { theme } from "../constants/theme";
import { icons } from "../constants/icons";
import { assets } from "../constants/assets";
import { appConfig } from "../constants/app";

import { BetterHtmlConfig } from "../types/config";
import { AnyOtherString, DeepPartialRecord } from "../types/app";
import { ColorTheme } from "../types/theme";
import { LoaderConfig, LoaderName } from "../types/loader";
import { BetterHtmlPlugin, PluginName } from "../types/plugin";

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

type BetterHtmlInternalConfig = BetterHtmlConfig & {
   setLoaders: React.Dispatch<React.SetStateAction<Partial<LoaderConfig>>>;
   plugins: BetterHtmlPlugin[];
};

const betterHtmlContext = createContext<BetterHtmlInternalConfig | undefined>(undefined);

export const useBetterHtmlContext = (): BetterHtmlConfig => {
   const context = useContext(betterHtmlContext);

   if (context === undefined)
      throw new Error(
         "`useBetterHtmlContext()` must be used within a `<BetterHtmlProvider>`. Make sure to add one at the root of your component tree.",
      );

   const { setLoaders, ...rest } = context;

   return rest;
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

export const useLoader = (loaderName?: LoaderName | AnyOtherString): boolean => {
   const context = useContext(betterHtmlContext);

   if (context === undefined)
      throw new Error(
         "`useLoader()` must be used within a `<BetterHtmlProvider>`. Make sure to add one at the root of your component tree.",
      );

   return loaderName ? context.loaders[loaderName.toString()] ?? false : false;
};

export const useLoaderControls = () => {
   const context = useContext(betterHtmlContext);

   if (context === undefined)
      throw new Error(
         "`useLoaderControls()` must be used within a `<BetterHtmlProvider>`. Make sure to add one at the root of your component tree.",
      );

   const startLoading = useCallback((loaderName: LoaderName | AnyOtherString) => {
      context.setLoaders((oldValue) => ({
         ...oldValue,
         [loaderName.toString()]: true,
      }));
   }, []);
   const stopLoading = useCallback((loaderName: LoaderName | AnyOtherString) => {
      context.setLoaders((oldValue) => ({
         ...oldValue,
         [loaderName.toString()]: false,
      }));
   }, []);

   return {
      startLoading,
      stopLoading,
   };
};

export const usePlugin = (pluginName: PluginName): BetterHtmlPlugin | undefined => {
   const context = useContext(betterHtmlContext);

   if (context === undefined) {
      throw new Error(
         "`usePlugin()` must be used within a `<BetterHtmlProvider>`. Make sure to add one at the root of your component tree.",
      );
   }

   return context.plugins.find((plugin: BetterHtmlPlugin) => plugin.name === pluginName);
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
   plugins?: BetterHtmlPlugin[];
   children?: React.ReactNode;
};

function BetterHtmlProvider({ value, plugins: pluginsToUse, children }: BetterHtmlProviderProps) {
   const [loaders, setLoaders] = useState<Partial<LoaderConfig>>(value?.loaders ?? {});
   const [plugins] = useState<BetterHtmlPlugin[]>(pluginsToUse ?? []);

   const readyValue = useMemo<BetterHtmlInternalConfig>(
      () => ({
         app: {
            ...appConfig,
            ...value?.app,
         },
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
         loaders,
         setLoaders,
         components: {
            ...value?.components,
         },
         plugins,
      }),
      [value, loaders, plugins],
   );

   useEffect(() => {
      plugins.forEach((plugin) => {
         plugin.initialize?.();
      });
   }, [plugins]);

   return (
      <betterHtmlContext.Provider value={readyValue}>
         <BetterHtmlProviderContent>{children}</BetterHtmlProviderContent>
      </betterHtmlContext.Provider>
   );
}

export default memo(BetterHtmlProvider);
