import { forwardRef, memo } from "react";

import { ComponentPropWithRef } from "../types/components";
import { OmitProps } from "../types/app";
import { Color } from "../types/theme";

import { darkenColor, lightenColor, saturateColor } from "../utils/colorManipulation";

import Div, { DivProps } from "./Div";
import Text, { TextProps } from "./Text";
import { useBetterHtmlContextInternal, useTheme } from "./BetterHtmlProvider";

export type ChipProps = {
   text: string;
   /** @default theme.colors.textPrimary */
   color?: string;
   /** @default backgroundSecondary */
   backgroundColor?: string;
   /** @default theme.styles.borderRadius / 1.3 */
   borderRadius?: number;
   /** @default false */
   isCircle?: boolean;
} & Pick<DivProps, "border" | "borderColor" | "borderWidth" | "borderStyle"> &
   Pick<TextProps, "fontFamily" | "fontSize" | "fontWeight" | "fontStyle">;

type ChipComponentType = {
   (props: ComponentPropWithRef<HTMLDivElement, ChipProps>): React.ReactElement;
   colored: (
      props: ComponentPropWithRef<
         HTMLDivElement,
         OmitProps<ChipProps, "color" | "backgroundColor"> & {
            color?: Color;
         }
      >,
   ) => React.ReactElement;
};

const ChipComponent: ChipComponentType = forwardRef(function Chip(
   { text, color, backgroundColor, borderRadius, isCircle, ...props }: ChipProps,
   ref: React.ForwardedRef<HTMLDivElement>,
) {
   const theme = useTheme();

   return (
      <Div
         width="fit-content"
         backgroundColor={backgroundColor ?? theme.colors.backgroundSecondary}
         borderRadius={isCircle ? 999 : borderRadius ?? theme.styles.borderRadius / 1.3}
         paddingBlock={theme.styles.gap / 2}
         paddingInline={theme.styles.space / 1.5}
         {...props}
         ref={ref}
      >
         <Text color={color ?? theme.colors.textPrimary}>{text}</Text>
      </Div>
   );
}) as any;

ChipComponent.colored = forwardRef(function Colored({ color, ...props }, ref) {
   const theme = useTheme();
   const { colorTheme } = useBetterHtmlContextInternal();

   const readyColor = color ?? theme.colors.textSecondary;

   return (
      <ChipComponent
         color={colorTheme === "light" ? darkenColor(readyColor, 0.7) : lightenColor(readyColor, 0.7)}
         backgroundColor={readyColor + "40"}
         border={`1px solid ${readyColor}`}
         ref={ref}
         {...props}
      />
   );
}) as ChipComponentType["colored"];

const Chip = memo(ChipComponent) as any as typeof ChipComponent & {
   colored: typeof ChipComponent.colored;
};

Chip.colored = ChipComponent.colored;

export default Chip;
