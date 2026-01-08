import { memo, useCallback, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
   AnyOtherString,
   ColorTheme,
   IconName,
   LoaderName,
   OmitProps,
   PickValue,
   Theme,
   useBetterCoreContext,
   useTheme,
} from "react-better-core";
import styled from "styled-components";

import { ComponentPropWithRef } from "../types/components";

import { useUrlQuery } from "../utils/hooks";

import Div from "./Div";
import Button from "./Button";
import Text from "./Text";
import Divider from "./Divider";
import Icon from "./Icon";
import { useBetterHtmlContextInternal, usePlugin } from "./BetterHtmlProvider";

const DialogStylesElement = styled.dialog.withConfig({
   shouldForwardProp: (prop) => !["theme", "colorTheme", "opacity"].includes(prop),
})<{ theme: Theme; colorTheme: ColorTheme; opacity?: number }>`
   width: 100%;
   max-width: none;
   height: 100%;
   max-height: none;
   color: ${(props) => props.theme.colors.textPrimary};
   border: none;
   outline: none;
   background-color: transparent;
   margin: auto auto;
   padding-inline: ${(props) => props.theme.styles.gap}px;
   opacity: ${(props) => props.opacity};
   transition: ${(props) => props.theme.styles.transition};

   &::backdrop {
      background-color: ${(props) => (props.colorTheme === "light" ? "#000000a0" : "#222222e0")};
      opacity: ${(props) => props.opacity};
      transition: ${(props) => props.theme.styles.transition};
   }

   @keyframes fadeInAnimation {
      from {
         transform: translateY(${(props) => props.theme.styles.space}px);
      }
      to {
         transform: translateY(0px);
      }
   }

   @keyframes fadeOutAnimation {
      from {
         transform: translateY(0px);
      }
      to {
         transform: translateY(${(props) => props.theme.styles.space}px);
      }
   }
`;

export type ModalProps = {
   /**
    * If you want to have a small modal, you can use 660px as it looks good on most screens.
    *
    * @default 30% smaller than app.contentMaxWidth
    * */
   maxWidth?: number;
   icon?: IconName | AnyOtherString;
   title?: string;
   titleColor?: React.CSSProperties["color"];
   description?: string;
   descriptionColor?: React.CSSProperties["color"];
   headerTextAlign?: PickValue<NonNullable<React.CSSProperties["textAlign"]>, "left" | "center">;
   headerBackgroundColor?: React.CSSProperties["backgroundColor"];
   backgroundColor?: React.CSSProperties["backgroundColor"];
   /** @requires ReactRouterDomPlugin */
   name?: string;
   overflow?: React.CSSProperties["overflow"];
   withoutCloseButton?: boolean;
   onOpen?: () => void;
   onClose?: () => void;
   children?: React.ReactNode;
};

export type ModalRef = {
   isOpened: boolean;
   open: () => void;
   close: () => void;
};

type ModalComponent = {
   (props: ComponentPropWithRef<ModalRef, ModalProps>): React.ReactElement;
   confirmation: (
      props: ComponentPropWithRef<
         ModalRef,
         OmitProps<ModalProps, "maxWidth" | "children" | "overflow"> & {
            message?: string;
            /** @default "Continue" */
            continueButtonText?: string;
            continueButtonLoaderName?: LoaderName | AnyOtherString;
            onContinue?: () => void;
            onCancel?: () => void;
         }
      >,
   ) => React.ReactElement;
   destructive: (
      props: ComponentPropWithRef<
         ModalRef,
         OmitProps<ModalProps, "maxWidth" | "children" | "overflow"> & {
            message?: string;
            /** @default "Delete" */
            deleteButtonText?: string;
            /** @default "trash" */
            deleteButtonIconName?: IconName | AnyOtherString;
            deleteButtonLoaderName?: LoaderName | AnyOtherString;
            onDelete?: () => void;
            onCancel?: () => void;
         }
      >,
   ) => React.ReactElement;
};

