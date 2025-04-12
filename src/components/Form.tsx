import { memo, useMemo } from "react";

import { ComponentMarginProps } from "../types/components";
import { LoaderName } from "../types/loader";
import { AnyOtherString, OmitProps } from "../types/app";

import { useForm } from "../utils/hooks";

import Div from "./Div";
import Button from "./Button";
import { useTheme } from "./BetterHtmlProvider";

export type FormProps = {
   form?: OmitProps<ReturnType<typeof useForm>, "focusField">;
   submitButtonText?: string;
   submitButtonLoaderName?: LoaderName | AnyOtherString;
   submitButtonId?: string;
   submitButtonIsDisabled?: boolean;
   /** @default "right" */
   actionButtonsLocation?: "left" | "center" | "right";
   gap?: React.CSSProperties["gap"];
   isSubmitting?: boolean;
   isDestructive?: boolean;
   onClickCancel?: () => void;
   onSubmit?: (value: React.FormEvent<HTMLFormElement>) => void;
   children?: React.ReactNode;
} & ComponentMarginProps;

function Form({
   form,
   submitButtonText,
   submitButtonLoaderName,
   submitButtonId,
   submitButtonIsDisabled,
   actionButtonsLocation = "right",
   gap,
   isSubmitting,
   isDestructive,
   onClickCancel,
   onSubmit,
   children,
   ...props
}: FormProps) {
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
      <Div {...props}>
         <form onSubmit={onSubmit ?? form?.onSubmit}>
            {gap !== undefined ? <Div.column gap={gap}>{children}</Div.column> : children}

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
                  {onClickCancel && <Button.secondary text="Cancel" onClick={onClickCancel} />}

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
}

export default memo(Form);
