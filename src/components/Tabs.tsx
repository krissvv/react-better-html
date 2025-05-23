import { createContext, memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { Color } from "../types/theme";
import { ComponentMarginProps } from "../types/components";

import { useUrlQuery } from "../utils/hooks";

import Div from "./Div";
import Text from "./Text";
import { usePlugin, useTheme } from "./BetterHtmlProvider";

const tabBottomLineWidth = 2;
const tabDotSize = 6;
const defaultTabName = "tab";

export type TabGroup = {
   name: string;
   selectedTab: string;
};

export type ContextValueType = {
   tabGroups: TabGroup[];
   tabsWithDots: string[];
   setTabsWithDots?: React.Dispatch<React.SetStateAction<string[]>>;
};

const context = createContext<ContextValueType>({
   tabGroups: [
      {
         name: defaultTabName,
         selectedTab: "",
      },
   ],
   tabsWithDots: [],
});
const { Provider } = context;

type TabsProps = {
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
   const contextData = useContext(context);

   const tabsRef = useRef<Record<string, HTMLDivElement | null>>({});
   const urlSelectedTabSetRef = useRef<boolean>(false);

   const [tabsWithDots, setTabsWithDots] = useState<string[]>([]);
   const [selectedTab, setSelectedTab] = useState<string>(tabs[0] ?? "");
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
      let totalWidth = 0;

      Object.values(tabsRef.current).forEach((tab, index) => {
         if (index < selectedTabIndex) totalWidth += (tab?.getBoundingClientRect().width ?? 0) + tabsGap;
      });

      return totalWidth;
   }, [selectedTab, tabs, tabsGap]);
   const contextValue = useMemo<ContextValueType>(() => {
      const thisTabGroup = contextData.tabGroups.find((item) => item.name === (name ?? defaultTabName));

      return {
         tabGroups: thisTabGroup
            ? contextData.tabGroups.map((tab) =>
                 tab.name === (name ?? defaultTabName)
                    ? {
                         ...tab,
                         selectedTab: selectedTab,
                      }
                    : tab,
              )
            : [
                 ...contextData.tabGroups,
                 {
                    name: name ?? defaultTabName,
                    selectedTab: selectedTab,
                 },
              ],
         tabsWithDots,
         setTabsWithDots,
      };
   }, [contextData, name, selectedTab, tabsWithDots]);

   useEffect(() => {
      if (!urlQuery) return;
      if (urlSelectedTabSetRef.current) return;

      const tabQueryValue = urlQuery.getQuery(name ?? defaultTabName);

      if (!tabQueryValue) return;

      if (tabs.includes(tabQueryValue)) setSelectedTab(tabQueryValue);
      else {
         urlQuery.setQuery({
            [name ?? defaultTabName]: selectedTab,
         });
      }

      urlSelectedTabSetRef.current = true;
   }, [name, tabs, selectedTab, urlQuery]);
   useEffect(() => {
      const timeout = setTimeout(() => setRerenderState(Math.random()), 0.1 * 1000);

      return () => {
         clearTimeout(timeout);
      };
   }, []);

   return (
      <Provider value={contextValue}>
         <Div
            position="relative"
            className="react-better-html-no-scrollbar"
            overflowY="auto"
            marginBottom={theme.styles.space}
            {...props}
         >
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
                        filterHover="brightness(0.9)"
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
                        {tabsWithDots.includes(tab) && (
                           <Div
                              position="absolute"
                              top={(theme.styles.gap - tabDotSize / 2) / 2}
                              right={(theme.styles.space - tabDotSize / 2) / 2}
                              width={tabDotSize}
                              height={tabDotSize}
                              backgroundColor={theme.colors.primary}
                              borderRadius={999}
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
                  transition={theme.styles.transition}
               />
            )}
         </Div>

         {children}
      </Provider>
   );
};

type TabsContentProps = {
   tab: string;
   tabWithDot?: boolean;
   tabsGroupName?: string;
   children?: React.ReactNode;
};

TabsComponent.content = function Content({ tab, tabWithDot, tabsGroupName, children }) {
   const contextData = useContext(context);

   const thisTabGroupData = useMemo<TabGroup | undefined>(
      () => contextData.tabGroups.find((item) => item.name === (tabsGroupName ?? defaultTabName)),
      [contextData, tabsGroupName],
   );

   useEffect(() => {
      if (tabWithDot) {
         contextData.setTabsWithDots?.((oldValue) => (oldValue.includes(tab) ? oldValue : [...oldValue, tab]));
      } else {
         contextData.setTabsWithDots?.((oldValue) =>
            oldValue.includes(tab) ? oldValue.filter((tab) => tab !== tab) : oldValue,
         );
      }
   }, [tabWithDot, contextData.tabsWithDots]);

   return thisTabGroupData?.selectedTab === tab ? <Div width="100%">{children}</Div> : undefined;
} as TabsComponent["content"];

const Tabs = memo(TabsComponent) as any as typeof TabsComponent & {
   content: typeof TabsComponent.content;
};

Tabs.content = TabsComponent.content;

export default Tabs;
