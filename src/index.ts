import Div, { type DivProps } from "./components/Div";
import Text, { type TextProps, type TextAs } from "./components/Text";
import Loader, { type LoaderProps } from "./components/Loader";
import Icon, { type IconProps } from "./components/Icon";
import Image, { type ImageProps } from "./components/Image";
import Button, { type ButtonProps } from "./components/Button";
import Divider, { type HorizontalDividerProps, type VerticalDividerProps } from "./components/Divider";
import Modal, { type ModalRef, type ModalProps } from "./components/Modal";
import PageHolder, { type PageHolderProps } from "./components/PageHolder";
import PageHeader, { type PageHeaderProps } from "./components/PageHeader";
import Chip, { type ChipProps } from "./components/Chip";
import InputField, { type InputFieldProps, type TextareaFieldProps } from "./components/InputField";
import Dropdown, { type DropdownOption, type DropdownProps } from "./components/Dropdown";
import ToggleInput, { type ToggleInputRef, type ToggleInputProps } from "./components/ToggleInput";
import Form, { type FormProps } from "./components/Form";
import Label, { type LabelProps } from "./components/Label";
import FormRow, { type FormRowProps } from "./components/FormRow";
import ColorThemeSwitch, { type ColorThemeSwitchProps } from "./components/ColorThemeSwitch";
import Table, { type TableColumn, type TableFilterData, type TableProps, type TableRef } from "./components/Table";
import Tooltip, { type TooltipProps, type TooltipRef } from "./components/Tooltip";
import Tabs, { type TabGroup, type TabsProps, type TabsRef } from "./components/Tabs";
import Foldable, { type FoldableProps, type FoldableRef } from "./components/Foldable";
import SideMenu, { type SideMenuItem } from "./components/SideMenu";
import Pagination from "./components/Pagination";

import BetterHtmlProvider, {
   useBetterHtmlContext,
   useTheme,
   useLoader,
   useAlertControls,
   useLoaderControls,
   type BetterHtmlProviderConfig,
} from "./components/BetterHtmlProvider";
import {
   usePageResize,
   usePageScroll,
   useMediaQuery,
   useBooleanState,
   useDebounceState,
   useForm,
   useUrlQuery,
} from "./utils/hooks";
import {
   generateRandomString,
   getBrowser,
   formatPhoneNumber,
   getFormErrorObject,
   eventPreventDefault,
   eventStopPropagation,
   eventPreventStop,
} from "./utils/functions";
import { lightenColor, darkenColor, saturateColor, desaturateColor } from "./utils/colorManipulation";
import {
   loaderControls,
   alertControls,
   sideMenuControls,
   colorThemeControls,
   filterHover,
} from "./utils/variableFunctions";
import { generateLocalStorage } from "./utils/localStorage";

import {
   type OmitProps,
   type ExcludeOptions,
   type PickValue,
   type PartialRecord,
   type DeepPartialRecord,
   type PickAllRequired,
} from "./types/app";
import { type AppConfig, type BetterHtmlConfig } from "./types/config";
import { type ComponentMarginProps, type ComponentPaddingProps, type ComponentHoverStyle } from "./types/components";
import { type AssetName, type AssetsConfig } from "./types/asset";
import { type IconName, type IconsConfig } from "./types/icon";
import { type LoaderName, type LoaderConfig } from "./types/loader";
import { type AlertType, type Alert } from "./types/alert";
import { type PluginName, type BetterHtmlPlugin } from "./types/plugin";
import {
   type Color,
   type ColorName,
   type ColorTheme,
   type Colors,
   type Styles,
   type Theme,
   type ThemeConfig,
} from "./types/theme";
import { type BrowserName } from "./types/other";

import { countries } from "./constants/countries";

import { isMobileDevice } from "./constants";

export * from "./plugins";

export {
   BetterHtmlProvider,
   BetterHtmlProviderConfig,
   // Components
   Div,
   DivProps,
   Text,
   TextProps,
   TextAs,
   Loader,
   LoaderProps,
   Icon,
   IconProps,
   Image,
   ImageProps,
   Button,
   ButtonProps,
   Divider,
   HorizontalDividerProps,
   VerticalDividerProps,
   Modal,
   ModalProps,
   ModalRef,
   PageHolder,
   PageHolderProps,
   PageHeader,
   PageHeaderProps,
   Chip,
   ChipProps,
   InputField,
   InputFieldProps,
   TextareaFieldProps,
   Dropdown,
   DropdownOption,
   DropdownProps,
   ToggleInput,
   ToggleInputRef,
   ToggleInputProps,
   Form,
   FormProps,
   Label,
   LabelProps,
   FormRow,
   FormRowProps,
   ColorThemeSwitch,
   ColorThemeSwitchProps,
   Table,
   TableColumn,
   TableFilterData,
   TableProps,
   TableRef,
   Tooltip,
   TooltipProps,
   TooltipRef,
   Tabs,
   TabGroup,
   TabsProps,
   TabsRef,
   Foldable,
   FoldableProps,
   FoldableRef,
   SideMenu,
   SideMenuItem,
   Pagination,
   // Hooks
   useBetterHtmlContext,
   useTheme,
   useLoader,
   useAlertControls,
   useLoaderControls,
   usePageResize,
   usePageScroll,
   useMediaQuery,
   useBooleanState,
   useDebounceState,
   useForm,
   useUrlQuery,
   // Functions
   generateRandomString,
   getBrowser,
   formatPhoneNumber,
   getFormErrorObject,
   eventPreventDefault,
   eventStopPropagation,
   eventPreventStop,
   // Color Manipulation
   lightenColor,
   darkenColor,
   saturateColor,
   desaturateColor,
   // Variable Functions
   loaderControls,
   alertControls,
   sideMenuControls,
   colorThemeControls,
   filterHover,
   // LocalStorage
   generateLocalStorage,
   // Types
   OmitProps,
   ExcludeOptions,
   PickValue,
   PartialRecord,
   DeepPartialRecord,
   PickAllRequired,
   AppConfig,
   BetterHtmlConfig,
   ComponentMarginProps,
   ComponentPaddingProps,
   ComponentHoverStyle,
   AssetName,
   AssetsConfig,
   IconName,
   IconsConfig,
   LoaderName,
   AlertType,
   Alert,
   PluginName,
   BetterHtmlPlugin,
   LoaderConfig,
   Color,
   ColorName,
   ColorTheme,
   Colors,
   Styles,
   Theme,
   ThemeConfig,
   BrowserName,
   // Constants
   countries,
   isMobileDevice,
};
