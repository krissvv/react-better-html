import { memo, useCallback, useEffect, useMemo } from "react";

import { defaultSideMenuWidth } from "../constants/app";

import { AnyOtherString } from "../types/app";
import { IconName } from "../types/icon";
import { AssetName } from "../types/asset";

import { useBooleanState, useMediaQuery } from "../utils/hooks";
import { filterHover } from "../utils/variableFunctions";

import { ReactRouterDomPluginOptions } from "../plugins";

import Div from "./Div";
import Icon from "./Icon";
import Button from "./Button";
import Text from "./Text";
import Image from "./Image";
import PageHolder, { PageHolderProps } from "./PageHolder";
import { useBetterHtmlContextInternal, usePlugin, useTheme } from "./BetterHtmlProvider";

export type MenuItem = {
   text: string;
   iconName: IconName | AnyOtherString;
   href?: string;
   onClick?: (item: MenuItem) => void;
   disabled?: boolean;
   hidden?: boolean;
   children?: MenuItem[];
};

type MenuItemComponentProps = {
   item: MenuItem;
   onClick?: () => void;
};

const MenuItemComponent = memo(function MenuItemComponent({ item, onClick }: MenuItemComponentProps) {
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
   const { colorTheme, components, sideMenuIsCollapsed } = useBetterHtmlContextInternal();

   const [isOpened, setIsOpened] = useBooleanState();

   const onClickElement = useCallback(() => {
      if (item.disabled) return;

      onClick?.();
      item.onClick?.(item);
   }, [onClick, item]);

   const isCollapsed = sideMenuIsCollapsed && !mediaQuery.size1000;
   const isActive = item.href
      ? location.pathname === "/"
         ? location.pathname === item.href
         : location.pathname.startsWith(item.href) && item.href !== "/"
      : false;

   const iconSize = 16;
   const paddingBlock = theme.styles.gap;
   const paddingLeft = theme.styles.gap + 2;
   const iconGap = theme.styles.gap;
   const lineHeight = 20;

   const lineWidth = 2;
   const lineEndRadius = iconSize / 2 + iconGap * 2;

   const content = (
      <Div.row
         alignItems="center"
         gap={iconGap}
         whiteSpace="nowrap"
         backgroundColor={isActive ? `${theme.colors.primary}20` : theme.colors.backgroundBase}
         borderRadius={theme.styles.borderRadius}
         paddingBlock={paddingBlock}
         paddingLeft={isCollapsed ? theme.styles.space : paddingLeft}
         paddingRight={theme.styles.space}
         filterHover={`brightness(${colorTheme === "dark" ? (isActive ? 0.8 : 1.3) : isActive ? 0.8 : 0.95})`}
         overflow={isCollapsed ? "hidden" : undefined}
         cursor={item.disabled ? "not-allowed" : "pointer"}
         opacity={item.disabled ? 0.6 : undefined}
         onClick={item.children ? setIsOpened.toggle : undefined}
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
   );

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
                  <MenuItemComponent item={child} onClick={onClick} key={child.text} />
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
                     borderTopColor={theme.colors.backgroundBase}
                     borderLeftColor={theme.colors.backgroundBase}
                     borderRightColor={theme.colors.backgroundBase}
                     transform="rotate(45deg)"
                  />
               </Div>
            </Div.column>
         )}
      </Div>
   );
});

type SideMenuProps = {
   items: MenuItem[];
   logoAssetName?: AssetName | AnyOtherString;
   logoUrl?: string;
   logoText?: string;
   logoFontFamily?: string;
   collapsable?: boolean;
   widthMobileHandle?: boolean;
};

type SideMenuComponentType = {
   (props: SideMenuProps): React.ReactElement;
   pageHolder: (props: SideMenuPageHolderProps) => React.ReactElement;
};

