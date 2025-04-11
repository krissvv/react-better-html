import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";

import { cssProps } from "../constants/css";

import { ComponentHoverStyle, ComponentPropWithRef, ComponentStyle } from "../types/components";
import { Theme } from "../types/theme";
import { OmitProps, PartialRecord } from "../types/app";

import { InputFieldProps, TextareaFieldProps } from "../components/InputField";
import { DropdownProps } from "../components/Dropdown";
import { ToggleInputProps, ToggleInputRef } from "../components/ToggleInput";
import { usePlugin } from "../components/BetterHtmlProvider";

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

export function usePageScroll() {
   const [scrollX, setScrollX] = useState<number>(window.scrollX ?? 0);
   const [scrollY, setScrollY] = useState<number>(window.scrollY ?? 0);

   useEffect(() => {
      const onScroll = () => {
         setScrollX(window.scrollX);
         setScrollY(window.scrollY);
      };

      window.addEventListener("scroll", onScroll);

      return () => {
         window.removeEventListener("scroll", onScroll);
      };
   }, []);

   return {
      scrollX,
      scrollY,
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

export function useForm<FormFields extends Record<string | number, string | number | boolean | undefined>>(options: {
   defaultValues: FormFields;
   requiredFields?: (keyof FormFields)[];
   onSubmit?: (values: FormFields) => void | Promise<void>;
   validate?: (values: FormFields) => PartialRecord<keyof FormFields, string>;
}) {
   const { defaultValues, requiredFields, onSubmit, validate } = options;

   const inputFieldRefs = useRef<Record<keyof FormFields, HTMLInputElement | undefined>>(
      {} as Record<keyof FormFields, HTMLInputElement | undefined>,
   );
   const [inputTypes, setInputTypes] = useState<Record<keyof FormFields, React.HTMLInputTypeAttribute>>(
      {} as Record<keyof FormFields, React.HTMLInputTypeAttribute>,
   );

   const [values, setValues] = useState<FormFields>(defaultValues);
   const [errors, setErrors] = useState<PartialRecord<keyof FormFields, string>>({});
   const [isSubmitting, setIsSubmitting] = useBooleanState();

   const setFieldValue = useCallback(
      <FieldName extends keyof FormFields>(field: FieldName, value: FormFields[FieldName] | undefined) => {
         setValues((oldValue) => ({
            ...oldValue,
            [field]: value,
         }));

         setErrors((oldValue) => ({
            ...oldValue,
            [field]: undefined,
         }));
      },
      [],
   );
   const setFieldsValue = useCallback((values: Partial<FormFields>) => {
      setValues((oldValue) => ({
         ...oldValue,
         ...values,
      }));

      setErrors((oldValue) => {
         const newErrors: typeof oldValue = {};

         for (const key in values) newErrors[key] = undefined;

         return newErrors;
      });
   }, []);
   const getInputFieldProps = useCallback(
      <FieldName extends keyof FormFields>(
         field: FieldName,
      ): ComponentPropWithRef<HTMLInputElement, InputFieldProps> => {
         const type = inputTypes[field] ?? "text";

         return {
            required: requiredFields?.includes(field),
            value: values[field]?.toString() ?? "",
            onChangeValue: (newValue) => {
               const readyValue = type === "number" ? (newValue ? Number(newValue) : undefined) : newValue;

               setFieldValue(field, readyValue as FormFields[FieldName]);
            },
            ref: (element) => {
               if (!element) return;

               inputFieldRefs.current[field] = element;

               if (inputTypes[field] === undefined)
                  setInputTypes((oldValue) => ({
                     ...oldValue,
                     [field]: element.getAttribute("type"),
                  }));
            },
            errorText: errors[field],
         };
      },
      [values, setFieldValue, inputTypes, errors],
   );
   const getTextAreaProps = useCallback(
      <FieldName extends keyof FormFields>(
         field: FieldName,
      ): ComponentPropWithRef<HTMLTextAreaElement, TextareaFieldProps> => {
         return {
            required: requiredFields?.includes(field),
            value: values[field]?.toString() ?? "",
            onChangeValue: (newValue) => {
               setFieldValue(field, newValue as FormFields[FieldName]);
            },
            errorText: errors[field],
         };
      },
      [values, setFieldValue, inputTypes, errors],
   );
   const getDropdownFieldProps = useCallback(
      <FieldName extends keyof FormFields>(
         field: FieldName,
      ): OmitProps<ComponentPropWithRef<HTMLDivElement, DropdownProps<FormFields[FieldName], unknown>>, "options"> => {
         return {
            required: requiredFields?.includes(field),
            value: values[field],
            onChange: (value) => {
               setFieldValue(field, value);
            },
            errorText: errors[field],
         };
      },
      [values, errors, setFieldValue],
   );
   const getCheckboxProps = useCallback(
      <FieldName extends keyof FormFields>(
         field: FieldName,
      ): ComponentPropWithRef<ToggleInputRef, ToggleInputProps<FormFields[FieldName]>> => {
         return {
            required: requiredFields?.includes(field),
            checked: values[field] as boolean,
            onChange: (checked) => {
               setFieldValue(field, checked as FormFields[FieldName]);
            },
            errorText: errors[field],
         };
      },
      [values, errors, setFieldValue],
   );
   const getRadioButtonProps = useCallback(
      <FieldName extends keyof FormFields>(
         field: FieldName,
         value: FormFields[FieldName],
      ): ComponentPropWithRef<ToggleInputRef, ToggleInputProps<FormFields[FieldName]>> => {
         return {
            required: requiredFields?.includes(field),
            checked: values[field] === value,
            name: field.toString(),
            value,
            onChange: (checked, newValue) => {
               setFieldValue(field, checked ? newValue : undefined);
            },
            errorText: errors[field],
         };
      },
      [values, errors, setFieldValue],
   );
   const getSwitchProps = useCallback(
      <FieldName extends keyof FormFields>(
         field: FieldName,
      ): ComponentPropWithRef<ToggleInputRef, ToggleInputProps<FormFields[FieldName]>> => {
         return {
            required: requiredFields?.includes(field),
            checked: values[field] as boolean,
            onChange: (checked) => {
               setFieldValue(field, checked as FormFields[FieldName]);
            },
            errorText: errors[field],
         };
      },
      [values, errors, setFieldValue],
   );
   const focusField = useCallback((field: keyof FormFields) => {
      inputFieldRefs.current[field]?.focus();
   }, []);
   const onSubmitFunction = useCallback(
      async (event: React.FormEvent<HTMLFormElement>) => {
         event.preventDefault();
         setIsSubmitting.setTrue();

         try {
            const validationErrors = validate?.(values) || {};
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length === 0) {
               await onSubmit?.(values);
            } else {
               const firstErrorField = Object.keys(validationErrors)[0] as keyof FormFields;
               focusField(firstErrorField);
            }
         } finally {
            setIsSubmitting.setFalse();
         }
      },
      [values, validate, onSubmit, focusField],
   );
   const reset = useCallback(() => {
      setValues(defaultValues);
      setErrors({});
   }, [defaultValues]);

   const isDirty = useMemo(
      () => Object.keys(defaultValues).some((key) => defaultValues[key] !== values[key]),
      [defaultValues, values],
   );

   return {
      values,
      errors,
      isSubmitting,
      setFieldValue,
      setFieldsValue,
      getInputFieldProps,
      getTextAreaProps,
      getDropdownFieldProps,
      getCheckboxProps,
      getRadioButtonProps,
      getSwitchProps,
      focusField,
      onSubmit: onSubmitFunction,
      reset,
      requiredFields,
      isDirty,
   };
}

export function useUrlQuery() {
   const reactRouterDomPlugin = usePlugin("react-router-dom");

   if (!reactRouterDomPlugin) {
      throw new Error(
         "`useUrlQuery` hook requires the `react-router-dom` plugin to be added to the `plugins` prop in `<BetterHtmlProvider>`.",
      );
   }

   const navigate = useNavigate();
   const [searchParams] = useSearchParams();

   const setQuery = useCallback(
      (query: Record<string, string>, keepHistory = true) => {
         const currentSearchParams: Record<string, string> = {};
         searchParams.forEach((value, key) => {
            (currentSearchParams as any)[key] = value;
         });

         navigate(
            {
               search: createSearchParams({
                  ...currentSearchParams,
                  ...query,
               }).toString(),
            },
            {
               replace: !keepHistory,
            },
         );
      },
      [navigate, searchParams],
   );
   const getQuery = useCallback((name: string) => searchParams.get(name), [searchParams]);
   const removeQuery = useCallback(
      (name: string, keepHistory = true) => {
         searchParams.delete(name);

         navigate(
            {
               search: searchParams.toString(),
            },
            {
               replace: !keepHistory,
            },
         );
      },
      [navigate, searchParams],
   );

   return {
      setQuery,
      getQuery,
      removeQuery,
   };
}
