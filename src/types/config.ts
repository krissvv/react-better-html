import { PartialTheme, Theme } from "./theme";
import { AssetsConfig } from "./asset";
import { IconsConfig } from "./icon";

export type BetterHtmlConfig = {
   theme: Theme;
   icons: Partial<IconsConfig>;
   assets: Partial<AssetsConfig>;
};

export type PartialBetterHtmlConfig = {
   theme?: PartialTheme;
   icons?: Partial<IconsConfig>;
   assets?: Partial<AssetsConfig>;
};
