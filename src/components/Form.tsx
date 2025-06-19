import { Children, forwardRef, Fragment, memo, useMemo } from "react";

import { ComponentMarginProps, ComponentPropWithRef } from "../types/components";
import { LoaderName } from "../types/loader";
import { AnyOtherString, OmitProps } from "../types/app";

import { useForm } from "../utils/hooks";

import Div from "./Div";
import Button from "./Button";
import Divider from "./Divider";
import { useTheme } from "./BetterHtmlProvider";

export type FormProps = {
   form?: OmitProps<ReturnType<typeof useForm>, "focusField">;
   submitButtonText?: string;
   submitButtonLoaderName?: LoaderName | AnyOtherString;
   submitButtonId?: string;
   /** @default false */
   submitButtonIsDisabled?: boolean;
   cancelButtonText?: string;
   /** @default "right" */
   actionButtonsLocation?: "left" | "center" | "right";
   gap?: React.CSSProperties["gap"];
   /** @default false */
   isSubmitting?: boolean;
   /** @default false */
   isDestructive?: boolean;
   /** @default false */
   withDividers?: boolean;
   renderActionButtons?: React.ReactNode;
   onClickCancel?: () => void;
   onSubmit?: (value: React.FormEvent<HTMLFormElement>) => void;
   children?: React.ReactNode;
} & ComponentMarginProps;

type FormComponentType = {
   (props: ComponentPropWithRef<HTMLFormElement, FormProps>): React.ReactElement;
};

const FormComponent: FormComponentType = forwardRef(function Form(
   {
      form,
      submitButtonText,
      submitButtonLoaderName,
      submitButtonId,
      submitButtonIsDisabled,
      cancelButtonText,
      actionButtonsLocation = "right",
      gap,
      isSubmitting,
      isDestructive,
      withDividers,
      renderActionButtons,
      onClickCancel,
      onSubmit,
      children,
      ...props
   }: FormProps,
   ref: React.ForwardedRef<HTMLFormElement>,
) {
   const theme = useTheme();

   const submitButtonIsDisabledInternal = useMemo<boolean>(() => {
      if (!form || !form.requiredFields) return false;

      return Object.entries(form.values).some(
         ([key, value]) =>
            form.requiredFields?.includes(key) &&
            (value === undefined || value === null || value?.toString().trim() === ""),
      );
   }, [form]);

   const SubmitButtonTag = isDestructive ? Button.destructive : Button;
   const submitButtonIsDisabledFinal = submitButtonIsDisabled || submitButtonIsDisabledInternal;

   return (
      <Div width="100%" {...props}>
         <form onSubmit={onSubmit ?? form?.onSubmit} ref={ref}>
            {gap !== undefined || withDividers ? (
               <Div.column gap={gap ?? (withDividers ? theme.styles.space : theme.styles.gap)}>
                  {withDividers
                     ? Children.toArray(children).map((child, index) => (
                          <Fragment key={index}>
                             {child}

                             {index < Children.toArray(children).length - 1 && <Divider.horizontal />}
                          </Fragment>
                       ))
                     : children}
               </Div.column>
            ) : (
               children
            )}

            {submitButtonText && (
               <Div.row
                  alignItems="center"
                  justifyContent={
                     actionButtonsLocation === "left"
                        ? "flex-start"
                        : actionButtonsLocation === "center"
                        ? "center"
                        : "flex-end"
                  }
                  gap={theme.styles.gap}
                  marginTop={theme.styles.space}
               >
                  {renderActionButtons}

                  {onClickCancel && <Button.secondary text={cancelButtonText ?? "Cancel"} onClick={onClickCancel} />}

                  <SubmitButtonTag
                     text={submitButtonText}
                     isLoading={isSubmitting || form?.isSubmitting}
                     loaderName={submitButtonLoaderName}
                     disabled={submitButtonIsDisabledFinal}
                     id={submitButtonId}
                     isSubmit
                  />
               </Div.row>
            )}
         </form>
      </Div>
   );
}) as any;

const Form = memo(FormComponent) as any as typeof FormComponent & {};

export default Form;
