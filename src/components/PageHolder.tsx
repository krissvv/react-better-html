import { forwardRef, memo } from "react";

import { ComponentPaddingProps, ComponentPropWithRef } from "../types/components";

import { useMediaQuery } from "../utils/hooks";

import Div from "./Div";
import { useBetterHtmlContextInternal, useTheme } from "./BetterHtmlProvider";

export type PageHolderProps = {
   /** @default false */
   noMaxContentWidth?: boolean;
   backgroundColor?: string;
   children?: React.ReactNode;
} & ComponentPaddingProps;

type PageHolderComponentType = {
   (props: ComponentPropWithRef<HTMLDivElement, PageHolderProps>): React.ReactElement;
   center: (
      props: ComponentPropWithRef<
         HTMLDivElement,
         PageHolderProps & {
            pageBackgroundColor?: string;
            contentMaxWidth?: React.CSSProperties["maxWidth"];
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
      contentMaxWidth,
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

   return (
      <Div.row
         width="100%"
         minHeight="100svh"
         alignItems="center"
         justifyContent="center"
         backgroundColor={pageBackgroundColor}
      >
         {sideComponentPosition === "left" && withSideComponent && <Div width="50%" />}

         <Div.column width={`${withSideComponent ? 50 : 100}%`} alignItems="center">
            <Div.box
               width={`calc(100% - ${theme.styles.space}px * 2)`}
               maxWidth={!noMaxContentWidth ? contentMaxWidth ?? app.contentMaxWidth / 2 : undefined}
               marginInline={theme.styles.space}
               marginBlock={theme.styles.space}
               {...props}
               ref={ref}
            >
               {children}
            </Div.box>
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
