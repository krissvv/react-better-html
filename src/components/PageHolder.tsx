import { forwardRef, memo } from "react";

import { ComponentPaddingProps, ComponentPropWithRef } from "../types/components";

import { useMediaQuery } from "../utils/hooks";

import Div from "./Div";
import { useBetterHtmlContextInternal, useTheme } from "./BetterHtmlProvider";

export type PageHolderProps = {
   /** @default false */
   noMaxContentWidth?: boolean;
   backgroundColor?: React.CSSProperties["backgroundColor"];
   backgroundImage?: React.CSSProperties["backgroundImage"];
   children?: React.ReactNode;
} & ComponentPaddingProps;

type PageHolderComponentType = {
   (props: ComponentPropWithRef<HTMLDivElement, PageHolderProps>): React.ReactElement;
   center: (
      props: ComponentPropWithRef<
         HTMLDivElement,
         PageHolderProps & {
            pageBackgroundColor?: React.CSSProperties["backgroundColor"];
            pageBackgroundImage?: React.CSSProperties["backgroundImage"];
            contentMaxWidth?: React.CSSProperties["maxWidth"];
            /** @default true */
            contentInsideBox?: boolean;
            behindComponent?: React.ReactNode;
            sideComponent?: React.ReactNode;
            /** @default "right" */
            sideComponentPosition?: "left" | "right";
         }
      >,
   ) => React.ReactElement;
};

const PageHolderComponent: PageHolderComponentType = forwardRef(function PageHolder(
   { noMaxContentWidth, children, ...props }: PageHolderProps,
   ref: React.ForwardedRef<HTMLDivElement>,
) {
   const theme = useTheme();
   const { app } = useBetterHtmlContextInternal();

   return (
      <Div
         as="main"
         width="100%"
         maxWidth={!noMaxContentWidth ? app.contentMaxWidth : undefined}
         margin="0px auto"
         padding={theme.styles.space}
         {...props}
         ref={ref}
      >
         {children}
      </Div>
   );
}) as any;

PageHolderComponent.center = forwardRef(function Center(
   {
      pageBackgroundColor,
      pageBackgroundImage,
      contentMaxWidth,
      contentInsideBox,
      behindComponent,
      sideComponent,
      sideComponentPosition = "right",
      noMaxContentWidth,
      children,
      ...props
   },
   ref,
) {
   const theme = useTheme();
   const mediaQuery = useMediaQuery();
   const { app } = useBetterHtmlContextInternal();

   const breakingPoint = mediaQuery.size1000;

   const withSideComponent = sideComponent && !breakingPoint;

   const ContentTag = contentInsideBox !== false ? Div.box : Div;

   return (
      <Div.row
         position="relative"
         width="100%"
         minHeight="100svh"
         alignItems="center"
         justifyContent="center"
         backgroundColor={pageBackgroundColor}
         backgroundImage={pageBackgroundImage}
      >
         {behindComponent && (
            <Div
               position="fixed"
               width={`${withSideComponent ? 50 : 100}%`}
               height="100svh"
               top={0}
               left={sideComponentPosition === "right" ? 0 : "auto"}
               right={sideComponentPosition === "left" ? 0 : "auto"}
               zIndex={1}
            >
               {behindComponent}
            </Div>
         )}

         {sideComponentPosition === "left" && withSideComponent && <Div width="50%" />}

         <Div.column position="relative" width={`${withSideComponent ? 50 : 100}%`} alignItems="center" zIndex={2}>
            <ContentTag
               width={`calc(100% - ${theme.styles.space * 2}px)`}
               maxWidth={!noMaxContentWidth ? contentMaxWidth ?? app.contentMaxWidth / 2 : undefined}
               marginInline={theme.styles.space}
               marginBlock={theme.styles.space}
               {...props}
               ref={ref}
            >
               {children}
            </ContentTag>
         </Div.column>

         {sideComponentPosition === "right" && withSideComponent && <Div width="50%" />}

         {withSideComponent && (
            <Div
               position="fixed"
               width="50%"
               height="100svh"
               top={0}
               left={sideComponentPosition === "left" ? 0 : "auto"}
               right={sideComponentPosition === "right" ? 0 : "auto"}
            >
               {sideComponent}
            </Div>
         )}
      </Div.row>
   );
}) as PageHolderComponentType["center"];

const PageHolder = memo(PageHolderComponent) as any as typeof PageHolderComponent & {
   center: typeof PageHolderComponent.center;
};

PageHolder.center = PageHolderComponent.center;

export default PageHolder;
