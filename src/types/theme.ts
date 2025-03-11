export type Styles = {
   sideSpace: number;
   borderRadius: number;
   borderRadiusSmall?: number;
   gap: number;
   fontSize?: number;
   fontFamily: string;
   transition: string;
};

export type Color = `#${string}` | "transparent";
export type Colors = Record<
   | "textPrimary"
   | "textSecondary"
   | "brand"
   | "brandSecondary"
   | "success"
   | "info"
   | "warn"
   | "error"
   | "errorSecondary"
   | "backgroundBase"
   | "backgroundSecondary"
   | "backgroundTertiary"
   | "border",
   Color
>;

export type Theme = {
   styles: Styles;
   colors: Colors;
};

export type PartialTheme = {
   styles?: Partial<Styles>;
   colors?: Partial<Colors>;
};
