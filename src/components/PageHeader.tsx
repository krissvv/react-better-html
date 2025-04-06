import React, { memo } from "react";

import { ComponentMarginProps } from "../types/components";

import { useMediaQuery } from "../utils/hooks";

import Div from "./Div";
import Text, { TextAs } from "./Text";
import Image from "./Image";
import { useTheme } from "./BetterHtmlProvider";

type PageHeaderProps = {
   imageUrl?: string;
   imageSize?: number;
   title?: string;
   titleAs?: TextAs;
   description?: string;
   textAlign?: React.CSSProperties["textAlign"];
   rightElement?: React.ReactNode;
   lightMode?: boolean;
} & Pick<ComponentMarginProps, "marginBottom">;

function PageHeader({
   imageUrl,
   imageSize = 60,
   title,
   titleAs,
   description,
   textAlign,
   rightElement,
   lightMode,
   marginBottom,
}: PageHeaderProps) {
   const theme = useTheme();
   const mediaQuery = useMediaQuery();

   return (
      <Div.row alignItems="center" gap={theme.styles.space} marginBottom={marginBottom ?? theme.styles.space * 2}>
         {imageUrl && <Image.profileImage src={imageUrl} size={imageSize ?? (mediaQuery.size600 ? 46 : 60)} />}

         <Div.column flex={1} gap={theme.styles.gap / 2}>
            <Text
               as={titleAs ?? "h1"}
               textAlign={textAlign}
               color={lightMode ? theme.colors.base : theme.colors.textPrimary}
            >
               {title}
            </Text>
            <Text
               textAlign={textAlign}
               color={lightMode ? theme.colors.base : theme.colors.textSecondary}
               opacity={lightMode ? 0.7 : undefined}
            >
               {description}
            </Text>
         </Div.column>

         {rightElement}
      </Div.row>
   );
}

export default memo(PageHeader);
