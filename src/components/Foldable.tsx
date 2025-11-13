import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

import { AnyOtherString } from "../types/app";
import { ComponentPropWithRef } from "../types/components";
import { IconName } from "../types/icon";
import { AssetName } from "../types/asset";

import { useBooleanState } from "../utils/hooks";

import Div, { DivProps } from "./Div";
import Icon from "./Icon";
import Text, { TextAs } from "./Text";
import Image from "./Image";
import Divider from "./Divider";
import { useTheme } from "./BetterHtmlProvider";

const animationDurationClose = 0.15;
const animationDurationOpen = animationDurationClose * 2;

export type FoldableProps = {
   isOpen?: boolean;
   defaultOpen?: boolean;
   title?: string;
   /** @default "h3" */
   titleAs?: TextAs;
   /** @default textPrimary */
   titleColor?: React.CSSProperties["color"];
   titleRightElement?: React.ReactNode;
   description?: string;
   /** @default textSecondary */
   descriptionColor?: React.CSSProperties["color"];
   rightElement?: React.ReactNode;
   icon?: IconName | AnyOtherString;
   image?: AssetName | AnyOtherString;
   headerPaddingBlock?: React.CSSProperties["paddingBlock"];
   headerPaddingInline?: React.CSSProperties["paddingInline"];
   renderHeader?: (isOpen: boolean, toggleOpen: () => void) => React.ReactNode;
   onOpenChange?: (isOpen: boolean) => void;
   children?: React.ReactNode;
} & DivProps;

export type FoldableRef = {
   isOpen: boolean;
   open: () => void;
   close: () => void;
   toggle: () => void;
};

type FoldableComponentType = {
   (props: ComponentPropWithRef<HTMLDivElement, FoldableProps>): React.ReactElement;
   box: (props: ComponentPropWithRef<HTMLDivElement, FoldableProps>) => React.ReactElement;
};

const FoldableComponent: FoldableComponentType = forwardRef<FoldableRef, FoldableProps>(function Foldable(
   {
      isOpen: controlledIsOpen,
      defaultOpen = false,
      title,
      titleAs = "h3",
      titleColor,
      titleRightElement,
      description,
      descriptionColor,
      rightElement,
      icon,
      image,
      headerPaddingBlock,
      headerPaddingInline,
      renderHeader,
      onOpenChange,
      children,
      ...props
   },
   ref,
) {
   const theme = useTheme();

   const bodyRef = useRef<HTMLDivElement>(null);

   const [internalIsOpen, setInternalIsOpen] = useBooleanState(defaultOpen);
   const [bodyVirtualHeight, setBodyVirtualHeight] = useState<number>();

   const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

   const open = useCallback(() => {
      if (controlledIsOpen === undefined) setInternalIsOpen.setTrue();
      onOpenChange?.(true);
   }, [controlledIsOpen, onOpenChange]);
   const close = useCallback(() => {
      if (controlledIsOpen === undefined) setInternalIsOpen.setFalse();
      onOpenChange?.(false);
   }, [controlledIsOpen, onOpenChange]);
   const toggleOpen = useCallback(() => {
      if (controlledIsOpen === undefined) setInternalIsOpen.toggle();
      onOpenChange?.(!isOpen);
   }, [controlledIsOpen, isOpen, onOpenChange]);

   useEffect(() => {
      if (!bodyRef.current) return;

      const body = bodyRef.current;

      setBodyVirtualHeight(body.scrollHeight * 2);

      const timeout = setTimeout(() => {
         setBodyVirtualHeight(body.scrollHeight * 2);
      }, 0.2 * 1000);

      return () => {
         clearTimeout(timeout);
      };
   }, [isOpen]);
   useEffect(() => {
      if (!isOpen) return;
      if (!bodyRef.current) return;

      const observer = new ResizeObserver(() => {
         if (!bodyRef.current) return;

         setBodyVirtualHeight(bodyRef.current.scrollHeight * 2);
      });

      observer.observe(bodyRef.current);

      return () => {
         observer.disconnect();
      };
   }, [isOpen]);

   useImperativeHandle(
      ref,
      (): FoldableRef => {
         return {
            open,
            close,
            toggle: toggleOpen,
            isOpen,
         };
      },
      [open, close, toggleOpen, isOpen],
   );

   return (
      <Div.column width="100%" {...props}>
         {renderHeader ? (
            renderHeader(isOpen, toggleOpen)
         ) : (
            <Div.row
               width="100%"
               alignItems="center"
               gap={theme.styles.space}
               paddingBlock={headerPaddingBlock ?? theme.styles.gap}
               paddingInline={headerPaddingInline}
               cursor="pointer"
               onClick={toggleOpen}
               userSelect="none"
            >
               <Div.row flex={1} alignItems="center" gap={theme.styles.space}>
                  {icon && <Icon name={icon} size={20} flexShrink={0} />}
                  {image && <Image.profileImage name={image} size={24} flexShrink={0} />}

                  <Div.column gap={theme.styles.gap / 2}>
                     {title && (
                        <Div.row alignItems="center" gap={theme.styles.space}>
                           <Text
                              as={titleAs}
                              fontWeight={700}
                              lineHeight="20px"
                              color={titleColor ?? theme.colors.textPrimary}
                           >
                              {title}
                           </Text>

                           {titleRightElement}
                        </Div.row>
                     )}

                     {description && <Text color={descriptionColor ?? theme.colors.textSecondary}>{description}</Text>}
                  </Div.column>
               </Div.row>

               {rightElement}

               <Icon
                  name="chevronDown"
                  transform={`rotate(${isOpen ? 180 : 0}deg)`}
                  transition={theme.styles.transition}
               />
            </Div.row>
         )}

         <Div height={isOpen ? 1 : 0} opacity={isOpen ? 1 : 0} transition={theme.styles.transition}>
            <Divider.horizontal />
         </Div>

         <Div
            maxHeight={isOpen ? bodyVirtualHeight : 0}
            opacity={!isOpen ? 0 : undefined}
            transition={`max-height ${isOpen ? animationDurationOpen : animationDurationClose}s ease, opacity ${
               theme.styles.transition
            }`}
            overflow={!isOpen ? "hidden" : undefined}
            pointerEvents={!isOpen ? "none" : undefined}
            ref={bodyRef}
         >
            <Div paddingBlock={theme.styles.gap} paddingInline={headerPaddingInline}>
               {children}
            </Div>
         </Div>
      </Div.column>
   );
}) as any;

FoldableComponent.box = forwardRef(function Box({ ...props }, ref) {
   const theme = useTheme();

   return (
      <FoldableComponent
         backgroundColor={theme.colors.backgroundContent}
         border={`1px solid ${theme.colors.border}`}
         borderRadius={theme.styles.borderRadius}
         headerPaddingBlock={(theme.styles.gap + theme.styles.space) / 2}
         headerPaddingInline={theme.styles.space}
         {...props}
         ref={ref}
      />
   );
}) as FoldableComponentType["box"];

const Foldable = memo(FoldableComponent) as any as typeof FoldableComponent & {
   box: typeof FoldableComponent.box;
};

Foldable.box = FoldableComponent.box;

export default Foldable;
