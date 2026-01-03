import { forwardRef, memo, useCallback } from "react";
import { OmitProps, useTheme } from "react-better-core";
import styled, { WebTarget } from "styled-components";

import { isMobileDevice } from "../constants";

import { ComponentHoverStyle, ComponentPropWithRef, ComponentStyle } from "../types/components";

import { useComponentPropsWithPrefix, useComponentPropsGrouper } from "../utils/hooks";

import Divider from "./Divider";
import PageHeader, { PageHeaderProps } from "./PageHeader";

const DivStyledComponent = styled.div.withConfig({
   shouldForwardProp: (prop) => !["style", "hoverStyle"].includes(prop),
})<{ style: ComponentStyle; hoverStyle: ComponentStyle }>`
   ${(props) => props.style as any}

   &:hover {
      ${(props) => props.hoverStyle as any}
   }
`;

export type DivProps<Value = unknown> = {
   value?: Value;
   /** @default "div" */
   as?: WebTarget;
   /** @default false */
   isTabAccessed?: boolean;
   htmlContentTranslate?: React.ComponentProps<"div">["translate"];
   onClickWithValue?: (value: Value) => void;
} & OmitProps<React.ComponentProps<"div">, "style" | "defaultValue" | "translate"> &
   ComponentStyle &
   ComponentHoverStyle;

type DivComponentType = {
   <Value>(props: ComponentPropWithRef<HTMLDivElement, DivProps<Value>>): React.ReactElement;
   row: <Value>(
      props: ComponentPropWithRef<
         HTMLDivElement,
         OmitProps<DivProps<Value>, "display" | "flexDirection"> & {
            flexReverse?: boolean;
            invertFlexDirection?: boolean;
         }
      >,
   ) => React.ReactElement;
   column: <Value>(
      props: ComponentPropWithRef<
         HTMLDivElement,
         OmitProps<DivProps<Value>, "display" | "flexDirection"> & {
            flexReverse?: boolean;
            invertFlexDirection?: boolean;
         }
      >,
   ) => React.ReactElement;
   grid: <Value>(
      props: ComponentPropWithRef<HTMLDivElement, OmitProps<DivProps<Value>, "display">>,
   ) => React.ReactElement;
   box: <Value>(
      props: ComponentPropWithRef<
         HTMLDivElement,
         DivProps<Value> &
            OmitProps<PageHeaderProps, "marginBottom"> & {
               headerBackgroundColor?: string;
               isActive?: boolean;
            }
      >,
   ) => React.ReactElement;
};

const DivComponent: DivComponentType = forwardRef(function Div<Value>(
   {
      as = "div",
      value,
      isTabAccessed,
      htmlContentTranslate,
      onClickWithValue,
      role,
      onClick,
      onKeyDown,
      children,
      ...props
   }: DivProps<Value>,
   ref: React.ForwardedRef<HTMLDivElement>,
) {
   const { style, hoverStyle, restProps } = useComponentPropsGrouper(props);
   const dataProps = useComponentPropsWithPrefix(restProps, "data");
   const ariaProps = useComponentPropsWithPrefix(restProps, "aria");

   const onClickElement = useCallback(
      (event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
         onClick?.(event);
         onClickWithValue?.(value as any);
      },
      [onClick, onClickWithValue, value],
   );
   const onKeyDownElement = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
         onKeyDown?.(event);

         if (!isTabAccessed) return;

         if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.currentTarget.click();
         }
      },
      [onKeyDown, isTabAccessed],
   );

   return (
      <DivStyledComponent
         as={as}
         tabIndex={isTabAccessed && !isMobileDevice ? 0 : undefined}
         translate={htmlContentTranslate}
         role={role ?? (onClick ? "button" : undefined)}
         onClick={onClickElement}
         onKeyDown={onKeyDownElement}
         style={style}
         hoverStyle={hoverStyle}
         {...restProps}
         {...dataProps}
         {...ariaProps}
         ref={ref}
      >
         {children}
      </DivStyledComponent>
   );
}) as any;

