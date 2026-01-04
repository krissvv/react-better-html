import { createContext, memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
   useBooleanState,
   OmitProps,
   DeepPartialRecord,
   colorThemeControls,
   useTheme,
   Color,
   BetterCoreProvider,
   BetterCoreProviderConfig,
   BetterCoreConfig,
   useBetterCoreContext,
} from "react-better-core";
import { createGlobalStyle } from "styled-components";

import { appConfig } from "../constants/app";
import { theme } from "../constants/theme";
import { icons } from "../constants/icons";
import { assets } from "../constants/assets";

import { BetterHtmlConfig } from "../types/config";
import { Alert } from "../types/alert";
import { BetterHtmlPlugin, PluginName } from "../types/plugin";

import { TabGroup, TabsComponentState } from "./Tabs";
import AlertsHolder from "./alerts/AlertsHolder";

const GlobalStyle = createGlobalStyle<{ fontFamily: string; color: Color; backgroundColor: Color }>`
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
   alerts: Alert[];
   setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
   setSideMenuIsCollapsed: ReturnType<typeof useBooleanState>[1];
   setSideMenuIsOpenMobile: ReturnType<typeof useBooleanState>[1];
   plugins: BetterHtmlPlugin[];
   componentsState: {
      tabs: TabsComponentState;
   };
};

const betterHtmlContext = createContext<BetterHtmlInternalConfig | undefined>(undefined);
export let externalBetterCoreContextValue: BetterCoreConfig | undefined;
export let externalBetterHtmlContextValue: BetterHtmlInternalConfig | undefined;

export const useBetterHtmlContext = (): BetterHtmlConfig & BetterCoreConfig => {
   const coreContext = useBetterCoreContext();
   const context = useContext(betterHtmlContext);

   if (context === undefined)
      throw new Error(
         "`useBetterHtmlContext()` must be used within a `<BetterHtmlProvider>`. Make sure to add one at the root of your component tree.",
      );

   const { alerts, setAlerts, setSideMenuIsCollapsed, setSideMenuIsOpenMobile, plugins, componentsState, ...rest } =
      context;

   return {
      ...coreContext,
      ...rest,
   };
};

export const useBetterHtmlContextInternal = (): BetterHtmlInternalConfig => {
   const context = useContext(betterHtmlContext);

   if (context === undefined)
      throw new Error(
         "`useBetterHtmlContextInternal()` must be used within a `<BetterHtmlProvider>`. Make sure to add one at the root of your component tree.",
      );

   return context;
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

type BetterHtmlProviderInternalContentProps = {
   children?: React.ReactNode;
};

function BetterHtmlProviderInternalContent({ children }: BetterHtmlProviderInternalContentProps) {
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

export type BetterHtmlProviderInternalConfig = DeepPartialRecord<BetterHtmlConfig>;

type BetterProviderCommonProps = {
   plugins?: BetterHtmlPlugin[];
   children?: React.ReactNode;
};

type BetterHtmlProviderInternalProps = BetterProviderCommonProps & {
   config?: BetterHtmlProviderInternalConfig;
};

function BetterHtmlProviderInternal({ config, plugins, children }: BetterHtmlProviderInternalProps) {
   const betterCoreContext = useBetterCoreContext();

   const [alerts, setAlerts] = useState<Alert[]>([]);
   const [sideMenuIsCollapsed, setSideMenuIsCollapsed] = useBooleanState();
   const [sideMenuIsOpenMobile, setSideMenuIsOpenMobile] = useBooleanState();
   const [tabGroups, setTabGroups] = useState<TabGroup[]>([]);
   const [tabsWithDots, setTabsWithDots] = useState<string[]>([]);

   const readyConfig = useMemo<BetterHtmlInternalConfig>(
      () => ({
         app: {
            ...appConfig,
            ...config?.app,
         },
         alerts,
         setAlerts,
         sideMenuIsCollapsed,
         setSideMenuIsCollapsed,
         sideMenuIsOpenMobile,
         setSideMenuIsOpenMobile,
         components: {
            ...config?.components,
         },
         plugins: plugins ?? [],
         componentsState: {
            tabs: {
               tabGroups,
               setTabGroups,
               tabsWithDots,
               setTabsWithDots,
            },
         },
      }),
      [config, alerts, sideMenuIsCollapsed, sideMenuIsOpenMobile, plugins, tabGroups, tabsWithDots],
   );

   useEffect(() => {
      if (!plugins) return;

      plugins.forEach((plugin) => {
         plugin.initialize?.();
      });
   }, []);

   externalBetterCoreContextValue = betterCoreContext;
   externalBetterHtmlContextValue = readyConfig;

   return (
      <betterHtmlContext.Provider value={readyConfig}>
         <BetterHtmlProviderInternalContent>{children}</BetterHtmlProviderInternalContent>
      </betterHtmlContext.Provider>
   );
}

export type BetterHtmlProviderConfig = BetterCoreProviderConfig & BetterHtmlProviderInternalConfig;

type BetterHtmlProviderProps = BetterProviderCommonProps & {
   config?: BetterHtmlProviderConfig;
};

function BetterHtmlProvider({ config, ...props }: BetterHtmlProviderProps) {
   const coreConfig = useMemo<BetterCoreProviderConfig>(
      () => ({
         theme: {
            ...theme,
            ...config?.theme,
         },
         colorTheme: config?.colorTheme ?? (localStorage.getItem("theme") === "dark" ? "dark" : "light"),
         icons: {
            ...icons,
            ...config?.icons,
         },
         assets: {
            ...assets,
            ...config?.assets,
         },
         loaders: config?.loaders,
      }),
      [config],
   );

   const htmlConfig = useMemo<BetterHtmlProviderInternalConfig>(
      () => ({
         app: config?.app,
         sideMenuIsCollapsed: config?.sideMenuIsCollapsed,
         sideMenuIsOpenMobile: config?.sideMenuIsOpenMobile,
         components: config?.components,
      }),
      [config],
   );

   useEffect(() => {
      const html = document.querySelector("html");

      if (!html) return;

      html.setAttribute("data-theme", localStorage.getItem("theme") === "dark" ? "dark" : "light");

      const observer = new MutationObserver((mutations) => {
         mutations.forEach((mutation) => {
            if (mutation.type === "attributes") {
               const newColorTheme = html.getAttribute("data-theme") === "dark" ? "dark" : "light";

               colorThemeControls.toggleTheme(newColorTheme);
               localStorage.setItem("theme", newColorTheme);
            }
         });
      });

      observer.observe(html, {
         attributes: true,
         attributeFilter: ["data-theme"],
      });

      return () => {
         observer.disconnect();
      };
   }, []);

   return (
      <BetterCoreProvider config={coreConfig}>
         <BetterHtmlProviderInternal config={htmlConfig} {...props} />
      </BetterCoreProvider>
   );
}

export default memo(BetterHtmlProvider);
