import { forwardRef, useCallback, useId, useState } from "react";
import { ColorTheme, OmitProps, Theme, useBetterCoreContext, useBooleanState, useTheme } from "react-better-core";
import styled, { css } from "styled-components";

import { ComponentHoverStyle, ComponentPropWithRef, ComponentStyle } from "../types/components";

import { useComponentPropsGrouper, useComponentPropsWithPrefix, useComponentsPropsMerger } from "../utils/hooks";

import Text from "./Text";
import Div from "./Div";
import Icon from "./Icon";
import Label from "./Label";
import { useBetterHtmlContextInternal } from "./BetterHtmlProvider";

const componentSize = 26;
const switchComponentBallGap = 3;
const switchComponentMouseDownDifference = 4;

const InputElement = styled.input.withConfig({
   shouldForwardProp: (prop) => !["theme", "colorTheme", "style", "hoverStyle", "size", "withNoBorder"].includes(prop),
})<{
   theme: Theme;
   colorTheme?: ColorTheme;
   style: ComponentStyle;
   hoverStyle: ComponentStyle;
   size?: number;
   withNoBorder?: boolean;
}>`
   position: relative;
   appearance: none;
   width: ${(props) => props.size ?? componentSize}px;
   height: ${(props) => props.size ?? componentSize}px;
   background-color: ${(props) => props.theme.colors.backgroundContent};
   border: ${(props) => props.theme.styles.borderWidth}px solid ${(props) => props.theme.colors.border};
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

   ${(props) => props.style as any}

   &:hover {
      ${(props) =>
         props.withNoBorder
            ? css`
                 filter: ${props.colorTheme === "dark" ? "brightness(1.2)" : "brightness(0.9)"};
              `
            : css`
                 border-color: ${props.theme.colors.primary};
              `}

      ${(props) => props.hoverStyle as any}
   }
`;

