export type IconName =
   | "XMark"
   | "uploadCloud"
   | "trash"
   | "chevronDown"
   | "chevronLeft"
   | "chevronRight"
   | "eye"
   | "eyeDashed"
   | "magnifyingGlass"
   | "check";

export type IconData = {
   width: number;
   height: number;
   paths: (React.ComponentProps<"path"> & { type: "fill" | "stroke" })[];
};

export type IconsConfig = Record<IconName, IconData> & {
   [key: string]: IconData;
};
