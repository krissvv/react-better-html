type LogType = "info" | "success" | "warn" | "error";
type TextColor = keyof typeof textColors;
type BackgroundColor = keyof typeof backgroundColors;

type Options = {
   color?: TextColor;
   backgroundColor?: BackgroundColor;
   bold?: boolean;
};

const textColors = {
   black: "#111111",
   red: "#f83e4b",
   green: "#5ac53a",
   yellow: "#f8d770",
   blue: "#3d6fdf",
   magenta: "#9648eb",
   cyan: "#53b2c8",
   white: "#f8f8f8",
};
const backgroundColors = {
   black: "#111111",
   red: "#f83e4b",
   green: "#5ac53a",
   yellow: "#f8d770",
   blue: "#3d6fdf",
   magenta: "#9648eb",
   cyan: "#53b2c8",
   white: "#f8f8f8",
};

const logTypes: Record<LogType, TextColor> = {
   info: "cyan",
   success: "green",
   warn: "yellow",
   error: "red",
};

function getCssString(options: Options): string {
   const color = options.color ? textColors[options.color] : undefined;
   const backgroundColor = options.backgroundColor ? backgroundColors[options.backgroundColor] : undefined;
   const fontWeight = options.bold ? "bold" : "normal";

   return `${color ? `color: ${color};` : ""}${backgroundColor ? `background-color: ${backgroundColor};` : ""}${
      fontWeight ? `font-weight: ${fontWeight};` : ""
   }`;
}

function logText(text?: string, options?: Options): void {
   console.log(`%c${text}`, getCssString(options ?? {}));
}

export const log = {
   ...Object.entries(logTypes).reduce((previousValue, [logType, color]) => {
      previousValue[logType as LogType] = (text = "", bold?: boolean) => {
         logText(text, {
            color,
            bold,
         });
      };
      return previousValue;
   }, {} as Record<LogType, (text?: string, bold?: boolean) => void>),
   /** @description Default log function */
   log: (text?: string, options?: Options) => {
      logText(text, options);
   },
   /** @description Logs the value in pretty json format */
   json: (jsonObject?: any, options?: Options) => {
      logText(`\n${JSON.stringify(jsonObject, null, 4)}`, options);
   },
   /** @description Logs a -=-= pattern */
   divider: (color?: TextColor) => {
      logText("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-", {
         color,
      });
   },
   trace: () => {
      console.trace();
   },
};
