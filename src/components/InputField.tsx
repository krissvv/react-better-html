import React, { forwardRef, memo, useCallback, useState, useEffect, useMemo } from "react";
import styled from "styled-components";

import { countries } from "../constants/countries";

import { ComponentHoverStyle, ComponentPropWithRef, ComponentStyle } from "../types/components";
import { AnyOtherString, OmitProps } from "../types/app";
import { Theme } from "../types/theme";
import { IconName } from "../types/icon";
import { Country } from "../types/countries";

import {
   useBooleanState,
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
   }

   ${(props) => props.normalStyle as any}

   &:hover {
      ${(props) => props.hoverStyle as any}
   }
`;

const TextareaElement = styled.textarea.withConfig({
   shouldForwardProp: (prop) => !["normalStyle", "hoverStyle"].includes(prop),
})<{ normalStyle: ComponentStyle; hoverStyle: ComponentStyle }>`
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

export type InputFieldProps = {
   label?: string;
   errorText?: string;
   infoText?: string;
   leftIcon?: IconName | AnyOtherString;
   rightIcon?: IconName | AnyOtherString;
   insideInputFieldComponent?: React.ReactNode;
   withDebounce?: boolean;
   /** @default 0.5s */
   debounceDelay?: number;
   onChangeValue?: (value: string) => void;
   onClickRightIcon?: () => void;
} & OmitProps<React.ComponentProps<"input">, "style" | "ref"> &
   ComponentStyle &
   ComponentHoverStyle;

type InputFieldComponentType = {
   (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>): React.ReactElement;
   multiline: (props: ComponentPropWithRef<HTMLTextAreaElement, TextareaFieldProps>) => React.ReactElement;
   email: (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>) => React.ReactElement;
   password: (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>) => React.ReactElement;
   search: (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>) => React.ReactElement;
   phoneNumber: (
      props: ComponentPropWithRef<HTMLInputElement, OmitProps<InputFieldProps, "type">>,
   ) => React.ReactElement;
};

const InputFieldComponent: InputFieldComponentType = forwardRef(function InputField(
   {
      label,
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
      <Div.column width="100%" gap={theme.styles.gap / 2} {...styledComponentStylesWithExcluded}>
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
                  zIndex={1002}
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
               color={errorText ? theme.colors.error : theme.colors.textSecondary}
            >
               {errorText || infoText}
            </Text>
         )}
      </Div.column>
   );
}) as any;

export type TextareaFieldProps = OmitProps<InputFieldProps, "type"> &
   OmitProps<React.ComponentProps<"textarea">, "style" | "ref">;

InputFieldComponent.multiline = forwardRef(function Textarea(
   { label, errorText, infoText, onChange, onChangeValue, required, ...props }: TextareaFieldProps,
   ref: React.ForwardedRef<HTMLTextAreaElement>,
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
      <Div.column gap={theme.styles.gap / 2}>
         {label && <Label text={label} required={required} isError={!!errorText} />}

         <TextareaElement
            theme={theme}
            required={required}
            onChange={onChangeElement}
            {...styledComponentStyles}
            {...dataProps}
            {...ariaProps}
            {...restProps}
            ref={ref}
         />

         {(errorText || infoText) && (
            <Text
               as="span"
               display="block"
               marginTop={theme.styles.gap / 2}
               color={errorText ? theme.colors.error : theme.colors.textSecondary}
               fontSize={14}
            >
               {errorText || infoText}
            </Text>
         )}
      </Div.column>
   );
}) as InputFieldComponentType["multiline"];

InputFieldComponent.email = forwardRef(function Email(
   { ...props }: InputFieldProps,
   ref: React.ForwardedRef<HTMLInputElement>,
) {
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

InputFieldComponent.password = forwardRef(function Email(
   { ...props }: InputFieldProps,
   ref: React.ForwardedRef<HTMLInputElement>,
) {
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

InputFieldComponent.search = forwardRef(function Email(
   { ...props }: InputFieldProps,
   ref: React.ForwardedRef<HTMLInputElement>,
) {
   return <InputFieldComponent leftIcon="magnifyingGlass" placeholder="Search..." ref={ref} {...props} />;
}) as InputFieldComponentType["search"];

InputFieldComponent.phoneNumber = forwardRef(function Email(
   { value, onChangeValue, ...props }: InputFieldProps,
   ref: React.ForwardedRef<HTMLInputElement>,
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
      <Div.row>
         <Dropdown
            options={options}
            renderOption={renderOption}
            width={130}
            withSearch
            placeholder="+00"
            inputFieldClassName="react-better-html-phone-number-holder"
            defaultValue={defaultValue}
            value={dropdownValue}
            onChange={setDropdownValue}
            withoutClearButton
         />
         <InputFieldComponent
            placeholder="Phone number"
            className="react-better-html-phone-number"
            value={inputFieldValue}
            onChangeValue={onChangeValueElement}
            ref={ref}
            {...props}
         />
      </Div.row>
   );
}) as InputFieldComponentType["phoneNumber"];

const InputField = memo(InputFieldComponent) as any as typeof InputFieldComponent & {
   multiline: typeof InputFieldComponent.multiline;
   email: typeof InputFieldComponent.email;
   password: typeof InputFieldComponent.password;
   search: typeof InputFieldComponent.search;
   phoneNumber: typeof InputFieldComponent.phoneNumber;
};

InputField.multiline = InputFieldComponent.multiline;
InputField.email = InputFieldComponent.email;
InputField.password = InputFieldComponent.password;
InputField.search = InputFieldComponent.search;
InputField.phoneNumber = InputFieldComponent.phoneNumber;

export default InputField;
