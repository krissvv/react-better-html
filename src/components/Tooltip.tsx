import { memo, useCallback, useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import styled, { css, RuleSet } from "styled-components";

import { Theme } from "../types/theme";
import { ComponentPropWithRef } from "../types/components";

import Div from "./Div";
import { useTheme } from "./BetterHtmlProvider";

type TooltipContainerProps = {
   theme: Theme;
   position: TooltipPosition;
   withArrow?: boolean;
   arrowSize?: number;
   isOpen: boolean;
   gap: number;
};

type ArrowProps = {
   theme: Theme;
   position: TooltipPosition;
   isOpen: boolean;
   size: number;
};

const tooltipContainerStyle = (props: TooltipContainerProps): Record<TooltipPosition, RuleSet<object>> => ({
   top: css`
      bottom: calc(100% + ${props.gap}px + ${props.arrowSize}px);
      left: 50%;
   `,
   bottom: css`
      top: calc(100% + ${props.gap}px + ${props.arrowSize}px);
      left: 50%;
   `,
   left: css`
      top: 50%;
      right: calc(100% + ${props.gap}px + ${props.arrowSize}px);
   `,
   right: css`
      top: 50%;
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
         transform: translateX(-50%);
      `,
      closed: css`
         transform: translateX(-50%) translateY(${props.theme.styles.gap}px);
      `,
   },
   bottom: {
      opened: css`
         transform: translateX(-50%);
      `,
      closed: css`
         transform: translateX(-50%) translateY(-${props.theme.styles.gap}px);
      `,
   },
   left: {
      opened: css`
         transform: translateY(-50%);
      `,
      closed: css`
         transform: translateX(${props.theme.styles.gap}px) translateY(-50%);
      `,
   },
   right: {
      opened: css`
         transform: translateY(-50%);
      `,
      closed: css`
         transform: translateX(-${props.theme.styles.gap}px) translateY(-50%);
      `,
   },
});

const arrowStyle = (props: ArrowProps): Record<TooltipPosition, RuleSet<object>> => ({
   top: css`
      bottom: -${props.size}px;
      left: 50%;
      border-top-color: var(--color);
      border-bottom: 0;
      transform: translateX(-50%);
   `,
   bottom: css`
      top: -${props.size}px;
      left: 50%;
      border-bottom-color: var(--color);
      border-top: 0;
      transform: translateX(-50%);
   `,
   left: css`
      right: -${props.size}px;
      top: 50%;
      border-left-color: var(--color);
      border-right: 0;
      transform: translateY(-50%);
   `,
   right: css`
      left: -${props.size}px;
      top: 50%;
      border-right-color: var(--color);
      border-left: 0;
      transform: translateY(-50%);
   `,
});

const TooltipContainer = styled.div.withConfig({
   shouldForwardProp: (prop) => !["theme", "position", "withArrow", "arrowSize", "isOpen", "gap"].includes(prop),
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
   shouldForwardProp: (prop) => !["theme", "position", "isOpen", "size"].includes(prop),
})<ArrowProps>`
   --color: ${(props) => props.theme.colors.backgroundContent};

   position: absolute;
   width: 0;
   height: 0;
   border: ${(props) => props.size}px solid transparent;
   opacity: ${(props) => (props.isOpen ? 1 : 0)};
   pointer-events: ${(props) => (props.isOpen ? "auto" : "none")};
   transition: ${(props) => props.theme.styles.transition};

   ${(props) => arrowStyle(props)[props.position]}
`;

type TooltipPosition = "top" | "bottom" | "left" | "right";

export type TooltipProps = {
   /** @default "bottom" */
   position?: TooltipPosition;
   /** @default "hover" */
   trigger?: "hover" | "click";
   content: React.ReactNode;
   withArrow?: boolean;
   backgroundColor?: string;
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
};

const TooltipComponent: TooltipComponent = forwardRef(function Tooltip(
   {
      position = "bottom",
      trigger = "hover",
      content,
      withArrow,
      backgroundColor,
      onOpen,
      onClose,
      children,
   }: TooltipProps,
   ref: React.ForwardedRef<TooltipRef>,
) {
   const theme = useTheme();

   const containerRef = useRef<HTMLDivElement>(null);
   const triggerHolderRef = useRef<HTMLDivElement>(null);
   const contentRef = useRef<HTMLDivElement>(null);

   const closeTimerRef = useRef<number>(undefined);

   const [isOpen, setIsOpen] = useState<boolean>(false);
   const [isOpenLate, setIsOpenLate] = useState<boolean>(false);

   const openTooltip = useCallback(() => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);

      setIsOpen(true);
      setIsOpenLate(true);

      onOpen?.();
   }, [onOpen]);
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

   const arrowSize = withArrow ? theme.styles.gap : 0;
   const tooltipTriggerGap = theme.styles.gap / 2;

   const totalGap = arrowSize + tooltipTriggerGap;

   return (
      <Div
         position="relative"
         onClick={onClickHolder}
         onMouseEnter={onMouseEnter}
         onMouseLeave={onMouseLeave}
         ref={containerRef}
      >
         <Div width="100%" ref={triggerHolderRef}>
            {children}
         </Div>

         <TooltipContainer
            theme={theme}
            position={position}
            withArrow={withArrow}
            arrowSize={arrowSize}
            gap={tooltipTriggerGap}
            isOpen={isOpen}
         >
            {(isOpen || isOpenLate) && (
               <Div.box
                  position="relative"
                  minWidth="220px"
                  backgroundColor={backgroundColor ?? theme.colors.backgroundContent}
                  boxShadow="0px 10px 20px #00000020"
                  ref={contentRef}
               >
                  {content}

                  <Div
                     position="absolute"
                     width={position === "left" || position === "right" ? totalGap : "100%"}
                     height={position === "top" || position === "bottom" ? totalGap : "100%"}
                     top={position === "top" ? "calc(100% + 1px)" : position === "bottom" ? undefined : 0}
                     bottom={position === "bottom" ? "calc(100% + 1px)" : position === "top" ? undefined : 0}
                     left={position === "left" ? "calc(100% + 1px)" : position === "right" ? undefined : 0}
                     right={position === "right" ? "calc(100% + 1px)" : position === "left" ? undefined : 0}
                  />

                  {withArrow && <Arrow theme={theme} position={position} isOpen={isOpen} size={arrowSize} />}
               </Div.box>
            )}
         </TooltipContainer>
      </Div>
   );
}) as any;

const Tooltip = memo(TooltipComponent) as any as typeof TooltipComponent & {};

export default Tooltip;
