import { ButtonProps } from "../components/Button";
import { InputFieldProps } from "../components/InputField";
import { DropdownProps } from "../components/Dropdown";
import { ToggleInputProps } from "../components/ToggleInput";
import { HorizontalDividerProps, VerticalDividerProps } from "../components/Divider";
import { LabelProps } from "../components/Label";
import { ImageProps } from "../components/Image";

type ComponentStyleConfig<ComponentProps, Subcomponents extends string> = {
   [key in Subcomponents]?: Partial<ComponentProps>;
};

type ComponentTagReplacementConfig<Subcomponents extends string> = {
   [key in Subcomponents]?: React.ElementType;
};

export type AppConfig = {
   contentMaxWidth: number;
};

export type BetterHtmlConfig = {
   app: AppConfig;
   sideMenuIsCollapsed: boolean;
   sideMenuIsOpenMobile: boolean;
   components: {
      button?: {
         style?: ComponentStyleConfig<ButtonProps, "default" | "secondary" | "destructive" | "icon" | "upload">;
         tagReplacement?: ComponentTagReplacementConfig<"buttonComponent" | "linkComponent">;
      };
      inputField?: {
         style?: ComponentStyleConfig<
            InputFieldProps,
            | "default"
            | "multiline"
            | "email"
            | "password"
            | "search"
            | "phoneNumber"
            | "date"
            | "dateTime"
            | "time"
            | "color"
         >;
      };
      dropdown?: {
         style?: ComponentStyleConfig<DropdownProps, "default" | "countries">;
      };
      toggleInput?: {
         style?: ComponentStyleConfig<ToggleInputProps, "checkbox" | "radiobutton" | "switch">;
      };
      label?: {
         style?: ComponentStyleConfig<LabelProps, "default">;
      };
      divider?: {
         style?: {
            vertical?: VerticalDividerProps;
            horizontal?: HorizontalDividerProps;
         };
      };
      image?: {
         style?: ComponentStyleConfig<ImageProps, "default" | "profileImage">;
      };
      sideMenu?: {
         /** @default 300 */
         width?: number;
      };
   };
};
