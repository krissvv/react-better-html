import { forwardRef, useCallback, useId, useState } from "react";
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
import Label from "./Label";
import { useTheme } from "./BetterHtmlProvider";

const componentSize = 26;
const switchComponentBallGap = 3;
const switchComponentMouseDownDifference = 4;

const InputElement = styled.input.withConfig({
   shouldForwardProp: (prop) => !["theme", "normalStyle", "hoverStyle"].includes(prop),
})<{ theme: Theme; normalStyle: ComponentStyle; hoverStyle: ComponentStyle }>`
   position: relative;
   appearance: none;
   width: ${componentSize}px;
   height: ${componentSize}px;
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
      border-color: ${(props) => props.theme.colors.primary};

      ${(props) => props.hoverStyle as any}
   }
`;

const SwitchElement = styled.div.withConfig({
   shouldForwardProp: (prop) =>
      !["theme", "checked", "disabled", "isMouseDown", "normalStyle", "hoverStyle"].includes(prop),
})<{
   theme: Theme;
   checked: boolean;
   disabled: boolean;
   isMouseDown: boolean;
   normalStyle: ComponentStyle;
   hoverStyle: ComponentStyle;
}>`
   --width: ${(props) => componentSize * 2 - props.theme.styles.gap / 2}px;
   --ball-size: ${componentSize - switchComponentBallGap * 2}px;

   position: relative;
   width: var(--width);
   height: ${componentSize}px;
   background-color: ${(props) => (props.checked ? props.theme.colors.primary : props.theme.colors.border)};
   border-radius: 999px;
   cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
   opacity: ${(props) => (props.disabled ? 0.5 : 1)};
   transition: ${(props) => props.theme.styles.transition};

   &::before {
      content: "";
      position: absolute;
      width: ${(props) =>
         componentSize - switchComponentBallGap * 2 + (props.isMouseDown ? switchComponentMouseDownDifference : 0)}px;
      height: ${componentSize - switchComponentBallGap * 2}px;
      background-color: ${(props) => props.theme.colors.base};
      border-radius: 999px;
      top: ${switchComponentBallGap}px;
      left: ${switchComponentBallGap}px;
      transform: translateX(
         ${(props) =>
            props.checked
               ? `calc(var(--width) - ${
                    componentSize + (props.isMouseDown ? switchComponentMouseDownDifference : 0)
                 }px)`
               : "0px"}
      );
      transition: ${(props) => props.theme.styles.transition};
   }

   &.react-better-html-color-theme-switch-with-moon {
      &::after {
         content: "";
         position: absolute;
         width: ${(props) =>
            componentSize -
            switchComponentBallGap * 2 +
            (props.isMouseDown ? switchComponentMouseDownDifference : 0)}px;
         height: ${componentSize - switchComponentBallGap * 2}px;
         background-color: ${(props) => (props.checked ? props.theme.colors.primary : "transparent")};
         border-radius: 999px;
         top: ${switchComponentBallGap}px;
         left: ${switchComponentBallGap}px;
         transform: translateX(
            ${(props) =>
               props.checked
                  ? `calc(var(--width) - ${
                       componentSize + (props.isMouseDown ? switchComponentMouseDownDifference * 2 : 0)
                    }px - calc(var(--ball-size) / 3))`
                  : "0px"}
         );
         transition: ${(props) => props.theme.styles.transition};
      }
   }

   ${(props) => props.normalStyle as any}

   &:hover {
      ${(props) => props.hoverStyle as any}
   }
`;

export type ToggleInputRef = {};

