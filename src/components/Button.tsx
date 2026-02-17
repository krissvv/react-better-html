import { ComponentProps, memo, useCallback } from "react";
import {
   AnyOtherString,
   AssetName,
   Color,
   ColorTheme,
   IconName,
   LoaderName,
   OmitProps,
   Theme,
   useBetterCoreContext,
   useLoader,
   useTheme,
} from "react-better-core";
import styled, { css } from "styled-components";

import { ComponentHoverStyle, ComponentStyle } from "../types/components";

import { useComponentPropsGrouper, useComponentPropsWithPrefix } from "../utils/hooks";

import Div from "./Div";
import Icon from "./Icon";
import Loader from "./Loader";
import Image from "./Image";
import { useBetterHtmlContextInternal } from "./BetterHtmlProvider";

const ButtonElement = styled.button.withConfig({
   shouldForwardProp: (prop) =>
      !["theme", "colorTheme", "style", "hoverStyle", "isSmall", "withText", "isLoading"].includes(prop),
})<{
   theme: Theme;
   colorTheme: ColorTheme;
   style: ComponentStyle;
   hoverStyle: ComponentStyle;
   isSmall?: boolean;
   withText?: boolean;
   disabled?: boolean;
   isLoading?: boolean;
}>`
   display: block;
   position: relative;
   width: fit-content;
   min-width: max-content;
   font-family: ${(props) => props.theme.styles.fontFamily};
   font-size: 16px;
   line-height: 20px;
   text-decoration: none;
   color: ${(props) => props.theme.colors.base};
   background-color: ${(props) => props.theme.colors.primary};
   border: none;
   border-radius: ${(props) => props.theme.styles.borderRadius}px;
   padding: ${(props) =>
      props.isSmall
         ? `${props.theme.styles.gap + 1}px ${props.theme.styles.space}px`
         : `${(props.theme.styles.gap + props.theme.styles.space) / 2 + 1}px ${
              props.theme.styles.space + (props.withText ? props.theme.styles.gap : 0)
           }px`};
   user-select: none;
   flex-shrink: 0;
   transition: ${(props) => props.theme.styles.transition};

   ${(props) =>
      props.disabled
         ? css`
              opacity: 0.6;
              cursor: not-allowed;
           `
         : !props.isLoading
           ? css`
                cursor: pointer;

                &:not(.secondary):hover {
                   filter: ${props.colorTheme === "dark" ? "brightness(1.2)" : "brightness(0.9)"};
                }

                &.secondary:hover {
                   border-color: ${props.theme.colors.primary};
                }
             `
           : ""}

   &.secondary {
      padding-block: ${(props) =>
         props.isSmall ? props.theme.styles.gap : (props.theme.styles.space + props.theme.styles.gap) / 2}px;
      border: solid 1px ${(props) => props.theme.colors.border};
      background-color: ${(props) => props.theme.colors.backgroundContent};
      background-image: none;

      ${(props) => props.style as any}
   }

   ${(props) => props.style as any}

   &:hover {
      ${(props) => props.hoverStyle as any}
   }
`;

export type ButtonProps<Value> = {
   text?: string;
   value?: Value;

   href?: string;
   download?: string;
   target?: React.ComponentProps<"a">["target"];

   icon?: IconName | AnyOtherString;
   /** @default "left" */
   iconPosition?: "left" | "right";
   /** @default Same as text color */
   iconColor?: string;
   /** @default 16 */
   iconSize?: number;

   image?: AssetName | AnyOtherString;
   /** @default "left" */
   imagePosition?: "left" | "right";
   /** @default 16 */
   imageWidth?: number;
   /** @default undefined */
   imageHeight?: number;

   loaderName?: LoaderName | AnyOtherString;
   /** @default 16 */
   loaderSize?: number;
   /** @default false */
   isLoading?: boolean;

   /** @default false */
   disabled?: boolean;
   /** @default false */
   isSmall?: boolean;
   /** @default false */
   isSubmit?: boolean;

   onClickWithValue?: (value: Value) => void;
} & OmitProps<React.ComponentProps<"button">, "style" | "defaultValue" | "translate" | "value"> &
   ComponentStyle &
   ComponentHoverStyle;