const SideMenuComponent: SideMenuComponentType = function SideMenu({
   items,
   logoAssetName,
   logoUrl,
   logoText,
   logoFontFamily,
   collapsable,
   widthMobileHandle,
}: SideMenuProps) {
   const theme = useTheme();
   const mediaQuery = useMediaQuery();
   const { components, sideMenuIsCollapsed, setSideMenuIsCollapsed, sideMenuIsOpenMobile, setSideMenuIsOpenMobile } =
      useBetterHtmlContextInternal();

   const onClickXButton = useCallback(() => {
      setSideMenuIsOpenMobile.setFalse();
   }, []);

   const readyItems = useMemo(() => items.filter((item) => !item.hidden), [items]);

   const isCollapsed = sideMenuIsCollapsed && !mediaQuery.size1000;

   const LinkComponentTag = components.button?.tagReplacement?.linkComponent ?? "a";
   const sideMenuWidth = components.sideMenu?.width ?? defaultSideMenuWidth;
   const sideMenuCollapsedWidth = theme.styles.space + theme.styles.space * 2 + 16 + 1 + theme.styles.space;

   const logoSize = sideMenuCollapsedWidth - theme.styles.space * 2;

   return (
      <Div.column
         position="fixed"
         width={mediaQuery.size1000 ? "100%" : isCollapsed ? sideMenuCollapsedWidth : sideMenuWidth}
         height="100svh"
         backgroundColor={theme.colors.backgroundBase}
         borderRight={`solid 1px ${theme.colors.border}`}
         transform={!mediaQuery.size1000 || sideMenuIsOpenMobile ? "translateX(0)" : "translateX(-100%)"}
         paddingInline={theme.styles.space}
         paddingTop={logoAssetName || logoUrl ? theme.styles.gap : theme.styles.space}
         paddingBottom={theme.styles.space}
         transition={
            mediaQuery.size1000
               ? !isCollapsed
                  ? `transform ${theme.styles.transition}`
                  : "none"
               : theme.styles.transition
         }
         userSelect="none"
         zIndex={11}
      >
         <Div.column width="100%" height="100%" gap={theme.styles.space}>
            {(logoAssetName || logoUrl || mediaQuery.size1000) && (
               <Div.row alignItems="center">
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

                  {mediaQuery.size1000 && <Button.icon icon="XMark" marginLeft="auto" onClick={onClickXButton} />}
               </Div.row>
            )}

            <Div.column gap={theme.styles.gap / 2}>
               {readyItems.map((item) => (
                  <MenuItemComponent item={item} onClick={onClickXButton} key={item.text} />
               ))}
            </Div.column>

            {collapsable && !mediaQuery.size1000 && (
               <Div.row
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor={theme.colors.backgroundBase}
                  borderRadius={theme.styles.borderRadius}
                  marginTop="auto"
                  cursor="pointer"
                  filterHover={filterHover().z1}
                  paddingBlock={theme.styles.gap}
                  isTabAccessed
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
            )}
         </Div.column>

         {widthMobileHandle && (
            <Div.row
               position="absolute"
               top={theme.styles.space}
               left="100%"
               backgroundColor={theme.colors.backgroundBase}
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
      </Div.column>
   );
};

type SideMenuPageHolderProps = PageHolderProps & {};

SideMenuComponent.pageHolder = function SideMenuPageHolder({ ...props }) {
   const theme = useTheme();
   const mediaQuery = useMediaQuery();
   const { components, sideMenuIsCollapsed } = useBetterHtmlContextInternal();

   const sideMenuWidth = components.sideMenu?.width ?? defaultSideMenuWidth;
   const sideMenuCollapsedWidth = theme.styles.space + theme.styles.space * 2 + 16 + 1 + theme.styles.space;

   return (
      <Div
         width="100%"
         paddingLeft={
            !mediaQuery.size1000 ? (!sideMenuIsCollapsed ? sideMenuWidth : sideMenuCollapsedWidth) : undefined
         }
         transition={theme.styles.transition}
      >
         <PageHolder {...props} />
      </Div>
   );
} as SideMenuComponentType["pageHolder"];

const SideMenu = memo(SideMenuComponent) as any as typeof SideMenuComponent & {
   pageHolder: typeof SideMenuComponent.pageHolder;
};

SideMenu.pageHolder = SideMenuComponent.pageHolder;

export default SideMenu;
