export {
   useTheme,
   useLoader,
   useLoaderControls,
   countries,
   type OmitProps,
   type ExcludeOptions,
   type PickValue,
   type PartialRecord,
   type DeepPartialRecord,
   type PickAllRequired,
   type AnyOtherString,
   type AssetName,
   type AssetsConfig,
   type Country,
   type IconName,
   type IconsConfig,
   type LoaderName,
   type LoaderConfig,
   type Color,
   type ColorName,
   type ColorTheme,
   type Colors,
   type Styles,
   type Theme,
   type ThemeConfig,
   lightenColor,
   darkenColor,
   saturateColor,
   desaturateColor,
   generateRandomString,
   formatPhoneNumber,
   eventPreventDefault,
   eventStopPropagation,
   eventPreventStop,
   getPluralWord,
   useBooleanState,
   useDebounceState,
   loaderControls,
   colorThemeControls,
} from "react-better-core";

import BetterHtmlProvider, {
   useBetterHtmlContext,
   useAlertControls,
   type BetterHtmlProviderConfig,
} from "./components/BetterHtmlProvider";

import { isMobileDevice } from "./constants";

import { type AppConfig, type BetterHtmlConfig } from "./types/config";
import { type ComponentMarginProps, type ComponentPaddingProps, type ComponentHoverStyle } from "./types/components";
import { type AlertType, type Alert } from "./types/alert";
import { type PluginName, type BetterHtmlPlugin } from "./types/plugin";
import { type BrowserName } from "./types/other";

import { usePageResize, usePageScroll, useMediaQuery, useForm, useUrlQuery } from "./utils/hooks";
import { getBrowser, getFormErrorObject } from "./utils/functions";
import { alertControls, sideMenuControls, filterHover } from "./utils/variableFunctions";
import { generateLocalStorage } from "./utils/localStorage";

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
import Table, {
   type TableColumn,
   type TableFilterData,
   type TableListFilterListItem,
   type TableProps,
   type TableRef,
} from "./components/Table";
import Tooltip, { type TooltipProps, type TooltipRef } from "./components/Tooltip";
import Tabs, { type TabGroup, type TabsProps, type TabsRef } from "./components/Tabs";
import Foldable, { type FoldableProps, type FoldableRef } from "./components/Foldable";
import SideMenu, { type SideMenuItem } from "./components/SideMenu";
import Pagination from "./components/Pagination";

export * from "./plugins";

export {
   BetterHtmlProvider,
   useBetterHtmlContext,
   useAlertControls,
   BetterHtmlProviderConfig,

   // Constants
   isMobileDevice,

   // Types
   AppConfig,
   BetterHtmlConfig,
   ComponentMarginProps,
   ComponentPaddingProps,
   ComponentHoverStyle,
   AlertType,
   Alert,
   PluginName,
   BetterHtmlPlugin,
   BrowserName,

   // Hooks
   usePageResize,
   usePageScroll,
   useMediaQuery,
   useForm,
   useUrlQuery,

   // Functions
   getBrowser,
   getFormErrorObject,

   // Variable Functions
   alertControls,
   sideMenuControls,
   filterHover,

   // LocalStorage
   generateLocalStorage,

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
   TableListFilterListItem,
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
};
