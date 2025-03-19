import { forwardRef, memo, useEffect } from "react";
import styled from "styled-components";

import { AnyOtherString, OmitProps } from "../types/app";
import { ComponentHoverStyle, ComponentPropWithRef, ComponentStyle } from "../types/components";
import { IconName } from "../types/icon";

import { useComponentPropsWithoutStyle, useComponentPropsWithPrefix, useStyledComponentStyles } from "../utils/hooks";

import { useBetterHtmlContext, useTheme } from "./BetterHtmlProvider";

type IconProps = {
   name: IconName | AnyOtherString;
   /** @default 16 */
   size?: number;
} & OmitProps<React.ComponentProps<"svg">, "style" | "width" | "height" | "viewBox" | "fill" | "xmlns"> &
   ComponentStyle &
   ComponentHoverStyle;

type IconComponent = {
   (props: ComponentPropWithRef<SVGSVGElement, IconProps>): React.ReactElement;
};

const IconElement = styled.svg.withConfig({
   shouldForwardProp: (prop) => !["normalStyle", "hoverStyle"].includes(prop),
})<{ normalStyle: ComponentStyle; hoverStyle: ComponentStyle }>`
   ${(props) => props.normalStyle as any}

   &:hover {
      ${(props) => props.hoverStyle as any}
   }
`;

const Icon: IconComponent = forwardRef(function Icon(
   { name, size = 16, ...props }: IconProps,
   ref: React.ForwardedRef<SVGSVGElement>,
) {
   const theme = useTheme();
   const { icons } = useBetterHtmlContext();

   const styledComponentStyles = useStyledComponentStyles(props, theme);
   const dataProps = useComponentPropsWithPrefix(props, "data");
   const ariaProps = useComponentPropsWithPrefix(props, "aria");
   const restProps = useComponentPropsWithoutStyle(props);

   const svgColor = props.color ?? theme.colors.textPrimary;

   useEffect(() => {
      if (!icons[name])
         console.warn(
            `The icon \`${name}\` you are trying to use does not exist. Make sure to add it to the \`icons\` object in \`<BetterHtmlProvider>\` config value prop.`,
         );
   }, [icons, name]);

   return (
      <IconElement
         width={size}
         height={size}
         viewBox={`0 0 ${icons[name]?.width ?? 0} ${icons[name]?.height ?? 0}`}
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...styledComponentStyles}
         {...dataProps}
         {...ariaProps}
         {...restProps}
         ref={ref}
      >
         {icons[name]?.paths.map((path) => (
            <path
               {...path}
               fill={path.type === "fill" ? svgColor : undefined}
               stroke={path.type === "stroke" ? svgColor : undefined}
               key={path.d}
            />
         ))}
      </IconElement>
   );
}) as any;

const MemoizedIcon = memo(Icon) as any as typeof Icon & {};

export default { Icon: MemoizedIcon }.Icon;
