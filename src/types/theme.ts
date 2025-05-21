export type Color = `#${string}` | "transparent";
export type ColorName =
   | "textPrimary"
   | "textSecondary"
   | "textLink"
   | "label"
   | "primary"
   | "secondary"
   | "accent"
   | "success"
   | "info"
   | "warn"
   | "error"
   | "base"
   | "backgroundBase"
   | "backgroundSecondary"
   | "backgroundContent"
   | "border";
export type ColorTheme = "light" | "dark";

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
export type ThemeConfig = {
   styles: Styles;
   colors: Record<ColorTheme, Colors>;
};
