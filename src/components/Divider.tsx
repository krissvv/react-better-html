import { memo } from "react";

import Div from "./Div";
import Text from "./Text";
import { useTheme } from "./BetterHtmlProvider";

type DividerProps = {
   /** @default 1 */
   width?: number;
   /** @default border */
   backgroundColor?: string;
   paddingBlock?: number;
};

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
   vertical: memo(function Divider({ width = 1, backgroundColor, paddingBlock, height }: VerticalDividerProps) {
      const theme = useTheme();

      return (
         <Div
            width={width}
            height={height ?? "100%"}
            flexShrink={0}
            backgroundColor={backgroundColor ?? theme.colors.border}
            paddingBlock={paddingBlock}
         />
      );
   }),
   horizontal: memo(function Divider({
      width = 1,
      backgroundColor,
      paddingBlock,
      text,
      textColor,
   }: HorizontalDividerProps) {
      const theme = useTheme();

      return (
         <Div.row alignItems="center" gap={text ? theme.styles.space : undefined} paddingBlock={paddingBlock}>
            <Div flex={1} height={width} flexShrink={0} backgroundColor={backgroundColor ?? theme.colors.border} />

            {text && <Text color={textColor ?? theme.colors.textSecondary}>{text}</Text>}

            <Div flex={1} height={width} flexShrink={0} backgroundColor={backgroundColor ?? theme.colors.border} />
         </Div.row>
      );
   }),
};
