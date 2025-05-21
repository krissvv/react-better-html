import React, { forwardRef, memo, useCallback, useState, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";

import { countries } from "../constants/countries";

import { ComponentHoverStyle, ComponentPropWithRef, ComponentStyle } from "../types/components";
import { AnyOtherString, OmitProps } from "../types/app";
import { Theme } from "../types/theme";
import { IconName } from "../types/icon";
import { Country } from "../types/countries";

import {
   useBooleanState,
   useComponentInputFieldDateProps,
   useComponentPropsWithExcludedStyle,
   useComponentPropsWithoutStyle,
   useComponentPropsWithPrefix,
   useDebounceState,
   useStyledComponentStyles,
} from "../utils/hooks";

import Text from "./Text";
import Div from "./Div";
import Icon from "./Icon";
import Button from "./Button";
import Label from "./Label";
import Dropdown, { DropdownOption } from "./Dropdown";
import Image from "./Image";
import { useTheme } from "./BetterHtmlProvider";

const InputElement = styled.input.withConfig({
   shouldForwardProp: (prop) => !["theme", "withLeftIcon", "withRightIcon", "normalStyle", "hoverStyle"].includes(prop),
})<{
   theme: Theme;
   withLeftIcon?: boolean;
   withRightIcon?: boolean;
   normalStyle: ComponentStyle;
   hoverStyle: ComponentStyle;
}>`
   position: relative;
   width: 100%;
   font-family: ${(props) => props.theme.styles.fontFamily};
   font-size: 16px;
   line-height: 20px;
   color: ${(props) => props.theme.colors.textPrimary};
   background: ${(props) => props.theme.colors.backgroundContent};
   border: 1px solid ${(props) => props.theme.colors.border};
   border-radius: ${(props) => props.theme.styles.borderRadius}px;
   outline: none;
   padding: ${(props) =>
      `${(props.theme.styles.space + props.theme.styles.gap) / 2}px ${
         props.theme.styles.space + props.theme.styles.gap
      }px`};
   padding-left: ${(props) =>
      props.withLeftIcon ? `${props.theme.styles.space + 16 + props.theme.styles.space - 1}px` : undefined};
   padding-right: ${(props) =>
      props.withRightIcon ? `${props.theme.styles.space + 16 + props.theme.styles.space - 1}px` : undefined};
   transition: ${(props) => props.theme.styles.transition};

   &::placeholder {
      color: ${(props) => props.theme.colors.textSecondary}80;
   }

   &:focus {
      border-color: ${(props) => props.theme.colors.primary};
   }

   &:disabled {
      filter: brightness(0.9);
      cursor: not-allowed;
   }

   &[type="date"]::-webkit-calendar-picker-indicator,
   &[type="datetime-local"]::-webkit-calendar-picker-indicator,
   &[type="time"]::-webkit-calendar-picker-indicator {
      display: none;
      -webkit-appearance: none;
   }

   &.react-better-html-phone-number-holder {
      border-right: none;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
   }

   &.react-better-html-phone-number {
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
   }

   &.react-better-html-dropdown {
      padding-right: ${(props) => props.theme.styles.space + 16 + props.theme.styles.space - 1}px;

      &.react-better-html-dropdown-open {
         border-bottom-left-radius: 0px;
         border-bottom-right-radius: 0px;
      }

      &.react-better-html-dropdown-open-late {
         z-index: 1001;
      }
   }

   &.react-better-html-inputField-dateTime-opened {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
   }

   &.react-better-html-inputField-dateTime-opened-late {
      z-index: 1001;
   }

   ${(props) => props.normalStyle as any}

   &:hover {
      ${(props) => props.hoverStyle as any}
   }
`;

const TextareaElement = styled.textarea.withConfig({
   shouldForwardProp: (prop) => !["theme", "withLeftIcon", "withRightIcon", "normalStyle", "hoverStyle"].includes(prop),
})<{
   theme: Theme;
   withLeftIcon?: boolean;
   withRightIcon?: boolean;
   normalStyle: ComponentStyle;
   hoverStyle: ComponentStyle;
}>`
   width: 100%;
   min-height: 3lh;
   max-height: 8lh;
   font-family: ${(props) => props.theme.styles.fontFamily};
   font-size: 16px;
   line-height: 20px;
   color: ${(props) => props.theme.colors.textPrimary};
   background: ${(props) => props.theme.colors.backgroundContent};
   border: 1px solid ${(props) => props.theme.colors.border};
   border-radius: ${(props) => props.theme.styles.borderRadius}px;
   outline: none;
   padding: ${(props) =>
      `${(props.theme.styles.gap + props.theme.styles.space) / 2}px ${
         props.theme.styles.space + props.theme.styles.gap
      }px`};
   padding-left: ${(props) =>
      props.withLeftIcon ? `${props.theme.styles.space + 16 + props.theme.styles.space - 1}px` : undefined};
   padding-right: ${(props) =>
      props.withRightIcon ? `${props.theme.styles.space + 16 + props.theme.styles.space - 1}px` : undefined};
   resize: vertical;
   transition: border-color ${(props) => props.theme.styles.transition};

   &::placeholder {
      color: ${(props) => props.theme.colors.textSecondary}80;
   }

   &:focus {
      border-color: ${(props) => props.theme.colors.primary};
   }

   ${(props) => props.normalStyle as any}

   &:hover {
      ${(props) => props.hoverStyle as any}
   }
`;

const hours = Array.from({ length: 24 }, (_, index) => index);
const minutes = Array.from({ length: 60 }, (_, index) => index);

export type InputFieldProps = {
   label?: string;
   labelColor?: string;
   errorText?: string;
   infoText?: string;
   leftIcon?: IconName | AnyOtherString;
   rightIcon?: IconName | AnyOtherString;
   insideInputFieldComponent?: React.ReactNode;
   /** @default false */
   withDebounce?: boolean;
   /** @default 0.5s */
   debounceDelay?: number;
   onChangeValue?: (value: string) => void;
   onClickRightIcon?: () => void;
   holderRef?: React.ForwardedRef<HTMLDivElement>;
} & OmitProps<React.ComponentProps<"input">, "style" | "ref"> &
   ComponentStyle &
   ComponentHoverStyle;

export type TextareaFieldProps = OmitProps<InputFieldProps, "type"> &
   OmitProps<React.ComponentProps<"textarea">, "style" | "ref">;

type InputFieldComponentType = {
   (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>): React.ReactElement;
   multiline: (props: ComponentPropWithRef<HTMLTextAreaElement, TextareaFieldProps>) => React.ReactElement;
   email: (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>) => React.ReactElement;
   password: (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>) => React.ReactElement;
   search: (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>) => React.ReactElement;
   phoneNumber: (
      props: ComponentPropWithRef<HTMLInputElement, OmitProps<InputFieldProps, "type">>,
   ) => React.ReactElement;
   date: (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>) => React.ReactElement;
   dateTime: (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>) => React.ReactElement;
   time: (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>) => React.ReactElement;
};

const InputFieldComponent: InputFieldComponentType = forwardRef(function InputField(
   {
      label,
      labelColor,
      errorText,
      infoText,
      leftIcon,
      rightIcon,
      insideInputFieldComponent,
      withDebounce,
      debounceDelay = 0.5,
      onChange,
      onChangeValue,
      onClickRightIcon,
      holderRef,
      required,
      placeholder,
      ...props
   }: InputFieldProps,
   ref: React.ForwardedRef<HTMLInputElement>,
) {
   const theme = useTheme();
   const [_, debouncedValue, setDebouncedValue] = useDebounceState<string>(
      props.value?.toString() ?? "",
      debounceDelay,
   );

   const styledComponentStylesWithoutExcluded = useStyledComponentStyles(props, theme, true);
   const styledComponentStylesWithExcluded = useComponentPropsWithExcludedStyle(props);
   const dataProps = useComponentPropsWithPrefix(props, "data");
   const ariaProps = useComponentPropsWithPrefix(props, "aria");
   const restProps = useComponentPropsWithoutStyle(props);

   const onChangeElement = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
         const newValue = event.target.value;

         if (withDebounce) {
            onChange?.(event);
            setDebouncedValue(newValue);
         } else {
            onChange?.(event);
            onChangeValue?.(newValue);
         }
      },
      [onChange, onChangeValue, withDebounce],
   );

   useEffect(() => {
      if (!withDebounce) return;

      onChangeValue?.(debouncedValue);
   }, [withDebounce, onChangeValue, debouncedValue]);

   return (
      <Div.column width="100%" gap={theme.styles.gap} {...styledComponentStylesWithExcluded} ref={holderRef}>
         {label && <Label text={label} color={labelColor} required={required} isError={!!errorText} />}

         <Div position="relative" width="100%">
            {leftIcon && (
               <Icon
                  name={leftIcon}
                  position="absolute"
                  top={46 / 2}
                  left={theme.styles.space + 1}
                  transform="translateY(-50%)"
                  pointerEvents="none"
                  zIndex={props.className?.includes("react-better-html-dropdown-open-late") ? 1002 : 1}
               />
            )}

            <InputElement
               theme={theme}
               withLeftIcon={leftIcon !== undefined}
               withRightIcon={rightIcon !== undefined}
               required={required}
               placeholder={placeholder ?? label}
               onChange={onChangeElement}
               {...styledComponentStylesWithoutExcluded}
               {...dataProps}
               {...ariaProps}
               {...restProps}
               ref={ref}
            />

            {rightIcon ? (
               onClickRightIcon ? (
                  <Button.icon
                     icon={rightIcon}
                     position="absolute"
                     top={46 / 2}
                     right={theme.styles.space + 1 - theme.styles.space / 2}
                     transform="translateY(-50%)"
                     onClick={onClickRightIcon}
                  />
               ) : (
                  <Icon
                     name={rightIcon}
                     position="absolute"
                     top={46 / 2}
                     right={theme.styles.space + 1}
                     transform="translateY(-50%)"
                     pointerEvents="none"
                  />
               )
            ) : undefined}

            {insideInputFieldComponent}
         </Div>

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
}) as any;

