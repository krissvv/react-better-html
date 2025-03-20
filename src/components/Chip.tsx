import { forwardRef, memo } from "react";

import { ComponentPropWithRef } from "../types/components";
import { OmitProps } from "../types/app";

import Div from "./Div";
import Text from "./Text";
import { useTheme } from "./BetterHtmlProvider";

type ChipProps = {
   text: string;
   /** @default theme.colors.textPrimary */
   color?: string;
   /** @default backgroundSecondary */
   backgroundColor?: string;
   /** @default theme.styles.borderRadius / 1.3 */
   borderRadius?: number;
};

type ChipComponentType = {
   (props: ComponentPropWithRef<HTMLDivElement, ChipProps>): React.ReactElement;
   circle: (props: ComponentPropWithRef<HTMLDivElement, OmitProps<ChipProps, "borderRadius">>) => React.ReactElement;
};

const ChipComponent: ChipComponentType = forwardRef(function Chip(
   { text, color, backgroundColor, borderRadius }: ChipProps,
   ref: React.ForwardedRef<HTMLDivElement>,
) {
   const theme = useTheme();

   return (
      <Div
         width="fit-content"
         backgroundColor={backgroundColor ?? theme.colors.backgroundSecondary}
         borderRadius={borderRadius ?? theme.styles.borderRadius / 1.3}
         paddingBlock={theme.styles.gap}
         paddingInline={theme.styles.space}
         ref={ref}
      >
         <Text color={color ?? theme.colors.textPrimary}>{text}</Text>
      </Div>
   );
}) as any;

ChipComponent.circle = forwardRef(function Circle(props, ref) {
   return <ChipComponent borderRadius={999} ref={ref} {...props} />;
}) as ChipComponentType["circle"];

const Chip = memo(ChipComponent) as any as typeof ChipComponent & {
   circle: typeof ChipComponent.circle;
};

Chip.circle = ChipComponent.circle;

export default Chip;
