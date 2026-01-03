import { memo } from "react";
import { useTheme } from "react-better-core";

import Text from "./Text";

export type LabelProps = {
   text?: string;
   /** @default false */
   required?: boolean;
   /** @default false */
   isError?: boolean;
   color?: string;
   htmlFor?: string;
};

function Label({ text, required, isError, color, htmlFor }: LabelProps) {
   const theme = useTheme();

   return (
      <Text
         as="label"
         width="fit-content"
         height={16}
         fontSize={14}
         color={isError ? theme.colors.error : color ?? theme.colors.textSecondary}
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
