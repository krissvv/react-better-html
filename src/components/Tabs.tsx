import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Color } from "../types/theme";
import { ComponentMarginProps } from "../types/components";

import { useUrlQuery } from "../utils/hooks";

import Div from "./Div";
import Text from "./Text";
import { useBetterHtmlContextInternal, usePlugin, useTheme } from "./BetterHtmlProvider";

const tabBottomLineWidth = 2;
const tabDotSize = 6;
const defaultTabName = "tab";

export type TabGroup = {
   name: string;
   selectedTab: string;
};

export type TabsComponentState = {
   tabGroups: TabGroup[];
   setTabGroups: React.Dispatch<React.SetStateAction<TabGroup[]>>;
   tabsWithDots: string[];
   setTabsWithDots: React.Dispatch<React.SetStateAction<string[]>>;
};

export type TabsProps = {
   tabs: string[];
   name?: string;
   accentColor?: Color;
   style?: "default" | "borderRadiusTop" | "box";
   children?: React.ReactNode;
} & ComponentMarginProps;

type TabsComponent = {
   (props: TabsProps): React.ReactElement;
   content: (props: TabsContentProps) => React.ReactElement;
};

const TabsComponent: TabsComponent = function Tabs({
   tabs,
   name,
   accentColor,
   style = "default",
   children,
   ...props
}: TabsProps) {
   const reactRouterDomPlugin = usePlugin("react-router-dom");

   const theme = useTheme();
   const urlQuery = reactRouterDomPlugin ? useUrlQuery() : undefined;
   const { colorTheme, componentsState } = useBetterHtmlContextInternal();

   const firstRenderPassedRef = useRef<boolean>(false);
   const tabsRef = useRef<Record<string, HTMLDivElement | null>>({});

   const [selectedTab, setSelectedTab] = useState<string>(() => {
      const selectedTabValue = tabs[0] ?? "";

      if (urlQuery) {
         const tabQueryValue = urlQuery.getQuery(name ?? defaultTabName);

         if (!tabQueryValue) return selectedTabValue;

         if (tabs.includes(tabQueryValue)) return tabQueryValue;
      }

      return selectedTabValue;
   });
   const [rerenderState, setRerenderState] = useState<number>(0);

   const tabsGap = style === "box" ? theme.styles.gap / 2 : 0;

   const onClickTab = useCallback(
      (tab: string) => {
         setSelectedTab(tab);

         if (urlQuery) {
            urlQuery.setQuery({
               [name ?? defaultTabName]: tab,
            });
         }
      },
      [name, urlQuery],
   );

   const width = useMemo<number>(
      () => tabsRef.current[selectedTab]?.getBoundingClientRect().width ?? 0,
      [rerenderState, selectedTab],
   );
   const leftSpacing = useMemo<number>(() => {
      const selectedTabIndex = tabs.findIndex((tab) => tab === selectedTab);

      let spacing = 0;
      Object.values(tabsRef.current).forEach((tab, index) => {
         if (index < selectedTabIndex) spacing += (tab?.getBoundingClientRect().width ?? 0) + tabsGap;
      });

      return spacing;
   }, [selectedTab, tabs, tabsGap]);

   useEffect(() => {
      const timeout = setTimeout(() => {
         setRerenderState(Math.random());
         firstRenderPassedRef.current = true;
      }, 0.01 * 1000);

      return () => {
         clearTimeout(timeout);
      };
   }, []);
   useEffect(() => {
      componentsState.tabs.setTabGroups((oldValue) => {
         const thisTabGroup = oldValue.find((item) => item.name === (name ?? defaultTabName));

         if (thisTabGroup) {
            return oldValue.map((item) =>
               item.name === (name ?? defaultTabName)
                  ? {
                       ...item,
                       selectedTab,
                    }
                  : item,
            );
         } else {
            return [
               ...oldValue,
               {
                  name: name ?? defaultTabName,
                  selectedTab,
               },
            ];
         }
      });
   }, [selectedTab, name]);
   useEffect(() => {
      tabsRef.current[selectedTab]?.scrollIntoView({
         behavior: firstRenderPassedRef.current ? "smooth" : undefined,
         block: "nearest",
      });
   }, [selectedTab]);

   return (
      <Div.column width="100%" gap={theme.styles.space} {...props}>
         <Div position="relative" className="react-better-html-no-scrollbar" overflowY="auto">
            <Div.row position="relative" width="fit-content" gap={tabsGap} userSelect="none">
               {tabs.map((tab) => {
                  const selected = tab === selectedTab;

                  return (
                     <Div
                        position="relative"
                        width="fit-content"
                        backgroundColor={
                           style === "box"
                              ? selected
                                 ? theme.colors.primary
                                 : theme.colors.backgroundContent
                              : theme.colors.backgroundBase
                        }
                        borderRadius={style === "box" ? theme.styles.borderRadius : undefined}
                        borderTopLeftRadius={style === "borderRadiusTop" ? theme.styles.borderRadius : undefined}
                        borderTopRightRadius={style === "borderRadiusTop" ? theme.styles.borderRadius : undefined}
                        border={
                           style === "box" ? `1px solid ${selected ? "transparent" : theme.colors.border}` : undefined
                        }
                        filterHover={
                           colorTheme === "dark"
                              ? style === "box"
                                 ? "brightness(1.2)"
                                 : "brightness(2)"
                              : "brightness(0.9)"
                        }
                        paddingInline={theme.styles.space}
                        paddingBlock={theme.styles.gap}
                        value={tab}
                        cursor="pointer"
                        isTabAccessed
                        onClickWithValue={onClickTab}
                        ref={(ref) => {
                           tabsRef.current[tab] = ref;
                        }}
                        key={tab}
                     >
                        {componentsState.tabs.tabsWithDots.includes(tab) && (
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
                              !selected ? theme.colors.textSecondary : style === "box" ? theme.colors.base : undefined
                           }
                           transition={theme.styles.transition}
                           whiteSpace="nowrap"
                        >
                           {tab}
                        </Text>
                     </Div>
                  );
               })}
            </Div.row>

            {style !== "box" && (
               <Div
                  position="absolute"
                  width={width}
                  height={tabBottomLineWidth}
                  bottom={0}
                  left={leftSpacing}
                  backgroundColor={accentColor ?? theme.colors.primary}
                  transition={firstRenderPassedRef.current ? theme.styles.transition : "none"}
               />
            )}
         </Div>

         <Div width="100%">{children}</Div>
      </Div.column>
   );
};

type TabsContentProps = {
   tab: string;
   tabWithDot?: boolean;
   tabsGroupName?: string;
   children?: React.ReactNode;
};

TabsComponent.content = function Content({ tab, tabWithDot, tabsGroupName, children }) {
   const { componentsState } = useBetterHtmlContextInternal();

   const thisTabGroupData = useMemo<TabGroup | undefined>(
      () => componentsState.tabs.tabGroups.find((item) => item.name === (tabsGroupName ?? defaultTabName)),
      [componentsState.tabs, tabsGroupName],
   );

   useEffect(() => {
      if (tabWithDot) {
         componentsState.tabs.setTabsWithDots?.((oldValue) => (oldValue.includes(tab) ? oldValue : [...oldValue, tab]));
      } else {
         componentsState.tabs.setTabsWithDots?.((oldValue) =>
            oldValue.includes(tab) ? oldValue.filter((tab) => tab !== tab) : oldValue,
         );
      }
   }, [tabWithDot]);

   return thisTabGroupData?.selectedTab === tab ? <Div width="100%">{children}</Div> : undefined;
} as TabsComponent["content"];

const Tabs = memo(TabsComponent) as any as typeof TabsComponent & {
   content: typeof TabsComponent.content;
};

Tabs.content = TabsComponent.content;

export default Tabs;
