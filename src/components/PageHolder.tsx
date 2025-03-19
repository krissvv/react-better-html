import { memo } from "react";

import Div from "./Div";
import { useBetterHtmlContext, useTheme } from "./BetterHtmlProvider";

type PageHolderProps = {
   /** @default false */
   noMaxContentWidth?: boolean;
   children?: React.ReactNode;
};

function PageHolder({ noMaxContentWidth, children }: PageHolderProps) {
   const theme = useTheme();
   const { app } = useBetterHtmlContext();

   return (
      <Div
         as="main"
         width="100%"
         maxWidth={!noMaxContentWidth ? app.contentMaxWidth : undefined}
         margin="0px auto"
         paddingBlock={theme.styles.gap}
         paddingInline={theme.styles.space}
      >
         {children}
      </Div>
   );
}

export default memo(PageHolder);
