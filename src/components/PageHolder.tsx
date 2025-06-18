import { forwardRef, memo } from "react";

import { ComponentPaddingProps, ComponentPropWithRef } from "../types/components";

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
   center: (props: ComponentPropWithRef<HTMLDivElement, PageHolderProps>) => React.ReactElement;
};

const PageHolderComponent: PageHolderComponentType = forwardRef(function PageHolder(
   { noMaxContentWidth, backgroundColor, children, ...props }: PageHolderProps,
   ref: React.ForwardedRef<HTMLDivElement>,
) {
   const theme = useTheme();
   const { app } = useBetterHtmlContextInternal();

   return (
      <Div
         as="main"
         width="100%"
         maxWidth={!noMaxContentWidth ? app.contentMaxWidth : undefined}
         backgroundColor={backgroundColor}
         margin="0px auto"
         padding={theme.styles.space}
         {...props}
         ref={ref}
      >
         {children}
      </Div>
   );
}) as any;

PageHolderComponent.center = forwardRef(function Center(props, ref) {
   return <></>;
}) as PageHolderComponentType["center"];

const PageHolder = memo(PageHolderComponent) as any as typeof PageHolderComponent & {
   center: typeof PageHolderComponent.center;
};

PageHolder.center = PageHolderComponent.center;

export default PageHolder;
