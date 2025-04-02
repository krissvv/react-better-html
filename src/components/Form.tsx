import { memo } from "react";

import { ComponentMarginProps } from "../types/components";
import { LoaderName } from "../types/loader";
import { AnyOtherString } from "../types/app";

import Div from "./Div";
import Button from "./Button";
import { useTheme } from "./BetterHtmlProvider";

type FormProps = {
   submitButtonText?: string;
   submitButtonLoaderName?: LoaderName | AnyOtherString;
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
   submitButtonText,
   submitButtonLoaderName,
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

   const SubmitButtonTag = isDestructive ? Button.destructive : Button;

   return (
      <Div {...props}>
         <form onSubmit={onSubmit}>
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
                     isLoading={isSubmitting}
                     loaderName={submitButtonLoaderName}
                     isSubmit
                  />
               </Div.row>
            )}
         </form>
      </Div>
   );
}

export default memo(Form);
