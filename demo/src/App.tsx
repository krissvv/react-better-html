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
   ToggleInput,
   Form,
   useForm,
   PageHeader,
   FormRow,
   getFormErrorObject,
   ColorThemeSwitch,
} from "../../src";

function App() {
   const theme = useTheme();

   const modalRef = useRef<ModalRef>(null);
   const modalWithTitleRef = useRef<ModalRef>(null);
   const confirmationModalRef = useRef<ModalRef>(null);
   const destructiveModalRef = useRef<ModalRef>(null);

   const form = useForm({
      defaultValues: {
         name: "",
         number: undefined as number | undefined,
         email: "",
         phone: "",
         option: undefined as 1 | 2 | 3 | undefined,
         withSurprise: false as boolean,
         fruit: "banana" as "banana" | "apple" | "orange",
         canDelete: false as boolean,
      },
      requiredFields: ["name", "email"],
      validate: (values) => {
         const errors = getFormErrorObject(values);

         return errors;
      },
      onSubmit: (values) => {
         console.log(values);
      },
   });

   return (
      <>
         <PageHolder>
            <Div.column gap={theme.styles.space}>
               <ColorThemeSwitch />
               <ColorThemeSwitch.withText />
               <ColorThemeSwitch.withText withMoon />

               <PageHeader
                  title="Hello there"
                  description="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi ipsa nobis aspernatur."
               />

               <PageHeader
                  title="Hello there"
                  description="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi ipsa nobis aspernatur."
                  rightElement={<Button text="Hello there" />}
               />

               <PageHeader
                  imageUrl="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
                  title="Hello there"
                  description="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi ipsa nobis aspernatur."
                  rightElement={<Button text="Hello there" />}
               />

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
                  width={300}
                  marginBottom={20}
               />
               <InputField label="Label" required infoText="Here is a helper message" placeholder="Placeholder" />
               <InputField.email />
               <InputField.password />
               <InputField.search />
               <InputField.search label="With Debounce" withDebounce />
               <InputField.phoneNumber />
               <InputField.phoneNumber label="Phone number" />

               <InputField.multiline placeholder="Placeholder" />
               <InputField.multiline leftIcon="uploadCloud" placeholder="Placeholder" />
               <InputField.multiline rightIcon="uploadCloud" placeholder="Placeholder" />

               <FormRow>
                  <InputField placeholder="Hello" />
                  <InputField placeholder="Hello" />
               </FormRow>

               <FormRow.withTitle title="Title" description="Description">
                  <InputField placeholder="Hello" />
               </FormRow.withTitle>

               <FormRow.withTitle icon="trash" title="Title" description="Description">
                  <InputField placeholder="Hello" />
               </FormRow.withTitle>

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
                  width={300}
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
                  leftIcon="uploadCloud"
                  required
                  errorText="This is an error"
                  marginBottom={20}
               />
               <Dropdown
                  options={[
                     { label: "Option 1", value: "1" },
                     { label: "Option 2", value: "2" },
                     { label: "Option 3", value: "3" },
                  ]}
                  label="With debounce"
                  withSearch
                  withDebounce
               />

               <ToggleInput.checkbox />
               <ToggleInput.checkbox label="Label" />
               <ToggleInput.checkbox text="Some text here" />
               <ToggleInput.checkbox label="Label" text="Some text here" />
               <ToggleInput.checkbox label="Label" text="Some text here" errorText="This is an error" />
               <ToggleInput.checkbox label="Label" text="Some text here" disabled />

               <ToggleInput.radiobutton />
               <ToggleInput.radiobutton label="Label" />
               <ToggleInput.radiobutton text="Some text here" />
               <ToggleInput.radiobutton label="Label" text="Some text here" />
               <ToggleInput.radiobutton label="Label" text="Some text here" errorText="This is an error" />
               <ToggleInput.radiobutton label="Label" text="Some text here" disabled />

               <ToggleInput.switch />
               <ToggleInput.switch label="Label" />
               <ToggleInput.switch text="Some text here" />
               <ToggleInput.switch label="Label" text="Some text here" />
               <ToggleInput.switch label="Label" text="Some text here" errorText="This is an error" />
               <ToggleInput.switch label="Label" text="Some text here" disabled />

               <Form form={form} gap={theme.styles.gap} submitButtonText="Create" onClickCancel={() => {}}>
                  <InputField placeholder="Name" {...form.getInputFieldProps("name")} />
                  <InputField.email {...form.getInputFieldProps("email")} />
                  <InputField.phoneNumber {...form.getInputFieldProps("phone")} />

                  <InputField placeholder="Name" type="number" {...form.getInputFieldProps("number")} />

                  <Dropdown
                     options={[
                        { label: "Option 1 hello", value: 1 },
                        { label: "Option 2 this", value: 2 },
                        { label: "Option 3 ll", value: 3 },
                     ]}
                     withSearch
                     {...form.getDropdownFieldProps("option")}
                  />

                  <ToggleInput.checkbox label="Label" text="With Surprise" {...form.getCheckboxProps("withSurprise")} />

                  <ToggleInput.radiobutton text="Apple" {...form.getRadioButtonProps("fruit", "apple")} />
                  <ToggleInput.radiobutton text="Banana" {...form.getRadioButtonProps("fruit", "banana")} />
                  <ToggleInput.radiobutton text="Orange" {...form.getRadioButtonProps("fruit", "orange")} />

                  <ToggleInput.switch text="Can Delete" {...form.getSwitchProps("canDelete")} />

                  <FormRow.withTitle title="Title" description="Description" withActions={form.isDirty}>
                     <InputField placeholder="Hello" {...form.getInputFieldProps("name")} />
                  </FormRow.withTitle>
               </Form>

               <Button text="Open modal" onClick={modalRef.current?.open} />
               <Button text="Open modal with title" onClick={modalWithTitleRef.current?.open} />
               <Button text="Open confirmation modal" onClick={confirmationModalRef.current?.open} />
               <Button text="Open destructive modal" onClick={destructiveModalRef.current?.open} />

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

         <Modal name="awd" ref={modalRef}>
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
