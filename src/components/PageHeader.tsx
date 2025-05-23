import React, { memo } from "react";

import { ComponentMarginProps } from "../types/components";

import { useMediaQuery } from "../utils/hooks";

import Div from "./Div";
import Text, { TextAs } from "./Text";
import Image from "./Image";
import { useBetterHtmlContextInternal, useTheme } from "./BetterHtmlProvider";

export type PageHeaderProps = {
   imageUrl?: string;
   imageSize?: number;
   title?: string;
   titleAs?: TextAs;
   titleRightElement?: React.ReactNode;
   description?: string;
   textAlign?: React.CSSProperties["textAlign"];
   rightElement?: React.ReactNode;
   /** @default false */
   lightMode?: boolean;
} & Pick<ComponentMarginProps, "marginBottom">;

function PageHeader({
   imageUrl,
   imageSize = 60,
   title,
   titleAs,
   titleRightElement,
   description,
   textAlign,
   rightElement,
   lightMode,
   marginBottom,
}: PageHeaderProps) {
   const theme = useTheme();
   const { app } = useBetterHtmlContextInternal();
   const mediaQuery = useMediaQuery();

   return (
      <Div.row alignItems="center" gap={theme.styles.space} marginBottom={marginBottom ?? theme.styles.space * 2}>
         {imageUrl && <Image.profileImage src={imageUrl} size={imageSize ?? (mediaQuery.size600 ? 46 : 60)} />}

         <Div.column
            alignItems={textAlign === "center" ? "center" : textAlign === "right" ? "flex-end" : undefined}
            flex={1}
            gap={theme.styles.gap / 2}
         >
            <Div.row
               alignItems="center"
               justifyContent={textAlign === "center" ? "center" : textAlign === "right" ? "flex-end" : undefined}
               gap={theme.styles.space}
            >
               <Text
                  as={titleAs ?? "h1"}
                  textAlign={textAlign}
                  color={lightMode ? theme.colors.base : theme.colors.textPrimary}
               >
                  {title}
               </Text>

               {titleRightElement}
            </Div.row>

            {description && (
               <Text
                  maxWidth={!mediaQuery.size600 ? app.contentMaxWidth * 0.6 : undefined}
                  textAlign={textAlign}
                  color={lightMode ? theme.colors.base : theme.colors.textSecondary}
                  opacity={lightMode ? 0.7 : undefined}
               >
                  {description}
               </Text>
            )}
         </Div.column>

         {rightElement}
      </Div.row>
   );
}

export default memo(PageHeader);