InputFieldComponent.multiline = forwardRef(function Multiline(
   {
      label,
      placeholder,
      errorText,
      infoText,
      leftIcon,
      rightIcon,
      onChange,
      onChangeValue,
      onClickRightIcon,
      required,
      ...props
   },
   ref,
) {
   const theme = useTheme();

   const styledComponentStyles = useStyledComponentStyles(props, theme);
   const dataProps = useComponentPropsWithPrefix(props, "data");
   const ariaProps = useComponentPropsWithPrefix(props, "aria");
   const restProps = useComponentPropsWithoutStyle(props);

   const onChangeElement = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
         onChange?.(event);
         onChangeValue?.(event.target.value);
      },
      [onChange, onChangeValue],
   );

   return (
      <Div.column gap={theme.styles.gap}>
         {label && <Label text={label} required={required} isError={!!errorText} />}

         <Div position="relative" width="100%">
            {leftIcon && (
               <Icon
                  name={leftIcon}
                  position="absolute"
                  top={46 / 2}
                  left={theme.styles.space + 1}
                  transform="translateY(-50%)"
                  pointerEvents="none"
               />
            )}

            <TextareaElement
               theme={theme}
               withLeftIcon={leftIcon !== undefined}
               withRightIcon={rightIcon !== undefined}
               required={required}
               placeholder={placeholder ?? label}
               onChange={onChangeElement}
               {...styledComponentStyles}
               {...dataProps}
               {...ariaProps}
               {...restProps}
               ref={ref}
            />

            {rightIcon ? (
               onClickRightIcon ? (
                  <Button.icon
                     icon={rightIcon}
                     position="absolute"
                     top={46 / 2}
                     right={theme.styles.space + 1 - theme.styles.space / 2}
                     transform="translateY(-50%)"
                     onClick={onClickRightIcon}
                  />
               ) : (
                  <Icon
                     name={rightIcon}
                     position="absolute"
                     top={46 / 2}
                     right={theme.styles.space + 1}
                     transform="translateY(-50%)"
                     pointerEvents="none"
                  />
               )
            ) : undefined}
         </Div>

         {(errorText || infoText) && (
            <Text
               as="span"
               display="block"
               marginTop={theme.styles.gap / 2}
               color={errorText ? theme.colors.error : props.labelColor ?? theme.colors.textSecondary}
               fontSize={14}
            >
               {errorText || infoText}
            </Text>
         )}
      </Div.column>
   );
}) as InputFieldComponentType["multiline"];

