import { ThemeConfig } from "../types/theme";

export const theme: ThemeConfig = {
   styles: {
      space: 16,
      gap: 8,
      borderRadius: 10,
      fontFamily: "Arial, sans-serif",
      transition: "ease 0.2s",
   },
   colors: {
      light: {
         textPrimary: "#111111",
         textSecondary: "#777777",
         label: "#111111",
         primary: "#6d466b",
         secondary: "#412234",
         success: "#28a745",
         info: "#17a2b8",
         warn: "#ffc107",
         error: "#dc3545",
         backgroundBase: "#f8f8f8",
         backgroundSecondary: "#e8e8e8",
         backgroundContent: "#ffffff",
         border: "#ced4da",
      },
      dark: {
         textPrimary: "#f8f8f8",
         textSecondary: "#e8e8e8",
         label: "#111111",
         primary: "#9b6499",
         secondary: "#6c466b",
         success: "#28a745",
         info: "#17a2b8",
         warn: "#ffc107",
         error: "#dc3545",
         backgroundBase: "#111111",
         backgroundSecondary: "#222222",
         backgroundContent: "#333333",
         border: "#777777",
      },
   },
};
