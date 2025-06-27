import { memo, useCallback, useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import styled, { css, RuleSet } from "styled-components";

import { Theme } from "../types/theme";
import { ComponentPaddingProps, ComponentPropWithRef } from "../types/components";

import Div from "./Div";
import Text, { TextProps } from "./Text";
import Divider, { HorizontalDividerProps } from "./Divider";
import { useTheme } from "./BetterHtmlProvider";
import { AnyOtherString, OmitProps } from "../types/app";
import { IconName } from "../types/icon";
import Icon from "./Icon";

type TooltipContainerProps = {
   theme: Theme;
   position: TooltipPosition;
   align?: TooltipAlign;
   withArrow?: boolean;
   arrowSize?: number;
   isOpen: boolean;
   gap: number;
};

type ArrowProps = {
   theme: Theme;
   position: TooltipPosition;
   align?: TooltipAlign;
   isOpen: boolean;
   size: number;
};

const tooltipContainerStyle = (props: TooltipContainerProps): Record<TooltipPosition, RuleSet<object>> => ({
   top: css`
      bottom: calc(100% + ${props.gap}px + ${props.arrowSize}px);
      ${props.align === "center" ? "left: 50%;" : props.align === "left" ? "left: 0;" : "right: 0;"}
   `,
   bottom: css`
      top: calc(100% + ${props.gap}px + ${props.arrowSize}px);
      ${props.align === "center" ? "left: 50%;" : props.align === "left" ? "left: 0;" : "right: 0;"};
   `,
   left: css`
      ${props.align === "center" ? "top: 50%;" : props.align === "top" ? "top: 0;" : "bottom: 0;"};
      right: calc(100% + ${props.gap}px + ${props.arrowSize}px);
   `,
   right: css`
      ${props.align === "center" ? "top: 50%;" : props.align === "top" ? "top: 0;" : "bottom: 0;"};
      left: calc(100% + ${props.gap}px + ${props.arrowSize}px);
   `,
});

const tooltipPositionStyle = (
   props: TooltipContainerProps,
): Record<
   TooltipPosition,
   {
      opened: RuleSet<object>;
      closed: RuleSet<object>;
   }
> => ({
   top: {
      opened: css`
         transform: translateX(${props.align === "center" ? "-50%" : "0"});
      `,
      closed: css`
         transform: translateX(${props.align === "center" ? "-50%" : "0"}) translateY(${props.theme.styles.gap}px);
      `,
   },
   bottom: {
      opened: css`
         transform: translateX(${props.align === "center" ? "-50%" : "0"});
      `,
      closed: css`
         transform: translateX(${props.align === "center" ? "-50%" : "0"}) translateY(-${props.theme.styles.gap}px);
      `,
   },
   left: {
      opened: css`
         transform: translateY(${props.align === "center" ? "-50%" : "0"});
      `,
      closed: css`
         transform: translateX(${props.theme.styles.gap}px) translateY(${props.align === "center" ? "-50%" : "0"});
      `,
   },
   right: {
      opened: css`
         transform: translateY(${props.align === "center" ? "-50%" : "0"});
      `,
      closed: css`
         transform: translateX(-${props.theme.styles.gap}px) translateY(${props.align === "center" ? "-50%" : "0"});
      `,
   },
});

const arrowStyle = (props: ArrowProps): Record<TooltipPosition, RuleSet<object>> => ({
   top: css`
      bottom: -${props.size - 1}px;
      ${props.align === "center"
         ? "left:  50%;"
         : props.align === "left"
         ? "left: var(--arrow-side-space);"
         : "right: var(--arrow-side-space);"}
      border-top-color: var(--color);
      border-bottom: 0;
      ${props.align === "center" ? "transform: translateX(-50%);" : ""}
   `,
   bottom: css`
      top: -${props.size - 1}px;
      ${props.align === "center"
         ? "left:  50%;"
         : props.align === "left"
         ? "left: var(--arrow-side-space);"
         : "right: var(--arrow-side-space);"}
      border-bottom-color: var(--color);
      border-top: 0;
      ${props.align === "center" ? "transform: translateX(-50%);" : ""}
   `,
   left: css`
      right: -${props.size - 1}px;
      ${props.align === "center"
         ? "top: 50%;"
         : props.align === "top"
         ? "top: var(--arrow-side-space);"
         : "bottom: var(--arrow-side-space);"}
      border-left-color: var(--color);
      border-right: 0;
      ${props.align === "center" ? "transform: translateY(-50%);" : ""}
   `,
   right: css`
      left: -${props.size - 1}px;
      ${props.align === "center"
         ? "top: 50%;"
         : props.align === "top"
         ? "top: var(--arrow-side-space);"
         : "bottom: var(--arrow-side-space);"}
      border-right-color: var(--color);
      border-left: 0;
      ${props.align === "center" ? "transform: translateY(-50%);" : ""}
   `,
});

const TooltipContainer = styled.div.withConfig({
   shouldForwardProp: (prop) =>
      !["theme", "position", "align", "withArrow", "arrowSize", "isOpen", "gap"].includes(prop),
})<TooltipContainerProps>`
   position: absolute;
   opacity: ${(props) => (props.isOpen ? 1 : 0)};
   pointer-events: ${(props) => (props.isOpen ? "auto" : "none")};
   transition: ${(props) => props.theme.styles.transition};
   z-index: 1000;

   ${(props) => tooltipContainerStyle(props)[props.position]}

   ${(props) =>
      props.isOpen
         ? tooltipPositionStyle(props)[props.position].opened
         : tooltipPositionStyle(props)[props.position].closed}
`;

const Arrow = styled.div.withConfig({
   shouldForwardProp: (prop) => !["theme", "position", "align", "isOpen", "size"].includes(prop),
})<ArrowProps>`
   --color: ${(props) => props.theme.colors.backgroundContent};
   --arrow-side-space: ${(props) => props.theme.styles.borderRadius}px;

   position: absolute;
   width: 0;
   height: 0;
   border: ${(props) => props.size}px solid transparent;
   opacity: ${(props) => (props.isOpen ? 1 : 0)};
   pointer-events: ${(props) => (props.isOpen ? "auto" : "none")};
   transition: ${(props) => props.theme.styles.transition};
   z-index: 1;

   ${(props) => arrowStyle(props)[props.position]}
`;

type TooltipPosition = "top" | "bottom" | "left" | "right";
type TooltipAlign = "left" | "center" | "right" | "top" | "bottom";

export type TooltipProps = {
   /** @default "bottom" */
   position?: TooltipPosition;
   /** @default "hover" */
   trigger?: "hover" | "click";
   /** @default "center" */
   align?: TooltipAlign;
   content: React.ReactNode;
   contentWidth?: React.CSSProperties["width"];
   contentMinWidth?: React.CSSProperties["minWidth"];
   withArrow?: boolean;
   backgroundColor?: string;
   asContextMenu?: boolean;
   onOpen?: () => void;
   onClose?: () => void;
   children: React.ReactNode;
} & ComponentPaddingProps;

export type TooltipRef = {
   isOpen: boolean;
   open: () => void;
   close: () => void;
};

type TooltipComponent = {
   (props: ComponentPropWithRef<TooltipRef, TooltipProps>): React.ReactElement;
   item: <Value>(props: ComponentPropWithRef<HTMLDivElement, TooltipItemProps<Value>>) => React.ReactElement;
   divider: (props: ComponentPropWithRef<HTMLDivElement, HorizontalDividerProps>) => React.ReactElement;
   sectionTitle: (props: ComponentPropWithRef<HTMLParagraphElement, TooltipSectionTitleProps>) => React.ReactElement;
};

const TooltipComponent: TooltipComponent = forwardRef(function Tooltip(
   {
      position = "bottom",
      trigger = "hover",
      align = "center",
      content,
      contentWidth,
      contentMinWidth,
      withArrow,
      backgroundColor,
      asContextMenu,
      onOpen,
      onClose,
      children,
      ...props
   }: TooltipProps,
   ref: React.ForwardedRef<TooltipRef>,
) {
   const theme = useTheme();

   const triggerHolderRef = useRef<HTMLDivElement>(null);
   const contentRef = useRef<HTMLDivElement>(null);
   const tooltipContainerRef = useRef<HTMLDivElement>(null);

   const closeTimerRef = useRef<number>(undefined);

   const [isOpen, setIsOpen] = useState<boolean>(false);
   const [isOpenLate, setIsOpenLate] = useState<boolean>(false);

   const arrowSize = withArrow ? theme.styles.gap : 0;
   const tooltipTriggerGap = theme.styles.gap / 2;
   const outsideGap = theme.styles.gap / 2;

   const totalGap = arrowSize + tooltipTriggerGap;

   const openTooltip = useCallback(() => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);

      setIsOpen(true);
      setIsOpenLate(true);

      setTimeout(() => {
         if (!tooltipContainerRef.current) return;
         if (!contentRef.current) return;

         const clientRects = tooltipContainerRef.current.getBoundingClientRect();

         if (clientRects) {
            const { width, height, x, y } = clientRects;

            const topOutside = y < 0;
            const bottomOutside = y + height > window.innerHeight;
            const leftOutside = x < 0;
            const rightOutside = x + width > window.innerWidth;

            if (topOutside) contentRef.current.style.transform = `translateY(${y * -1 + outsideGap}px)`;
            if (bottomOutside)
               contentRef.current.style.transform = `translateY(${window.innerHeight - (y + height) - totalGap}px)`;
            if (leftOutside) contentRef.current.style.transform = `translateX(${x * -1 + outsideGap}px)`;
            if (rightOutside)
               contentRef.current.style.transform = `translateX(${window.innerWidth - (x + width) - totalGap}px)`;
         }
      }, 1);

      onOpen?.();
   }, [onOpen, outsideGap, totalGap]);
   const closeTooltip = useCallback(() => {
      setIsOpen(false);
      closeTimerRef.current = setTimeout(() => setIsOpenLate(false), 300);

      onClose?.();
   }, [onClose]);
   const onMouseEnter = useCallback(() => {
      if (trigger === "hover") openTooltip();
   }, [trigger, openTooltip]);
   const onMouseLeave = useCallback(() => {
      if (trigger === "hover") closeTooltip();
   }, [trigger, closeTooltip]);
   const onClickHolder = useCallback(
      (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
         if (trigger === "click") {
            if (!isOpen) openTooltip();
            else if (triggerHolderRef.current?.contains(event.target as Node)) closeTooltip();
         }
      },
      [trigger, openTooltip, isOpen, closeTooltip],
   );
   const onClickOutside = useCallback(
      (event: MouseEvent) => {
         if (!isOpen) return;
         if (trigger !== "click") return;

         if (
            !contentRef.current?.contains(event.target as Node) &&
            !triggerHolderRef.current?.contains(event.target as Node)
         ) {
            closeTooltip();
         }
      },
      [trigger, isOpen, closeTooltip],
   );

   useEffect(() => {
      if (trigger === "click") {
         document.addEventListener("mousedown", onClickOutside);

         return () => {
            document.removeEventListener("mousedown", onClickOutside);
         };
      }
   }, [trigger, onClickOutside]);

   useImperativeHandle(
      ref,
      (): TooltipRef => {
         return {
            isOpen,
            open: openTooltip,
            close: closeTooltip,
         };
      },
      [isOpen, openTooltip, closeTooltip],
   );

   return (
      <Div position="relative" onClick={onClickHolder} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
         <Div width="100%" ref={triggerHolderRef}>
            {children}
         </Div>

         <TooltipContainer
            theme={theme}
            position={position}
            align={align}
            withArrow={withArrow}
            arrowSize={arrowSize}
            gap={tooltipTriggerGap}
            isOpen={isOpen}
            ref={tooltipContainerRef}
         >
            {(isOpen || isOpenLate) && (
               <Div position="relative" ref={contentRef}>
                  <Div.box
                     position="relative"
                     width={contentWidth}
                     minWidth={contentMinWidth}
                     backgroundColor={backgroundColor ?? theme.colors.backgroundContent}
                     boxShadow="0px 10px 20px #00000020"
                     paddingInline={asContextMenu ? 0 : theme.styles.space}
                     overflow={asContextMenu ? "hidden" : undefined}
                     {...props}
                  >
                     {content}
                  </Div.box>

                  <Div
                     position="absolute"
                     width={position === "left" || position === "right" ? totalGap : "100%"}
                     height={position === "top" || position === "bottom" ? totalGap : "100%"}
                     top={position === "top" ? "calc(100% + 1px)" : position === "bottom" ? undefined : 0}
                     bottom={position === "bottom" ? "calc(100% + 1px)" : position === "top" ? undefined : 0}
                     left={position === "left" ? "calc(100% + 1px)" : position === "right" ? undefined : 0}
                     right={position === "right" ? "calc(100% + 1px)" : position === "left" ? undefined : 0}
                  />

                  {withArrow && (
                     <Arrow theme={theme} position={position} align={align} isOpen={isOpen} size={arrowSize} />
                  )}
               </Div>
            )}
         </TooltipContainer>
      </Div>
   );
}) as any;

