import { memo } from "react";

import { ComponentMarginProps } from "../types/components";

import Div from "./Div";
import Text from "./Text";
import { useTheme } from "./BetterHtmlProvider";

type DividerProps = {
   /** @default 1 */
   width?: number;
   /** @default border */
   backgroundColor?: string;
} & ComponentMarginProps;

type VerticalDividerProps = DividerProps & {
   /** @default "100%" */
   height?: number;
};

type HorizontalDividerProps = DividerProps & {
   text?: string;
   /** @default textSecondary */
   textColor?: string;
};

export default {
   vertical: memo(function Divider({ width = 1, backgroundColor, height, ...props }: VerticalDividerProps) {
      const theme = useTheme();

      return (
         <Div
            width={width}
            height={height ?? "100%"}
            flexShrink={0}
            backgroundColor={backgroundColor ?? theme.colors.border}
            {...props}
         />
      );
   }),
   horizontal: memo(function Divider({
      width = 1,
      backgroundColor,
      text,
      textColor,
      ...props
   }: HorizontalDividerProps) {
      const theme = useTheme();

      return (
         <Div.row alignItems="center" gap={text ? theme.styles.space : undefined} {...props}>
            <Div flex={1} height={width} flexShrink={0} backgroundColor={backgroundColor ?? theme.colors.border} />

            {text && <Text color={textColor ?? theme.colors.textSecondary}>{text}</Text>}

            <Div flex={1} height={width} flexShrink={0} backgroundColor={backgroundColor ?? theme.colors.border} />
         </Div.row>
      );
   }),
};
