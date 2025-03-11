export type IconsConfig = Record<
   IconName,
   {
      width: number;
      height: number;
      paths: (React.ComponentProps<"path"> & { type: "fill" | "stroke" })[];
   }
>;

export type IconName = "";
