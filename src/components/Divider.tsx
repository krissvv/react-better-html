import { forwardRef, memo } from "react";

import { ComponentMarginProps, ComponentPropWithRef } from "../types/components";

import Div from "./Div";
import Text from "./Text";
import { useTheme } from "./BetterHtmlProvider";

type DividerProps = {
   /** @default 1 */
   width?: number;
   /** @default border */
   backgroundColor?: string;
} & ComponentMarginProps;

export type VerticalDividerProps = DividerProps & {
   /** @default "100%" */
   height?: number;
};

export type HorizontalDividerProps = DividerProps & {
   text?: string;
   textFontSize?: React.CSSProperties["fontSize"];
   /** @default textSecondary */
   textColor?: React.CSSProperties["color"];
};

type DividerComponentType = {
   vertical: (props: ComponentPropWithRef<HTMLDivElement, VerticalDividerProps>) => React.ReactElement;
   horizontal: (props: ComponentPropWithRef<HTMLDivElement, HorizontalDividerProps>) => React.ReactElement;
};

export default {
   vertical: memo(
      forwardRef(function Divider(
         { width = 1, backgroundColor, height, ...props }: VerticalDividerProps,
         ref: React.ForwardedRef<HTMLDivElement>,
      ) {
         const theme = useTheme();

         return (
            <Div
               width={width}
               height={height ?? "100%"}
               flexShrink={0}
               backgroundColor={backgroundColor ?? theme.colors.border}
               {...props}
               ref={ref}
            />
         );
      }),
   ) as DividerComponentType["vertical"],
   horizontal: memo(
      forwardRef(function Divider(
         { width = 1, backgroundColor, text, textFontSize, textColor, ...props }: HorizontalDividerProps,
         ref: React.ForwardedRef<HTMLDivElement>,
      ) {
         const theme = useTheme();

         return (
            <Div.row width="100%" alignItems="center" gap={text ? theme.styles.space : undefined} {...props} ref={ref}>
               <Div flex={1} height={width} flexShrink={0} backgroundColor={backgroundColor ?? theme.colors.border} />

               {text && (
                  <Text fontSize={textFontSize} color={textColor ?? theme.colors.textSecondary}>
                     {text}
                  </Text>
               )}

               <Div flex={1} height={width} flexShrink={0} backgroundColor={backgroundColor ?? theme.colors.border} />
            </Div.row>
         );
      }),
   ) as DividerComponentType["horizontal"],
};
