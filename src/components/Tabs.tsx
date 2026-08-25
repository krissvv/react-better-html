import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Color, useTheme } from "react-better-core";

import { ComponentMarginProps, ComponentPropWithRef } from "../types/components";

import { useUrlQuery } from "../utils/hooks";
import { filterHover } from "../utils/variableFunctions";

import Div from "./Div";
import Text from "./Text";
import { useBetterHtmlContextInternal, usePlugin } from "./BetterHtmlProvider";

const tabBottomLineWidth = 2;
const tabDotSize = 6;
const defaultTabName = "tab";

export type Tab = {
   id: string;
   label?: string;
};

export type TabGroup = {
   name: string;
   selectedTab: Tab["id"];
};

export type TabsComponentState = {
   tabGroups: TabGroup[];
   setTabGroups: React.Dispatch<React.SetStateAction<TabGroup[]>>;
   tabsWithDots: Tab["id"][];
   setTabsWithDots: React.Dispatch<React.SetStateAction<Tab["id"][]>>;
};

export type TabsProps = {
   tabs: Tab[];
   name?: string;
   accentColor?: Color;
   style?: "default" | "borderRadiusTop" | "box" | "bubble";
   gap?: number;
   borderRadius?: React.CSSProperties["borderRadius"];
   noBottomLine?: boolean;
   /** @default true */
   keepUrlHistory?: boolean;
   onChange?: (tab: Tab["id"]) => void;
   children?: React.ReactNode;
} & ComponentMarginProps;

export type TabsRef = {
   selectedTab: Tab["id"];
   selectTab: (tabId: Tab["id"]) => void;
};

type TabsComponent = {
   (props: ComponentPropWithRef<TabsRef, TabsProps>): React.ReactElement;
   content: (props: TabsContentProps) => React.ReactElement;
};

