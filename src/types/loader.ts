export type LoaderName = "";

export type LoaderConfig = Record<LoaderName, boolean | undefined> & {
   [key: string]: boolean | undefined;
};
