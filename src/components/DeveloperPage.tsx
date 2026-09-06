import { memo } from "react";

import Div from "./Div";
import Icon from "./Icon";
import Text from "./Text";
import Image from "./Image";
import { useBetterCoreContext, useTheme } from "react-better-core";

export type DeveloperPageSection = {
   title: string;
   description?: string;
   children?: React.ReactNode;
};

type DeveloperPageProps = {
   /** @default 24 */
   iconSize?: number;
   /** @default 120 */
   assetSize?: number;
   sections?: DeveloperPageSection[];
};

function DeveloperPage({ iconSize = 24, assetSize = 120, sections }: DeveloperPageProps) {
   const theme = useTheme();
   const { devMode, icons, assets } = useBetterCoreContext();

   const gridGap = theme.styles.space;
   const iconNameFontSie = 12;

   return devMode ? (
      <Div.column gap={theme.styles.space}>
         <Div.box title="Icons" titleAs="h2" description="List of all icons in the config">
            <Div.row alignItems="center" justifyContent="center" flexWrap="wrap" gap={gridGap}>
               {Object.keys(icons).map((icon) => (
                  <Div.row
                     position="relative"
                     width={iconSize + gridGap * 2 + iconNameFontSie}
                     height={iconSize + gridGap * 2 + iconNameFontSie}
                     alignItems="center"
                     justifyContent="center"
                     key={icon}
                  >
                     <Icon name={icon} color={theme.colors.primary} size={iconSize} />

                     <Text
                        position="absolute"
                        width="100%"
                        top={`calc(100% - ${iconNameFontSie}px)`}
                        fontSize={iconNameFontSie}
                        textAlign="center"
                        wordBreak="break-all"
                        color={theme.colors.textSecondary}
                     >
                        {icon}
                     </Text>
                  </Div.row>
               ))}
            </Div.row>
         </Div.box>

         <Div.box title="Assets" titleAs="h2" description="List of all assets in the config">
            <Div.row alignItems="center" justifyContent="center" flexWrap="wrap" gap={gridGap}>
               {Object.keys(assets).map((asset) => (
                  <Div.column
                     position="relative"
                     width={assetSize}
                     alignItems="center"
                     justifyContent="center"
                     gap={theme.styles.gap}
                     key={asset}
                  >
                     <Image name={asset} width="100%" height={assetSize} objectFit="contain" />

                     <Text
                        width="100%"
                        fontSize={iconNameFontSie}
                        textAlign="center"
                        wordBreak="break-all"
                        color={theme.colors.textSecondary}
                     >
                        {asset}
                     </Text>
                  </Div.column>
               ))}
            </Div.row>
         </Div.box>

         {sections?.map((section) => (
            <Div.box title={section.title} titleAs="h2" description={section.description} key={section.title}>
               {section.children}
            </Div.box>
         ))}
      </Div.column>
   ) : undefined;
}

export default memo(DeveloperPage);
