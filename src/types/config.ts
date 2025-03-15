import { ThemeConfig } from "./theme";
import { AssetsConfig } from "./asset";
import { IconsConfig } from "./icon";

export type BetterHtmlConfig = {
   theme: ThemeConfig;
   icons: Partial<IconsConfig>;
   assets: Partial<AssetsConfig>;
};
