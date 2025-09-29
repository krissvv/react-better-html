import { memo, useEffect } from "react";

import { ComponentMarginProps } from "../types/components";

import { useForm } from "../utils/hooks";
import { colorThemeControls } from "../utils/variableFunctions";

import Div from "./Div";
import Text from "./Text";
import ToggleInput from "./ToggleInput";
import { useTheme } from "./BetterHtmlProvider";

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
   const form = useForm({
      defaultValues: {
         darkMode: localStorage.getItem("theme") === "dark",
      },
   });

   useEffect(() => {
      colorThemeControls.toggleTheme(form.values.darkMode ? "dark" : "light");
   }, [form.values.darkMode]);
   useEffect(() => {
      const html = document.querySelector("html");

      if (!html) return;

      const observer = new MutationObserver((mutations) => {
         mutations.forEach((mutation) => {
            if (mutation.type === "attributes") {
               form.setFieldValue("darkMode", html.getAttribute("data-theme") === "dark");
            }
         });
      });

      observer.observe(html, {
         attributes: true,
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
         {...form.getSwitchProps("darkMode")}
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
