import { memo, useRef } from "react";

import {
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
   useTheme,
   Chip,
} from "../../src";

function App() {
   const theme = useTheme();

   const modalRef = useRef<ModalRef>(null);
   const modalWithTitleRef = useRef<ModalRef>(null);
   const confirmationModalRef = useRef<ModalRef>(null);
   const destructiveModalRef = useRef<ModalRef>(null);

   return (
      <>
         <PageHolder>
            <Div.column gap={theme.styles.space}>
               <Text as="h1">Hello</Text>

               <Div.box>App</Div.box>

               <Loader />
               <Loader.box />
               <Loader.text />

               <Icon name="XMark" />

               <Image name="logo" width={300} />

               <Divider.horizontal />
               <Div height={100}>
                  <Divider.vertical />
               </Div>

               <Chip text="Some text" />
               <Chip.circle text="Some text" backgroundColor="red" color="white" />

               <Button text="Open modal" onClick={() => modalRef.current?.open()} />
               <Button text="Open modal with title" onClick={() => modalWithTitleRef.current?.open()} />
               <Button text="Open confirmation modal" onClick={() => confirmationModalRef.current?.open()} />
               <Button text="Open destructive modal" onClick={() => destructiveModalRef.current?.open()} />

               <Div.row alignItems="center" gap={theme.styles.gap}>
                  <Button text="Hello there" />
                  <Button.secondary text="Hello there" />
                  <Button.destructive text="Hello there" />
                  <Button.icon icon="XMark" />
                  <Button.upload />
               </Div.row>
               <Div.row alignItems="center" gap={theme.styles.gap}>
                  <Button text="Hello there" isSmall />
                  <Button.secondary text="Hello there" isSmall />
                  <Button.destructive text="Hello there" isSmall />
                  <Button.icon icon="XMark" />
                  <Button.upload isSmall />
               </Div.row>
               <Div.row alignItems="center" gap={theme.styles.gap}>
                  <Button text="Hello there" isLoading />
                  <Button.secondary text="Hello there" isLoading />
                  <Button.destructive text="Hello there" isLoading />
                  <Button.icon icon="XMark" isLoading />
                  <Button.upload isLoading />
               </Div.row>
            </Div.column>
         </PageHolder>

         <Modal ref={modalRef}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae cumque tempore qui?
         </Modal>

         <Modal title="My Modal" description="Lorem ipsum dolor sit amet" ref={modalWithTitleRef}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae cumque tempore qui?
         </Modal>
         <Modal.confirmation ref={confirmationModalRef} />
         <Modal.destructive ref={destructiveModalRef} />
      </>
   );
}

export default memo(App);
