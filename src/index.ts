import Div from "./components/Div";
import Text from "./components/Text";
import Loader from "./components/Loader";
import Icon from "./components/Icon";
import Image from "./components/Image";
import Button from "./components/Button";
import Divider from "./components/Divider";
import Modal, { type ModalRef } from "./components/Modal";
import PageHolder from "./components/PageHolder";
import Chip from "./components/Chip";
import InputField from "./components/InputField";
import Dropdown, { type DropdownOption } from "./components/Dropdown";
import ToggleInput from "./components/ToggleInput";
import Form from "./components/Form";
import Label from "./components/Label";

import BetterHtmlProvider, {
   useBetterHtmlContext,
   useTheme,
   useLoader,
   useLoaderControls,
} from "./components/BetterHtmlProvider";
import { usePageResize, useMediaQuery, useBooleanState, useDebounceState, useForm, useUrlQuery } from "./utils/hooks";

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

import { isMobileDevice } from "./constants";

export * from "./plugins";

export {
   BetterHtmlProvider,
   // Components
   Div,
   Text,
   Loader,
   Icon,
   Image,
   Button,
   Divider,
   Modal,
   ModalRef,
   PageHolder,
   Chip,
   InputField,
   Dropdown,
   DropdownOption,
   ToggleInput,
   Form,
   Label,
   // Hooks
   useBetterHtmlContext,
   useTheme,
   useLoader,
   useLoaderControls,
   usePageResize,
   useMediaQuery,
   useBooleanState,
   useDebounceState,
   useForm,
   useUrlQuery,
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
   // Constants
   isMobileDevice,
};
