import { forwardRef, useCallback, useState } from "react";
import styled from "styled-components";

import { ComponentHoverStyle, ComponentPropWithRef, ComponentStyle } from "../types/components";
import { OmitProps } from "../types/app";
import { Theme } from "../types/theme";

import {
   useBooleanState,
   useComponentPropsWithExcludedStyle,
   useComponentPropsWithoutStyle,
   useComponentPropsWithPrefix,
   useStyledComponentStyles,
} from "../utils/hooks";

import Text from "./Text";
import Div from "./Div";
import Icon from "./Icon";
import { useTheme } from "./BetterHtmlProvider";

const InputElement = styled.input.withConfig({
   shouldForwardProp: (prop) => !["theme", "normalStyle", "hoverStyle"].includes(prop),
})<{ theme: Theme; normalStyle: ComponentStyle; hoverStyle: ComponentStyle }>`
   position: relative;
   appearance: none;
   width: 26px;
   height: 26px;
   background-color: ${(props) => props.theme.colors.backgroundContent};
   border: 1px solid ${(props) => props.theme.colors.border};
   border-radius: ${(props) => props.theme.styles.borderRadius / 2}px;
   cursor: pointer;
   transition: ${(props) => props.theme.styles.transition};
   flex-shrink: 0;

   &[type="radio"] {
      border-radius: 999px;
   }

   &:checked {
      background-color: ${(props) => props.theme.colors.primary};
      border-color: ${(props) => props.theme.colors.primary};
   }

   &:disabled {
      filter: brightness(0.9);
      cursor: not-allowed;
   }

   ${(props) => props.normalStyle as any}

   &:hover {
      ${(props) => props.hoverStyle as any}
   }
`;

const SwitchElement = styled.div.withConfig({
   shouldForwardProp: (prop) => !["theme", "checked", "disabled", "normalStyle", "hoverStyle"].includes(prop),
})<{
   theme: Theme;
   checked: boolean;
   disabled: boolean;
   normalStyle: ComponentStyle;
   hoverStyle: ComponentStyle;
}>`
   position: relative;
   width: 36px;
   height: 20px;
   background-color: ${(props) => (props.checked ? props.theme.colors.primary : props.theme.colors.border)};
   border-radius: 10px;
   cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
   opacity: ${(props) => (props.disabled ? 0.5 : 1)};
   transition: ${(props) => props.theme.styles.transition};

   &::before {
      content: "";
      position: absolute;
      width: 16px;
      height: 16px;
      background-color: white;
      border-radius: 50%;
      top: 2px;
      left: 2px;
      transition: ${(props) => props.theme.styles.transition};
      transform: translateX(${(props) => (props.checked ? "16px" : "0")});
   }

   ${(props) => props.normalStyle as any}

   &:hover {
      ${(props) => props.hoverStyle as any}
   }
`;

export type ToggleInputRef = {};

type InternalToggleInputProps<Value> = {
   label?: string;
   text?: string;
   errorText?: string;
   infoText?: string;
   value?: Value;
   onChange?: (checked: boolean, value?: Value) => void;
} & OmitProps<React.ComponentProps<"input">, "style" | "value" | "ref" | "onChange" | "name"> &
   ComponentStyle &
   ComponentHoverStyle;

export type ToggleInputProps<Value> = ComponentPropWithRef<
   ToggleInputRef,
   OmitProps<InternalToggleInputProps<Value>, "type">
>;
type ToggleInputComponentType = <Value>(props: ToggleInputProps<Value>) => React.ReactElement;