type ButtonComponent = {
   <Value>(props: ButtonProps<Value>): React.ReactElement;
   secondary: <Value>(props: ButtonProps<Value>) => React.ReactElement;
   destructive: <Value>(props: ButtonProps<Value>) => React.ReactElement;
   icon: <Value>(
      props: OmitProps<ButtonProps<Value>, "icon" | "width" | "height" | "isSmall"> & {
         icon: IconName | AnyOtherString;
         /** @default 16 */
         size?: number;
         buttonSize?: number;
         /** @default "#000000" */
         backgroundButtonColor?: string;
      },
   ) => React.ReactElement;
   upload: <Value>(
      props: OmitProps<ButtonProps<Value>, "onClick"> & {
         accept?: ComponentProps<"input">["accept"];
         /** @default false */
         multiple?: boolean;
         onUpload?: (files: FileList | null) => void;
      },
   ) => React.ReactElement;
};

const ButtonComponent: ButtonComponent = function Button<Value>({
   href,
   text,
   value,
   download,
   target,

   icon,
   iconPosition = "left",
   iconColor,
   iconSize,

   image,
   imagePosition = "left",
   imageWidth,
   imageHeight,

   loaderName,
   loaderSize,
   isLoading,

   disabled,
   isSmall,
   isSubmit,

   onClick,
   onClickWithValue,
   ...props
}: ButtonProps<Value>) {
   const theme = useTheme();
   const isLoadingHook = useLoader(loaderName);
   const { components } = useBetterHtmlContextInternal();
   const { colorTheme } = useBetterCoreContext();

   const isLoadingElement = isLoading || isLoadingHook;

   const { style, hoverStyle, restProps } = useComponentPropsGrouper({
      ...components.button?.style?.default,
      ...props,
   });
   const dataProps = useComponentPropsWithPrefix(restProps, "data");
   const ariaProps = useComponentPropsWithPrefix(restProps, "aria");

   const onClickElement = useCallback(
      (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
         onClick?.(event);
         onClickWithValue?.(value as any);
      },
      [onClick, onClickWithValue, value],
   );

   const iconComponent = icon ? (
      <Div.row
         height={iconSize ?? parseInt(style.fontSize?.toString() ?? "16")}
         alignItems="center"
         justifyContent="center"
      >
         <Icon
            name={icon}
            color={iconColor ?? props.color ?? theme.colors.base}
            size={iconSize ?? parseInt(style.fontSize?.toString() ?? "16")}
         />
      </Div.row>
   ) : undefined;
   const imageComponent = image ? (
      <Image
         name={image}
         color={iconColor ?? props.color ?? theme.colors.base}
         width={imageWidth ?? parseInt(style.fontSize?.toString() ?? "16")}
         height={imageHeight}
      />
   ) : undefined;

   const linkComponentTag = components.button?.tagReplacement?.linkComponent ?? "a";
   const buttonComponentTag = components.button?.tagReplacement?.buttonComponent ?? "button";

   return (
      <ButtonElement
         as={(href ? linkComponentTag : buttonComponentTag) as any}
         theme={theme}
         colorTheme={colorTheme}
         isSmall={isSmall}
         withText={text !== undefined}
         isLoading={isLoadingElement}
         disabled={disabled}
         to={href}
         href={href}
         download={download}
         target={target}
         type={isSubmit && !isLoadingElement ? "submit" : "button"}
         onClick={!disabled && !isLoadingElement ? onClickElement : undefined}
         style={style}
         hoverStyle={hoverStyle}
         {...restProps}
         {...dataProps}
         {...ariaProps}
      >
         <Div.row
            alignItems="center"
            justifyContent="center"
            gap={10}
            pointerEvents="none"
            opacity={isLoadingElement ? 0 : 1}
            transition={theme.styles.transition}
         >
            {iconPosition === "left" && iconComponent}
            {imagePosition === "left" && imageComponent}

            {text}

            {iconPosition === "right" && iconComponent}
            {imagePosition === "right" && imageComponent}
         </Div.row>

         <Div.row
            position="absolute"
            width="100%"
            height="100%"
            top={0}
            left={0}
            pointerEvents="none"
            alignItems="center"
            justifyContent="center"
            opacity={isLoadingElement ? 1 : 0}
            transition={theme.styles.transition}
         >
            <Loader
               color={(props.color as Color) ?? theme.colors.base}
               size={loaderSize}
               disabled={!isLoadingElement}
            />
         </Div.row>
      </ButtonElement>
   );
} as any;

