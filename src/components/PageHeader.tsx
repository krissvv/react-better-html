import { forwardRef, memo } from "react";

import { ComponentMarginProps, ComponentPropWithRef } from "../types/components";

import { useMediaQuery } from "../utils/hooks";

import Div from "./Div";
import Text, { TextAs } from "./Text";
import Image from "./Image";
import { useBetterHtmlContextInternal, useTheme } from "./BetterHtmlProvider";

//* Used in DIV.box

export type PageHeaderProps = {
   imageUrl?: string;
   imageSize?: number;
   title?: string;
   /** @default "h1" */
   titleAs?: TextAs;
   /** @default textPrimary */
   titleColor?: React.CSSProperties["color"];
   titleRightElement?: React.ReactNode;
   description?: string;
   /** @default textSecondary */
   descriptionColor?: React.CSSProperties["color"];
   textAlign?: React.CSSProperties["textAlign"];
   rightElement?: React.ReactNode;
   /** @default false */
   lightMode?: boolean;
} & Pick<ComponentMarginProps, "marginBottom">;

type PageHeaderComponentType = {
   (props: ComponentPropWithRef<HTMLDivElement, PageHeaderProps>): React.ReactElement;
};

const PageHeaderComponent: PageHeaderComponentType = forwardRef(function PageHeader(
   {
      imageUrl,
      imageSize = 60,
      title,
      titleAs = "h1",
      titleColor,
      titleRightElement,
      description,
      descriptionColor,
      textAlign,
      rightElement,
      lightMode,
      marginBottom,
   }: PageHeaderProps,
   ref: React.ForwardedRef<HTMLDivElement>,
) {
   const theme = useTheme();
   const { app } = useBetterHtmlContextInternal();
   const mediaQuery = useMediaQuery();

   return (
      <Div.row
         alignItems="center"
         gap={theme.styles.space}
         marginBottom={marginBottom ?? theme.styles.space * 2}
         ref={ref}
      >
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
                  as={titleAs}
                  textAlign={textAlign}
                  color={titleColor ?? (lightMode ? theme.colors.base : theme.colors.textPrimary)}
               >
                  {title}
               </Text>

               {titleRightElement}
            </Div.row>

            {description && (
               <Text
                  maxWidth={!mediaQuery.size600 ? app.contentMaxWidth * 0.6 : undefined}
                  textAlign={textAlign}
                  color={descriptionColor ?? (lightMode ? theme.colors.base : theme.colors.textSecondary)}
                  opacity={lightMode ? 0.7 : undefined}
               >
                  {description}
               </Text>
            )}
         </Div.column>

         {rightElement}
      </Div.row>
   );
}) as any;

const PageHeader = memo(PageHeaderComponent) as any as typeof PageHeaderComponent & {};

export default PageHeader;