type TooltipItemProps<Value = unknown> = {
   icon?: IconName | AnyOtherString;
   text?: string;
   description?: string;
   isActive?: boolean;
   value?: Value;
   onClick?: () => void;
   onClickWithValue?: (value: Value) => void;
};

TooltipComponent.item = forwardRef(function Item<Value>(
   { icon, text, description, isActive, onClick, onClickWithValue, value }: TooltipItemProps<Value>,
   ref: React.ForwardedRef<HTMLDivElement>,
) {
   const theme = useTheme();

   return (
      <Div.row
         alignItems="center"
         gap={theme.styles.space}
         backgroundColor={theme.colors.backgroundContent}
         filterHover="brightness(0.9)"
         paddingBlock={theme.styles.gap}
         paddingInline={theme.styles.space}
         cursor="pointer"
         value={value}
         onClick={onClick}
         onClickWithValue={onClickWithValue}
         ref={ref}
      >
         {icon && <Icon name={icon} color={!isActive ? theme.colors.textSecondary : undefined} />}

         <Div.column flex={1} gap={theme.styles.gap / 2}>
            <Text fontWeight={isActive ? 700 : undefined}>{text}</Text>
            {description && (
               <Text fontSize={14} color={theme.colors.textSecondary}>
                  {description}
               </Text>
            )}
         </Div.column>
      </Div.row>
   );
}) as TooltipComponent["item"];

TooltipComponent.divider = forwardRef(function DividerComponent(props, ref) {
   const theme = useTheme();

   return <Divider.horizontal marginBlock={theme.styles.gap} {...props} ref={ref} />;
}) as TooltipComponent["divider"];

type TooltipSectionTitleProps = OmitProps<TextProps, "children"> & {
   text?: string;
};

TooltipComponent.sectionTitle = forwardRef(function SectionTitle({ text, ...props }, ref) {
   const theme = useTheme();

   return (
      <Text
         fontSize={12}
         fontWeight={700}
         textTransform="uppercase"
         marginBlock={theme.styles.gap / 2}
         marginInline={theme.styles.space}
         {...props}
         ref={ref}
      >
         {text}
      </Text>
   );
}) as TooltipComponent["sectionTitle"];

const Tooltip = memo(TooltipComponent) as any as typeof TooltipComponent & {
   item: typeof TooltipComponent.item;
   divider: typeof TooltipComponent.divider;
   sectionTitle: typeof TooltipComponent.sectionTitle;
};

Tooltip.item = TooltipComponent.item;
Tooltip.divider = TooltipComponent.divider;
Tooltip.sectionTitle = TooltipComponent.sectionTitle;

export default Tooltip;
