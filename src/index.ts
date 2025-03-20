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

import { useBetterHtmlContext, useTheme, useLoader, useLoaderControls } from "./components/BetterHtmlProvider";
import { usePageResize, useMediaQuery } from "./utils/hooks";

export {
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
   // Hooks
   useBetterHtmlContext,
   useTheme,
   useLoader,
   useLoaderControls,
   usePageResize,
   useMediaQuery,
};
