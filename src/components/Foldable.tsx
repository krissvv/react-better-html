import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { OmitProps, useBooleanState, useTheme } from "react-better-core";

import { ComponentPropWithRef } from "../types/components";

import Div, { DivProps } from "./Div";
import Icon from "./Icon";
import Divider from "./Divider";
import PageHeader, { PageHeaderProps } from "./PageHeader";

const animationDurationClose = 0.15;
const animationDurationOpen = animationDurationClose * 2;

export type FoldableProps = {
   isOpen?: boolean;
   defaultOpen?: boolean;
   headerPaddingBlock?: React.CSSProperties["paddingBlock"];
   headerPaddingInline?: React.CSSProperties["paddingInline"];
   /** @default "right" */
   arrowPosition?: "left" | "right";
   renderHeader?: (isOpen: boolean, toggleOpen: () => void) => React.ReactNode;
   onOpenChange?: (isOpen: boolean) => void;
   children?: React.ReactNode;
} & OmitProps<PageHeaderProps, "marginBottom"> &
   OmitProps<DivProps, "ref">;

export type FoldableRef = {
   isOpen: boolean;
   open: () => void;
   close: () => void;
   toggle: () => void;
};

type FoldableComponentType = {
   (props: ComponentPropWithRef<FoldableRef, FoldableProps>): React.ReactElement;
   box: (props: ComponentPropWithRef<FoldableRef, FoldableProps>) => React.ReactElement;
};

const FoldableComponent: FoldableComponentType = forwardRef<FoldableRef, FoldableProps>(function Foldable(
   {
      isOpen: controlledIsOpen,
      defaultOpen = false,
      icon,
      iconColor,
      iconSize,
      image,
      imageUrl,
      imageSize,
      imageAzProfileImage,
      title,
      titleAs = "h3",
      titleFontSize,
      titleColor,
      titleRightElement,
      description,
      descriptionFontSize,
      descriptionColor,
      textAlign,
      rightElement,
      lightMode,
      headerPaddingBlock,
      headerPaddingInline,
      arrowPosition = "right",
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

   useImperativeHandle(ref, (): FoldableRef => {
      return {
         open,
         close,
         toggle: toggleOpen,
         isOpen,
      };
   }, [open, close, toggleOpen, isOpen]);

   const arrow = (
      <Icon name="chevronDown" transform={`rotate(${isOpen ? 180 : 0}deg)`} transition={theme.styles.transition} />
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
               {arrowPosition === "left" && arrow}

               <Div flex={1}>
                  <PageHeader
                     icon={icon}
                     iconColor={iconColor}
                     iconSize={iconSize}
                     image={image}
                     imageUrl={imageUrl}
                     imageSize={imageSize}
                     imageAzProfileImage={imageAzProfileImage}
                     title={title}
                     titleAs={titleAs}
                     titleFontSize={titleFontSize}
                     titleColor={titleColor}
                     titleRightElement={titleRightElement}
                     description={description}
                     descriptionFontSize={descriptionFontSize}
                     descriptionColor={descriptionColor}
                     textAlign={textAlign}
                     rightElement={rightElement}
                     lightMode={lightMode}
                     marginBottom={0}
                  />
               </Div>

               {rightElement}

               {arrowPosition === "right" && arrow}
            </Div.row>
         )}

         <Div height={isOpen ? 1 : 0} opacity={isOpen ? 1 : 0} transition={theme.styles.transition}>
            <Divider.horizontal width={theme.styles.borderWidth === 0 ? 1 : theme.styles.borderWidth} />
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
         border={`${theme.styles.borderWidth}px solid ${theme.colors.border}`}
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