const ModalComponent: ModalComponent = forwardRef(function Modal(
   {
      maxWidth,
      icon,
      title,
      titleColor,
      description,
      descriptionColor,
      headerTextAlign,
      headerBackgroundColor,
      backgroundColor,
      name,
      overflow,
      withoutCloseButton,
      onOpen,
      onClose,
      children,
   }: ModalProps,
   ref: React.ForwardedRef<ModalRef>,
) {
   const reactRouterDomPlugin = usePlugin("react-router-dom");
   const urlQuery = reactRouterDomPlugin ? useUrlQuery() : undefined;

   const theme = useTheme();
   const { app } = useBetterHtmlContextInternal();
   const { colorTheme } = useBetterCoreContext();

   const dialogRef = useRef<HTMLDialogElement>(null);

   const [isOpened, setIsOpened] = useState<boolean>(false);
   const [isOpenedLate, setIsOpenedLate] = useState<boolean>(false);

   const onClickOpen = useCallback(() => {
      dialogRef.current?.showModal();

      setIsOpened(true);
      setIsOpenedLate(true);

      if (urlQuery && name) {
         urlQuery.setQuery(
            {
               [`${name}-modal`]: "opened",
            },
            false,
         );
      }

      onOpen?.();
   }, [onOpen, urlQuery, name]);
   const onClickClose = useCallback(() => {
      setIsOpened(false);
      onClose?.();

      if (urlQuery && name) urlQuery.removeQuery(`${name}-modal`, false);

      setTimeout(() => {
         dialogRef.current?.close();
         setIsOpenedLate(false);
      }, 0.2 * 1000);
   }, [onClose, urlQuery, name]);
   const onKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDialogElement>) => {
         if (event.key === "Escape") {
            if (!withoutCloseButton) return;

            event.preventDefault();
         }
      },
      [withoutCloseButton],
   );

   useImperativeHandle(
      ref,
      (): ModalRef => {
         return {
            open: onClickOpen,
            close: onClickClose,
            isOpened,
         };
      },
      [onClickOpen, onClickClose, isOpened],
   );

   const headerVertical = headerTextAlign === "center";

   return createPortal(
      <DialogStylesElement
         theme={theme}
         colorTheme={colorTheme}
         opacity={!isOpened ? 0 : 1}
         onClose={onClickClose}
         onKeyDown={onKeyDown}
         ref={dialogRef}
      >
         {isOpenedLate ? (
            <Div.column
               position="relative"
               width="100%"
               maxWidth={maxWidth ?? app.contentMaxWidth / 1.3}
               minHeight={`calc(100% - ${theme.styles.space * 2}px)`}
               alignItems="center"
               justifyContent="center"
               marginBlock={theme.styles.space}
               marginInline="auto"
               transform={`translateY(${theme.styles.space}px)`}
               transition={theme.styles.transition}
               animation={isOpened ? "fadeInAnimation 0.2s ease forwards" : "fadeOutAnimation 0.2s ease forwards"}
            >
               <Div
                  position="relative"
                  width="100%"
                  minHeight={32 + theme.styles.space * 2}
                  backgroundColor={backgroundColor ?? theme.colors.backgroundBase}
                  borderRadius={theme.styles.borderRadius * 2}
                  padding={!title ? theme.styles.space : undefined}
                  overflow={overflow}
               >
                  {title ? (
                     <>
                        <Div.row
                           alignItems="center"
                           gap={theme.styles.gap}
                           backgroundColor={headerBackgroundColor}
                           borderTopLeftRadius={theme.styles.borderRadius * 2 - 1}
                           borderTopRightRadius={theme.styles.borderRadius * 2 - 1}
                           paddingInline={theme.styles.space}
                           paddingBlock={theme.styles.space}
                           transition={theme.styles.transition}
                        >
                           <Div.row
                              flex={1}
                              alignItems="center"
                              gap={headerVertical ? theme.styles.space * 2 : theme.styles.space}
                              invertFlexDirection={headerVertical}
                           >
                              {icon &&
                                 (headerVertical ? (
                                    <Div.row
                                       width={76}
                                       height={76}
                                       alignItems="center"
                                       justifyContent="center"
                                       backgroundColor={titleColor ?? theme.colors.textPrimary}
                                       borderRadius={999}
                                    >
                                       <Icon
                                          name={icon}
                                          size={36}
                                          color={headerBackgroundColor ?? theme.colors.backgroundBase}
                                          flexShrink={0}
                                       />
                                    </Div.row>
                                 ) : (
                                    <Icon
                                       name={icon}
                                       size={24}
                                       color={titleColor ?? theme.colors.textPrimary}
                                       flexShrink={0}
                                    />
                                 ))}

                              <Div.column flex={1} gap={theme.styles.gap / 2}>
                                 <Text
                                    as="h1"
                                    textAlign={headerTextAlign}
                                    color={titleColor ?? theme.colors.textPrimary}
                                    transition={theme.styles.transition}
                                 >
                                    {title}
                                 </Text>

                                 {description && (
                                    <Text
                                       textAlign={headerTextAlign}
                                       color={descriptionColor ?? theme.colors.textSecondary}
                                       transition={theme.styles.transition}
                                    >
                                       {description}
                                    </Text>
                                 )}
                              </Div.column>
                           </Div.row>

                           {!withoutCloseButton && (
                              <Button.icon
                                 icon="XMark"
                                 marginTop={1}
                                 iconColor={titleColor}
                                 onClick={onClickClose}
                                 transition={theme.styles.transition}
                                 zIndex={10}
                              />
                           )}
                        </Div.row>

                        <Divider.horizontal />
                     </>
                  ) : (
                     <>
                        {!withoutCloseButton && (
                           <Div position="absolute" top={theme.styles.space} right={theme.styles.space} zIndex={10}>
                              <Button.icon icon="XMark" iconColor={titleColor} onClick={onClickClose} />
                           </Div>
                        )}
                     </>
                  )}

                  <Div padding={title ? theme.styles.space : undefined}>{children}</Div>
               </Div>
            </Div.column>
         ) : undefined}
      </DialogStylesElement>,
      document.body,
   );
}) as any;

