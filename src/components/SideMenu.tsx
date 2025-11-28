import { createContext, memo, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { defaultSideMenuWidth } from "../constants/app";

import { AnyOtherString } from "../types/app";
import { IconName } from "../types/icon";
import { AssetName } from "../types/asset";

import { useBooleanState, useMediaQuery } from "../utils/hooks";
import { filterHover } from "../utils/variableFunctions";
import { lightenColor } from "../utils/colorManipulation";

import { ReactRouterDomPluginOptions } from "../plugins";

import Div from "./Div";
import Icon from "./Icon";
import Button from "./Button";
import Text from "./Text";
import Image from "./Image";
import PageHolder, { PageHolderProps } from "./PageHolder";
import Loader from "./Loader";
import Tooltip from "./Tooltip";
import { useBetterHtmlContextInternal, usePlugin, useTheme } from "./BetterHtmlProvider";

type SideMenuActiveItem = {
   href: string;
   length: number;
};

type SideMenuContext = {
   activeItem: SideMenuActiveItem | undefined;
   setActiveItem: React.Dispatch<React.SetStateAction<SideMenuActiveItem | undefined>>;
};

const sideMenuContext = createContext<SideMenuContext | undefined>(undefined);

const SideMenuContextProvider = sideMenuContext.Provider;
const useSideMenuContext = () => {
   const context = useContext(sideMenuContext);

   if (!context) {
      throw new Error("`useSideMenuContext` must be used within a `<SideMenuContextProvider>` component");
   }

   return context;
};

export type SideMenuItem = {
   text: string;
   iconName: IconName | AnyOtherString;
   href?: string;
   disabled?: boolean;
   hidden?: boolean;
   children?: SideMenuItem[];
   /** @default true */
   onClickCloseSideMenu?: boolean;
   onClick?: (item: SideMenuItem) => void;
};

type MenuItemComponentProps = {
   item: SideMenuItem;
   backgroundColor?: React.CSSProperties["backgroundColor"];
   onClick?: () => void;
};

const MenuItemComponent = memo(function MenuItemComponent({ item, backgroundColor, onClick }: MenuItemComponentProps) {
   const reactRouterDomPlugin = usePlugin<ReactRouterDomPluginOptions>("react-router-dom");

   if (!reactRouterDomPlugin) {
      throw new Error(
         "`SideMenu` component requires the `react-router-dom` plugin to be added to the `plugins` prop in `<BetterHtmlProvider>`.",
      );
   }

   const reactRouterDomPluginConfig = reactRouterDomPlugin.getConfig();

   const theme = useTheme();
   const mediaQuery = useMediaQuery();
   const location = reactRouterDomPluginConfig.useLocation();
   const { colorTheme, components, sideMenuIsCollapsed, setSideMenuIsCollapsed } = useBetterHtmlContextInternal();

   const { activeItem, setActiveItem } = useSideMenuContext();

   const [isOpened, setIsOpened] = useBooleanState();

   const isCollapsed = sideMenuIsCollapsed && !mediaQuery.size1000;

   const onClickElement = useCallback(() => {
      if (item.disabled) return;

      if (item.children) {
         setSideMenuIsCollapsed.setFalse();
         if (isCollapsed) setTimeout(setIsOpened.setTrue, 0.1 * 1000);
         else setIsOpened.toggle();
      } else {
         setActiveItem(undefined);

         if (item.onClickCloseSideMenu !== false) onClick?.();
         item.onClick?.(item);
      }
   }, [onClick, item, isCollapsed]);

   const isActive = activeItem && item.href && activeItem.href === item.href;

   const readyBackgroundColor = backgroundColor ?? theme.colors.backgroundContent;

   const iconSize = 16;
   const paddingBlock = theme.styles.gap;
   const paddingLeft = theme.styles.gap + 2;
   const iconGap = theme.styles.gap;
   const lineHeight = 20;

   const lineWidth = 2;
   const lineEndRadius = iconSize / 2 + iconGap * 2;

   const content = (
      <Tooltip
         content={
            <Div.row alignItems="center" gap={theme.styles.gap}>
               <Text whiteSpace="nowrap">{item.text}</Text>

               {item.children && <Icon name="chevronDown" color={theme.colors.textSecondary} size={14} />}
            </Div.row>
         }
         contentPointerEvents="none"
         withArrow
         childrenWrapperWidth="100%"
         disabled={!isCollapsed}
         position="right"
      >
         <Div.row
            alignItems="center"
            gap={iconGap}
            whiteSpace="nowrap"
            backgroundColor={
               isActive
                  ? colorTheme === "dark"
                     ? lightenColor(theme.colors.primary, 0.7)
                     : lightenColor(theme.colors.primary, 0.85)
                  : readyBackgroundColor
            }
            borderRadius={theme.styles.borderRadius}
            paddingBlock={paddingBlock}
            paddingLeft={isCollapsed ? theme.styles.space : paddingLeft}
            paddingRight={theme.styles.space}
            filterHover={`brightness(${colorTheme === "dark" ? (isActive ? 0.8 : 1.3) : isActive ? 0.8 : 0.95})`}
            overflow={isCollapsed ? "hidden" : undefined}
            cursor={item.disabled ? "not-allowed" : "pointer"}
            opacity={item.disabled ? 0.6 : undefined}
            onClick={onClickElement}
         >
            <Icon name={item.iconName} color={theme.colors.primary} size={iconSize} flexShrink={0} />

            <Text
               flex={1}
               lineHeight={`${lineHeight}px`}
               color={isActive ? theme.colors.primary : theme.colors.textPrimary}
               opacity={isCollapsed ? 0 : undefined}
               transition={theme.styles.transition}
            >
               {item.text}
            </Text>

            {item.children && (
               <Icon
                  name="chevronDown"
                  color={theme.colors.textSecondary}
                  size={14}
                  transform={isOpened ? "rotate(180deg)" : undefined}
                  transition={theme.styles.transition}
               />
            )}
         </Div.row>
      </Tooltip>
   );

   useEffect(() => {
      if (!item.href) return;

      const isActive =
         location.pathname === "/"
            ? location.pathname === item.href
            : location.pathname.startsWith(item.href) && item.href !== "/";

      if (!isActive) return;

      setActiveItem((oldValue) =>
         item.href
            ? oldValue && oldValue.length > item.href.length
               ? oldValue
               : {
                    href: item.href,
                    length: item.href.length,
                 }
            : undefined,
      );
   }, [location.pathname]);
   useEffect(() => {
      if (!item.children) return;

      const toBeOpened = item.children.some((child) =>
         child.href
            ? location.pathname === "/"
               ? location.pathname === child.href
               : location.pathname.startsWith(child.href) && child.href !== "/"
            : false,
      );

      setIsOpened.setState(toBeOpened);
   }, [item]);
   useEffect(() => {
      if (!isCollapsed) return;

      setIsOpened.setFalse();
   }, [isCollapsed]);

   const LinkComponentTag = components.button?.tagReplacement?.linkComponent ?? "a";

   return (
      <Div width="100%">
         {item.href ? (
            <LinkComponentTag to={item.href} href={item.href} onClick={onClickElement}>
               {content}
            </LinkComponentTag>
         ) : (
            content
         )}

         {item.children && (
            <Div.column
               position="relative"
               maxHeight={isOpened ? 1000 : 0}
               gap={theme.styles.gap / 2}
               marginTop={isOpened ? theme.styles.gap / 2 : undefined}
               paddingLeft={paddingLeft + iconSize + iconGap}
               overflow="hidden"
               transition={`max-height ${theme.styles.transition}, margin-top ${theme.styles.transition}`}
            >
               {item.children.map((child) => (
                  <MenuItemComponent
                     item={child}
                     backgroundColor={readyBackgroundColor}
                     onClick={onClick}
                     key={child.text}
                  />
               ))}

               <Div
                  position="absolute"
                  height={`calc(100% - ${paddingBlock + lineHeight / 2 + lineEndRadius / 2}px)`}
                  top={0}
                  left={paddingLeft + iconSize / 2}
                  zIndex={-1}
               >
                  <Div
                     position="relative"
                     width={lineWidth}
                     height="100%"
                     backgroundColor={theme.colors.border}
                     zIndex={1}
                  />
                  <Div
                     position="absolute"
                     width={lineEndRadius}
                     height={lineEndRadius}
                     top={`calc(100% - ${lineEndRadius / 2}px)`}
                     left={0}
                     border={`${lineWidth}px solid ${theme.colors.border}`}
                     borderRadius={999}
                     borderTopColor={readyBackgroundColor}
                     borderLeftColor={readyBackgroundColor}
                     borderRightColor={readyBackgroundColor}
                     transform="rotate(45deg)"
                  />
               </Div>
            </Div.column>
         )}
      </Div>
   );
});

type SideMenuProps = {
   items: SideMenuItem[];
   bottomItems?: SideMenuItem[];
   topSpace?: number;
   logoAssetName?: AssetName | AnyOtherString;
   logoUrl?: string;
   logoText?: string;
   logoFontFamily?: string;
   collapsable?: boolean;
   withCloseButton?: boolean;
   widthMobileHandle?: boolean;
   absoluteComponent?: React.ReactNode;
   additionalComponent?: React.ReactNode;
   isLoading?: boolean;
   /** @default backgroundContent */
   backgroundColor?: React.CSSProperties["backgroundColor"];
   paddingTop?: React.CSSProperties["paddingTop"];
};

type SideMenuComponentType = {
   (props: SideMenuProps): React.ReactElement;
   pageHolder: (props: SideMenuPageHolderProps) => React.ReactElement;
   burgerButton: () => React.ReactElement;
};

const SideMenuComponent: SideMenuComponentType = function SideMenu({
   items,
   bottomItems,
   topSpace = 0,
   logoAssetName,
   logoUrl,
   logoText,
   logoFontFamily,
   collapsable,
   withCloseButton,
   widthMobileHandle,
   absoluteComponent,
   additionalComponent,
   isLoading,
   backgroundColor,
   paddingTop,
}: SideMenuProps) {
   const theme = useTheme();
   const mediaQuery = useMediaQuery();
   const { components, sideMenuIsCollapsed, setSideMenuIsCollapsed, sideMenuIsOpenMobile, setSideMenuIsOpenMobile } =
      useBetterHtmlContextInternal();

   const [activeItem, setActiveItem] = useState<SideMenuActiveItem>();

   const onClickXButton = useCallback(() => {
      setSideMenuIsOpenMobile.setFalse();
   }, []);

   const readyItems = useMemo(() => items.filter((item) => !item.hidden), [items]);
   const readyBottomItems = useMemo(() => bottomItems?.filter((item) => !item.hidden), [bottomItems]);

   const contextValue = useMemo<SideMenuContext>(
      () => ({
         activeItem,
         setActiveItem,
      }),
      [activeItem],
   );

   const isCollapsable = collapsable && !mediaQuery.size1000;
   const isCollapsed = sideMenuIsCollapsed && !mediaQuery.size1000;

   const LinkComponentTag = components.button?.tagReplacement?.linkComponent ?? "a";
   const sideMenuWidth = components.sideMenu?.width ?? defaultSideMenuWidth;
   const sideMenuCollapsedWidth = theme.styles.space + theme.styles.space * 2 + 16 + theme.styles.space;

   const readyBackgroundColor = backgroundColor ?? theme.colors.backgroundContent;
   const logoSize = sideMenuCollapsedWidth - theme.styles.space * 2;

   return (
      <SideMenuContextProvider value={contextValue}>
         <Div.column
            position="fixed"
            width={mediaQuery.size1000 ? "100%" : isCollapsed ? sideMenuCollapsedWidth : sideMenuWidth}
            height={`calc(100svh - ${topSpace}px)`}
            top={topSpace}
            left={0}
            backgroundColor={readyBackgroundColor}
            borderRight={`solid 1px ${theme.colors.border}`}
            transform={!mediaQuery.size1000 || sideMenuIsOpenMobile ? "translateX(0)" : "translateX(-100%)"}
            paddingTop={paddingTop ?? (logoAssetName || logoUrl ? theme.styles.gap : theme.styles.space)}
            transition={
               mediaQuery.size1000
                  ? !isCollapsed
                     ? `transform ${theme.styles.transition}`
                     : "none"
                  : theme.styles.transition
            }
            userSelect="none"
            zIndex={10}
         >
            <Div.column width="100%" height="100%" gap={theme.styles.space}>
               {(logoAssetName || logoUrl || (withCloseButton && mediaQuery.size1000)) && (
                  <Div.row alignItems="center" paddingInline={theme.styles.space}>
                     {(logoAssetName || logoUrl) && (
                        <LinkComponentTag to="/" href="/" onClick={onClickXButton}>
                           <Div.row
                              alignItems="center"
                              width={sideMenuCollapsedWidth ? logoSize : undefined}
                              height={logoSize}
                              whiteSpace="nowrap"
                              gap={theme.styles.gap}
                           >
                              <Image
                                 name={logoAssetName}
                                 src={logoUrl}
                                 width={logoSize}
                                 height={logoSize}
                                 objectFit="contain"
                              />

                              {logoText && (
                                 <Text
                                    fontFamily={logoFontFamily}
                                    fontSize={22}
                                    fontWeight={800}
                                    opacity={!isCollapsed ? 1 : 0}
                                    transition={theme.styles.transition}
                                    userSelect="none"
                                 >
                                    {logoText}
                                 </Text>
                              )}
                           </Div.row>
                        </LinkComponentTag>
                     )}

                     {withCloseButton && mediaQuery.size1000 && (
                        <Button.icon icon="XMark" marginLeft="auto" onClick={onClickXButton} />
                     )}
                  </Div.row>
               )}

               {!isLoading ? (
                  <>
                     <Div.column
                        width="100%"
                        height="100%"
                        overflowY={!isCollapsed ? "auto" : undefined}
                        paddingInline={theme.styles.space}
                        paddingBottom={!isCollapsable && !readyBottomItems ? theme.styles.space : undefined}
                     >
                        <Div.column gap={theme.styles.gap / 2}>
                           {readyItems.map((item) => (
                              <MenuItemComponent
                                 item={item}
                                 backgroundColor={readyBackgroundColor}
                                 onClick={onClickXButton}
                                 key={item.text}
                              />
                           ))}
                        </Div.column>
                     </Div.column>

                     {readyBottomItems && (
                        <Div.column
                           borderTop={mediaQuery.size1000 ? `solid 1px ${theme.colors.border}` : undefined}
                           gap={theme.styles.gap / 2}
                           marginTop="auto"
                           paddingTop={mediaQuery.size1000 ? theme.styles.space : undefined}
                           paddingInline={theme.styles.space}
                           paddingBottom={!isCollapsable ? theme.styles.space : undefined}
                        >
                           {readyBottomItems.map((item) => (
                              <MenuItemComponent
                                 item={item}
                                 backgroundColor={readyBackgroundColor}
                                 onClick={onClickXButton}
                                 key={item.text}
                              />
                           ))}
                        </Div.column>
                     )}
                  </>
               ) : (
                  <Div flex={1}>
                     <Loader.box text={isCollapsed ? "" : undefined} />
                  </Div>
               )}

               {additionalComponent}

               {isCollapsable && (
                  <Div
                     borderTop={`solid 1px ${theme.colors.border}`}
                     marginTop={!readyBottomItems ? "auto" : undefined}
                     paddingInline={theme.styles.space}
                     paddingBlock={theme.styles.space}
                  >
                     <Div.row
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor={readyBackgroundColor}
                        borderRadius={theme.styles.borderRadius}
                        cursor="pointer"
                        filterHover={filterHover().z1}
                        isTabAccessed
                        paddingBlock={theme.styles.gap}
                        onClick={setSideMenuIsCollapsed.toggle}
                     >
                        <Icon
                           name="chevronRight"
                           size={20}
                           color={theme.colors.textSecondary}
                           transform={`rotate(${isCollapsed ? 0 : 180}deg)`}
                           transition={theme.styles.transition}
                        />
                     </Div.row>
                  </Div>
               )}
            </Div.column>

            {widthMobileHandle && (
               <Div.row
                  position="absolute"
                  top={theme.styles.space}
                  left="100%"
                  backgroundColor={readyBackgroundColor}
                  border={`solid 1px ${theme.colors.border}`}
                  borderLeft="none"
                  borderTopRightRadius={theme.styles.borderRadius}
                  borderBottomRightRadius={theme.styles.borderRadius}
                  alignItems="center"
                  cursor="pointer"
                  opacity={!mediaQuery.size1000 ? 0 : undefined}
                  pointerEvents={!mediaQuery.size1000 ? "none" : undefined}
                  padding={theme.styles.gap}
                  paddingRight={(theme.styles.space + theme.styles.gap) / 2}
                  transform={!mediaQuery.size1000 ? "translateX(-100%)" : undefined}
                  transition={theme.styles.transition}
                  onClick={setSideMenuIsOpenMobile.toggle}
               >
                  <Icon
                     name="chevronRight"
                     size={20}
                     color={theme.colors.textSecondary}
                     transform={sideMenuIsOpenMobile ? "rotate(180deg)" : undefined}
                     transition={theme.styles.transition}
                  />
               </Div.row>
            )}

            {absoluteComponent && (
               <Div position="absolute" top={0} left={0} pointerEvents="none" zIndex={2}>
                  <Div pointerEvents="all">{absoluteComponent}</Div>
               </Div>
            )}
         </Div.column>
      </SideMenuContextProvider>
   );
};

type SideMenuPageHolderProps = PageHolderProps & {
   outsideComponent?: React.ReactNode;
};

SideMenuComponent.pageHolder = function SideMenuPageHolder({ outsideComponent, ...props }) {
   const theme = useTheme();
   const mediaQuery = useMediaQuery();
   const { components, sideMenuIsCollapsed } = useBetterHtmlContextInternal();

   const sideMenuWidth = components.sideMenu?.width ?? defaultSideMenuWidth;
   const sideMenuCollapsedWidth = theme.styles.space + theme.styles.space * 2 + 16 + theme.styles.space;

   return (
      <Div
         position="relative"
         width="100%"
         paddingLeft={
            !mediaQuery.size1000 ? (!sideMenuIsCollapsed ? sideMenuWidth : sideMenuCollapsedWidth) : undefined
         }
         transition={theme.styles.transition}
      >
         {outsideComponent}

         <PageHolder {...props} />
      </Div>
   );
} as SideMenuComponentType["pageHolder"];

SideMenuComponent.burgerButton = function BurgerButton() {
   const theme = useTheme();
   const { sideMenuIsOpenMobile, setSideMenuIsOpenMobile } = useBetterHtmlContextInternal();

   const [isHovered, setIsHovered] = useBooleanState();

   const width = 2;

   return (
      <Div
         position="relative"
         width={32}
         height={20}
         cursor="pointer"
         onMouseOver={setIsHovered.setTrue}
         onMouseLeave={setIsHovered.setFalse}
         onMouseOut={setIsHovered.setFalse}
         onClick={setSideMenuIsOpenMobile.toggle}
      >
         <Div
            position="absolute"
            width={isHovered || sideMenuIsOpenMobile ? "100%" : "50%"}
            height={width}
            top={sideMenuIsOpenMobile ? `calc(50% - ${width / 2}px)` : 0}
            left={0}
            backgroundColor={theme.colors.border}
            borderRadius={999}
            transform={sideMenuIsOpenMobile ? "rotate(45deg)" : undefined}
            transition={theme.styles.transition}
         />
         <Div
            position="absolute"
            width={isHovered ? "100%" : "100%"}
            height={width}
            top="50%"
            left={0}
            backgroundColor={theme.colors.border}
            borderRadius={999}
            transform="translateY(-50%)"
            opacity={sideMenuIsOpenMobile ? 0 : undefined}
            transition={theme.styles.transition}
         />
         <Div
            position="absolute"
            width={isHovered || sideMenuIsOpenMobile ? "100%" : "75%"}
            height={width}
            bottom={sideMenuIsOpenMobile ? `calc(50% - ${width / 2}px)` : 0}
            left={0}
            backgroundColor={theme.colors.border}
            borderRadius={999}
            transform={sideMenuIsOpenMobile ? "rotate(-45deg)" : undefined}
            transition={theme.styles.transition}
         />
      </Div>
   );
} as SideMenuComponentType["burgerButton"];

const SideMenu = memo(SideMenuComponent) as any as typeof SideMenuComponent & {
   pageHolder: typeof SideMenuComponent.pageHolder;
   burgerButton: typeof SideMenuComponent.burgerButton;
};

SideMenu.pageHolder = SideMenuComponent.pageHolder;
SideMenu.burgerButton = SideMenuComponent.burgerButton;

export default SideMenu;
