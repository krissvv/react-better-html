import { useCallback, useEffect, useMemo, useState } from "react";

import { ComponentHoverStyle, ComponentStyle } from "../types/components";
import { Theme } from "../types/theme";

const cssProps = Object.keys(document.documentElement.style).reduce((previousValue, currentValue) => {
   previousValue[currentValue.toLowerCase() as keyof React.CSSProperties] = true;
   previousValue[`${currentValue}Hover`.toLowerCase() as keyof React.CSSProperties] = true;

   return previousValue;
}, {} as Record<keyof React.CSSProperties, boolean>);
const cssPropsToExclude: (keyof React.CSSProperties)[] = [
   "margin",
   "marginTop",
   "marginBottom",
   "marginLeft",
   "marginRight",
   "marginBlock",
   "marginInline",
   "marginBlockStart",
   "marginBlockEnd",
   "marginInlineStart",
   "marginInlineEnd",
   "marginTrim",
];

export function useStyledComponentStyles(
   props: ComponentStyle & ComponentHoverStyle,
   theme?: Theme,
   /** @default false */
   excludeProps?: boolean,
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

            const readyKey = key as keyof ComponentStyle;

            if (excludeProps && cssPropsToExclude.includes(readyKey)) continue;

            (normalStyle[readyKey] as any) = props[readyKey];
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

export function useComponentPropsWithExcludedStyle<Props extends Record<string, any>>(props: Props) {
   return useMemo(
      () =>
         Object.keys(props).reduce((previousValue, currentValue) => {
            if (!cssProps[currentValue.toLowerCase() as keyof React.CSSProperties]) {
               if (cssPropsToExclude.includes(currentValue as keyof React.CSSProperties)) return previousValue;

               previousValue[currentValue as keyof Props] = props[currentValue];
            }

            return previousValue;
         }, {} as Partial<Props>),
      [props],
   );
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

export function usePageResize() {
   const [width, setWidth] = useState<number>(window.innerWidth);
   const [height, setHeight] = useState<number>(window.innerHeight);

   useEffect(() => {
      const onResize = () => {
         setWidth(window.innerWidth);
         setHeight(window.innerHeight);
      };

      window.addEventListener("resize", onResize);

      return () => {
         window.removeEventListener("resize", onResize);
      };
   }, []);

   return {
      width,
      height,
   };
}

export function useMediaQuery() {
   const { width } = usePageResize();

   return {
      size320: width <= 320,
      size400: width <= 400,
      size500: width <= 500,
      size600: width <= 600,
      size700: width <= 700,
      size800: width <= 800,
      size900: width <= 900,
      size1000: width <= 1000,
      size1100: width <= 1100,
      size1200: width <= 1200,
      size1300: width <= 1300,
      size1400: width <= 1400,
      size1500: width <= 1500,
      size1600: width <= 1600,
   };
}

export function useBooleanState(initialValue = false): [
   boolean,
   {
      setState: React.Dispatch<React.SetStateAction<boolean>>;
      setTrue: () => void;
      setFalse: () => void;
      toggle: () => void;
   },
] {
   const [state, setState] = useState<boolean>(initialValue);

   const setTrue = useCallback(() => setState(true), []);
   const setFalse = useCallback(() => setState(false), []);
   const toggle = useCallback(() => setState((oldValue) => !oldValue), []);

   return [state, { setState, setTrue, setFalse, toggle }];
}
