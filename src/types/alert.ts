export type AlertType = "info" | "success" | "warning" | "error";
export type AlertDuration = number | "auto";

export type Alert = {
   id: string;
   type: AlertType;
   title?: string;
   message?: string;
   duration?: AlertDuration;
   onClose?: (alert: Alert) => void;
};
