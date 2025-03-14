export type Color = `#${string}` | "transparent";
export type ColorName =
   | "textPrimary"
   | "textSecondary"
   | "label"
   | "primary"
   | "secondary"
   | "success"
   | "info"
   | "warn"
   | "error"
   | "backgroundBase"
   | "backgroundSecondary"
   | "backgroundContent"
   | "border";

export type Styles = {
   space: number;
   gap: number;
   borderRadius: number;
   fontFamily: string;
   transition: string;
};
export type Colors = Record<ColorName, Color>;

export type Theme = {
   styles: Styles;
   colors: Colors;
};

export type PartialTheme = {
   styles?: Partial<Styles>;
   colors?: Partial<Colors>;
};
