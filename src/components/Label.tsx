import { memo } from "react";

import Text from "./Text";
import { useTheme } from "./BetterHtmlProvider";

export type LabelProps = {
   text?: string;
   /** @default false */
   required?: boolean;
   /** @default false */
   isError?: boolean;
   color?: string;
};

function Label({ text, required, isError, color }: LabelProps) {
   const theme = useTheme();

   return (
      <Text
         as="label"
         height={16}
         fontSize={14}
         color={isError ? theme.colors.error : color ?? theme.colors.textSecondary}
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