ModalComponent.confirmation = forwardRef(function Confirmation(
   { message, continueButtonText = "Continue", continueButtonLoaderName, onContinue, onCancel, ...props },
   ref,
) {
   const theme = useTheme();

   const modalRef = useRef<ModalRef>(null);

   const onCancelElement = useCallback(() => {
      onCancel?.();
      modalRef.current?.close();
   }, [onCancel]);
   const onContinueElement = useCallback(() => {
      onContinue?.();
      modalRef.current?.close();
   }, [onContinue]);

   useImperativeHandle(ref, (): ModalRef => modalRef.current as ModalRef, []);

   return (
      <ModalComponent title="Are you sure?" maxWidth={660} {...props} ref={modalRef}>
         <Text color={theme.colors.textSecondary}>
            {message ?? "Do you really want to continue? This action may be irreversible."}
         </Text>

         <Div.row
            alignItems="center"
            justifyContent="flex-end"
            gap={theme.styles.gap}
            marginTop={theme.styles.space * 2}
         >
            <Button.secondary text="Cancel" onClick={onCancelElement} />
            <Button text={continueButtonText} loaderName={continueButtonLoaderName} onClick={onContinueElement} />
         </Div.row>
      </ModalComponent>
   );
}) as ModalComponent["confirmation"];

ModalComponent.destructive = forwardRef(function Destructive(
   {
      message,
      deleteButtonText = "Delete",
      deleteButtonIconName = "trash",
      deleteButtonLoaderName,
      onDelete,
      onCancel,
      ...props
   },
   ref,
) {
   const theme = useTheme();

   const modalRef = useRef<ModalRef>(null);

   const onCancelElement = useCallback(() => {
      onCancel?.();
      modalRef.current?.close();
   }, [onCancel]);
   const onDeleteElement = useCallback(() => {
      onDelete?.();
      modalRef.current?.close();
   }, [onDelete]);

   useImperativeHandle(ref, (): ModalRef => modalRef.current as ModalRef, []);

   return (
      <ModalComponent title="Are you sure?" maxWidth={660} {...props} ref={modalRef}>
         <Text color={theme.colors.textSecondary}>
            {message ??
               "Do you really want to continue with the deleting of the item? This action may be irreversible."}
         </Text>

         <Div.row
            alignItems="center"
            justifyContent="flex-end"
            gap={theme.styles.gap}
            marginTop={theme.styles.space * 2}
         >
            <Button.secondary text="Cancel" onClick={onCancelElement} />
            <Button.destructive
               icon={deleteButtonIconName}
               text={deleteButtonText}
               loaderName={deleteButtonLoaderName}
               onClick={onDeleteElement}
            />
         </Div.row>
      </ModalComponent>
   );
}) as ModalComponent["destructive"];

const Modal = memo(ModalComponent) as any as typeof ModalComponent & {
   confirmation: typeof ModalComponent.confirmation;
   destructive: typeof ModalComponent.destructive;
};

Modal.confirmation = ModalComponent.confirmation;
Modal.destructive = ModalComponent.destructive;

export default Modal;