InputFieldComponent.email = forwardRef(function Email({ ...props }, ref) {
   return (
      <InputFieldComponent
         type="email"
         placeholder="your@email.here"
         autoComplete="email"
         autoCorrect="off"
         autoCapitalize="off"
         ref={ref}
         {...props}
      />
   );
}) as InputFieldComponentType["email"];

InputFieldComponent.password = forwardRef(function Password({ ...props }, ref) {
   const [isPassword, setIsPassword] = useBooleanState(true);

   return (
      <InputFieldComponent
         type={isPassword ? "password" : "text"}
         placeholder="******"
         rightIcon={isPassword ? "eye" : "eyeDashed"}
         onClickRightIcon={setIsPassword.toggle}
         autoComplete="current-password"
         autoCorrect="off"
         autoCapitalize="off"
         ref={ref}
         {...props}
      />
   );
}) as InputFieldComponentType["password"];

InputFieldComponent.search = forwardRef(function Search({ ...props }, ref) {
   return <InputFieldComponent leftIcon="magnifyingGlass" placeholder="Search..." ref={ref} {...props} />;
}) as InputFieldComponentType["search"];

InputFieldComponent.phoneNumber = forwardRef(function PhoneNumber(
   { label, value, onChangeValue, labelColor, ...props },
   ref,
) {
   const theme = useTheme();

   const [dropdownValue, setDropdownValue] = useState<string>();
   const [inputFieldValue, setInputFieldValue] = useState<string>(value?.toString() ?? "");

   const renderOption = useCallback(
      (option: DropdownOption<string, Country>, index: number, isSelected: boolean): React.ReactNode => (
         <Div.row alignItems="center" gap={theme.styles.gap}>
            <Image src={`https://flagcdn.com/w80/${option.data?.code.toString().toLowerCase()}.webp`} width={20} />
            <Text>{option.label}</Text>
         </Div.row>
      ),
      [],
   );
   const onChangeValueElement = useCallback(
      (value: string) => {
         const readyValue = value.replace(/\D/g, "");

         setInputFieldValue(readyValue);
         onChangeValue?.(dropdownValue ? `+${dropdownValue}${readyValue}` : readyValue);
      },
      [onChangeValue, dropdownValue],
   );

   const options = useMemo<DropdownOption<string, Country>[]>(
      () =>
         countries.map((country) => ({
            value: country.phoneNumberExtension,
            label: `+${country.phoneNumberExtension}`,
            data: country,
         })),
      [],
   );
   const defaultValue = useMemo<string>(() => {
      const thisTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const initialDefaultValue = options.find((option) => option.data?.timeZone === thisTimeZone)?.value ?? "";
      setDropdownValue(initialDefaultValue);

      return initialDefaultValue;
   }, [options]);

   useEffect(() => {
      if (value === undefined || value === null) return;

      const newValue = value.toString();

      const country = countries.find(
         (country) =>
            country.phoneNumberExtension ===
            newValue.slice(
               newValue.startsWith("+") ? 1 : 0,
               country.phoneNumberExtension.length + (newValue.startsWith("+") ? 1 : 0),
            ),
      );

      if (!country) {
         setInputFieldValue(newValue);
         return;
      }

      setDropdownValue(country.phoneNumberExtension);
      setInputFieldValue(newValue.slice(country?.phoneNumberExtension.length + 1));
   }, [value]);

   return (
      <Div.column width="100%" gap={theme.styles.gap}>
         {label && <Label text={label} color={labelColor} required={props.required} isError={!!props.errorText} />}

         <Div.row>
            <Dropdown
               options={options}
               renderOption={renderOption}
               width={130}
               minWidth={116}
               withSearch
               placeholder="+00"
               inputFieldClassName="react-better-html-phone-number-holder"
               defaultValue={defaultValue}
               value={dropdownValue}
               onChange={setDropdownValue}
               withoutClearButton
            />
            <InputFieldComponent
               placeholder={label ?? "Phone number"}
               className="react-better-html-phone-number"
               value={inputFieldValue}
               onChangeValue={onChangeValueElement}
               ref={ref}
               {...props}
            />
         </Div.row>
      </Div.column>
   );
}) as InputFieldComponentType["phoneNumber"];