const ToggleInputComponent = forwardRef(function ToggleInput<Value>(
   {
      label,
      text,
      errorText,
      infoText,
      value,
      onChange,
      checked: controlledChecked,
      required,
      ...props
   }: InternalToggleInputProps<Value>,
   ref: React.ForwardedRef<ToggleInputRef>,
) {
   const theme = useTheme();

   const styledComponentStyles = useStyledComponentStyles(props, theme, true);
   const styledComponentStylesWithExcluded = useComponentPropsWithExcludedStyle(props);
   const dataProps = useComponentPropsWithPrefix(props, "data");
   const ariaProps = useComponentPropsWithPrefix(props, "aria");
   const restProps = useComponentPropsWithoutStyle(props);

   const [internalChecked, setInternalChecked] = useState(false);

   const onChangeElement = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
         const newValue = event.target.checked;

         if (controlledChecked === undefined) setInternalChecked(newValue);
         onChange?.(newValue, value);
      },
      [onChange, controlledChecked, value],
   );

   const checked = controlledChecked ?? internalChecked;

   const onClickText = useCallback(() => {
      const newValue = !checked;

      if (controlledChecked === undefined) setInternalChecked(newValue);
      onChange?.(newValue, value);
   }, [checked, controlledChecked, onChange, value]);

   return (
      <Div.column width="100%" gap={theme.styles.gap / 2} {...styledComponentStylesWithExcluded}>
         {label && (
            <Text
               as="label"
               height={16}
               fontSize={14}
               color={errorText ? theme.colors.error : theme.colors.textSecondary}
            >
               {label}

               {required && (
                  <Text as="span" fontSize={16} color={theme.colors.error}>
                     {" "}
                     *
                  </Text>
               )}
            </Text>
         )}

         <Div.row alignItems="center" gap={theme.styles.gap}>
            <Div.row position="relative" alignItems="center">
               <InputElement
                  theme={theme}
                  type={props.type ?? "checkbox"}
                  checked={checked}
                  onChange={onChangeElement}
                  {...styledComponentStyles}
                  {...dataProps}
                  {...ariaProps}
                  {...restProps}
               />

               {props.type === "checkbox" ? (
                  <Icon
                     name="check"
                     position="absolute"
                     top="50%"
                     left="50%"
                     color={theme.colors.base}
                     size={14}
                     transform={`translate(-50%, -50%)${checked ? "" : " scale(0.4)"}`}
                     opacity={checked ? 1 : 0}
                     pointerEvents="none"
                     transition={theme.styles.transition}
                  />
               ) : props.type === "radio" ? (
                  <Div
                     position="absolute"
                     width={10}
                     height={10}
                     top="50%"
                     left="50%"
                     backgroundColor={theme.colors.base}
                     borderRadius={999}
                     transform={`translate(-50%, -50%)${checked ? "" : " scale(0.4)"}`}
                     opacity={checked ? 1 : 0}
                     pointerEvents="none"
                  />
               ) : undefined}
            </Div.row>

            {text && (
               <Text userSelect="none" cursor="pointer" onClick={onClickText}>
                  {text}
               </Text>
            )}
         </Div.row>

         {(errorText || infoText) && (
            <Text
               as="span"
               display="block"
               fontSize={14}
               color={errorText ? theme.colors.error : theme.colors.textSecondary}
            >
               {errorText || infoText}
            </Text>
         )}
      </Div.column>
   );
}) as <Value>(props: ComponentPropWithRef<ToggleInputRef, InternalToggleInputProps<Value>>) => React.ReactElement;

export default {
   checkbox: forwardRef(function Checkbox<Value>(
      props: ToggleInputProps<Value>,
      ref: React.ForwardedRef<ToggleInputRef>,
   ) {
      return <ToggleInputComponent type="checkbox" ref={ref} {...props} />;
   }) as ToggleInputComponentType,
   radiobutton: forwardRef(function RadioButton<Value>(
      props: ToggleInputProps<Value>,
      ref: React.ForwardedRef<ToggleInputRef>,
   ) {
      return <ToggleInputComponent type="radio" ref={ref} {...props} />;
   }) as ToggleInputComponentType,
   switch: forwardRef(function Switch<Value>(
      {
         label,
         errorText,
         infoText,
         disabled,
         onChange,
         checked: controlledChecked,
         required,
         ...props
      }: InternalToggleInputProps<Value>,
      ref: React.ForwardedRef<ToggleInputRef>,
   ) {
      const theme = useTheme();

      const styledComponentStyles = useStyledComponentStyles(props, theme, true);
      const styledComponentStylesWithExcluded = useComponentPropsWithExcludedStyle(props);
      const dataProps = useComponentPropsWithPrefix(props, "data");
      const ariaProps = useComponentPropsWithPrefix(props, "aria");
      const restProps = useComponentPropsWithoutStyle(props);

      const [internalChecked, setInternalChecked] = useBooleanState();

      const checked = controlledChecked ?? internalChecked;

      const onClickElement = useCallback(() => {
         if (disabled) return;

         const newValue = !checked;

         if (controlledChecked === undefined) setInternalChecked.setState(newValue);
         onChange?.(newValue);
      }, [disabled, checked, onChange, controlledChecked]);

      return (
         <Div.column width="100%" gap={theme.styles.gap / 2} {...styledComponentStylesWithExcluded}>
            {label && (
               <Text
                  as="label"
                  height={16}
                  fontSize={14}
                  color={errorText ? theme.colors.error : theme.colors.textSecondary}
               >
                  {label}

                  {required && (
                     <Text as="span" fontSize={16} color={theme.colors.error}>
                        {" "}
                        *
                     </Text>
                  )}
               </Text>
            )}

            <Div.row alignItems="center" gap={theme.styles.gap}>
               <SwitchElement
                  theme={theme}
                  checked={checked}
                  disabled={disabled ?? false}
                  onClick={onClickElement}
                  {...styledComponentStyles}
                  {...dataProps}
                  {...ariaProps}
                  {...restProps}
               />
            </Div.row>

            {(errorText || infoText) && (
               <Text
                  as="span"
                  display="block"
                  fontSize={14}
                  color={errorText ? theme.colors.error : theme.colors.textSecondary}
               >
                  {errorText || infoText}
               </Text>
            )}
         </Div.column>
      );
   }) as ToggleInputComponentType,
};