ButtonComponent.secondary = function Secondary({ className, ...props }) {
   const theme = useTheme();
   const betterHtmlContext = useBetterHtmlContextInternal();

   return (
      <ButtonComponent
         {...betterHtmlContext.components.button?.style?.secondary}
         className={`secondary${className ? ` ${className}` : ""}`}
         color={theme.colors.textPrimary}
         {...props}
      />
   );
} as ButtonComponent["secondary"];

ButtonComponent.destructive = function Destructive(props) {
   const theme = useTheme();
   const betterHtmlContext = useBetterHtmlContextInternal();

   return (
      <ButtonComponent
         {...betterHtmlContext.components.button?.style?.destructive}
         backgroundColor={theme.colors.error}
         color={theme.colors.base}
         {...props}
      />
   );
} as ButtonComponent["destructive"];

ButtonComponent.icon = function Icon({ size = 16, buttonSize, backgroundButtonColor, ...props }) {
   const theme = useTheme();
   const betterHtmlContext = useBetterHtmlContextInternal();

   const readyButtonSize = buttonSize ?? size + theme.styles.space;
   const backgroundButtonColorReady = backgroundButtonColor ?? theme.colors.textPrimary;

   return (
      <ButtonComponent
         {...betterHtmlContext.components.button?.style?.icon}
         width={readyButtonSize}
         height={readyButtonSize}
         color={theme.colors.textPrimary}
         backgroundColor={backgroundButtonColorReady + "00"}
         backgroundImage="none"
         backgroundColorHover={backgroundButtonColorReady + "20"}
         borderRadius={999}
         iconSize={size}
         loaderSize={12}
         border="none"
         padding={0}
         filterHover="none !important"
         {...props}
      />
   );
} as ButtonComponent["icon"];

ButtonComponent.upload = function Upload({ accept, multiple, onUpload, ...props }) {
   const betterHtmlContext = useBetterHtmlContextInternal();

   const onClickElement = useCallback(() => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      if (accept) input.setAttribute("accept", accept);
      if (multiple) input.setAttribute("multiple", "true");

      input.addEventListener("change", () => {
         onUpload?.(input.files);
      });

      input.click();
   }, [accept]);

   return (
      <ButtonComponent
         {...betterHtmlContext.components.button?.style?.upload}
         text="Upload"
         icon="uploadCloud"
         onClick={onClickElement}
         {...props}
      />
   );
} as ButtonComponent["upload"];

const Button = memo(ButtonComponent) as any as typeof ButtonComponent & {
   secondary: typeof ButtonComponent.secondary;
   destructive: typeof ButtonComponent.destructive;
   icon: typeof ButtonComponent.icon;
   upload: typeof ButtonComponent.upload;
};

Button.secondary = ButtonComponent.secondary;
Button.destructive = ButtonComponent.destructive;
Button.icon = ButtonComponent.icon;
Button.upload = ButtonComponent.upload;

export default Button;
