import React, { forwardRef, memo, useCallback } from "react";
import styled from "styled-components";

import { ComponentHoverStyle, ComponentPropWithRef, ComponentStyle } from "../types/components";
import { OmitProps } from "../types/app";
import { Theme } from "../types/theme";
import { IconName } from "../types/icon";

import {
   useBooleanState,
   useComponentPropsWithoutStyle,
   useComponentPropsWithPrefix,
   useStyledComponentStyles,
} from "../utils/hooks";

import Text from "./Text";
import Div from "./Div";
import Icon from "./Icon";
import Button from "./Button";
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

type InputFieldProps = {
   label?: string;
   errorText?: string;
   infoText?: string;
   leftIcon?: IconName;
   rightIcon?: IconName;
   insideInputFieldComponent?: React.ReactNode;
   onChangeValue?: (value: string) => void;
   onClickRightIcon?: () => void;
} & OmitProps<React.ComponentProps<"input">, "style"> &
   ComponentStyle &
   ComponentHoverStyle;

type InputFieldComponentType = {
   (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>): React.ReactElement;
   multiline: (props: ComponentPropWithRef<HTMLTextAreaElement, TextareaFieldProps>) => React.ReactElement;
   email: (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>) => React.ReactElement;
   password: (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>) => React.ReactElement;
   search: (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>) => React.ReactElement;
};

const InputFieldComponent: InputFieldComponentType = forwardRef(function InputField(
   {
      label,
      errorText,
      infoText,
      leftIcon,
      rightIcon,
      insideInputFieldComponent,
      onChange,
      onChangeValue,
      onClickRightIcon,
      required,
      ...props
   }: InputFieldProps,
   ref: React.ForwardedRef<HTMLInputElement>,
) {
   const theme = useTheme();

   const styledComponentStyles = useStyledComponentStyles(props, theme);
   const dataProps = useComponentPropsWithPrefix(props, "data");
   const ariaProps = useComponentPropsWithPrefix(props, "aria");
   const restProps = useComponentPropsWithoutStyle(props);

   const onChangeElement = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
         onChange?.(event);
         onChangeValue?.(event.target.value);
      },
      [onChange, onChangeValue],
   );

   return (
      <Div.column width="100%" gap={theme.styles.gap / 2}>
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

type TextareaFieldProps = OmitProps<InputFieldProps, "type"> & OmitProps<React.ComponentProps<"textarea">, "style">;

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
         {label && (
            <Text as="label" fontSize={14} color={errorText ? theme.colors.error : theme.colors.textSecondary}>
               {label}

               {required && (
                  <Text as="span" fontSize={16} color={theme.colors.error}>
                     {" "}
                     *
                  </Text>
               )}
            </Text>
         )}

         <TextareaElement
            theme={theme}
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
   { ...props }: TextareaFieldProps,
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
   { ...props }: TextareaFieldProps,
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
   { ...props }: TextareaFieldProps,
   ref: React.ForwardedRef<HTMLInputElement>,
) {
   return <InputFieldComponent leftIcon="magnifyingGlass" placeholder="Search..." ref={ref} {...props} />;
}) as InputFieldComponentType["search"];

const InputField = memo(InputFieldComponent) as any as typeof InputFieldComponent & {
   multiline: typeof InputFieldComponent.multiline;
   email: typeof InputFieldComponent.email;
   password: typeof InputFieldComponent.password;
   search: typeof InputFieldComponent.search;
};

InputField.multiline = InputFieldComponent.multiline;
InputField.email = InputFieldComponent.email;
InputField.password = InputFieldComponent.password;
InputField.search = InputFieldComponent.search;

export default InputField;