const SwitchElement = styled.div.withConfig({
   shouldForwardProp: (prop) => !["theme", "checked", "disabled", "isMouseDown", "style", "hoverStyle"].includes(prop),
})<{
   theme: Theme;
   checked: boolean;
   disabled: boolean;
   isMouseDown: boolean;
   style: ComponentStyle;
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

   ${(props) => props.style as any}

   &:hover {
      ${(props) => props.hoverStyle as any}
   }
`;

export type ToggleInputRef = {};

type InternalToggleInputProps<Value> = {
   label?: string;
   labelFontFamily?: React.CSSProperties["fontFamily"];
   labelFontSize?: React.CSSProperties["fontSize"];
   labelLetterSpacing?: React.CSSProperties["letterSpacing"];
   labelTextTransform?: React.CSSProperties["textTransform"];
   labelColor?: React.CSSProperties["color"];
   labelGap?: React.CSSProperties["gap"];
   text?: string;
   textFontFamily?: React.CSSProperties["fontFamily"];
   textFontSize?: React.CSSProperties["fontSize"];
   textLetterSpacing?: React.CSSProperties["letterSpacing"];
   textTextTransform?: React.CSSProperties["textTransform"];
   textAdvanced?: React.ReactNode;
   errorText?: string;
   infoText?: string;
   /** @default 26 */
   size?: number;
   value?: Value;
   onChange?: (checked: boolean, value?: Value) => void;
} & OmitProps<React.ComponentProps<"input">, "style" | "value" | "ref" | "onChange" | "size"> &
   ComponentStyle &
   ComponentHoverStyle;

export type ToggleInputProps<Value = unknown> = ComponentPropWithRef<
   ToggleInputRef,
   OmitProps<InternalToggleInputProps<Value>, "type">
>;
type ToggleInputComponentType = <Value>(props: ToggleInputProps<Value>) => React.ReactElement;

const ToggleInputComponent = forwardRef(function ToggleInput<Value>(
   {
      label,
      labelFontFamily,
      labelFontSize,
      labelLetterSpacing,
      labelTextTransform,
      labelColor,
      labelGap,
      text,
      textFontFamily,
      textFontSize,
      textLetterSpacing,
      textTextTransform,
      textAdvanced,
      errorText,
      infoText,
      size,
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
   const { colorTheme } = useBetterCoreContext();

   const { style, hoverStyle, excludeStyle, restProps } = useComponentPropsGrouper(props, true);
   const dataProps = useComponentPropsWithPrefix(restProps, "data");
   const ariaProps = useComponentPropsWithPrefix(restProps, "aria");

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
      <Div.column gap={labelGap ?? theme.styles.gap} {...excludeStyle}>
         {label && (
            <Label
               text={label}
               fontFamily={labelFontFamily}
               fontSize={labelFontSize}
               letterSpacing={labelLetterSpacing}
               textTransform={labelTextTransform}
               color={labelColor}
               required={required}
               isError={!!errorText}
               htmlFor={readyId}
            />
         )}

         <Div.row alignItems="center" gap={theme.styles.gap}>
            <Div.row position="relative" alignItems="center">
               <InputElement
                  theme={theme}
                  colorTheme={colorTheme}
                  size={size}
                  withNoBorder={theme.styles.borderWidth === 0}
                  type={props.type ?? "checkbox"}
                  checked={checked}
                  onChange={onChangeElement}
                  id={readyId}
                  style={style}
                  hoverStyle={hoverStyle}
                  {...restProps}
                  {...dataProps}
                  {...ariaProps}
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
               <Text
                  fontFamily={textFontFamily}
                  fontSize={textFontSize}
                  letterSpacing={textLetterSpacing}
                  textTransform={textTextTransform}
                  color={color}
                  userSelect="none"
                  cursor="pointer"
                  onClick={onClickText}
               >
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
               color={errorText ? theme.colors.error : (labelColor ?? theme.colors.textSecondary)}
            >
               {errorText || infoText}
            </Text>
         )}
      </Div.column>
   );
}) as <Value>(props: ComponentPropWithRef<ToggleInputRef, InternalToggleInputProps<Value>>) => React.ReactElement;

export default {
   checkbox: forwardRef(function Checkbox<Value>(
      checkboxProps: ToggleInputProps<Value>,
      ref: React.ForwardedRef<ToggleInputRef>,
   ) {
      const betterHtmlContextInternal = useBetterHtmlContextInternal();
      const props = useComponentsPropsMerger(
         betterHtmlContextInternal.components.toggleInput?.style?.checkbox as ToggleInputProps<Value>,
         checkboxProps,
      );

      return <ToggleInputComponent type="checkbox" ref={ref} {...props} />;
   }) as ToggleInputComponentType,
   radiobutton: forwardRef(function RadioButton<Value>(
      radiobuttonProps: ToggleInputProps<Value>,
      ref: React.ForwardedRef<ToggleInputRef>,
   ) {
      const betterHtmlContextInternal = useBetterHtmlContextInternal();
      const props = useComponentsPropsMerger(
         betterHtmlContextInternal.components.toggleInput?.style?.radiobutton as ToggleInputProps<Value>,
         radiobuttonProps,
      );

      return <ToggleInputComponent type="radio" ref={ref} {...props} />;
   }) as ToggleInputComponentType,
   switch: forwardRef(function Switch<Value>(
      switchProps: InternalToggleInputProps<Value>,
      ref: React.ForwardedRef<ToggleInputRef>,
   ) {
      const betterHtmlContextInternal = useBetterHtmlContextInternal();
      const {
         label,
         labelFontFamily,
         labelFontSize,
         labelLetterSpacing,
         labelTextTransform,
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
      } = useComponentsPropsMerger(
         betterHtmlContextInternal.components.toggleInput?.style?.switch as InternalToggleInputProps<Value>,
         switchProps,
      );

      const theme = useTheme();
      const internalId = useId();

      const { style, hoverStyle, excludeStyle, restProps } = useComponentPropsGrouper(props, true);
      const dataProps = useComponentPropsWithPrefix(restProps, "data");
      const ariaProps = useComponentPropsWithPrefix(restProps, "aria");

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
         <Div.column width="fit-content" gap={theme.styles.gap} {...excludeStyle}>
            {label && (
               <Label
                  text={label}
                  fontFamily={labelFontFamily}
                  fontSize={labelFontSize}
                  letterSpacing={labelLetterSpacing}
                  textTransform={labelTextTransform}
                  color={labelColor}
                  required={required}
                  isError={!!errorText}
                  htmlFor={readyId}
               />
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
                  style={style}
                  hoverStyle={hoverStyle}
                  {...restProps}
                  {...dataProps}
                  {...ariaProps}
               />
            </Div.row>

            {(errorText || infoText) && (
               <Text
                  as="span"
                  display="block"
                  fontSize={14}
                  color={errorText ? theme.colors.error : (labelColor ?? theme.colors.textSecondary)}
               >
                  {errorText || infoText}
               </Text>
            )}
         </Div.column>
      );
   }) as ToggleInputComponentType,
};
