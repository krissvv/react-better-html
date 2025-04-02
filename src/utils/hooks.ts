import { useCallback, useEffect, useMemo, useState } from "react";

import { cssProps } from "../constants/css";

import { ComponentHoverStyle, ComponentStyle } from "../types/components";
import { Theme } from "../types/theme";

const cssPropsToExclude: (keyof React.CSSProperties)[] = [
   "position",
   "top",
   "right",
   "bottom",
   "left",
   "width",
   "height",
   "minWidth",
   "minHeight",
   "maxWidth",
   "maxHeight",
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
   "zIndex",
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
   return useMemo(() => {
      const normalStyle: ComponentStyle = {};
      const hoverStyle: ComponentStyle = {};

      let haveHover = false;

      for (const key in props) {
         if (excludeProps && cssPropsToExclude.includes(key as keyof React.CSSProperties)) continue;

         if (key.endsWith("Hover")) {
            haveHover = true;

            const normalKey = key.slice(0, -5) as keyof ComponentStyle;
            (hoverStyle[normalKey] as any) = props[key as keyof ComponentStyle];
         } else {
            if (!cssProps[key.toLowerCase()]) continue;

            (normalStyle[key as keyof ComponentStyle] as any) = props[key as keyof ComponentStyle];
         }
      }

      if (haveHover) normalStyle.transition = theme?.styles.transition ?? "";

      return {
         normalStyle,
         hoverStyle,
      };
   }, [props, theme]);
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
            const key = currentValue as keyof React.CSSProperties;

            if (!cssPropsToExclude.includes(key)) return previousValue;

            (previousValue[key] as any) = props[key];

            return previousValue;
         }, {} as Partial<Props>),
      [props],
   );
}

export function useComponentPropsWithoutStyle<Props extends Record<string, any>>(props: Props) {
   return useMemo(
      () =>
         Object.keys(props).reduce((previousValue, currentValue) => {
            if (!cssProps[currentValue.toLowerCase()]) previousValue[currentValue as keyof Props] = props[currentValue];

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
   state: boolean,
   actions: {
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

export function useDebounceState<Value>(
   initialValue: Value,
   delay = 0.5,
): [value: Value, debouncedValue: Value, setValue: React.Dispatch<React.SetStateAction<Value>>, isLoading: boolean] {
   const [value, setValue] = useState<Value>(initialValue);
   const [debouncedValue, setDebouncedValue] = useState<Value>(initialValue);
   const [isLoading, setIsLoading] = useBooleanState();

   useEffect(() => {
      setIsLoading.setTrue();

      const timer = setTimeout(() => {
         setDebouncedValue(value);
         setIsLoading.setFalse();
      }, delay * 1000);

      return () => {
         clearTimeout(timer);
      };
   }, [value, delay]);

   return [value, debouncedValue, setValue, isLoading];
}
