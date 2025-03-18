import { forwardRef, memo } from "react";
import styled from "styled-components";

import { ComponentHoverStyle, ComponentPropWithRef, ComponentStyle } from "../types/components";
import { OmitProps } from "../types/app";

import { useComponentPropsWithoutStyle, useComponentPropsWithPrefix, useStyledComponentStyles } from "../utils/hooks";

import { useTheme } from "./BetterHtmlProvider";

const TextStyledComponent = styled.div.withConfig({
   shouldForwardProp: (prop) => !["normalStyle", "hoverStyle"].includes(prop),
})<{ normalStyle: ComponentStyle; hoverStyle: ComponentStyle }>`
   ${(props) => props.normalStyle as any}

   &:hover {
      ${(props) => props.hoverStyle as any}
   }
`;

export type TextProps = {
   /** @default "p" */
   as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "label";
} & OmitProps<React.ComponentProps<"p">, "style"> &
   ComponentStyle &
   ComponentHoverStyle;

type TextComponentType = {
   (props: ComponentPropWithRef<HTMLParagraphElement, TextProps>): React.ReactElement;
   unknown: (props: ComponentPropWithRef<HTMLParagraphElement, TextProps>) => React.ReactElement;
   oneLine: (props: ComponentPropWithRef<HTMLParagraphElement, TextProps>) => React.ReactElement;
};

const TextComponent: TextComponentType = forwardRef(function Text(
   { as = "p", children, ...props }: TextProps,
   ref: React.ForwardedRef<HTMLParagraphElement>,
) {
   const theme = useTheme();

   const styledComponentStyles = useStyledComponentStyles(props, theme);
   const dataProps = useComponentPropsWithPrefix(props, "data");
   const ariaProps = useComponentPropsWithPrefix(props, "aria");
   const restProps = useComponentPropsWithoutStyle(props);

   return (
      <TextStyledComponent as={as} {...styledComponentStyles} {...dataProps} {...ariaProps} {...restProps} ref={ref}>
         {children}
      </TextStyledComponent>
   );
}) as any;

TextComponent.unknown = forwardRef(function Unknown(props, ref) {
   const theme = useTheme();

   return (
      <TextComponent fontStyle="italic" textAlign="center" color={theme.colors.textSecondary} ref={ref} {...props} />
   );
}) as TextComponentType["unknown"];

TextComponent.oneLine = forwardRef(function OneLine(props, ref) {
   return <TextComponent textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden" ref={ref} {...props} />;
}) as TextComponentType["oneLine"];

const Text = memo(TextComponent) as any as typeof TextComponent & {
   unknown: typeof TextComponent.unknown;
   oneLine: typeof TextComponent.oneLine;
};

Text.unknown = TextComponent.unknown;
Text.oneLine = TextComponent.oneLine;

export default Text;
