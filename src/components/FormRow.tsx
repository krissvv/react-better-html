import { forwardRef, memo } from "react";

import { IconName } from "../types/icon";
import { AnyOtherString } from "../types/app";
import { ComponentMarginProps, ComponentPropWithRef } from "../types/components";
import { LoaderName } from "../types/loader";

import { useMediaQuery } from "../utils/hooks";

import Div from "./Div";
import Icon from "./Icon";
import Text, { TextAs } from "./Text";
import Button from "./Button";
import Loader from "./Loader";
import { useTheme } from "./BetterHtmlProvider";

export type FormRowProps = {
   oneItemOnly?: boolean;
   /**
    * @description Weather to break the two items into two separate lines on mobile or not
    * @default false
    */
   noBreakingPoint?: boolean;
   /**
    * @description Weather to render the children as a column or not
    * @default false
    */
   asColumn?: boolean;
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
            /** @default "h3" */
            titleAs?: TextAs;
            titleFontSize?: React.CSSProperties["fontSize"];
            description?: string;
            descriptionFontSize?: React.CSSProperties["fontSize"];
            alignChildren?: React.CSSProperties["justifyContent"];
            isLoading?: boolean;
            withActions?: boolean;
            saveButtonLoaderName?: LoaderName | AnyOtherString;
            resetButtonLoaderName?: LoaderName | AnyOtherString;
            onClickSave?: () => void;
            onClickReset?: () => void;
         }
      >,
   ) => React.ReactElement;
};

const FormRowComponent: FormRowComponentType = forwardRef(function FormRow(
   { oneItemOnly, noBreakingPoint, asColumn, gap, children, ...props }: FormRowProps,
   ref: React.ForwardedRef<HTMLDivElement>,
) {
   const theme = useTheme();
   const mediaQuery = useMediaQuery();

   const breakingPoint = asColumn ?? (!noBreakingPoint ? mediaQuery.size900 : false);
   const readyGap =
      breakingPoint || (noBreakingPoint && mediaQuery.size900) ? theme.styles.gap : theme.styles.space * 2;

   return (
      <Div.row alignItems="center" gap={gap ?? readyGap} invertFlexDirection={breakingPoint} {...props} ref={ref}>
         {children}

         {oneItemOnly && <Div width="100%" />}
      </Div.row>
   );
}) as any;

FormRowComponent.withTitle = forwardRef(function WithTitle(
   {
      icon,
      title,
      titleAs = "h3",
      titleFontSize,
      description,
      descriptionFontSize,
      alignChildren = "flex-start",
      isLoading,
      withActions,
      saveButtonLoaderName,
      resetButtonLoaderName,
      onClickSave,
      onClickReset,
      children,
      ...props
   },
   ref,
) {
   const theme = useTheme();
   const mediaQuery = useMediaQuery();

   const titleGap = theme.styles.space;

   return (
      <FormRowComponent {...props} ref={ref}>
         <Div.row width="100%" alignItems="center" gap={titleGap}>
            {icon && <Icon name={icon} />}

            <Div.column flex={1} gap={theme.styles.gap / 2}>
               <Text as={titleAs} fontSize={titleFontSize}>
                  {title}
               </Text>

               {description && (
                  <Text fontSize={descriptionFontSize} color={theme.colors.textSecondary}>
                     {description}
                  </Text>
               )}
            </Div.column>

            {isLoading && <Div width={26 - titleGap} />}
         </Div.row>

         <Div.row
            position="relative"
            width={props.noBreakingPoint && mediaQuery.size900 ? undefined : "100%"}
            alignItems="center"
            justifyContent={alignChildren}
            gap={theme.styles.gap}
         >
            <Div
               position="absolute"
               top="50%"
               right={`calc(100% + ${theme.styles.space}px)`}
               transform="translateY(-50%)"
               opacity={!isLoading ? 0 : undefined}
               pointerEvents={!isLoading ? "none" : undefined}
            >
               <Loader />
            </Div>

            {children}

            {withActions && (
               <Div.row alignItems="center" gap={theme.styles.gap}>
                  {onClickReset && (
                     <Button.icon icon="XMark" loaderName={resetButtonLoaderName} onClick={onClickReset} />
                  )}
                  <Button.icon icon="check" loaderName={saveButtonLoaderName} onClick={onClickSave} />
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
