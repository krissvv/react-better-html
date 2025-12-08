import { ComponentProps, forwardRef, memo } from "react";
import styled from "styled-components";

import { ComponentHoverStyle, ComponentPropWithRef, ComponentStyle } from "../types/components";
import { OmitProps } from "../types/app";

import { useComponentPropsWithoutStyle, useComponentPropsWithPrefix, useStyledComponentStyles } from "../utils/hooks";

import { useTheme } from "./BetterHtmlProvider";

const TextStyledComponent = styled.p.withConfig({
   shouldForwardProp: (prop) => !["normalStyle", "hoverStyle"].includes(prop),
})<{ normalStyle: ComponentStyle; hoverStyle: ComponentStyle }>`
   ${(props) => props.normalStyle as any}

   &:hover {
      ${(props) => props.hoverStyle as any}
   }
`;

export type TextAs = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "label";

export type TextProps<As extends TextAs = "p"> = {
   /** @default "p" */
   as?: As;
   htmlContentTranslate?: React.ComponentProps<"div">["translate"];
} & OmitProps<React.ComponentProps<As>, "style"> &
   ComponentStyle &
   ComponentHoverStyle;

type TextComponentType = {
   <As extends TextAs>(props: ComponentPropWithRef<HTMLParagraphElement, TextProps<As>>): React.ReactElement;
   unknown: <As extends TextAs>(props: ComponentPropWithRef<HTMLParagraphElement, TextProps<As>>) => React.ReactElement;
   oneLine: <As extends TextAs>(props: ComponentPropWithRef<HTMLParagraphElement, TextProps<As>>) => React.ReactElement;
};

const TextComponent: TextComponentType = forwardRef(function Text<As extends TextAs>(
   { htmlContentTranslate, children, ...props }: TextProps<As>,
   ref: React.ForwardedRef<HTMLParagraphElement>,
) {
   const theme = useTheme();

   const styledComponentStyles = useStyledComponentStyles(props, theme);
   const dataProps = useComponentPropsWithPrefix(props, "data");
   const ariaProps = useComponentPropsWithPrefix(props, "aria");
   const restProps = useComponentPropsWithoutStyle(props);

   return (
      <TextStyledComponent
         as={props.as}
         translate={htmlContentTranslate}
         {...(styledComponentStyles as any)}
         {...dataProps}
         {...ariaProps}
         {...restProps}
         ref={ref}
      >
         {children}
      </TextStyledComponent>
   );
}) as any;

TextComponent.unknown = forwardRef(function Unknown(
   props: ComponentProps<TextComponentType["unknown"]>,
   ref: React.ForwardedRef<HTMLParagraphElement>,
) {
   const theme = useTheme();

   return (
      <TextComponent fontStyle="italic" textAlign="center" color={theme.colors.textSecondary} ref={ref} {...props} />
   );
}) as TextComponentType["unknown"];

TextComponent.oneLine = forwardRef(function OneLine(
   props: ComponentProps<TextComponentType["oneLine"]>,
   ref: React.ForwardedRef<HTMLParagraphElement>,
) {
   return <TextComponent textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden" ref={ref} {...props} />;
}) as TextComponentType["oneLine"];

const Text = memo(TextComponent) as any as typeof TextComponent & {
   unknown: typeof TextComponent.unknown;
   oneLine: typeof TextComponent.oneLine;
};

Text.unknown = TextComponent.unknown;
Text.oneLine = TextComponent.oneLine;

export default Text;
