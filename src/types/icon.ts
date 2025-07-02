export type IconName =
   | "XMark"
   | "uploadCloud"
   | "trash"
   | "chevronDown"
   | "chevronLeft"
   | "chevronRight"
   | "doubleChevronLeft"
   | "doubleChevronRight"
   | "eye"
   | "eyeDashed"
   | "magnifyingGlass"
   | "check"
   | "infoI"
   | "warningTriangle"
   | "filter";

export type IconData = {
   width: number;
   height: number;
   paths: (React.ComponentProps<"path"> & { type: "fill" | "stroke" })[];
};

export type IconsConfig = Record<IconName, IconData> & {
   [key: string]: IconData;
};
