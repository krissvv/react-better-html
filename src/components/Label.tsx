import { memo } from "react";
import { useTheme } from "react-better-core";

import { useComponentsPropsMerger } from "../utils/hooks";

import Text from "./Text";
import { useBetterHtmlContextInternal } from "./BetterHtmlProvider";

export type LabelProps = {
   text?: string;
   /** @default false */
   required?: boolean;
   /** @default 16 */
   requiredSize?: React.CSSProperties["fontSize"];
   /** @default false */
   isError?: boolean;
   fontFamily?: React.CSSProperties["fontFamily"];
   /** @default 14 */
   fontSize?: React.CSSProperties["fontSize"];
   letterSpacing?: React.CSSProperties["letterSpacing"];
   textTransform?: React.CSSProperties["textTransform"];
   color?: React.CSSProperties["color"];
   htmlFor?: string;
};

function Label(labelProps: LabelProps) {
   const betterHtmlContextInternal = useBetterHtmlContextInternal();
   const {
      text,
      required,
      requiredSize = 16,
      isError,
      fontFamily,
      fontSize = 14,
      letterSpacing,
      textTransform,
      color,
      htmlFor,
   } = useComponentsPropsMerger(betterHtmlContextInternal.components.label?.style?.default, labelProps);

   const theme = useTheme();

   return (
      <Text
         as="label"
         width="fit-content"
         fontFamily={fontFamily}
         fontSize={fontSize}
         color={isError ? theme.colors.error : (color ?? theme.colors.textSecondary)}
         letterSpacing={letterSpacing}
         textTransform={textTransform}
         htmlFor={htmlFor}
         aria-required={required}
      >
         {text}

         {required && (
            <Text
               as="span"
               display="inline-block"
               height={fontSize}
               fontSize={requiredSize}
               letterSpacing="normal"
               color={theme.colors.error}
            >
               {" "}
               *
            </Text>
         )}
      </Text>
   );
}

export default memo(Label);