const TabsComponent: TabsComponent = forwardRef(function Tabs(
   {
      tabs,
      name,
      accentColor,
      style = "default",
      gap,
      borderRadius,
      noBottomLine,
      keepUrlHistory = true,
      onChange,
      children,
      ...props
   }: TabsProps,
   ref: React.ForwardedRef<TabsRef>,
) {
   const reactRouterDomPlugin = usePlugin("react-router-dom");

   const theme = useTheme();
   const urlQuery = reactRouterDomPlugin ? useUrlQuery() : undefined;
   const { language, componentsState } = useBetterHtmlContextInternal();

   const firstRenderPassedRef = useRef<boolean>(false);
   const tabsRef = useRef<Record<Tab["id"], HTMLDivElement | null>>({});

   const tabsGap = gap ?? (style === "box" || style === "bubble" ? theme.styles.gap / 2 : 0);

   const [selectedTabId, setSelectedTabId] = useState<Tab["id"]>(() => {
      const selectedTabId = tabs[0];

      if (!selectedTabId) return "";

      if (urlQuery) {
         const tabQueryValue = urlQuery.getQuery(name ?? defaultTabName);

         if (!tabQueryValue) return selectedTabId.id;

         const queryTab = tabs.find((tab) => tab.id === tabQueryValue);
         if (queryTab) return queryTab.id;
      }

      return selectedTabId.id;
   });
   const [rerenderState, setRerenderState] = useState<number>(0);

   const onClickTab = useCallback(
      (tabId: Tab["id"]) => {
         setSelectedTabId(tabId);
         onChange?.(tabId);

         if (urlQuery) {
            urlQuery.setQuery(
               {
                  [name ?? defaultTabName]: tabId,
               },
               keepUrlHistory,
            );
         }
      },
      [onChange, name, urlQuery, keepUrlHistory],
   );

   const width = useMemo<number>(
      () => tabsRef.current[selectedTabId]?.getBoundingClientRect().width ?? 0,
      [rerenderState, selectedTabId],
   );
   const leftSpacing = useMemo<number>(() => {
      const selectedTabIndex = tabs.findIndex((tab) => tab.id === selectedTabId);

      let spacing = 0;
      Object.values(tabsRef.current).forEach((tab, index) => {
         if (index < selectedTabIndex) spacing += (tab?.getBoundingClientRect().width ?? 0) + tabsGap;
      });

      return spacing;
   }, [rerenderState, selectedTabId, tabs, tabsGap]);

   useEffect(() => {
      const timeout = setTimeout(() => {
         setRerenderState(Math.random());
         firstRenderPassedRef.current = true;
      }, 0.01 * 1000);

      return () => {
         clearTimeout(timeout);
      };
   }, [language]);
   useEffect(() => {
      componentsState.tabs.setTabGroups((oldValue) => {
         const thisTabGroup = oldValue.find((item) => item.name === (name ?? defaultTabName));

         if (thisTabGroup) {
            return oldValue.map((item) =>
               item.name === (name ?? defaultTabName)
                  ? {
                       ...item,
                       selectedTab: selectedTabId,
                    }
                  : item,
            );
         } else {
            return [
               ...oldValue,
               {
                  name: name ?? defaultTabName,
                  selectedTab: selectedTabId,
               },
            ];
         }
      });
   }, [selectedTabId, name]);
   useEffect(() => {
      tabsRef.current[selectedTabId]?.scrollIntoView({
         behavior: firstRenderPassedRef.current ? "smooth" : undefined,
         block: "nearest",
      });
   }, [selectedTabId]);
   useEffect(() => {
      return () => {
         componentsState.tabs.setTabGroups((oldValue) =>
            oldValue.filter((item) => item.name !== (name ?? defaultTabName)),
         );
      };
   }, []);
   useEffect(() => {
      onChange?.(selectedTabId);
   }, []);

   useImperativeHandle(ref, (): TabsRef => {
      return {
         selectedTab: selectedTabId,
         selectTab: onClickTab,
      };
   }, [selectedTabId, onClickTab]);

   const readyBorderRadius = borderRadius ?? (style === "bubble" ? theme.styles.borderRadius : undefined);

   return (
      <Div.column width="100%" gap={theme.styles.space} {...props}>
         <Div position="relative" className="react-better-html-no-scrollbar" overflowY="auto">
            <Div.row position="relative" width="fit-content" gap={tabsGap} userSelect="none" zIndex={2}>
               {tabs.map((tab) => {
                  const selected = tab.id === selectedTabId;

                  return (
                     <Div
                        className={`react-better-html-tabs-tab${selected ? " react-better-html-tabs-tab-selected" : ""}`}
                        position="relative"
                        width="fit-content"
                        backgroundColor={
                           style === "bubble"
                              ? theme.colors.textPrimary + "00"
                              : style === "box"
                                ? selected
                                   ? (accentColor ?? theme.colors.primary)
                                   : theme.colors.backgroundContent
                                : theme.colors.backgroundBase
                        }
                        backgroundColorHover={style === "bubble" ? theme.colors.textPrimary + "20" : undefined}
                        borderRadius={readyBorderRadius ?? (style === "box" ? theme.styles.borderRadius : undefined)}
                        borderTopLeftRadius={style === "borderRadiusTop" ? theme.styles.borderRadius : undefined}
                        borderTopRightRadius={style === "borderRadiusTop" ? theme.styles.borderRadius : undefined}
                        border={
                           style === "box"
                              ? `${theme.styles.borderWidth}px solid ${selected ? "transparent" : theme.colors.border}`
                              : undefined
                        }
                        borderColorHover={style === "box" ? (accentColor ?? theme.colors.primary) : undefined}
                        filterHover={style !== "box" ? filterHover().z1 : undefined}
                        paddingInline={theme.styles.space}
                        paddingBlock={theme.styles.gap}
                        value={tab.id}
                        cursor="pointer"
                        isTabAccessed
                        onClickWithValue={onClickTab}
                        ref={(ref) => {
                           tabsRef.current[tab.id] = ref;
                        }}
                        key={tab.id}
                     >
                        {componentsState.tabs.tabsWithDots.includes(tab.id) && (
                           <Div
                              position="absolute"
                              top={(theme.styles.space - tabDotSize) / 2}
                              right={(theme.styles.space - tabDotSize) / 2}
                              width={tabDotSize}
                              height={tabDotSize}
                              backgroundColor={style === "box" && selected ? theme.colors.base : theme.colors.primary}
                              borderRadius={999}
                              transition={theme.styles.transition}
                           />
                        )}

                        <Text
                           fontWeight={700}
                           color={
                              !selected
                                 ? theme.colors.textSecondary
                                 : style === "box" || style === "bubble"
                                   ? theme.colors.base
                                   : undefined
                           }
                           transition={theme.styles.transition}
                           whiteSpace="nowrap"
                        >
                           {tab.label ?? tab.id}
                        </Text>
                     </Div>
                  );
               })}
            </Div.row>

            {style !== "box" &&
               !noBottomLine &&
               (style === "bubble" ? (
                  <Div
                     position="absolute"
                     width={width}
                     height="100%"
                     bottom={0}
                     left={leftSpacing}
                     backgroundColor={accentColor ?? theme.colors.primary}
                     borderRadius={readyBorderRadius}
                     transition={firstRenderPassedRef.current ? theme.styles.transition : "none"}
                     zIndex={1}
                  />
               ) : (
                  <Div
                     position="absolute"
                     width={width}
                     height={tabBottomLineWidth}
                     bottom={0}
                     left={leftSpacing}
                     backgroundColor={accentColor ?? theme.colors.primary}
                     transition={firstRenderPassedRef.current ? theme.styles.transition : "none"}
                     zIndex={2}
                  />
               ))}
         </Div>

         {children && <Div width="100%">{children}</Div>}
      </Div.column>
   );
}) as any;

type TabsContentProps = {
   tabId: Tab["id"];
   tabWithDot?: boolean;
   tabsGroupName?: string;
   isInitialTab?: boolean;
   children?: React.ReactNode;
};

TabsComponent.content = function Content({ tabId, tabWithDot, tabsGroupName, isInitialTab, children }) {
   const { componentsState } = useBetterHtmlContextInternal();

   const thisTabGroupData = useMemo<TabGroup | undefined>(
      () => componentsState.tabs.tabGroups.find((item) => item.name === (tabsGroupName ?? defaultTabName)),
      [componentsState.tabs, tabsGroupName],
   );

   useEffect(() => {
      if (tabWithDot) {
         componentsState.tabs.setTabsWithDots?.((oldValue) =>
            oldValue.includes(tabId) ? oldValue : [...oldValue, tabId],
         );
      } else {
         componentsState.tabs.setTabsWithDots?.((oldValue) =>
            oldValue.includes(tabId) ? oldValue.filter((tab) => tab !== tabId) : oldValue,
         );
      }
   }, [tabWithDot]);

   return (thisTabGroupData ? thisTabGroupData.selectedTab === tabId : isInitialTab) ? (
      <Div width="100%">{children}</Div>
   ) : undefined;
} as TabsComponent["content"];

const Tabs = memo(TabsComponent) as any as typeof TabsComponent & {
   content: typeof TabsComponent.content;
};

Tabs.content = TabsComponent.content;

export default Tabs;
