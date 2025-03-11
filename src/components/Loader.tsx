import { memo } from "react";
import styled from "styled-components";

import { Color } from "../types/theme";
import { OmitProps } from "../types/app";

import Div, { DivProps } from "./Div";

import { useTheme } from "./BetterHtmlProvider";

type LoaderProps = {
   /** @default textPrimary */
   color?: Color;
   /** @default 16 */
   size?: number;
   /** @default 5 */
   width?: number;
   /** @default false */
   disabled?: boolean;
} & OmitProps<
   DivProps<unknown>,
   | "width"
   | "height"
   | "color"
   | "background"
   | "borderRadius"
   | "mask"
   | "WebkitMask"
   | "padding"
   | "animation"
   | "animationName"
>;

type LoaderComponentType = {
   (props: LoaderProps): React.ReactElement;
};

const StyledDiv = styled(Div)`
   @keyframes loaderAnimation {
      to {
         transform: rotate(360deg);
      }
   }

   @keyframes textLoaderAnimation {
      to {
         clip-path: inset(0 -1ch 0 0);
      }
   }
`;

const LoaderComponent: LoaderComponentType = function Loader({
   color,
   size = 16,
   width,
   disabled,
   ...props
}: LoaderProps) {
   const theme = useTheme();

   const readyColor: Color = color ?? theme.colors.textPrimary;
   const readyWidth: number = width ?? size / 3;
   const mask: React.CSSProperties["mask"] = `radial-gradient(farthest-side, #0000 calc(100% - ${readyWidth}px), #000 0)`;

   return (
      <StyledDiv
         width={size + readyWidth * 2}
         height={size + readyWidth * 2}
         background={`radial-gradient(farthest-side, ${readyColor} 94%, #0000) top/${readyWidth}px ${readyWidth}px no-repeat, conic-gradient(#0000 30%, ${readyColor})`}
         borderRadius={999}
         mask={mask}
         WebkitMask={mask}
         padding={readyWidth}
         animation={!disabled ? "loaderAnimation .6s infinite linear" : undefined}
         {...props}
      />
   );
};

const Loader = memo(LoaderComponent) as any as typeof LoaderComponent & {};

export default Loader;
