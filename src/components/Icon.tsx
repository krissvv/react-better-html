import { forwardRef, memo, useEffect } from "react";
import styled from "styled-components";

import { AnyOtherString, OmitProps } from "../types/app";
import { ComponentHoverStyle, ComponentPropWithRef, ComponentStyle } from "../types/components";
import { IconName } from "../types/icon";
import { Theme } from "../types/theme";

import { useComponentPropsWithoutStyle, useComponentPropsWithPrefix, useStyledComponentStyles } from "../utils/hooks";

import { useBetterHtmlContextInternal, useTheme } from "./BetterHtmlProvider";

export type IconProps = {
   name: IconName | AnyOtherString;
   /** @default 16 */
   size?: number;
} & OmitProps<React.ComponentProps<"svg">, "style" | "width" | "height" | "viewBox" | "fill" | "xmlns" | "name"> &
   ComponentStyle &
   ComponentHoverStyle;

type IconComponent = {
   (props: ComponentPropWithRef<SVGSVGElement, IconProps>): React.ReactElement;
};

const IconElement = styled.svg.withConfig({
   shouldForwardProp: (prop) => !["theme", "normalStyle", "hoverStyle", "hoverColor"].includes(prop),
})<{ theme: Theme; normalStyle: ComponentStyle; hoverStyle: ComponentStyle; hoverColor?: string }>`
   ${(props) => props.normalStyle as any}

   path {
      ${(props) => (props.hoverColor ? `transition: ${props.theme.styles.transition};` : "")}
   }

   &:hover {
      path.react-better-html-icon-path-with-fill {
         fill: ${(props) => props.hoverColor};
      }

      path.react-better-html-icon-path-with-stroke {
         stroke: ${(props) => props.hoverColor};
      }
   }

   &:hover {
      ${(props) => props.hoverStyle as any}
   }
`;

const Icon: IconComponent = forwardRef(function Icon(
   { name, size = 16, ...props }: IconProps,
   ref: React.ForwardedRef<SVGSVGElement>,
) {
   const theme = useTheme();
   const { icons } = useBetterHtmlContextInternal();

   const styledComponentStyles = useStyledComponentStyles(props, theme);
   const dataProps = useComponentPropsWithPrefix(props, "data");
   const ariaProps = useComponentPropsWithPrefix(props, "aria");
   const restProps = useComponentPropsWithoutStyle(props);

   const svgColor = props.color ?? theme.colors.textPrimary;
   const svgHoverColorColor = props.colorHover;

   useEffect(() => {
      if (!icons[name.toString()])
         console.warn(
            `The icon \`${name}\` you are trying to use does not exist. Make sure to add it to the \`icons\` object in \`<BetterHtmlProvider>\` config value prop.`,
         );
   }, [icons, name]);

   return (
      <IconElement
         width={size}
         height={size}
         viewBox={`0 0 ${icons[name.toString()]?.width ?? 0} ${icons[name.toString()]?.height ?? 0}`}
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         theme={theme}
         hoverColor={svgHoverColorColor}
         {...styledComponentStyles}
         {...dataProps}
         {...ariaProps}
         {...restProps}
         ref={ref}
      >
         {icons[name.toString()]?.paths.map((path) => (
            <path
               {...path}
               className={
                  path.type === "fill"
                     ? "react-better-html-icon-path-with-fill"
                     : "react-better-html-icon-path-with-stroke"
               }
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
