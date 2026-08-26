import { ComponentProps, forwardRef, memo, useCallback } from "react";
import { OmitProps, Theme, useTheme } from "react-better-core";
import styled, { css } from "styled-components";

import { isMobileDevice } from "../constants";

import { ComponentHoverStyle, ComponentPropWithRef, ComponentStyle } from "../types/components";

import { useComponentPropsGrouper, useComponentPropsWithPrefix } from "../utils/hooks";

const TextStyledComponent = styled.p.withConfig({
   shouldForwardProp: (prop) => !["theme", "style", "hoverStyle", "isP"].includes(prop),
})<{ theme: Theme; style: ComponentStyle; hoverStyle: ComponentStyle; isP?: boolean }>`
   ${(props) =>
      props.isP
         ? css`
              font-size: ${props.theme.styles.fontSize}px;
           `
         : ""}

   ${(props) => props.style as any}

   &:hover {
      ${(props) => props.hoverStyle as any}
   }
`;

export type TextAs = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "label" | "li";

export type TextProps<As extends TextAs = "p"> = {
   /** @default "p" */
   as?: As;
   /** @default false */
   isTabAccessed?: boolean;
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
   { as: asValue, isTabAccessed, htmlContentTranslate, onKeyDown, children, ...props }: TextProps<As>,
   ref: React.ForwardedRef<HTMLParagraphElement>,
) {
   const theme = useTheme();

   const { style, hoverStyle, restProps } = useComponentPropsGrouper(props);
   const dataProps = useComponentPropsWithPrefix(restProps, "data");
   const ariaProps = useComponentPropsWithPrefix(restProps, "aria");

   const onKeyDownElement = useCallback(
      (event: any) => {
         onKeyDown?.(event);

         if (!isTabAccessed) return;

         if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.currentTarget.click();
         }
      },
      [onKeyDown, isTabAccessed],
   );

   return (
      <TextStyledComponent
         as={asValue}
         tabIndex={isTabAccessed && !isMobileDevice ? 0 : undefined}
         theme={theme}
         translate={htmlContentTranslate}
         onKeyDown={onKeyDownElement}
         style={style}
         hoverStyle={hoverStyle}
         isP={asValue === "p"}
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
