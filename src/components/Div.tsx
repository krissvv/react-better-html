import { forwardRef, memo, useCallback } from "react";
import styled, { WebTarget } from "styled-components";

import { isMobileDevice } from "../constants";

import { ComponentHoverStyle, ComponentPropWithRef, ComponentStyle } from "../types/components";
import { OmitProps } from "../types/app";

import { useStyledComponentStyles, useComponentPropsWithPrefix, useComponentPropsWithoutStyle } from "../utils/hooks";

import { useTheme } from "./BetterHtmlProvider";

const DivStyledComponent = styled.div.withConfig({
   shouldForwardProp: (prop) => !["normalStyle", "hoverStyle"].includes(prop),
})<{ normalStyle: ComponentStyle; hoverStyle: ComponentStyle }>`
   ${(props) => props.normalStyle as any}

   &:hover {
      ${(props) => props.hoverStyle as any}
   }
`;

export type DivProps<Value> = {
   value?: Value;
   /** @default "div" */
   as?: WebTarget;
   /** @default false */
   isTabAccessed?: boolean;
   onClickWithValue?: (value: Value) => void;
} & OmitProps<React.ComponentProps<"div">, "style" | "defaultValue"> &
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
   box: <Value>(props: ComponentPropWithRef<HTMLDivElement, DivProps<Value>>) => React.ReactElement;
};

const DivComponent: DivComponentType = forwardRef(function Div<Value>(
   { value, as, isTabAccessed, onClickWithValue, role, onClick, onKeyDown, children, ...props }: DivProps<Value>,
   ref: React.ForwardedRef<HTMLDivElement>,
) {
   const theme = useTheme();

   const styledComponentStyles = useStyledComponentStyles(props, theme);
   const dataProps = useComponentPropsWithPrefix(props, "data");
   const ariaProps = useComponentPropsWithPrefix(props, "aria");
   const restProps = useComponentPropsWithoutStyle(props);

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
         role={role ?? (onClick ? "button" : undefined)}
         onClick={onClickElement}
         onKeyDown={onKeyDownElement}
         {...styledComponentStyles}
         {...dataProps}
         {...ariaProps}
         {...restProps}
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
         flexDirection={((invertFlexDirection ? "column" : "row") + reverseSuffix) as any}
         ref={ref}
         {...props}
      />
   );
}) as DivComponentType["column"];

DivComponent.grid = forwardRef(function Grid(props, ref) {
   return <DivComponent display="grid" ref={ref} {...props} />;
}) as DivComponentType["grid"];

DivComponent.box = forwardRef(function Box(props, ref) {
   const theme = useTheme();

   return (
      <DivComponent
         backgroundColor={theme.colors.backgroundContent}
         border={`1px solid ${theme.colors.border}`}
         borderRadius={theme.styles.borderRadius}
         paddingBlock={theme.styles.gap}
         paddingInline={theme.styles.space}
         ref={ref}
         {...props}
      />
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
