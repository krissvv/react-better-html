import { forwardRef, memo, useCallback } from "react";
import styled from "styled-components";

import { ComponentHoverStyle, ComponentPropWithRef, ComponentStyle } from "../types/components";
import { OmitProps } from "../types/app";
import { Theme } from "../types/theme";

import { useComponentPropsWithoutStyle, useComponentPropsWithPrefix, useStyledComponentStyles } from "../utils/hooks";

import Text from "./Text";
import Div from "./Div";
import { useTheme } from "./BetterHtmlProvider";

const InputElement = styled.input.withConfig({
   shouldForwardProp: (prop) => !["theme", "normalStyle", "hoverStyle"].includes(prop),
})<{ theme: Theme; normalStyle: ComponentStyle; hoverStyle: ComponentStyle }>`
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

   &.react-better-html-dropdown-open {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
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
   onChangeText?: (text: string) => void;
} & OmitProps<React.ComponentProps<"input">, "style"> &
   ComponentStyle &
   ComponentHoverStyle;

type InputFieldComponentType = {
   (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>): React.ReactElement;
   multiline: (props: ComponentPropWithRef<HTMLTextAreaElement, TextareaFieldProps>) => React.ReactElement;
   email: (props: ComponentPropWithRef<HTMLInputElement, InputFieldProps>) => React.ReactElement;
};

const InputFieldComponent: InputFieldComponentType = forwardRef(function InputField(
   { label, errorText, infoText, onChange, onChangeText, required, ...props }: InputFieldProps,
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
         onChangeText?.(event.target.value);
      },
      [onChange, onChangeText],
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

         <InputElement
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
   { label, errorText, infoText, onChange, onChangeText, required, ...props }: TextareaFieldProps,
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
         onChangeText?.(event.target.value);
      },
      [onChange, onChangeText],
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

const InputField = memo(InputFieldComponent) as any as typeof InputFieldComponent & {
   textarea: typeof InputFieldComponent.multiline;
   email: typeof InputFieldComponent.email;
};

InputField.multiline = InputFieldComponent.multiline;
InputField.email = InputFieldComponent.email;

export default InputField;
