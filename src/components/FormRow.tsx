import { forwardRef, memo } from "react";

import { IconName } from "../types/icon";
import { AnyOtherString } from "../types/app";
import { ComponentMarginProps, ComponentPropWithRef } from "../types/components";

import { useMediaQuery } from "../utils/hooks";

import Div from "./Div";
import Icon from "./Icon";
import Text from "./Text";
import { useTheme } from "./BetterHtmlProvider";
import Button from "./Button";

export type FormRowProps = {
   oneItemOnly?: boolean;
   gap?: React.CSSProperties["gap"];
   children?: React.ReactNode;
} & ComponentMarginProps;

type FormRowComponentType = {
   (props: ComponentPropWithRef<HTMLDivElement, FormRowProps>): React.ReactElement;
   withTitle: (
      props: ComponentPropWithRef<
         HTMLDivElement,
         FormRowProps & {
            icon?: IconName | AnyOtherString;
            title?: string;
            description?: string;
            withActions?: boolean;
            onClickSave?: () => void;
            onClickReset?: () => void;
         }
      >,
   ) => React.ReactElement;
};

const FormRowComponent: FormRowComponentType = forwardRef(function FormRow(
   { oneItemOnly, gap, children, ...props }: FormRowProps,
   ref: React.ForwardedRef<HTMLDivElement>,
) {
   const theme = useTheme();
   const mediaQuery = useMediaQuery();

   const breakingPoint = mediaQuery.size900;
   const readyGap = breakingPoint ? theme.styles.gap : theme.styles.space * 2;

   return (
      <Div.row alignItems="center" gap={gap ?? readyGap} invertFlexDirection={breakingPoint} {...props} ref={ref}>
         {children}

         {oneItemOnly && <Div width="100%" />}
      </Div.row>
   );
}) as any;

FormRowComponent.withTitle = forwardRef(function WithTitle(
   { icon, title, description, withActions, onClickSave, onClickReset, children, ...props },
   ref,
) {
   const theme = useTheme();

   return (
      <FormRowComponent {...props} ref={ref}>
         <Div.row width="100%" alignItems="center" gap={theme.styles.space}>
            {icon && <Icon name={icon} />}

            <Div.column flex={1} gap={theme.styles.gap / 2}>
               <Text as="h3">{title}</Text>

               {description && <Text color={theme.colors.textSecondary}>{description}</Text>}
            </Div.column>
         </Div.row>

         <Div.row width="100%" alignItems="center" gap={theme.styles.gap}>
            {children}

            {withActions && (
               <Div.row alignItems="center" gap={theme.styles.gap}>
                  {onClickReset && <Button.icon icon="XMark" onClick={onClickReset} />}
                  <Button.icon icon="check" onClick={onClickSave} />
               </Div.row>
            )}
         </Div.row>
      </FormRowComponent>
   );
}) as FormRowComponentType["withTitle"];

const FormRow = memo(FormRowComponent) as any as typeof FormRowComponent & {
   withTitle: typeof FormRowComponent.withTitle;
};

FormRow.withTitle = FormRowComponent.withTitle;

export default FormRow;
