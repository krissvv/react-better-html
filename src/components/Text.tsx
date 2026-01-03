import { ComponentProps, forwardRef, memo } from "react";
import { OmitProps, useTheme } from "react-better-core";
import styled from "styled-components";

import { ComponentHoverStyle, ComponentPropWithRef, ComponentStyle } from "../types/components";

import { useComponentPropsGrouper, useComponentPropsWithPrefix } from "../utils/hooks";

const TextStyledComponent = styled.p.withConfig({
   shouldForwardProp: (prop) => !["style", "hoverStyle"].includes(prop),
})<{ style: ComponentStyle; hoverStyle: ComponentStyle }>`
   ${(props) => props.style as any}

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
   const { style, hoverStyle, restProps } = useComponentPropsGrouper(props);
   const dataProps = useComponentPropsWithPrefix(restProps, "data");
   const ariaProps = useComponentPropsWithPrefix(restProps, "aria");

   return (
      <TextStyledComponent
         as={props.as as any}
         translate={htmlContentTranslate}
         style={style}
         hoverStyle={hoverStyle}
         {...restProps}
         {...dataProps}
         {...ariaProps}
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
