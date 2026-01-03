import { memo, useCallback, useRef, useState, useEffect, forwardRef, useImperativeHandle, useMemo } from "react";
import { AnyOtherString, IconName, OmitProps, Theme, useTheme } from "react-better-core";
import styled, { css, RuleSet } from "styled-components";

import { ComponentPropWithRef } from "../types/components";

import Div, { DivProps } from "./Div";
import Text, { TextProps } from "./Text";
import Divider, { HorizontalDividerProps } from "./Divider";
import Icon from "./Icon";

type TooltipContainerProps = {
   theme: Theme;
   position: TooltipPosition;
   align?: TooltipAlign;
   pointerEvents?: React.CSSProperties["pointerEvents"];
   withArrow?: boolean;
   arrowSize?: number;
   isOpen: boolean;
   gap: number;
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

const TooltipContainer = styled.div.withConfig({
   shouldForwardProp: (prop) =>
      !["theme", "position", "align", "pointerEvents", "withArrow", "arrowSize", "isOpen", "gap"].includes(prop),
})<TooltipContainerProps>`
   position: absolute;
   opacity: ${(props) => (props.isOpen ? 1 : 0)};
   pointer-events: ${(props) => (props.isOpen ? props.pointerEvents : "none")};
   transition: ${(props) => props.theme.styles.transition};
   z-index: 1000;

   ${(props) => tooltipContainerStyle(props)[props.position]}

   ${(props) =>
      props.isOpen
         ? tooltipPositionStyle(props)[props.position].opened
         : tooltipPositionStyle(props)[props.position].closed}
`;

type TooltipPosition = "top" | "bottom" | "left" | "right";
type TooltipAlign = "left" | "center" | "right" | "top" | "bottom";

type ArrowProps = {
   position: TooltipPosition;
   align: TooltipAlign;
   sideSpace: number;
   size: number;
   color: string;
   isOpen: boolean;
};

const arrowStyle = (props: ArrowProps, borderWidth?: number): Record<TooltipPosition, DivProps> => ({
   top: {
      borderTopColor: props.color,
      borderBottom: 0,
      top: borderWidth ? -props.size : undefined,
      left: borderWidth
         ? -props.size + borderWidth * 2
         : props.align === "center"
         ? "50%"
         : props.align === "left"
         ? props.sideSpace
         : undefined,
      right: !borderWidth && props.align === "right" ? props.sideSpace : undefined,
      bottom: -props.size + 1,
      transform: !borderWidth && props.align === "center" ? "translateX(-50%)" : undefined,
   },
   bottom: {
      borderBottomColor: props.color,
      borderTop: 0,
      top: borderWidth ? borderWidth * 2 : -props.size + 1,
      left: borderWidth
         ? -props.size + borderWidth * 2
         : props.align === "center"
         ? "50%"
         : props.align === "left"
         ? props.sideSpace
         : undefined,
      right: !borderWidth && props.align === "right" ? props.sideSpace : undefined,
      transform: !borderWidth && props.align === "center" ? "translateX(-50%);" : undefined,
   },
   left: {
      borderLeftColor: props.color,
      borderRight: 0,
      top: borderWidth
         ? -props.size + borderWidth * 2
         : props.align === "center"
         ? "50%"
         : props.align === "top"
         ? props.sideSpace
         : undefined,
      bottom: !borderWidth && props.align === "bottom" ? props.sideSpace : undefined,
      left: borderWidth ? -props.size : undefined,
      right: -props.size + 1,
      transform: !borderWidth && props.align === "center" ? "translateY(-50%)" : undefined,
   },
   right: {
      borderRightColor: props.color,
      borderLeft: 0,
      top: borderWidth
         ? -props.size + borderWidth * 2
         : props.align === "center"
         ? "50%"
         : props.align === "top"
         ? props.sideSpace
         : undefined,
      bottom: !borderWidth && props.align === "bottom" ? props.sideSpace : undefined,
      left: borderWidth ? borderWidth * 2 : -props.size + 1,
      transform: !borderWidth && props.align === "center" ? "translateY(-50%);" : undefined,
   },
});

const Arrow = memo(function Arrow(props: ArrowProps) {
   const theme = useTheme();

   const { position, size } = props;

   const outerProps = useMemo<ArrowProps>(
      () => ({
         ...props,
         color: theme.colors.border,
      }),
      [props, theme],
   );

   const borderWidth = 1;

   return (
      <Div
         position="absolute"
         width={0}
         height={0}
         border={`${size}px solid transparent`}
         {...arrowStyle(outerProps)[position]}
      >
         <Div
            position="absolute"
            width={0}
            height={0}
            border={`${size - borderWidth * 2}px solid transparent`}
            {...arrowStyle(props, borderWidth)[position]}
         />
      </Div>
   );
});

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
   contentPointerEvents?: React.CSSProperties["pointerEvents"];
   /** @default "fit-content" */
   childrenWrapperWidth?: React.CSSProperties["width"];
   childrenWrapperHeight?: React.CSSProperties["height"];
   disabled?: boolean;
   withArrow?: boolean;
   isSmall?: boolean;
   backgroundColor?: string;
   asContextMenu?: boolean;
   isTabAccessed?: boolean;
   onOpen?: () => void;
   onClose?: () => void;
   children: React.ReactNode;
};

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
      contentPointerEvents = "auto",
      childrenWrapperWidth = "fit-content",
      childrenWrapperHeight,
      disabled,
      withArrow,
      isSmall,
      backgroundColor,
      asContextMenu,
      isTabAccessed,
      onOpen,
      onClose,
      children,
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
   const gap = theme.styles.gap / 2;

   const outsideScreenGap = theme.styles.gap / 2;
   const totalGap = arrowSize + gap;

   const openTooltip = useCallback(() => {
      if (disabled) return;
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

            if (topOutside) contentRef.current.style.transform = `translateY(${y * -1 + outsideScreenGap}px)`;
            if (bottomOutside)
               contentRef.current.style.transform = `translateY(${window.innerHeight - (y + height) - totalGap}px)`;
            if (leftOutside) contentRef.current.style.transform = `translateX(${x * -1 + outsideScreenGap}px)`;
            if (rightOutside)
               contentRef.current.style.transform = `translateX(${window.innerWidth - (x + width) - totalGap}px)`;
         }
      }, 1);

      onOpen?.();
   }, [disabled, onOpen, outsideScreenGap, totalGap]);
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
   useEffect(() => {
      if (!disabled) return;

      closeTooltip();
   }, [disabled]);

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
      <Div
         position="relative"
         width={childrenWrapperWidth}
         height={childrenWrapperHeight}
         onClick={onClickHolder}
         onMouseEnter={onMouseEnter}
         onMouseLeave={onMouseLeave}
      >
         <Div
            width={childrenWrapperWidth}
            height={childrenWrapperHeight}
            isTabAccessed={isTabAccessed}
            ref={triggerHolderRef}
         >
            {children}
         </Div>

         <TooltipContainer
            theme={theme}
            position={position}
            align={align}
            pointerEvents={contentPointerEvents}
            withArrow={withArrow}
            arrowSize={arrowSize}
            gap={gap}
            isOpen={isOpen}
            role="tooltip"
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
                     paddingBlock={isSmall ? theme.styles.gap / 2 : theme.styles.gap}
                     paddingInline={asContextMenu ? 0 : isSmall ? theme.styles.space / 2 : theme.styles.space}
                     overflow={asContextMenu ? "hidden" : undefined}
                  >
                     {content}
                  </Div.box>

                  <Div
                     position="absolute"
                     width={position === "left" || position === "right" ? totalGap : "100%"}
                     height={position === "top" || position === "bottom" ? totalGap : "100%"}
                     top={position === "top" ? "100%" : position === "bottom" ? undefined : 0}
                     bottom={position === "bottom" ? "100%" : position === "top" ? undefined : 0}
                     left={position === "left" ? "100%" : position === "right" ? undefined : 0}
                     right={position === "right" ? "100%" : position === "left" ? undefined : 0}
                     borderTopLeftRadius={999}
                     borderTopRightRadius={999}
                  />

                  {withArrow && (
                     <Arrow
                        position={position}
                        align={align}
                        sideSpace={theme.styles.borderRadius}
                        size={arrowSize}
                        color={backgroundColor ?? theme.colors.backgroundContent}
                        isOpen={isOpen}
                     />
                  )}
               </Div>
            )}
         </TooltipContainer>
      </Div>
   );
}) as any;

