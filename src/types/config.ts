import { ColorTheme, ThemeConfig } from "./theme";
import { AssetsConfig } from "./asset";
import { IconsConfig } from "./icon";
import { LoaderConfig } from "./loader";
import { ComponentHoverStyle, ComponentStyle } from "./components";

export type AppConfig = {
   contentMaxWidth: number;
};

type ComponentStyleConfig<Subcomponents extends string> = {
   [key in Subcomponents]?: ComponentStyle & ComponentHoverStyle;
};

type ComponentTagReplacementConfig<Subcomponents extends string> = {
   [key in Subcomponents]?: React.ElementType;
};

export type BetterHtmlConfig = {
   app: AppConfig;
   theme: ThemeConfig;
   colorTheme: ColorTheme;
   icons: Partial<IconsConfig>;
   assets: Partial<AssetsConfig>;
   loaders: Partial<LoaderConfig>;
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
