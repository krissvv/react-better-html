import { memo } from "react";

import Text from "./Text";
import { useTheme } from "./BetterHtmlProvider";

export type LabelProps = {
   text?: string;
   required?: boolean;
   isError?: boolean;
};

function Label({ text, required, isError }: LabelProps) {
   const theme = useTheme();

   return (
      <Text as="label" height={16} fontSize={14} color={isError ? theme.colors.error : theme.colors.textSecondary}>
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
