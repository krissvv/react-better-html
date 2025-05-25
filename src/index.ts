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
import Table, { type TableColumn, type TableProps } from "./components/Table";
import Tabs, { type TabGroup, type TabsProps } from "./components/Tabs";
import Foldable, { type FoldableProps, type FoldableRef } from "./components/Foldable";

import BetterHtmlProvider, {
   useBetterHtmlContext,
   useTheme,
   useLoader,
   useLoaderControls,
   type BetterHtmlProviderValue,
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
import { generateRandomString, getBrowser, formatPhoneNumber, getFormErrorObject } from "./utils/functions";
import { loaderControls } from "./utils/variableFunctions";

import {
   type OmitProps,
   type ExcludeOptions,
   type PickValue,
   type PartialRecord,
   type DeepPartialRecord,
   type PickAllRequired,
} from "./types/app";
import { type AppConfig, type BetterHtmlConfig } from "./types/config";
import { type AssetName, type AssetsConfig } from "./types/asset";
import { type IconName, type IconsConfig } from "./types/icon";
import { type LoaderName, type LoaderConfig } from "./types/loader";
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

import { isMobileDevice } from "./constants";

export * from "./plugins";

export {
   BetterHtmlProvider,
   BetterHtmlProviderValue,
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
   TableProps,
   Tabs,
   TabGroup,
   TabsProps,
   Foldable,
   FoldableProps,
   FoldableRef,
   // Hooks
   useBetterHtmlContext,
   useTheme,
   useLoader,
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
   // Variable Functions
   loaderControls,
   // Types
   OmitProps,
   ExcludeOptions,
   PickValue,
   PartialRecord,
   DeepPartialRecord,
   PickAllRequired,
   AppConfig,
   BetterHtmlConfig,
   AssetName,
   AssetsConfig,
   IconName,
   IconsConfig,
   LoaderName,
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
   isMobileDevice,
};
