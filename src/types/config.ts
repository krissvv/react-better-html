import { ComponentHoverStyle, ComponentStyle } from "./components";

type ComponentStyleConfig<Subcomponents extends string> = {
   [key in Subcomponents]?: ComponentStyle & ComponentHoverStyle;
};

type ComponentTagReplacementConfig<Subcomponents extends string> = {
   [key in Subcomponents]?: React.ElementType;
};

export type AppConfig = {
   contentMaxWidth: number;
};

export type BetterHtmlConfig = {
   app: AppConfig;
   sideMenuIsCollapsed: boolean;
   sideMenuIsOpenMobile: boolean;
   components: {
      button?: {
         style?: ComponentStyleConfig<"default" | "secondary" | "destructive" | "icon" | "upload">;
         tagReplacement?: ComponentTagReplacementConfig<"buttonComponent" | "linkComponent">;
      };
      sideMenu?: {
         /** @default 300 */
         width?: number;
      };
   };
};