type InternalToggleInputProps<Value> = {
   label?: string;
   labelColor?: string;
   text?: string;
   textAdvanced?: React.ReactNode;
   errorText?: string;
   infoText?: string;
   value?: Value;
   onChange?: (checked: boolean, value?: Value) => void;
} & OmitProps<React.ComponentProps<"input">, "style" | "value" | "ref" | "onChange"> &
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
      labelColor,
      text,
      textAdvanced,
      errorText,
      infoText,
      value,
      onChange,
      checked: controlledChecked,
      color,
      required,
      id,
      ...props
   }: InternalToggleInputProps<Value>,
   ref: React.ForwardedRef<ToggleInputRef>,
) {
   const theme = useTheme();
   const internalId = useId();

   const styledComponentStyles = useStyledComponentStyles(props, theme, true);
   const styledComponentStylesWithExcluded = useComponentPropsWithExcludedStyle(props);
   const dataProps = useComponentPropsWithPrefix(props, "data");
   const ariaProps = useComponentPropsWithPrefix(props, "aria");
   const restProps = useComponentPropsWithoutStyle(props);

   const [internalChecked, setInternalChecked] = useState(false);

   const onChangeElement = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
         const newIsChecked = event.target.checked;

         if (controlledChecked === undefined) setInternalChecked(newIsChecked);
         onChange?.(newIsChecked, value);
      },
      [onChange, controlledChecked, value],
   );

   const checked = controlledChecked ?? internalChecked;

   const onClickText = useCallback(() => {
      const newIsChecked = !checked;

      if (controlledChecked === undefined) setInternalChecked(newIsChecked);
      onChange?.(newIsChecked, value);
   }, [checked, controlledChecked, onChange, value]);

   const readyId = id ?? internalId;

   return (
      <Div.column gap={theme.styles.gap} {...styledComponentStylesWithExcluded}>
         {label && (
            <Label text={label} color={labelColor} required={required} isError={!!errorText} htmlFor={readyId} />
         )}

         <Div.row alignItems="center" gap={theme.styles.gap}>
            <Div.row position="relative" alignItems="center">
               <InputElement
                  theme={theme}
                  type={props.type ?? "checkbox"}
                  checked={checked}
                  onChange={onChangeElement}
                  id={readyId}
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

            {text ? (
               <Text color={color} userSelect="none" cursor="pointer" onClick={onClickText}>
                  {text}
                  {required && !label && (
                     <Text as="span" fontSize={16} color={theme.colors.error}>
                        {" "}
                        *
                     </Text>
                  )}
               </Text>
            ) : textAdvanced ? (
               <Div.row userSelect="none" cursor="pointer" onClick={onClickText}>
                  {textAdvanced}

                  {required && !label && (
                     <Text as="span" fontSize={16} color={theme.colors.error} marginLeft={4}>
                        {" "}
                        *
                     </Text>
                  )}
               </Div.row>
            ) : undefined}
         </Div.row>

         {(errorText || infoText) && (
            <Text
               as="span"
               display="block"
               fontSize={14}
               color={errorText ? theme.colors.error : labelColor ?? theme.colors.textSecondary}
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
         labelColor,
         errorText,
         infoText,
         disabled,
         value,
         onChange,
         checked: controlledChecked,
         required,
         id,
         ...props
      }: InternalToggleInputProps<Value>,
      ref: React.ForwardedRef<ToggleInputRef>,
   ) {
      const theme = useTheme();
      const internalId = useId();

      const styledComponentStyles = useStyledComponentStyles(props, theme, true);
      const styledComponentStylesWithExcluded = useComponentPropsWithExcludedStyle(props);
      const dataProps = useComponentPropsWithPrefix(props, "data");
      const ariaProps = useComponentPropsWithPrefix(props, "aria");
      const restProps = useComponentPropsWithoutStyle(props);

      const [internalChecked, setInternalChecked] = useBooleanState();
      const [isMouseDown, setIsMouseDown] = useBooleanState();

      const checked = controlledChecked ?? internalChecked;

      const onClickElement = useCallback(() => {
         if (disabled) return;

         const newIsChecked = !checked;

         if (controlledChecked === undefined) setInternalChecked.setState(newIsChecked);
         onChange?.(newIsChecked, value);
      }, [disabled, checked, onChange, controlledChecked, value]);

      const readyId = id ?? internalId;

      return (
         <Div.column width="fit-content" gap={theme.styles.gap} {...styledComponentStylesWithExcluded}>
            {label && (
               <Label text={label} color={labelColor} required={required} isError={!!errorText} htmlFor={readyId} />
            )}

            <Div.row
               alignItems="center"
               gap={theme.styles.gap}
               borderRadius={999}
               isTabAccessed
               onClick={onClickElement}
               onMouseDown={setIsMouseDown.setTrue}
               onMouseUp={setIsMouseDown.setFalse}
               onMouseOut={setIsMouseDown.setFalse}
               onTouchStart={setIsMouseDown.setTrue}
               onTouchEnd={setIsMouseDown.setFalse}
               onTouchCancel={setIsMouseDown.setFalse}
            >
               <SwitchElement
                  theme={theme}
                  checked={checked}
                  disabled={disabled ?? false}
                  isMouseDown={isMouseDown}
                  id={readyId}
                  role="switch"
                  aria-checked={checked}
                  aria-disabled={disabled ?? false}
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
                  color={errorText ? theme.colors.error : labelColor ?? theme.colors.textSecondary}
               >
                  {errorText || infoText}
               </Text>
            )}
         </Div.column>
      );
   }) as ToggleInputComponentType,
};
