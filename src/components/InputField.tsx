import { forwardRef, memo, useCallback, useState, useEffect, useMemo, useRef, useId } from "react";
import {
   AnyOtherString,
   Country,
   darkenColor,
   lightenColor,
   OmitProps,
   useBooleanState,
   useDebounceState,
   countries,
   IconName,
   Theme,
   useTheme,
   useBetterCoreContext,
} from "react-better-core";
import styled from "styled-components";

import { isMobileDevice } from "../constants";

import { ComponentHoverStyle, ComponentPropWithRef, ComponentStyle } from "../types/components";

import { useComponentInputFieldDateProps, useComponentPropsGrouper, useComponentPropsWithPrefix } from "../utils/hooks";
import { getBrowser } from "../utils/functions";

import Text from "./Text";
import Div from "./Div";
import Icon from "./Icon";
import Button from "./Button";
import Label from "./Label";
import Dropdown, { DropdownOption } from "./Dropdown";
import Image from "./Image";
import Calendar from "./Calendar";

const buttonWidth = 50;
const colorPickerSpacing = 4;
const colorPickerColorWidth = 12 + 27 + colorPickerSpacing;
const colorPickerValueWidth = 12 + 74 + colorPickerSpacing;

const InputElement = styled.input.withConfig({
   shouldForwardProp: (prop) =>
      !["theme", "withLeftIcon", "withRightIcon", "withPrefix", "withSuffix", "style", "hoverStyle"].includes(prop),
})<{
   theme: Theme;
   withLeftIcon?: boolean;
   withRightIcon?: boolean;
   withPrefix?: boolean;
   withSuffix?: boolean;
   style: ComponentStyle;
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
   border-top-left-radius: ${(props) => (props.withPrefix ? 0 : undefined)};
   border-bottom-left-radius: ${(props) => (props.withPrefix ? 0 : undefined)};
   border-top-right-radius: ${(props) => (props.withSuffix ? 0 : undefined)};
   border-bottom-right-radius: ${(props) => (props.withSuffix ? 0 : undefined)};
   outline: none;
   padding: ${(props) => `${(props.theme.styles.space + props.theme.styles.gap) / 2}px ${props.theme.styles.space}px`};
   padding-left: ${(props) =>
      props.withLeftIcon
         ? `${props.theme.styles.space + 16 + props.theme.styles.space - 1}px`
         : props.withPrefix
         ? `${props.theme.styles.space}px`
         : undefined};
   padding-right: ${(props) =>
      props.withRightIcon
         ? `${props.theme.styles.space + 16 + props.theme.styles.space - 1}px`
         : props.withSuffix
         ? `${props.theme.styles.space}px`
         : undefined};
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

   &:read-only {
      caret-color: transparent;
   }

   &::-webkit-outer-spin-button,
   &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
   }

   &[type="number"] {
      -moz-appearance: textfield;
   }

   &[type="date"],
   &[type="datetime-local"],
   &[type="time"] {
      min-height: 48px;
      -webkit-appearance: none;
      -moz-appearance: textfield;

      &::-webkit-calendar-picker-indicator {
         display: none;
         -webkit-appearance: none;
      }

      &::-webkit-date-and-time-value {
         text-align: left !important;
      }
   }

   &[type="color"] {
      --color-spacing: ${(props) => (props.theme.styles.space + props.theme.styles.gap) / 2}px;

      width: calc(var(--color-spacing) + 27px + ${colorPickerValueWidth}px);
      height: 48px;
      padding: 0px;
      padding-block: calc(var(--color-spacing) - 3px);
      padding-left: var(--color-spacing);
      padding-right: ${colorPickerValueWidth}px;
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

      &.react-better-html-dropdown-multiselect {
         border-top: none;
         border-top-left-radius: 0px;
         border-top-right-radius: 0px;
      }

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

   ${(props) => props.style as any}

   &:hover {
      ${(props) => props.hoverStyle as any}
   }
`;

const TextareaElement = styled.textarea.withConfig({
   shouldForwardProp: (prop) => !["theme", "withLeftIcon", "withRightIcon", "style", "hoverStyle"].includes(prop),
})<{
   theme: Theme;
   withLeftIcon?: boolean;
   withRightIcon?: boolean;
   style: ComponentStyle;
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
   padding: ${(props) => `${(props.theme.styles.gap + props.theme.styles.space) / 2}px ${props.theme.styles.space}px`};
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

   ${(props) => props.style as any}

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
   prefix?: React.ReactNode;
   prefixBackgroundColor?: string;
   suffix?: React.ReactNode;
   suffixBackgroundColor?: string;
   insideInputFieldBeforeComponent?: React.ReactNode;
   insideInputFieldAfterComponent?: React.ReactNode;
   /** @default false */
   withDebounce?: boolean;
   /** @default 0.5s */
   debounceDelay?: number;
   onChangeValue?: (value: string) => void;
   onClickRightIcon?: () => void;
   holderRef?: React.ForwardedRef<HTMLDivElement>;
} & OmitProps<React.ComponentProps<"input">, "style" | "ref" | "prefix"> &
   ComponentStyle &
   ComponentHoverStyle;

export type TextareaFieldProps = OmitProps<InputFieldProps, "type"> &
   OmitProps<React.ComponentProps<"textarea">, "style" | "ref">;

type InputFieldComponentType = {
   (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>): React.ReactElement;
   multiline: (props: ComponentPropWithRef<HTMLTextAreaElement, TextareaFieldProps>) => React.ReactElement;
   email: (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>) => React.ReactElement;
   password: (
      props: ComponentPropWithRef<
         HTMLInputElement,
         OmitProps<InputFieldProps, "autoComplete"> & {
            /** @default "current-password" */
            autoComplete?: React.ComponentProps<"input">["autoComplete"];
         }
      >,
   ) => React.ReactElement;
   search: (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>) => React.ReactElement;
   phoneNumber: (
      props: ComponentPropWithRef<HTMLInputElement, OmitProps<InputFieldProps, "type" | "prefix">>,
   ) => React.ReactElement;
   date: (
      props: ComponentPropWithRef<
         HTMLInputElement,
         InputFieldProps & {
            minDate?: Date;
            maxDate?: Date;
         }
      >,
   ) => React.ReactElement;
   dateTime: (
      props: ComponentPropWithRef<
         HTMLInputElement,
         InputFieldProps & {
            minDate?: Date;
            maxDate?: Date;
            /** @default today */
            defaultDateAfterTimePick?: `${number}-${number}-${number}`;
            /** @default "00:00" */
            defaultTimeAfterDatePick?: `${number}:${number}`;
         }
      >,
   ) => React.ReactElement;
   time: (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>) => React.ReactElement;
   color: (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>) => React.ReactElement;
};

const InputFieldComponent: InputFieldComponentType = forwardRef(function InputField(
   {
      label,
      labelColor,
      errorText,
      infoText,
      leftIcon,
      rightIcon,
      prefix,
      prefixBackgroundColor,
      suffix,
      suffixBackgroundColor,
      insideInputFieldBeforeComponent,
      insideInputFieldAfterComponent,
      withDebounce,
      debounceDelay = 0.5,
      onChange,
      onChangeValue,
      onClickRightIcon,
      holderRef,
      required,
      placeholder,
      id,
      ...props
   }: InputFieldProps,
   ref: React.ForwardedRef<HTMLInputElement>,
) {
   const theme = useTheme();
   const internalId = useId();
   const { colorTheme } = useBetterCoreContext();
   const [_, debouncedValue, setDebouncedValue] = useDebounceState<string>(
      props.value?.toString() ?? "",
      debounceDelay,
   );

   const { style, hoverStyle, excludeStyle, restProps } = useComponentPropsGrouper(props, true);
   const dataProps = useComponentPropsWithPrefix(restProps, "data");
   const ariaProps = useComponentPropsWithPrefix(restProps, "aria");

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

   const leftIconZIndex = useMemo(
      () =>
         ["react-better-html-dropdown-open-late", "react-better-html-inputField-dateTime-opened-late"].some(
            (classNameItem) => props.className?.includes(classNameItem),
         )
            ? 1002
            : 1,
      [props.className],
   );

   useEffect(() => {
      if (!withDebounce) return;

      onChangeValue?.(debouncedValue);
   }, [withDebounce, onChangeValue, debouncedValue]);

   const readyId = id ?? internalId;

   return (
      <Div.column width="100%" gap={theme.styles.gap / 2} {...excludeStyle}>
         {label && (
            <Label text={label} color={labelColor} required={required} isError={!!errorText} htmlFor={readyId} />
         )}

         <Div.row alignItems="stretch" width="100%">
            {prefix && (
               <Div.row
                  alignItems="center"
                  justifyContent="center"
                  border={`1px solid ${theme.colors.border}`}
                  borderRight="none"
                  backgroundColor={
                     prefixBackgroundColor ??
                     (colorTheme === "light"
                        ? darkenColor(theme.colors.backgroundContent, 0.03)
                        : lightenColor(theme.colors.backgroundContent, 0.1))
                  }
                  borderTopLeftRadius={theme.styles.borderRadius}
                  borderBottomLeftRadius={theme.styles.borderRadius}
                  paddingInline={theme.styles.space}
               >
                  {prefix}
               </Div.row>
            )}

            <Div position="relative" width="100%" height="fit-content" ref={holderRef}>
               {insideInputFieldBeforeComponent}

               <Div position="relative" width="100%" height="fit-content">
                  {leftIcon && (
                     <Icon
                        name={leftIcon}
                        position="absolute"
                        top={
                           (props.type === "date" || props.type === "time" || props.type === "datetime-local"
                              ? 48
                              : 46) / 2
                        }
                        left={theme.styles.space + 1}
                        transform="translateY(-50%)"
                        pointerEvents="none"
                        zIndex={leftIconZIndex}
                     />
                  )}

                  <InputElement
                     theme={theme}
                     withLeftIcon={leftIcon !== undefined}
                     withRightIcon={rightIcon !== undefined}
                     withPrefix={prefix !== undefined}
                     withSuffix={suffix !== undefined}
                     required={required}
                     placeholder={placeholder ?? label}
                     id={readyId}
                     onChange={onChangeElement}
                     style={style}
                     hoverStyle={hoverStyle}
                     {...restProps}
                     {...dataProps}
                     {...ariaProps}
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

                  {insideInputFieldAfterComponent}
               </Div>
            </Div>

            {suffix && (
               <Div.row
                  alignItems="center"
                  justifyContent="center"
                  border={`1px solid ${theme.colors.border}`}
                  borderLeft="none"
                  backgroundColor={
                     suffixBackgroundColor ??
                     (colorTheme === "light"
                        ? darkenColor(theme.colors.backgroundContent, 0.03)
                        : lightenColor(theme.colors.backgroundContent, 0.1))
                  }
                  borderTopRightRadius={theme.styles.borderRadius}
                  borderBottomRightRadius={theme.styles.borderRadius}
                  paddingInline={theme.styles.space}
               >
                  {suffix}
               </Div.row>
            )}
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
      id,
      ...props
   },
   ref,
) {
   const theme = useTheme();
   const internalId = useId();

   const { style, hoverStyle, restProps } = useComponentPropsGrouper(props);
   const dataProps = useComponentPropsWithPrefix(restProps, "data");
   const ariaProps = useComponentPropsWithPrefix(restProps, "aria");

   const onChangeElement = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
         onChange?.(event);
         onChangeValue?.(event.target.value);
      },
      [onChange, onChangeValue],
   );

   const readyId = id ?? internalId;

   return (
      <Div.column gap={theme.styles.gap / 2}>
         {label && <Label text={label} required={required} isError={!!errorText} htmlFor={readyId} />}

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
               id={readyId}
               style={style}
               hoverStyle={hoverStyle}
               {...restProps}
               {...dataProps}
               {...ariaProps}
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

InputFieldComponent.search = forwardRef(function Search({ value, onChangeValue, onFocus, onBlur, ...props }, ref) {
   const [inputFieldValue, setInputFieldValue] = useState<string>(value?.toString() ?? "");
   const [inputFieldFocused, setInputFieldFocused] = useBooleanState();

   const onChangeValueElement = useCallback(
      (value: string) => {
         setInputFieldValue(value);
         onChangeValue?.(value);
      },
      [onChangeValue],
   );
   const onFocusElement = useCallback(
      (event: React.FocusEvent<HTMLInputElement, Element>) => {
         setInputFieldFocused.setTrue();
         onFocus?.(event);
      },
      [onFocus],
   );
   const onBlurElement = useCallback(
      (event: React.FocusEvent<HTMLInputElement, Element>) => {
         setTimeout(() => setInputFieldFocused.setFalse(), 0.1 * 1000);
         onBlur?.(event);
      },
      [onBlur],
   );
   const onClickRightIcon = useCallback(() => {
      onChangeValueElement("");
   }, [onChangeValueElement]);

   return (
      <InputFieldComponent
         leftIcon="magnifyingGlass"
         placeholder="Search..."
         rightIcon={inputFieldValue.length > 0 && inputFieldFocused ? "XMark" : undefined}
         onClickRightIcon={onClickRightIcon}
         value={inputFieldValue}
         onChangeValue={onChangeValueElement}
         onFocus={onFocusElement}
         onBlur={onBlurElement}
         ref={ref}
         {...props}
      />
   );
}) as InputFieldComponentType["search"];

InputFieldComponent.phoneNumber = forwardRef(function PhoneNumber(
   { label, value, onChangeValue, labelColor, id, ...props },
   ref,
) {
   const theme = useTheme();
   const internalId = useId();

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
   const onChangeDropdown = useCallback(
      (value: string | undefined) => {
         setDropdownValue(value);
         onChangeValue?.(value ? `+${value}${inputFieldValue}` : inputFieldValue); //? Same line as onChangeValueElement
      },
      [onChangeValue, inputFieldValue],
   );
   const onChangeValueElement = useCallback(
      (value: string) => {
         const readyValue = value.replace(/\D/g, "");

         setInputFieldValue(readyValue);
         onChangeValue?.(dropdownValue ? `+${dropdownValue}${readyValue}` : readyValue); //? Same line as onChangeDropdown
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

   const readyId = id ?? internalId;

   return (
      <Div.column width="100%" gap={theme.styles.gap / 2}>
         {label && (
            <Label
               text={label}
               color={labelColor}
               required={props.required}
               isError={!!props.errorText}
               htmlFor={readyId}
            />
         )}

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
               disabled={props.disabled}
               onChange={onChangeDropdown}
               withoutClearButton
               withoutRenderingOptionsWhenClosed
            />
            <InputFieldComponent
               placeholder={label ?? "Phone number"}
               className="react-better-html-phone-number"
               value={inputFieldValue}
               onChangeValue={onChangeValueElement}
               ref={ref}
               id={readyId}
               {...props}
            />
         </Div.row>
      </Div.column>
   );
}) as InputFieldComponentType["phoneNumber"];

InputFieldComponent.date = forwardRef(function Date({ minDate, maxDate, ...props }, ref) {
   const theme = useTheme();

   const holderRef = useRef<HTMLDivElement>(null);

   const isMobileIOS = isMobileDevice && getBrowser() === "safari";

   const { internalValue, setInternalValue, inputFieldProps, insideInputFieldComponentProps } =
      useComponentInputFieldDateProps(props, holderRef, isMobileIOS);

   const onChange = useCallback(
      (date?: string) => {
         inputFieldProps.onChangeValue?.(date ?? "");
         setInternalValue(date ?? "");
      },
      [inputFieldProps.onChangeValue],
   );

   return (
      <InputFieldComponent
         type="date"
         insideInputFieldAfterComponent={
            !isMobileIOS ? (
               <Div
                  position="absolute"
                  top="100%"
                  left={0}
                  width="fit-content"
                  backgroundColor={theme.colors.backgroundContent}
                  borderBottomLeftRadius={theme.styles.borderRadius}
                  borderBottomRightRadius={theme.styles.borderRadius}
                  boxShadow="0px 10px 20px #00000020"
                  userSelect="none"
                  {...insideInputFieldComponentProps}
               >
                  <Calendar value={internalValue} minDate={minDate} maxDate={maxDate} onChange={onChange} />
               </Div>
            ) : undefined
         }
         holderRef={holderRef}
         ref={ref}
         {...props}
         {...inputFieldProps}
      />
   );
}) as InputFieldComponentType["date"];

InputFieldComponent.dateTime = forwardRef(function DateTime(
   { minDate, maxDate, defaultDateAfterTimePick, defaultTimeAfterDatePick = "00:00", ...props },
   ref,
) {
   const theme = useTheme();

   const holderRef = useRef<HTMLDivElement>(null);
   const selectedHourRef = useRef<HTMLDivElement>(null);
   const selectedMinuteRef = useRef<HTMLDivElement>(null);

   const isMobileIOS = isMobileDevice && getBrowser() === "safari";

   const { internalValue, setInternalValue, inputFieldProps, insideInputFieldComponentProps, isOpen } =
      useComponentInputFieldDateProps(props, holderRef, isMobileIOS);

   const onChange = useCallback(
      (date?: string) => {
         const newValue = date ? `${date}T${internalValue?.toString().split("T")[1] ?? defaultTimeAfterDatePick}` : "";

         inputFieldProps.onChangeValue?.(newValue);
         setInternalValue(newValue);
      },
      [internalValue, defaultTimeAfterDatePick, inputFieldProps.onChangeValue],
   );
   const onClickHour = useCallback(
      (hour: number) => {
         const newTime = `${hour.toString().padStart(2, "0")}:${internalValue?.toString().split(":")[1] || "00"}`;

         const today =
            defaultDateAfterTimePick ??
            `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}-${new Date()
               .getDate()
               .toString()
               .padStart(2, "0")}`;

         const newValue = `${(internalValue.trim() || today)?.toString().split("T")[0]}T${newTime}`;
         inputFieldProps.onChangeValue?.(newValue);
         setInternalValue(newValue);
      },
      [defaultDateAfterTimePick, internalValue, inputFieldProps.onChangeValue],
   );
   const onClickMinute = useCallback(
      (minute: number) => {
         const newTime = `${internalValue?.toString().split("T")?.[1]?.split(":")[0] || "00"}:${minute
            .toString()
            .padStart(2, "0")}`;

         const today =
            defaultDateAfterTimePick ??
            `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}-${new Date()
               .getDate()
               .toString()
               .padStart(2, "0")}`;

         const newValue = `${(internalValue.trim() || today)?.toString().split("T")[0]}T${newTime}`;

         inputFieldProps.onChangeValue?.(newValue);
         setInternalValue(newValue);
      },
      [defaultDateAfterTimePick, internalValue, inputFieldProps.onChangeValue],
   );

   useEffect(() => {
      if (isOpen && selectedHourRef.current)
         selectedHourRef.current.scrollIntoView({ block: "nearest", behavior: "instant" });

      if (isOpen && selectedMinuteRef.current)
         selectedMinuteRef.current.scrollIntoView({ block: "nearest", behavior: "instant" });
   }, [isOpen]);

   const valueHour = parseInt(internalValue?.toString().split("T")?.[1]?.split(":")?.[0]).toString();
   const valueMinute = parseInt(internalValue?.toString().split("T")?.[1]?.split(":")?.[1]).toString();

   const topSpacing = 32 + theme.styles.space / 2 + theme.styles.gap;

   return (
      <InputFieldComponent
         type="datetime-local"
         insideInputFieldAfterComponent={
            !isMobileIOS ? (
               <Div
                  position="absolute"
                  top="100%"
                  left={0}
                  width="fit-content"
                  backgroundColor={theme.colors.backgroundContent}
                  borderBottomLeftRadius={theme.styles.borderRadius}
                  borderBottomRightRadius={theme.styles.borderRadius}
                  boxShadow="0px 10px 20px #00000020"
                  overflow="hidden"
                  userSelect="none"
                  {...insideInputFieldComponentProps}
               >
                  <Div.row gap={theme.styles.space}>
                     <Calendar value={internalValue} minDate={minDate} maxDate={maxDate} onChange={onChange} />

                     <Div.row
                        height={276}
                        gap={theme.styles.gap / 2}
                        paddingTop={topSpacing}
                        paddingBottom={theme.styles.space / 2}
                        paddingRight={theme.styles.space / 2}
                     >
                        <Div height="100%">
                           <Text fontSize={14} fontWeight={700} textAlign="center" marginBottom={theme.styles.gap / 2}>
                              H
                           </Text>

                           <Div
                              className="react-better-html-no-scrollbar"
                              width={buttonWidth}
                              height={`calc(100% - ${16 + theme.styles.gap / 2}px)`}
                              overflowY="auto"
                              tabIndex={-1}
                           >
                              {hours.map((hour) => {
                                 const isSelected = hour.toString() === valueHour;

                                 return (
                                    <Div.row
                                       alignItems="center"
                                       justifyContent="center"
                                       color={isSelected ? theme.colors.base : theme.colors.textPrimary}
                                       backgroundColor={
                                          isSelected ? theme.colors.primary : theme.colors.backgroundContent
                                       }
                                       borderRadius={theme.styles.borderRadius / 2}
                                       filterHover="brightness(0.9)"
                                       cursor="pointer"
                                       padding={`${theme.styles.space / 2}px ${
                                          theme.styles.space + theme.styles.gap
                                       }px`}
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
                        </Div>

                        <Div height="100%">
                           <Text fontSize={14} fontWeight={700} textAlign="center" marginBottom={theme.styles.gap / 2}>
                              M
                           </Text>

                           <Div
                              className="react-better-html-no-scrollbar"
                              width={buttonWidth}
                              height={`calc(100% - ${16 + theme.styles.gap / 2}px)`}
                              overflowY="auto"
                              tabIndex={-1}
                           >
                              {minutes.map((minute) => {
                                 const isSelected = minute.toString() === valueMinute;

                                 return (
                                    <Div.row
                                       alignItems="center"
                                       justifyContent="center"
                                       color={isSelected ? theme.colors.base : theme.colors.textPrimary}
                                       backgroundColor={
                                          isSelected ? theme.colors.primary : theme.colors.backgroundContent
                                       }
                                       borderRadius={theme.styles.borderRadius / 2}
                                       filterHover="brightness(0.9)"
                                       cursor="pointer"
                                       padding={`${theme.styles.space / 2}px ${
                                          theme.styles.space + theme.styles.gap
                                       }px`}
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
                        </Div>
                     </Div.row>
                  </Div.row>
               </Div>
            ) : undefined
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

   const isMobileIOS = isMobileDevice && getBrowser() === "safari";

   const { internalValue, setInternalValue, inputFieldProps, insideInputFieldComponentProps, isOpen } =
      useComponentInputFieldDateProps(props, holderRef, isMobileIOS);

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

   return (
      <InputFieldComponent
         type="time"
         insideInputFieldAfterComponent={
            !isMobileIOS ? (
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
                  userSelect="none"
                  {...insideInputFieldComponentProps}
               >
                  <Div.row height="100%">
                     <Div
                        className="react-better-html-no-scrollbar"
                        width={buttonWidth}
                        height="100%"
                        overflowY="auto"
                        tabIndex={-1}
                     >
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

                     <Div
                        className="react-better-html-no-scrollbar"
                        width={buttonWidth}
                        height="100%"
                        overflowY="auto"
                        tabIndex={-1}
                     >
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
            ) : undefined
         }
         holderRef={holderRef}
         ref={ref}
         {...props}
         {...inputFieldProps}
         minWidth={buttonWidth * 2 + 2}
      />
   );
}) as InputFieldComponentType["time"];

InputFieldComponent.color = forwardRef(function Color({ value, onChangeValue, ...props }, ref) {
   const [inputFieldValue, setInputFieldValue] = useState<typeof value>(value ?? "#000000");

   const onChangeValueElement = useCallback(
      (value: string) => {
         setInputFieldValue(value);
         onChangeValue?.(value);
      },
      [onChangeValue],
   );

   useEffect(() => {
      if (value === undefined) return;

      setInputFieldValue(value);
   }, [value]);

   return (
      <InputFieldComponent
         type="color"
         insideInputFieldAfterComponent={
            <Div.row
               position="absolute"
               width="100%"
               height="100%"
               top={0}
               left={colorPickerSpacing}
               alignItems="center"
               pointerEvents="none"
               userSelect="none"
               paddingLeft={colorPickerColorWidth}
            >
               <Text>{inputFieldValue}</Text>
            </Div.row>
         }
         value={inputFieldValue}
         onChangeValue={onChangeValueElement}
         ref={ref}
         {...props}
      />
   );
}) as InputFieldComponentType["color"];

const InputField = memo(InputFieldComponent) as any as typeof InputFieldComponent & {
   multiline: typeof InputFieldComponent.multiline;
   email: typeof InputFieldComponent.email;
   password: typeof InputFieldComponent.password;
   search: typeof InputFieldComponent.search;
   phoneNumber: typeof InputFieldComponent.phoneNumber;
   date: typeof InputFieldComponent.date;
   dateTime: typeof InputFieldComponent.dateTime;
   time: typeof InputFieldComponent.time;
   color: typeof InputFieldComponent.color;
};

InputField.multiline = InputFieldComponent.multiline;
InputField.email = InputFieldComponent.email;
InputField.password = InputFieldComponent.password;
InputField.search = InputFieldComponent.search;
InputField.phoneNumber = InputFieldComponent.phoneNumber;
InputField.date = InputFieldComponent.date;
InputField.dateTime = InputFieldComponent.dateTime;
InputField.time = InputFieldComponent.time;
InputField.color = InputFieldComponent.color;

export default InputField;
