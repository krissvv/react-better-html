export type AlertType = "info" | "success" | "warning" | "error";
export type AlertDuration = number | "auto";
export type AlertDisplay = "default" | "prominent";

export type Alert = {
   id: string;
   type: AlertType;
   /** @default "default" */
   display?: AlertDisplay;
   title?: string;
   message?: string;
   /** @default "auto" */
   duration?: AlertDuration;
   onClose?: (alert: Alert) => void;
};