DivComponent.row = forwardRef(function Row({ flexReverse, invertFlexDirection, ...props }, ref) {
   const reverseSuffix = flexReverse ? "-reverse" : "";

   return (
      <DivComponent
         display="flex"
         flexDirection={((invertFlexDirection ? "column" : "row") + reverseSuffix) as any}
         ref={ref}
         {...props}
      />
   );
}) as DivComponentType["row"];

DivComponent.column = forwardRef(function Column({ flexReverse, invertFlexDirection, ...props }, ref) {
   const reverseSuffix = flexReverse ? "-reverse" : "";

   return (
      <DivComponent
         display="flex"
         flexDirection={((invertFlexDirection ? "row" : "column") + reverseSuffix) as any}
         ref={ref}
         {...props}
      />
   );
}) as DivComponentType["column"];

DivComponent.grid = forwardRef(function Grid(props, ref) {
   return <DivComponent display="grid" ref={ref} {...props} />;
}) as DivComponentType["grid"];

DivComponent.box = forwardRef(function Box(
   {
      imageUrl,
      imageSize,
      title,
      titleAs,
      titleColor,
      titleRightElement,
      description,
      descriptionColor,
      textAlign,
      rightElement,
      lightMode,
      headerBackgroundColor,
      isActive,
      children,
      ...props
   },
   ref,
) {
   const theme = useTheme();

   const withClick = props.onClick || props.onClickWithValue;

   return (
      <DivComponent
         color={isActive ? theme.colors.base : undefined}
         backgroundColor={isActive ? theme.colors.primary : theme.colors.backgroundContent}
         border={`1px solid ${isActive ? theme.colors.primary : theme.colors.border}`}
         borderRadius={theme.styles.borderRadius}
         borderColorHover={withClick && !isActive ? theme.colors.primary : undefined}
         filterHover={withClick && isActive ? "brightness(0.9)" : undefined}
         cursor={withClick ? "pointer" : undefined}
         paddingBlock={title ? theme.styles.space : theme.styles.gap}
         paddingInline={theme.styles.space}
         ref={ref}
         {...props}
      >
         {title && (
            <Div
               backgroundColor={headerBackgroundColor}
               borderTopLeftRadius={props.borderTopLeftRadius ?? props.borderRadius ?? theme.styles.borderRadius - 1}
               borderTopRightRadius={props.borderTopRightRadius ?? props.borderRadius ?? theme.styles.borderRadius - 1}
               marginInline={-theme.styles.space}
               marginTop={-theme.styles.space}
               marginBottom={theme.styles.space}
               paddingInline={theme.styles.space}
               paddingTop={theme.styles.space}
            >
               <PageHeader
                  imageUrl={imageUrl}
                  imageSize={imageSize}
                  title={title}
                  titleAs={titleAs}
                  titleColor={titleColor}
                  titleRightElement={titleRightElement}
                  description={description}
                  descriptionColor={descriptionColor}
                  textAlign={textAlign}
                  rightElement={rightElement}
                  lightMode={lightMode}
                  marginBottom={theme.styles.space}
               />

               <Div width={`calc(100% + ${theme.styles.space * 2}px)`} marginLeft={-theme.styles.space}>
                  <Divider.horizontal />
               </Div>
            </Div>
         )}

         {children}
      </DivComponent>
   );
}) as DivComponentType["box"];

const Div = memo(DivComponent) as any as typeof DivComponent & {
   row: typeof DivComponent.row;
   column: typeof DivComponent.column;
   grid: typeof DivComponent.grid;
   box: typeof DivComponent.box;
};

Div.row = DivComponent.row;
Div.column = DivComponent.column;
Div.grid = DivComponent.grid;
Div.box = DivComponent.box;

export default Div;