InputFieldComponent.date = forwardRef(function Date({ className, onFocus, onBlur, ...props }, ref) {
   const theme = useTheme();

   const holderRef = useRef<HTMLDivElement>(null);

   const { internalValue, setInternalValue, inputFieldProps, insideInputFieldComponentProps } =
      useComponentInputFieldDateProps(props, holderRef);

   return (
      <InputFieldComponent
         type="date"
         insideInputFieldComponent={
            <Div
               position="absolute"
               top="100%"
               left={0}
               width="100%"
               maxHeight={300}
               backgroundColor={theme.colors.backgroundContent}
               borderBottomLeftRadius={theme.styles.borderRadius}
               borderBottomRightRadius={theme.styles.borderRadius}
               boxShadow="0px 10px 20px #00000020"
               overflowY="auto"
               {...insideInputFieldComponentProps}
            >
               Hello there
            </Div>
         }
         holderRef={holderRef}
         ref={ref}
         {...props}
         {...inputFieldProps}
      />
   );
}) as InputFieldComponentType["date"];

InputFieldComponent.dateTime = forwardRef(function DateTime({ className, onFocus, onBlur, ...props }, ref) {
   const theme = useTheme();

   const holderRef = useRef<HTMLDivElement>(null);

   const { internalValue, setInternalValue, inputFieldProps, insideInputFieldComponentProps } =
      useComponentInputFieldDateProps(props, holderRef);

   return (
      <InputFieldComponent
         type="datetime-local"
         insideInputFieldComponent={
            <Div
               position="absolute"
               top="100%"
               left={0}
               width="100%"
               maxHeight={300}
               backgroundColor={theme.colors.backgroundContent}
               borderBottomLeftRadius={theme.styles.borderRadius}
               borderBottomRightRadius={theme.styles.borderRadius}
               boxShadow="0px 10px 20px #00000020"
               overflowY="auto"
               {...insideInputFieldComponentProps}
            >
               Hello there
            </Div>
         }
         holderRef={holderRef}
         ref={ref}
         {...props}
         {...inputFieldProps}
      />
   );
}) as InputFieldComponentType["dateTime"];

