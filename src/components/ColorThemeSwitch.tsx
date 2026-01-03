import { memo, useCallback, useEffect, useState } from "react";
import { useTheme } from "react-better-core";

import { ComponentMarginProps } from "../types/components";

import Div from "./Div";
import Text from "./Text";
import ToggleInput from "./ToggleInput";

export type ColorThemeSwitchProps = {
   /** @default false */
   withMoon?: boolean;
   className?: string;
} & ComponentMarginProps;

type ColorThemeSwitchComponentType = {
   (props: ColorThemeSwitchProps): React.ReactElement;
   withText: (props: ColorThemeSwitchProps) => React.ReactElement;
};

const ColorThemeSwitchComponent: ColorThemeSwitchComponentType = function ColorThemeSwitch({
   withMoon,
   className,
   ...props
}: ColorThemeSwitchProps) {
   const [value, setValue] = useState(localStorage.getItem("theme") === "dark");

   const onChangeSwitch = useCallback((checked: boolean) => {
      setValue(checked);

      document.querySelector("html")?.setAttribute("data-theme", checked ? "dark" : "light");
   }, []);

   useEffect(() => {
      const html = document.querySelector("html");

      if (!html) return;

      const observer = new MutationObserver((mutations) => {
         mutations.forEach((mutation) => {
            if (mutation.type === "attributes") {
               setValue(html.getAttribute("data-theme") === "dark");
            }
         });
      });

      observer.observe(html, {
         attributes: true,
         attributeFilter: ["data-theme"],
      });

      return () => {
         observer.disconnect();
      };
   }, []);

   return (
      <ToggleInput.switch
         className={`react-better-html-color-theme-switch ${
            withMoon ? ` react-better-html-color-theme-switch-with-moon` : ""
         }${className ? ` ${className}` : ""}`}
         checked={value}
         onChange={onChangeSwitch}
         {...props}
      />
   );
} as any;

ColorThemeSwitchComponent.withText = function WithText({ withMoon, className, ...props }) {
   const theme = useTheme();

   return (
      <Div.row width="fit-content" alignItems="center" gap={theme.styles.gap} userSelect="none" {...props}>
         <Text>Light</Text>
         <ColorThemeSwitchComponent withMoon={withMoon} className={className} />
         <Text>Dark</Text>
      </Div.row>
   );
} as ColorThemeSwitchComponentType["withText"];

const ColorThemeSwitch = memo(ColorThemeSwitchComponent) as any as typeof ColorThemeSwitchComponent & {
   withText: typeof ColorThemeSwitchComponent.withText;
};

ColorThemeSwitch.withText = ColorThemeSwitchComponent.withText;

export default ColorThemeSwitch;
