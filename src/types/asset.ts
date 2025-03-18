export type AssetName = "logo";

export type AssetsConfig = Record<AssetName, string> & {
   [key: string]: string;
};