InputFieldComponent.time = forwardRef(function Time({ ...props }, ref) {
   const theme = useTheme();

   const holderRef = useRef<HTMLDivElement>(null);
   const selectedHourRef = useRef<HTMLDivElement>(null);
   const selectedMinuteRef = useRef<HTMLDivElement>(null);

   const { internalValue, setInternalValue, inputFieldProps, insideInputFieldComponentProps, isOpen } =
      useComponentInputFieldDateProps(props, holderRef);

   const onClickHour = useCallback(
      (hour: number) => {
         const value = `${hour.toString().padStart(2, "0")}:${internalValue?.toString().split(":")[1] || "00"}`;

         inputFieldProps.onChangeValue?.(value);
         setInternalValue(value);
      },
      [internalValue, inputFieldProps.onChangeValue],
   );
   const onClickMinute = useCallback(
      (minute: number) => {
         const value = `${internalValue?.toString().split(":")[0] || "00"}:${minute.toString().padStart(2, "0")}`;

         inputFieldProps.onChangeValue?.(value);
         setInternalValue(value);
      },
      [internalValue, inputFieldProps.onChangeValue],
   );

   useEffect(() => {
      if (isOpen && selectedHourRef.current)
         selectedHourRef.current.scrollIntoView({ block: "nearest", behavior: "instant" });

      if (isOpen && selectedMinuteRef.current)
         selectedMinuteRef.current.scrollIntoView({ block: "nearest", behavior: "instant" });
   }, [isOpen]);

   const valueHour = parseInt(internalValue?.toString().split(":")?.[0]).toString();
   const valueMinute = parseInt(internalValue?.toString().split(":")?.[1]).toString();

   const buttonWidth = 50;

   return (
      <InputFieldComponent
         type="time"
         insideInputFieldComponent={
            <Div
               position="absolute"
               top="100%"
               left={0}
               width={buttonWidth * 2 + 2}
               height={300}
               backgroundColor={theme.colors.backgroundContent}
               borderBottomLeftRadius={theme.styles.borderRadius}
               borderBottomRightRadius={theme.styles.borderRadius}
               boxShadow="0px 10px 20px #00000020"
               overflowY="auto"
               {...insideInputFieldComponentProps}
            >
               <Div.row height="100%">
                  <Div className="react-better-html-no-scrollbar" width={buttonWidth} height="100%" overflowY="auto">
                     {hours.map((hour) => {
                        const isSelected = hour.toString() === valueHour;

                        return (
                           <Div.row
                              alignItems="center"
                              justifyContent="center"
                              color={isSelected ? theme.colors.base : theme.colors.textPrimary}
                              backgroundColor={isSelected ? theme.colors.primary : theme.colors.backgroundContent}
                              filterHover="brightness(0.9)"
                              cursor="pointer"
                              padding={`${theme.styles.space / 2}px ${theme.styles.space + theme.styles.gap}px`}
                              value={hour}
                              onClickWithValue={onClickHour}
                              ref={isSelected ? selectedHourRef : undefined}
                              key={hour}
                           >
                              <Text textAlign="center">{hour.toString().padStart(2, "0")}</Text>
                           </Div.row>
                        );
                     })}
                  </Div>

                  <Div className="react-better-html-no-scrollbar" width={buttonWidth} height="100%" overflowY="auto">
                     {minutes.map((minute) => {
                        const isSelected = minute.toString() === valueMinute;

                        return (
                           <Div.row
                              alignItems="center"
                              justifyContent="center"
                              color={isSelected ? theme.colors.base : theme.colors.textPrimary}
                              backgroundColor={isSelected ? theme.colors.primary : theme.colors.backgroundContent}
                              filterHover="brightness(0.9)"
                              cursor="pointer"
                              padding={`${theme.styles.space / 2}px ${theme.styles.space + theme.styles.gap}px`}
                              value={minute}
                              onClickWithValue={onClickMinute}
                              ref={isSelected ? selectedMinuteRef : undefined}
                              key={minute}
                           >
                              <Text textAlign="center">{minute.toString().padStart(2, "0")}</Text>
                           </Div.row>
                        );
                     })}
                  </Div>
               </Div.row>
            </Div>
         }
         holderRef={holderRef}
         ref={ref}
         {...props}
         {...inputFieldProps}
         minWidth={buttonWidth * 2 + 2}
      />
   );
}) as InputFieldComponentType["time"];

const InputField = memo(InputFieldComponent) as any as typeof InputFieldComponent & {
   multiline: typeof InputFieldComponent.multiline;
   email: typeof InputFieldComponent.email;
   password: typeof InputFieldComponent.password;
   search: typeof InputFieldComponent.search;
   phoneNumber: typeof InputFieldComponent.phoneNumber;
   date: typeof InputFieldComponent.date;
   dateTime: typeof InputFieldComponent.dateTime;
   time: typeof InputFieldComponent.time;
};

InputField.multiline = InputFieldComponent.multiline;
InputField.email = InputFieldComponent.email;
InputField.password = InputFieldComponent.password;
InputField.search = InputFieldComponent.search;
InputField.phoneNumber = InputFieldComponent.phoneNumber;
InputField.date = InputFieldComponent.date;
InputField.dateTime = InputFieldComponent.dateTime;
InputField.time = InputFieldComponent.time;

export default InputField;
