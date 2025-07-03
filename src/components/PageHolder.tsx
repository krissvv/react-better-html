import { forwardRef, memo } from "react";

import { ComponentPaddingProps, ComponentPropWithRef } from "../types/components";
import { AssetName } from "../types/asset";
import { AnyOtherString } from "../types/app";

import { useMediaQuery } from "../utils/hooks";

import Div from "./Div";
import Image from "./Image";
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
            sideImageSrc?: string;
            sideImageName?: AssetName | AnyOtherString;
            /** @default "right" */
            sideImagePosition?: "left" | "right";
            /** @default "center" */
            sideImageAlignment?: "left" | "center" | "right";
            sideImageFooter?: React.ReactNode;
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
      sideImageSrc,
      sideImageName,
      sideImagePosition = "right",
      sideImageAlignment = "center",
      sideImageFooter,
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

   const withSideImage = (sideImageSrc || sideImageName) && !breakingPoint;

   return (
      <Div.row
         width="100%"
         minHeight="100svh"
         alignItems="center"
         justifyContent="center"
         backgroundColor={pageBackgroundColor}
      >
         {sideImagePosition === "left" && withSideImage && <Div width="50%" />}

         <Div.column width={`${withSideImage ? 50 : 100}%`} alignItems="center">
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

         {sideImagePosition === "right" && withSideImage && <Div width="50%" />}

         {withSideImage && (
            <Div
               position="fixed"
               width="50%"
               height="100svh"
               top={0}
               left={sideImagePosition === "left" ? 0 : "auto"}
               right={sideImagePosition === "right" ? 0 : "auto"}
            >
               <Div.row
                  position="absolute"
                  width="100%"
                  height="100%"
                  top={0}
                  left={0}
                  justifyContent={
                     sideImageAlignment === "left"
                        ? "flex-start"
                        : sideImageAlignment === "right"
                        ? "flex-end"
                        : "center"
                  }
                  overflow="hidden"
               >
                  <Image name={sideImageName} height="100%" src={sideImageSrc} />
               </Div.row>

               <Div position="absolute" width="100%" bottom={theme.styles.space}>
                  {sideImageFooter}
               </Div>
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
