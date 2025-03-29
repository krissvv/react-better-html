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
   InputField,
   Dropdown,
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

               <InputField placeholder="Placeholder" />
               <InputField placeholder="Placeholder" disabled />
               <InputField label="Label" leftIcon="uploadCloud" placeholder="Placeholder" />
               <InputField label="Label" rightIcon="uploadCloud" required placeholder="Placeholder" />
               <InputField
                  label="Label"
                  rightIcon="uploadCloud"
                  onClickRightIcon={() => {}}
                  required
                  errorText="This is an error"
                  placeholder="Placeholder"
               />
               <InputField label="Label" required infoText="Here is a helper message" placeholder="Placeholder" />
               <InputField.email />
               <InputField.password />
               <InputField.search />

               <InputField.multiline placeholder="Placeholder" />

               <Dropdown
                  options={[
                     { label: "Option 1", value: "1" },
                     { label: "Option 2", value: "2" },
                     { label: "Option 3", value: "3", disabled: true },
                  ]}
               />
               <Dropdown
                  options={[
                     { label: "Option 1 hello", value: "1" },
                     { label: "Option 2 this", value: "2" },
                     { label: "Option 3 ll", value: "3" },
                  ]}
                  withSearch
               />
               <Dropdown
                  options={[
                     { label: "Option 1", value: "1" },
                     { label: "Option 2", value: "2" },
                     { label: "Option 3", value: "3" },
                  ]}
                  disabled
               />
               <Dropdown
                  options={[
                     { label: "Option 1", value: "1" },
                     { label: "Option 2", value: "2" },
                     { label: "Option 3", value: "3" },
                  ]}
                  label="Label"
                  leftIcon="uploadCloud"
               />
               <Dropdown
                  options={[
                     { label: "Option 1", value: "1" },
                     { label: "Option 2", value: "2" },
                     { label: "Option 3", value: "3" },
                  ]}
                  label="Label"
                  placeholder="Placeholder"
                  renderOption={(option) => (
                     <Div.row alignItems="center" gap={theme.styles.gap}>
                        <Div
                           width={20}
                           height={20}
                           borderRadius={theme.styles.borderRadius / 2}
                           backgroundColor="red"
                        />
                        <Text>{option.label}</Text>
                     </Div.row>
                  )}
               />
               <Dropdown
                  options={[
                     { label: "Option 1", value: "1" },
                     { label: "Option 2", value: "2" },
                     { label: "Option 3", value: "3" },
                  ]}
                  label="Label"
                  placeholder="Placeholder"
                  required
               />
               <Dropdown
                  options={[
                     { label: "Option 1", value: "1" },
                     { label: "Option 2", value: "2" },
                     { label: "Option 3", value: "3" },
                  ]}
                  label="Label"
                  placeholder="Placeholder"
                  required
                  errorText="This is an error"
               />

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
                  <Button.secondary text="Hello there" isSmall disabled />
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
