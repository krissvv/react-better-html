import { useMemo } from "react";

import { ComponentHoverStyle, ComponentStyle } from "../types/components";
import { Theme } from "../types/theme";

const cssProps = Object.keys(document.documentElement.style).reduce((previousValue, currentValue) => {
   previousValue[currentValue.toLowerCase() as keyof React.CSSProperties] = true;

   return previousValue;
}, {} as Record<keyof React.CSSProperties, boolean>);

export function useStyledComponentStyles(
   props: ComponentStyle & ComponentHoverStyle,
   theme?: Theme,
): {
   normalStyle: ComponentStyle;
   hoverStyle: ComponentStyle;
} {
   const styles = useMemo(() => {
      const normalStyle: ComponentStyle = {};
      const hoverStyle: ComponentStyle = {};

      let haveHover = false;

      for (const key in props) {
         if (key.endsWith("Hover")) {
            haveHover = true;

            const normalKey = key.slice(0, -5) as keyof ComponentStyle;
            (hoverStyle[normalKey] as any) = props[key as keyof ComponentStyle];
         } else {
            if (!cssProps[key.toLowerCase() as keyof React.CSSProperties]) continue;

            (normalStyle[key as keyof ComponentStyle] as any) = props[key as keyof ComponentStyle];
         }
      }

      if (haveHover) normalStyle.transition = theme?.styles.transition ?? "";

      return {
         normalStyle,
         hoverStyle,
      };
   }, [props, theme]);

   return styles;
}

export function useComponentPropsWithPrefix<Props extends Record<string, any>, Prefix extends string>(
   props: Props,
   prefix: Prefix,
) {
   return useMemo<Record<`${Prefix}-${string}`, any>>(() => {
      const returnValue: any = {};

      for (const key in props) {
         if (key.startsWith(`${prefix}-`)) {
            returnValue[key] = props[key];
         }
      }

      return returnValue;
   }, [props, prefix]);
}

export function useComponentPropsWithoutStyle<Props extends Record<string, any>>(props: Props) {
   return useMemo(
      () =>
         Object.keys(props).reduce((previousValue, currentValue) => {
            if (!cssProps[currentValue.toLowerCase() as keyof React.CSSProperties])
               previousValue[currentValue as keyof Props] = props[currentValue];

            return previousValue;
         }, {} as Partial<Props>),
      [props],
   );
}
