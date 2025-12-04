import { forwardRef, memo, useCallback } from "react";

import { ComponentPropWithRef } from "../types/components";
import { OmitProps } from "../types/app";

import { darkenColor, lightenColor } from "../utils/colorManipulation";

import Div, { DivProps } from "./Div";
import Text, { TextProps } from "./Text";
import { useBetterHtmlContextInternal, useTheme } from "./BetterHtmlProvider";

export type ChipProps<Value = unknown> = {
   text: string;
   /** @default theme.colors.textPrimary */
   color?: string;
   /** @default backgroundSecondary */
   backgroundColor?: string;
   /** @default theme.styles.borderRadius / 1.3 */
   borderRadius?: number;
   /** @default false */
   isCircle?: boolean;
   value?: Value;
   onClick?: (event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
   onClickWithValue?: (value: Value) => void;
} & Pick<DivProps, "border" | "borderColor" | "borderWidth" | "borderStyle"> &
   Pick<TextProps, "fontFamily" | "fontSize" | "fontWeight" | "fontStyle">;

type ChipComponentType = {
   <Value>(props: ComponentPropWithRef<HTMLDivElement, ChipProps>): React.ReactElement;
   colored: (
      props: ComponentPropWithRef<
         HTMLDivElement,
         OmitProps<ChipProps, "color" | "backgroundColor"> & {
            color?: string;
         }
      >,
   ) => React.ReactElement;
};

const ChipComponent: ChipComponentType = forwardRef(function Chip<Value>(
   {
      text,
      color,
      backgroundColor,
      borderRadius,
      isCircle,
      value,
      onClick,
      onClickWithValue,
      ...props
   }: ChipProps<Value>,
   ref: React.ForwardedRef<HTMLDivElement>,
) {
   const theme = useTheme();

   const onClickElement = useCallback(
      (event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
         onClick?.(event);
         onClickWithValue?.(value as any);
      },
      [onClick, onClickWithValue, value],
   );

   return (
      <Div
         width="fit-content"
         backgroundColor={backgroundColor ?? theme.colors.backgroundSecondary}
         borderRadius={isCircle ? 999 : borderRadius ?? theme.styles.borderRadius / 1.3}
         paddingBlock={theme.styles.gap / 2}
         paddingInline={theme.styles.space / 1.5}
         onClick={onClickElement}
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
