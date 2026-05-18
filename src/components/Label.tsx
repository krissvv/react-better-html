import { memo } from "react";
import { useTheme } from "react-better-core";

import { useComponentsPropsMerger } from "../utils/hooks";

import Text from "./Text";
import { useBetterHtmlContextInternal } from "./BetterHtmlProvider";

export type LabelProps = {
   text?: string;
   /** @default false */
   required?: boolean;
   /** @default false */
   isError?: boolean;
   fontFamily?: React.CSSProperties["fontFamily"];
   letterSpacing?: React.CSSProperties["letterSpacing"];
   textTransform?: React.CSSProperties["textTransform"];
   color?: React.CSSProperties["color"];
   htmlFor?: string;
};

function Label(labelProps: LabelProps) {
   const betterHtmlContextInternal = useBetterHtmlContextInternal();
   const { text, required, isError, fontFamily, letterSpacing, textTransform, color, htmlFor } =
      useComponentsPropsMerger(betterHtmlContextInternal.components.label?.style?.default, labelProps);

   const theme = useTheme();

   return (
      <Text
         as="label"
         width="fit-content"
         height={16}
         fontFamily={fontFamily}
         fontSize={14}
         color={isError ? theme.colors.error : (color ?? theme.colors.textSecondary)}
         letterSpacing={letterSpacing}
         textTransform={textTransform}
         htmlFor={htmlFor}
         aria-required={required}
      >
         {text}

         {required && (
            <Text as="span" fontSize={16} color={theme.colors.error}>
               {" "}
               *
            </Text>
         )}
      </Text>
   );
}

export default memo(Label);