type TooltipItemProps<Value = unknown> = {
   icon?: IconName | AnyOtherString;
   iconColor?: string;
   text?: string;
   textColor?: string;
   description?: string;
   isActive?: boolean;
   value?: Value;
   id?: string;
   disabled?: boolean;
   onClick?: () => void;
   onClickWithValue?: (value: Value) => void;
};

TooltipComponent.item = forwardRef(function Item<Value>(
   {
      icon,
      iconColor,
      text,
      textColor,
      description,
      isActive,
      value,
      id,
      disabled,
      onClick,
      onClickWithValue,
   }: TooltipItemProps<Value>,
   ref: React.ForwardedRef<HTMLDivElement>,
) {
   const theme = useTheme();

   return (
      <Div.row
         alignItems="center"
         gap={theme.styles.space}
         backgroundColor={theme.colors.backgroundContent}
         filterHover={!disabled ? "brightness(0.9)" : "brightness(0.94)"}
         paddingBlock={theme.styles.gap}
         paddingInline={theme.styles.space}
         cursor={disabled ? "not-allowed" : "pointer"}
         isTabAccessed
         id={id}
         opacity={disabled ? 0.4 : undefined}
         value={value}
         onClick={!disabled ? onClick : undefined}
         onClickWithValue={!disabled ? onClickWithValue : undefined}
         ref={ref}
      >
         {icon && <Icon name={icon} color={iconColor ?? (!isActive ? theme.colors.textSecondary : undefined)} />}

         <Div.column flex={1} gap={theme.styles.gap / 2}>
            <Text fontWeight={isActive ? 700 : undefined} color={textColor ?? theme.colors.textPrimary}>
               {text}
            </Text>
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
