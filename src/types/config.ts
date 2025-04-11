import { ColorTheme, ThemeConfig } from "./theme";
import { AssetsConfig } from "./asset";
import { IconsConfig } from "./icon";
import { LoaderConfig } from "./loader";
import { ComponentHoverStyle, ComponentStyle } from "./components";

export type AppConfig = {
   contentMaxWidth: number;
};

type ComponentConfig<Subcomponents extends string> = {
   [key in Subcomponents]?: ComponentStyle & ComponentHoverStyle;
};

export type BetterHtmlConfig = {
   app: AppConfig;
   theme: ThemeConfig;
   colorTheme: ColorTheme;
   icons: Partial<IconsConfig>;
   assets: Partial<AssetsConfig>;
   loaders: Partial<LoaderConfig>;
   components: {
      button?: ComponentConfig<"default" | "secondary" | "destructive" | "icon" | "upload">;
   };
};
