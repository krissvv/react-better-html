import { memo, useCallback, forwardRef, useImperativeHandle, useRef, useState } from "react";
import styled from "styled-components";

import { Theme } from "../types/theme";
import { ComponentPropWithRef } from "../types/components";
import { OmitProps } from "../types/app";

import Div from "./Div";
import Button from "./Button";
import Text from "./Text";
import Divider from "./Divider";
import { useBetterHtmlContext, useTheme } from "./BetterHtmlProvider";

type ModalProps = {
   /**
    * If you want to have a small modal, you can use 660px as it looks good on most screens.
    *
    * @default 30% smaller than app.contentMaxWidth
    * */
   maxWidth?: number;
   title?: string;
   titleColor?: string;
   description?: string;
   descriptionColor?: string;
   headerBackgroundColor?: string;
   overflow?: React.CSSProperties["overflow"];
   onOpen?: () => void;
   onClose?: () => void;
   children?: React.ReactNode;
};

export type ModalRef = {
   open: () => void;
   close: () => void;
   isOpened: boolean;
};

type ModalComponent = {
   (props: ComponentPropWithRef<ModalRef, ModalProps>): React.ReactElement;
   confirmation: (
      props: ComponentPropWithRef<
         ModalRef,
         OmitProps<ModalProps, "maxWidth" | "children" | "overflow"> & {
            onConfirm?: () => void;
            onCancel?: () => void;
         }
      >,
   ) => React.ReactElement;
   destructive: (
      props: ComponentPropWithRef<
         ModalRef,
         OmitProps<ModalProps, "maxWidth" | "children" | "overflow"> & {
            onDelete?: () => void;
            onCancel?: () => void;
         }
      >,
   ) => React.ReactElement;
};

const DialogStylesElement = styled.dialog.withConfig({
   shouldForwardProp: (prop) => !["theme", "opacity"].includes(prop),
})<{ theme: Theme; opacity?: number }>`
   width: 100%;
   max-width: none;
   height: 100%;
   max-height: none;
   border: none;
   outline: none;
   background-color: transparent;
   margin: auto auto;
   padding-inline: ${(props) => props.theme.styles.gap}px;
   opacity: ${(props) => props.opacity};
   transition: ${(props) => props.theme.styles.transition};

   &::backdrop {
      background-color: #000000a0;
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

const ModalComponent: ModalComponent = forwardRef(function Modal(
   {
      maxWidth,
      title,
      titleColor,
      description,
      descriptionColor,
      headerBackgroundColor,
      overflow,
      onOpen,
      onClose,
      children,
   }: ModalProps,
   ref: React.ForwardedRef<ModalRef>,
) {
   const theme = useTheme();
   const { app } = useBetterHtmlContext();

   const dialogRef = useRef<HTMLDialogElement>(null);

   const [isOpened, setIsOpened] = useState<boolean>(false);
   const [isOpenedLate, setIsOpenedLate] = useState<boolean>(false);

   const onClickOpen = useCallback(() => {
      dialogRef.current?.showModal();

      setIsOpened(true);
      setIsOpenedLate(true);

      onOpen?.();
   }, [onOpen]);
   const onClickClose = useCallback(() => {
      setIsOpened(false);
      onClose?.();

      setTimeout(() => {
         dialogRef.current?.close();
         setIsOpenedLate(false);
      }, 0.2 * 1000);
   }, [onClose]);

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

   return (
      <DialogStylesElement theme={theme} opacity={!isOpened ? 0 : 1} onClose={onClickClose} ref={dialogRef}>
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
                  backgroundColor={theme.colors.backgroundBase}
                  borderRadius={theme.styles.borderRadius * 2}
                  paddingInline={!title ? theme.styles.space : undefined}
                  paddingBlock={!title ? theme.styles.gap : undefined}
                  overflow={overflow}
               >
                  {title ? (
                     <>
                        <Div.row
                           alignItems="center"
                           gap={theme.styles.gap}
                           backgroundColor={headerBackgroundColor}
                           borderTopLeftRadius={theme.styles.borderRadius * 2}
                           borderTopRightRadius={theme.styles.borderRadius * 2}
                           paddingInline={theme.styles.space}
                           paddingBlock={theme.styles.gap}
                        >
                           <Div.column flex={1} gap={theme.styles.gap / 2}>
                              <Text as="h1" color={titleColor ?? theme.colors.textPrimary}>
                                 {title}
                              </Text>

                              {description && (
                                 <Text color={descriptionColor ?? theme.colors.textSecondary}>{description}</Text>
                              )}
                           </Div.column>

                           <Button.icon icon="XMark" marginTop={1} iconColor={titleColor} onClick={onClickClose} />
                        </Div.row>

                        <Divider.horizontal />
                     </>
                  ) : (
                     <Div position="absolute" top={theme.styles.space} right={theme.styles.space}>
                        <Button.icon icon="XMark" onClick={onClickClose} />
                     </Div>
                  )}

                  <Div
                     paddingInline={title ? theme.styles.space : undefined}
                     paddingBlock={title ? theme.styles.gap : undefined}
                  >
                     {children}
                  </Div>
               </Div>
            </Div.column>
         ) : undefined}
      </DialogStylesElement>
   );
}) as any;

ModalComponent.confirmation = forwardRef(function Confirmation({ onConfirm, onCancel, ...props }, ref) {
   const theme = useTheme();

   return (
      <Modal title="Are you sure?" maxWidth={660} {...props} ref={ref}>
         <Text color={theme.colors.textSecondary}>
            Do you really want to continue? This action may be irreversible.
         </Text>

         <Div.row
            alignItems="center"
            justifyContent="flex-end"
            gap={theme.styles.gap}
            marginTop={theme.styles.space * 2}
         >
            <Button.secondary text="Cancel" onClick={onCancel} />
            <Button text="Continue" onClick={onConfirm} />
         </Div.row>
      </Modal>
   );
}) as ModalComponent["confirmation"];

ModalComponent.destructive = forwardRef(function Destructive({ onDelete, onCancel, ...props }, ref) {
   const theme = useTheme();

   return (
      <Modal title="Are you sure?" maxWidth={660} {...props} ref={ref}>
         <Text color={theme.colors.textSecondary}>
            Do you really want to continue with the deleting of the item? This action may be irreversible.
         </Text>

         <Div.row
            alignItems="center"
            justifyContent="flex-end"
            gap={theme.styles.gap}
            marginTop={theme.styles.space * 2}
         >
            <Button.secondary text="Cancel" onClick={onCancel} />
            <Button.destructive icon="trash" text="Delete" onClick={onDelete} />
         </Div.row>
      </Modal>
   );
}) as ModalComponent["destructive"];

const Modal = memo(ModalComponent) as any as typeof ModalComponent & {
   confirmation: typeof ModalComponent.confirmation;
   destructive: typeof ModalComponent.destructive;
};

Modal.confirmation = ModalComponent.confirmation;
Modal.destructive = ModalComponent.destructive;

export default Modal;
