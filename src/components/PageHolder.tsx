import { memo } from "react";

import { ComponentPaddingProps } from "../types/components";

import Div from "./Div";
import { useBetterHtmlContextInternal, useTheme } from "./BetterHtmlProvider";

export type PageHolderProps = {
   /** @default false */
   noMaxContentWidth?: boolean;
   children?: React.ReactNode;
} & ComponentPaddingProps;

function PageHolder({ noMaxContentWidth, children, ...props }: PageHolderProps) {
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
      >
         {children}
      </Div>
   );
}

export default memo(PageHolder);
