import { ThemeConfig } from "./theme";
import { AssetsConfig } from "./asset";
import { IconsConfig } from "./icon";
import { LoaderConfig } from "./loader";

export type BetterHtmlConfig = {
   theme: ThemeConfig;
   icons: Partial<IconsConfig>;
   assets: Partial<AssetsConfig>;
   loaders: Partial<LoaderConfig>;
};
