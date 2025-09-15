import { createContext, memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createGlobalStyle } from "styled-components";

import { theme } from "../constants/theme";
import { icons } from "../constants/icons";
import { assets } from "../constants/assets";
import { appConfig } from "../constants/app";

import { BetterHtmlConfig } from "../types/config";
import { AnyOtherString, DeepPartialRecord, OmitProps } from "../types/app";
import { ColorTheme } from "../types/theme";
import { LoaderConfig, LoaderName } from "../types/loader";
import { Alert } from "../types/alert";
import { BetterHtmlPlugin, PluginName } from "../types/plugin";

import { LocalStorage } from "../utils/localStorage";

import { TabGroup, TabsComponentState } from "./Tabs";
import AlertsHolder from "./alerts/AlertsHolder";

const GlobalStyle = createGlobalStyle<{ fontFamily: string; color: string; backgroundColor: string }>`
   html {
      background-color: ${(props) => props.backgroundColor};
   }

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

   .react-better-html-no-scrollbar::-webkit-scrollbar {
      display: none;
   }
`;

export type BetterHtmlInternalConfig = BetterHtmlConfig & {
   setLoaders: React.Dispatch<React.SetStateAction<Partial<LoaderConfig>>>;
   alerts: Alert[];
   setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
   plugins: BetterHtmlPlugin[];
   componentsState: {
      tabs: TabsComponentState;
   };
};

const betterHtmlContext = createContext<BetterHtmlInternalConfig | undefined>(undefined);

export let externalBetterHtmlContextValue: BetterHtmlInternalConfig | undefined;

export const useBetterHtmlContext = (): BetterHtmlConfig => {
   const context = useContext(betterHtmlContext);

   if (context === undefined)
      throw new Error(
         "`useBetterHtmlContext()` must be used within a `<BetterHtmlProvider>`. Make sure to add one at the root of your component tree.",
      );

   const { setLoaders, plugins, componentsState, ...rest } = context;

   return rest;
};

export const useBetterHtmlContextInternal = (): BetterHtmlInternalConfig => {
   const context = useContext(betterHtmlContext);

   if (context === undefined)
      throw new Error(
         "`useBetterHtmlContextInternal()` must be used within a `<BetterHtmlProvider>`. Make sure to add one at the root of your component tree.",
      );

   return context;
};

export const useTheme = () => {
   const context = useContext(betterHtmlContext);

   if (context === undefined)
      throw new Error(
         "`useTheme()` must be used within a `<BetterHtmlProvider>`. Make sure to add one at the root of your component tree.",
      );

   return {
      ...context.theme,
      colors: context.theme.colors[context.colorTheme] ?? context.theme.colors.light,
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

export const useAlertControls = () => {
   const context = useContext(betterHtmlContext);

   if (context === undefined)
      throw new Error(
         "`useAlertControls()` must be used within a `<BetterHtmlProvider>`. Make sure to add one at the root of your component tree.",
      );

   const createAlert = useCallback((alert: OmitProps<Alert, "id">): Alert => {
      const readyAlert: Alert = {
         id: crypto.randomUUID(),
         ...alert,
      };
      context.setAlerts((oldValue) => [...oldValue, readyAlert]);

      return readyAlert;
   }, []);
   const removeAlert = useCallback((alertId: string) => {
      context.setAlerts((oldValue) => oldValue.filter((alert) => alert.id !== alertId));
   }, []);

   return {
      createAlert,
      removeAlert,
   };
};

export const usePlugin = <T extends object>(pluginName: PluginName): BetterHtmlPlugin<T> | undefined => {
   const context = useContext(betterHtmlContext);

   if (context === undefined) {
      throw new Error(
         "`usePlugin()` must be used within a `<BetterHtmlProvider>`. Make sure to add one at the root of your component tree.",
      );
   }

   return useMemo(
      () => context.plugins.find((plugin: BetterHtmlPlugin) => plugin.name === pluginName),
      [context.plugins, pluginName],
   ) as any;
};

type BetterHtmlProviderContentProps = {
   children?: React.ReactNode;
};

function BetterHtmlProviderContent({ children }: BetterHtmlProviderContentProps) {
   const theme = useTheme();
   const alertsPlugin = usePlugin("alerts");

   return (
      <>
         <GlobalStyle
            fontFamily={theme.styles.fontFamily}
            color={theme.colors.textPrimary}
            backgroundColor={theme.colors.backgroundBase}
         />

         {children}

         {alertsPlugin && <AlertsHolder />}
      </>
   );
}

export type BetterHtmlProviderValue = DeepPartialRecord<BetterHtmlConfig>;

type BetterHtmlProviderProps = {
   value?: BetterHtmlProviderValue;
   plugins?: BetterHtmlPlugin[];
   children?: React.ReactNode;
};

function BetterHtmlProvider({ value, plugins: pluginsToUse, children }: BetterHtmlProviderProps) {
   const [colorTheme, setColorTheme] = useState<ColorTheme>(
      LocalStorage.getItem("theme") === "dark" ? "dark" : value?.colorTheme ?? "light",
   );
   const [loaders, setLoaders] = useState<Partial<LoaderConfig>>(value?.loaders ?? {});
   const [plugins] = useState<BetterHtmlPlugin[]>(pluginsToUse ?? []);
   const [alerts, setAlerts] = useState<Alert[]>([]);
   const [tabGroups, setTabGroups] = useState<TabGroup[]>([]);
   const [tabsWithDots, setTabsWithDots] = useState<string[]>([]);

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
         colorTheme,
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
         alerts,
         setAlerts,
         components: {
            ...value?.components,
         },
         plugins,
         componentsState: {
            tabs: {
               tabGroups,
               setTabGroups,
               tabsWithDots,
               setTabsWithDots,
            },
         },
      }),
      [value, colorTheme, loaders, alerts, plugins, tabGroups, tabsWithDots],
   );

   useEffect(() => {
      plugins.forEach((plugin) => {
         plugin.initialize?.();
      });
   }, [plugins]);
   useEffect(() => {
      const html = document.querySelector("html");

      if (!html) return;

      const observer = new MutationObserver((mutations) => {
         mutations.forEach((mutation) => {
            if (mutation.type === "attributes") {
               setColorTheme(html.getAttribute("data-theme") === "dark" ? "dark" : value?.colorTheme ?? "light");
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

   externalBetterHtmlContextValue = readyValue;

   return (
      <betterHtmlContext.Provider value={readyValue}>
         <BetterHtmlProviderContent>{children}</BetterHtmlProviderContent>
      </betterHtmlContext.Provider>
   );
}

export default memo(BetterHtmlProvider) as typeof BetterHtmlProvider;
