import { forwardRef, memo } from "react";
import { useTheme } from "react-better-core";

import { ComponentMarginProps, ComponentPropWithRef } from "../types/components";

import { useComponentsPropsMerger } from "../utils/hooks";

import Div from "./Div";
import Text from "./Text";
import { useBetterHtmlContextInternal } from "./BetterHtmlProvider";

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
   textFontFamily?: React.CSSProperties["fontFamily"];
   textFontSize?: React.CSSProperties["fontSize"];
   textFontWeight?: React.CSSProperties["fontWeight"];
   textTransform?: React.CSSProperties["textTransform"];
   textLetterSpacing?: React.CSSProperties["letterSpacing"];
   /** @default textSecondary */
   textColor?: React.CSSProperties["color"];
};

type DividerComponentType = {
   vertical: (props: ComponentPropWithRef<HTMLDivElement, VerticalDividerProps>) => React.ReactElement;
   horizontal: (props: ComponentPropWithRef<HTMLDivElement, HorizontalDividerProps>) => React.ReactElement;
};

export default {
   vertical: memo(
      forwardRef(function Divider(dividerProps: VerticalDividerProps, ref: React.ForwardedRef<HTMLDivElement>) {
         const betterHtmlContextInternal = useBetterHtmlContextInternal();
         const {
            width = 1,
            backgroundColor,
            height,
            ...props
         } = useComponentsPropsMerger(betterHtmlContextInternal.components.divider?.style?.vertical, dividerProps);

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
      forwardRef(function Divider(dividerProps: HorizontalDividerProps, ref: React.ForwardedRef<HTMLDivElement>) {
         const betterHtmlContextInternal = useBetterHtmlContextInternal();
         const {
            width = 1,
            backgroundColor,
            text,
            textFontFamily,
            textFontSize,
            textFontWeight,
            textTransform,
            textLetterSpacing,
            textColor,
            ...props
         } = useComponentsPropsMerger(betterHtmlContextInternal.components.divider?.style?.horizontal, dividerProps);

         const theme = useTheme();

         return (
            <Div.row width="100%" alignItems="center" gap={text ? theme.styles.space : undefined} {...props} ref={ref}>
               <Div flex={1} height={width} flexShrink={0} backgroundColor={backgroundColor ?? theme.colors.border} />

               {text && (
                  <Text
                     fontFamily={textFontFamily}
                     fontSize={textFontSize}
                     fontWeight={textFontWeight}
                     textTransform={textTransform}
                     letterSpacing={textLetterSpacing}
                     color={textColor ?? theme.colors.textSecondary}
                  >
                     {text}
                  </Text>
               )}

               <Div flex={1} height={width} flexShrink={0} backgroundColor={backgroundColor ?? theme.colors.border} />
            </Div.row>
         );
      }),
   ) as DividerComponentType["horizontal"],
};
