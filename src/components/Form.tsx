import { memo } from "react";

import { ComponentMarginProps } from "../types/components";
import { LoaderName } from "../types/loader";
import { AnyOtherString } from "../types/app";

import Div from "./Div";
import Button from "./Button";
import { useTheme } from "./BetterHtmlProvider";

type FormType = "default" | "submit" | "save" | "create" | "delete" | "update" | "edit";

const formTypesText: Record<FormType, string> = {
   default: "Default",
   submit: "Submit",
   save: "Save",
   create: "Create",
   delete: "Delete",
   update: "Update",
   edit: "Edit",
};

type FormProps = {
   /** @default "default" */
   type?: FormType;
   /** @default "right" */
   actionButtonsLocation?: "left" | "center" | "right";
   actionButtonLoaderName?: LoaderName | AnyOtherString;
   gap?: React.CSSProperties["gap"];
   isSubmitting?: boolean;
   onClickCancel?: () => void;
   onSubmit?: (value: React.FormEvent<HTMLFormElement>) => void;
   children?: React.ReactNode;
} & ComponentMarginProps;

function Form({
   type = "default",
   actionButtonsLocation = "right",
   actionButtonLoaderName,
   gap,
   isSubmitting,
   onClickCancel,
   onSubmit,
   children,
   ...props
}: FormProps) {
   const theme = useTheme();

   const SubmitButtonTag = type === "delete" ? Button.destructive : Button;

   return (
      <Div {...props}>
         <form onSubmit={onSubmit}>
            {gap !== undefined ? <Div.column gap={gap}>{children}</Div.column> : children}

            {type !== "default" && (
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
                     text={formTypesText[type]}
                     isLoading={isSubmitting}
                     loaderName={actionButtonLoaderName}
                     isSubmit
                  />
               </Div.row>
            )}
         </form>
      </Div>
   );
}

export default memo(Form);
