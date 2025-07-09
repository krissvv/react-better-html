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
   loaderControls,
   useLoader,
   Table,
   Tabs,
   Foldable,
   Tooltip,
   useAlertControls,
   useBooleanState,
} from "../../src";

const data: {
   id: number;
   name: string;
   age: number;
   email: string;
   image: string;
   date: string;
   color: string;
   data?: {
      name: string;
   };
}[] = [
   {
      id: 1,
      name: "Kris",
      age: 25,
      email: "kris@kris.com",
      image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
      date: "2025-06-19",
      color: "red",
      data: {
         name: "Kris",
      },
   },
   {
      id: 2,
      name: "John",
      age: 30,
      email: "john@john.com",
      image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
      date: "2025-06-20",
      color: "red",
   },
   {
      id: 3,
      name: "Jane",
      age: 22,
      email: "jane@jane.com",
      image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
      date: "2025-06-21",
      color: "green",
   },
   {
      id: 4,
      name: "Bob",
      age: 28,
      email: "bob@bob.com",
      image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
      date: "2025-06-22",
      color: "red",
   },
   {
      id: 5,
      name: "Alice",
      age: 27,
      email: "alice@alice.com",
      image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
      date: "2025-06-23",
      color: "green",
   },
   {
      id: 6,
      name: "awd",
      age: 27,
      email: "awd@awd.com",
      image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
      date: "2025-06-24T14:04:59.180489",
      color: "green",
   },
];

const data2 = [
   {
      id: 1,
      name: "Kris",
      age: 25,
      email: "kris@kris.com",
      image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
      checked: true,
   },
   {
      id: 2,
      name: "John",
      age: 30,
      email: "john@john.com",
      image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
      checked: true,
   },
   {
      id: 3,
      name: "Jane",
      age: 22,
      email: "jane@jane.com",
      image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
      checked: true,
   },
   {
      id: 4,
      name: "Bob",
      age: 28,
      email: "bob@bob.com",
      image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
      checked: true,
   },
   {
      id: 5,
      name: "Alice",
      age: 27,
      email: "alice@alice.com",
      image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
      checked: true,
   },
];

function App() {
   const theme = useTheme();
   const alertControls = useAlertControls();

   const testLoaderIsLoading = useLoader("testLoader");

   const modalRef = useRef<ModalRef>(null);
   const modalWithTitleRef = useRef<ModalRef>(null);
   const modalWithFoldableRef = useRef<ModalRef>(null);
   const modalWithoutCloseRef = useRef<ModalRef>(null);
   const confirmationModalRef = useRef<ModalRef>(null);
   const destructiveModalRef = useRef<ModalRef>(null);

   const [bigHeight, setBigHeight] = useBooleanState();

   const form = useForm({
      defaultValues: {
         name: "",
         number: undefined as number | undefined,
         email: "",
         phone: "",
         option: undefined as 1 | 2 | 3 | undefined,
         withSurprise: false as boolean,
         fruit: "banana" as "banana" | "apple" | "orange",
         date: "2024-01-01",
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
            <Div.column gap={theme.styles.space} marginBottom={theme.styles.space}>
               <ColorThemeSwitch />
               <ColorThemeSwitch.withText />
               <ColorThemeSwitch.withText withMoon />
            </Div.column>

            <Tabs
               tabs={[
                  "PageHeader",
                  "Text",
                  "Div",
                  "Loader",
                  "Alert",
                  "Icon & Image",
                  "Divider",
                  "Chip",
                  "InputField",
                  "Dropdown",
                  "ToggleInput",
                  "Form",
                  "Button",
                  "Modal",
                  "Table",
                  "Foldable",
                  "Tooltip",
               ]}
               style="borderRadiusTop"
               // style="box"
            >
               <Tabs.content tab="PageHeader" tabWithDot>
                  <Div.column gap={theme.styles.space}>
                     <PageHeader
                        title="Hello there"
                        description="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi ipsa nobis aspernatur."
                     />

                     <PageHeader
                        title="Hello there"
                        description="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi ipsa nobis aspernatur."
                        textAlign="center"
                     />

                     <PageHeader
                        title="Hello there"
                        description="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi ipsa nobis aspernatur."
                        textAlign="right"
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
                  </Div.column>
               </Tabs.content>

               <Tabs.content tab="Text">
                  <Div.column gap={theme.styles.space}>
                     <Text as="h1">Hello</Text>
                     <Text as="h2">Hello</Text>
                     <Text as="h3">Hello</Text>
                     <Text as="h4">Hello</Text>
                     <Text as="h5">Hello</Text>
                     <Text as="h6">Hello</Text>
                     <Text>Hello</Text>
                  </Div.column>
               </Tabs.content>

               <Tabs.content tab="Div">
                  <Div.column gap={theme.styles.space}>
                     <Div.row width="fit-content" gap={theme.styles.gap}>
                        <Text>1</Text>
                        <Text>2</Text>
                        <Text>3</Text>
                        <Text>4</Text>
                     </Div.row>

                     <Div.row width="fit-content" gap={theme.styles.gap} flexReverse>
                        <Text>1</Text>
                        <Text>2</Text>
                        <Text>3</Text>
                        <Text>4</Text>
                     </Div.row>

                     <Div.box>App</Div.box>
                     <Div.box onClick={() => {}}>App</Div.box>
                     <Div.box isActive>App</Div.box>
                     <Div.box isActive onClick={() => {}}>
                        App
                     </Div.box>
                  </Div.column>
               </Tabs.content>

               <Tabs.content tab="Loader">
                  <Div.column gap={theme.styles.space}>
                     <Loader />
                     <Loader.box />
                     <Loader.text />

                     <Div.row alignItems="center" gap={theme.styles.gap}>
                        <Button
                           text="Start loading from function"
                           onClick={() => {
                              if (testLoaderIsLoading) loaderControls.stopLoading("testLoader");
                              else loaderControls.startLoading("testLoader");
                           }}
                        />

                        {testLoaderIsLoading && <Loader />}
                     </Div.row>
                  </Div.column>
               </Tabs.content>

               <Tabs.content tab="Alert">
                  <Div.column gap={theme.styles.space}>
                     <Div.row gap={theme.styles.gap}>
                        <Button
                           text="Short info alert"
                           onClick={() => {
                              alertControls.createAlert({
                                 type: "info",
                                 message: "Lorem ipsum",
                              });
                           }}
                        />
                        <Button
                           text="Info alert"
                           onClick={() => {
                              alertControls.createAlert({
                                 type: "info",
                                 title: "Hello there",
                                 message: "Lorem ipsum dolor sit amet consectetur",
                                 duration: 1000,
                                 onClose: (alert) => {
                                    console.log("Alert closed", alert.id);
                                 },
                              });
                           }}
                        />
                        <Button
                           text="Success alert"
                           onClick={() => {
                              alertControls.createAlert({
                                 type: "success",
                                 title: "Hello there",
                                 message: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
                              });
                           }}
                        />
                        <Button
                           text="Warning alert"
                           onClick={() => {
                              alertControls.createAlert({
                                 type: "warning",
                                 title: "Hello there",
                                 message:
                                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ipsa nobis aspernatur.",
                              });
                           }}
                        />
                        <Button
                           text="Error alert"
                           onClick={() => {
                              alertControls.createAlert({
                                 type: "error",
                                 title: "Hello there",
                                 message:
                                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ipsa nobis aspernatur. Commodi ipsa nobis aspernatur.",
                              });
                           }}
                        />
                     </Div.row>
                  </Div.column>
               </Tabs.content>

               <Tabs.content tab="Icon & Image">
                  <Div.column gap={theme.styles.space}>
                     <Icon name="XMark" />

                     <Image name="logo" width={300} />

                     <Image.profileImage src="https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png" />
                     <Image.profileImage letters="a" />
                     <Image.profileImage letters="Abc" />
                     <Image.profileImage letters="A" size={64} />
                     <Image.profileImage letters="Abc" size={100} />
                  </Div.column>
               </Tabs.content>

               <Tabs.content tab="Divider">
                  <Div.column gap={theme.styles.space}>
                     <Divider.horizontal />

                     <Div height={100}>
                        <Divider.vertical />
                     </Div>
                  </Div.column>
               </Tabs.content>

               <Tabs.content tab="Chip">
                  <Div.column gap={theme.styles.space}>
                     <Div.row alignItems="center" gap={theme.styles.gap} overflowX="auto">
                        <Chip text="Some text" />
                        <Chip text="Some text" backgroundColor="#ff0000" color={theme.colors.base} />
                        <Chip text="Some text" backgroundColor="#abe435" />
                        <Chip text="Some text" backgroundColor="#395fec" color={theme.colors.base} />
                        <Chip text="Some text" backgroundColor="#f5bc1e" />
                     </Div.row>

                     <Div.row alignItems="center" gap={theme.styles.gap} overflowX="auto">
                        <Chip text="Some text" isCircle />
                        <Chip text="Some text" backgroundColor="#ff0000" color={theme.colors.base} isCircle />
                        <Chip text="Some text" backgroundColor="#abe435" isCircle />
                        <Chip text="Some text" backgroundColor="#395fec" color={theme.colors.base} isCircle />
                        <Chip text="Some text" backgroundColor="#f5bc1e" isCircle />
                     </Div.row>

                     <Div.row alignItems="center" gap={theme.styles.gap} overflowX="auto">
                        <Chip.colored text="Some text" />
                        <Chip.colored text="Some text" color="#ff0000" />
                        <Chip.colored text="Some text" color="#abe435" />
                        <Chip.colored text="Some text" color="#395fec" />
                        <Chip.colored text="Some text" color="#f5bc1e" />
                     </Div.row>

                     <Div.row alignItems="center" gap={theme.styles.gap} overflowX="auto">
                        <Chip.colored text="Some text" isCircle />
                        <Chip.colored text="Some text" color="#ff0000" isCircle />
                        <Chip.colored text="Some text" color="#abe435" isCircle />
                        <Chip.colored text="Some text" color="#395fec" isCircle />
                        <Chip.colored text="Some text" color="#f5bc1e" isCircle />
                     </Div.row>
                  </Div.column>
               </Tabs.content>

               <Tabs.content tab="InputField">
                  <Div.column gap={theme.styles.space}>
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
                     <InputField.date label="Date" leftIcon="XMark" />
                     <InputField.dateTime label="Date & Time" />
                     <InputField.time label="Time" />
                     <InputField.color label="Color" />

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
                  </Div.column>
               </Tabs.content>

               <Tabs.content tab="Dropdown">
                  <Div.column gap={theme.styles.space}>
                     <Dropdown
                        options={[
                           { label: "Option 1", value: "1" },
                           { label: "Option 2", value: "2" },
                           { label: "Option 3", value: "3", disabled: true },
                        ]}
                     />
                     <Dropdown.countries />
                     <Dropdown.countries withSearch />
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
                  </Div.column>
               </Tabs.content>

               <Tabs.content tab="ToggleInput">
                  <Div.column gap={theme.styles.space}>
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
                  </Div.column>
               </Tabs.content>

               <Tabs.content tab="Form">
                  <Div.column gap={theme.styles.space * 10}>
                     <Form
                        form={form}
                        gap={theme.styles.gap}
                        submitButtonText="Create"
                        submitButtonLoaderName="testLoader"
                        onClickCancel={() => {}}
                     >
                        <InputField placeholder="Name" {...form.getInputFieldProps("name")} />
                        <InputField.email {...form.getInputFieldProps("email")} />
                        <InputField.phoneNumber {...form.getInputFieldProps("phone")} />

                        <InputField placeholder="Name" type="number" {...form.getInputFieldProps("number")} />
                        <InputField.date label="Date" {...form.getInputFieldProps("date")} />

                        <Dropdown
                           options={[
                              { label: "Option 1 hello", value: 1 },
                              { label: "Option 2 this", value: 2 },
                              { label: "Option 3 ll", value: 3 },
                           ]}
                           withSearch
                           {...form.getDropdownFieldProps("option")}
                        />

                        <ToggleInput.checkbox
                           label="Label"
                           text="With Surprise"
                           {...form.getCheckboxProps("withSurprise")}
                        />

                        <ToggleInput.radiobutton text="Apple" {...form.getRadioButtonProps("fruit", "apple")} />
                        <ToggleInput.radiobutton text="Banana" {...form.getRadioButtonProps("fruit", "banana")} />
                        <ToggleInput.radiobutton text="Orange" {...form.getRadioButtonProps("fruit", "orange")} />

                        <ToggleInput.switch text="Can Delete" {...form.getSwitchProps("canDelete")} />

                        <FormRow.withTitle title="Title" description="Description" withActions={form.isDirty}>
                           <InputField placeholder="Hello" {...form.getInputFieldProps("name")} />
                        </FormRow.withTitle>
                     </Form>

                     <Form form={form} withDividers submitButtonText="Create" onClickCancel={() => {}}>
                        <FormRow.withTitle title="Title" description="Description" withActions={form.isDirty}>
                           <InputField placeholder="Hello" {...form.getInputFieldProps("name")} />
                        </FormRow.withTitle>
                        <FormRow.withTitle title="Title" description="Description" withActions={form.isDirty}>
                           <InputField placeholder="Hello" {...form.getInputFieldProps("name")} />
                        </FormRow.withTitle>
                        <FormRow.withTitle title="Title" description="Description" isLoading withActions={form.isDirty}>
                           <InputField placeholder="Hello" {...form.getInputFieldProps("name")} />
                        </FormRow.withTitle>
                     </Form>
                  </Div.column>
               </Tabs.content>

               <Tabs.content tab="Button">
                  <Div.column gap={theme.styles.space}>
                     <Div.row alignItems="center" gap={theme.styles.gap} overflowX="auto">
                        <Button text="Hello there" href="/" />
                     </Div.row>

                     <Div.row alignItems="center" gap={theme.styles.gap} overflowX="auto">
                        <Button text="Hello there" />
                        <Button.secondary text="Hello there" />
                        <Button.destructive text="Hello there" />
                        <Button.icon icon="XMark" />
                        <Button.upload />
                     </Div.row>

                     <Div.row alignItems="center" gap={theme.styles.gap} overflowX="auto">
                        <Button text="Hello there" isSmall />
                        <Button.secondary text="Hello there" isSmall />
                        <Button.secondary text="Hello there" isSmall disabled />
                        <Button.destructive text="Hello there" isSmall />
                        <Button.icon icon="XMark" />
                        <Button.upload isSmall />
                     </Div.row>

                     <Div.row alignItems="center" gap={theme.styles.gap} overflowX="auto">
                        <Button text="Hello there" isLoading />
                        <Button.secondary text="Hello there" isLoading />
                        <Button.destructive text="Hello there" isLoading />
                        <Button.icon icon="XMark" isLoading />
                        <Button.upload isLoading />
                     </Div.row>
                  </Div.column>
               </Tabs.content>

               <Tabs.content tab="Modal">
                  <Div.column gap={theme.styles.space}>
                     <Button text="Open modal" onClick={() => modalRef.current?.open()} />
                     <Button text="Open modal with title" onClick={() => modalWithTitleRef.current?.open()} />
                     <Button text="Open modal with foldable" onClick={() => modalWithFoldableRef.current?.open()} />
                     <Button text="Open modal without close " onClick={() => modalWithoutCloseRef.current?.open()} />
                     <Button text="Open confirmation modal" onClick={() => confirmationModalRef.current?.open()} />
                     <Button text="Open destructive modal" onClick={() => destructiveModalRef.current?.open()} />
                  </Div.column>

                  <Modal name="awd" ref={modalRef}>
                     Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae cumque tempore qui?
                  </Modal>

                  <Modal title="My Modal" description="Lorem ipsum dolor sit amet" ref={modalWithTitleRef}>
                     Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae cumque tempore qui?
                  </Modal>

                  <Modal
                     title="My Modal With Foldable"
                     description="Lorem ipsum dolor sit amet"
                     ref={modalWithFoldableRef}
                  >
                     <Foldable
                        icon="magnifyingGlass"
                        title="Lorem ipsum dolor"
                        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, ullam, necessitatibus harum"
                     >
                        <Div.column gap={theme.styles.gap}>
                           <Text>
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, ullam, necessitatibus
                              harum error voluptas natus iste labore amet, itaque enim quae delectus exercitationem!
                              Ullam saepe, harum deserunt qui labore officiis id nisi atque nobis laudantium impedit
                              adipisci reprehenderit. Consequatur, vel.
                           </Text>

                           <Dropdown
                              options={[
                                 { label: "Option 1", value: "1" },
                                 { label: "Option 2", value: "2" },
                                 { label: "Option 3", value: "3" },
                              ]}
                           />
                        </Div.column>
                     </Foldable>
                  </Modal>

                  <Modal
                     title="My Modal With Foldable"
                     description="Lorem ipsum dolor sit amet"
                     withoutCloseButton
                     ref={modalWithoutCloseRef}
                  >
                     Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae cumque tempore qui?
                     <Button text="Close" onClick={() => modalWithoutCloseRef.current?.close()} />
                  </Modal>

                  <Modal.confirmation ref={confirmationModalRef} />

                  <Modal.destructive ref={destructiveModalRef} />
               </Tabs.content>

               <Tabs.content tab="Table">
                  <Div.column gap={theme.styles.space}>
                     <Table
                        columns={[
                           {
                              type: "text",
                              label: "ID",
                              keyName: "id",
                              width: 52,
                           },
                           {
                              type: "text",
                              label: "Name",
                              keyName: "name",
                           },
                           {
                              type: "text",
                              label: "Email",
                              keyName: "email",
                           },
                           {
                              type: "text",
                              label: "Age",
                              keyName: "age",
                              align: "center",
                              width: 70,
                           },
                        ]}
                        data={[]}
                     />
                     <Table
                        columns={[
                           {
                              type: "text",
                              label: "ID",
                              keyName: "id",
                              width: 52,
                           },
                           {
                              type: "text",
                              label: "Name",
                              keyName: "name",
                           },
                           {
                              type: "text",
                              label: "Email",
                              keyName: "email",
                           },
                           {
                              type: "text",
                              label: "Age",
                              keyName: "age",
                              align: "center",
                              width: 70,
                           },
                        ]}
                        data={[]}
                        isLoading
                     />
                     <Table
                        columns={[
                           {
                              type: "text",
                              label: "ID",
                              keyName: "id",
                              width: 52,
                           },
                           {
                              type: "text",
                              label: "Name",
                              keyName: "name",
                           },
                           {
                              type: "text",
                              label: "Email",
                              keyName: "email",
                           },
                           {
                              type: "text",
                              label: "Age",
                              keyName: "age",
                              align: "center",
                              width: 70,
                           },
                        ]}
                        data={data}
                        withStickyHeader
                        getRowStyle={(item) => ({
                           color: item.id === 2 ? theme.colors.base : undefined,
                           backgroundColor: item.id === 2 ? theme.colors.error : undefined,
                        })}
                     />
                     <Table
                        columns={[
                           {
                              type: "checkbox",
                              getToggleInputProps: {
                                 onChange: (checked, value) => {
                                    console.log(checked, value);
                                 },
                              },
                           },
                           {
                              type: "text",
                              label: "ID",
                              keyName: "id",
                              width: 60 + theme.styles.gap + 32,
                              filter: "number",
                           },
                           {
                              type: "text",
                              label: "Name",
                              keyName: "name",
                           },
                           {
                              type: "text",
                              label: "Email",
                              keyName: "email",
                           },
                           {
                              type: "text",
                              label: "Date",
                              keyName: "date",
                              filter: "date",
                              getValue: (value) => new Date(value.date),
                              presets: [
                                 "lastMonth",
                                 "lastWeek",
                                 "yesterday",
                                 "today",
                                 "tomorrow",
                                 "thisWeek",
                                 "thisMonth",
                                 "thisYear",
                              ],
                           },
                           {
                              type: "text",
                              label: "Color",
                              keyName: "color",
                              filter: "list",
                              withTotalNumber: true,
                              withSearch: true,
                              getValueForList: (item) => ({
                                 label: `${item.color[0].toUpperCase()}${item.color.slice(1)}`,
                                 value: item.color,
                              }),
                           },
                           {
                              type: "text",
                              label: "Age",
                              keyName: "age",
                              align: "center",
                              width: 70,
                           },
                        ]}
                        data={data}
                     />
                     <Table
                        columns={[
                           {
                              type: "checkbox",
                           },
                           {
                              type: "text",
                              label: "ID",
                              keyName: "id",
                              width: 52,
                           },
                           {
                              type: "text",
                              label: "Name",
                              keyName: "name",
                           },
                           {
                              type: "text",
                              label: "Email",
                              keyName: "email",
                           },
                           {
                              type: "text",
                              label: "Age",
                              keyName: "age",
                              align: "center",
                              width: 70,
                           },
                           {
                              type: "element",
                              width: 50,
                              clickStopPropagation: true,
                              render: () => (
                                 <Tooltip
                                    content={
                                       <>
                                          <Tooltip.item text="Hello" />
                                       </>
                                    }
                                    contentMinWidth={200}
                                    asContextMenu
                                    withArrow
                                    align="right"
                                    trigger="click"
                                 >
                                    <Button.icon icon="filter" />
                                 </Tooltip>
                              ),
                           },
                        ]}
                        data={data2}
                        onClickRow={(item) => console.log(item.id)}
                        onClickAllCheckboxes={() => {}}
                     />
                     <Table
                        columns={[
                           {
                              type: "image",
                              label: "Image",
                              getImageProps: (item) => ({
                                 src: item.image,
                              }),
                           },
                           {
                              type: "text",
                              label: "ID",
                              keyName: "id",
                              width: 52,
                           },
                           {
                              type: "text",
                              label: "Name",
                              keyName: "name",
                           },
                           {
                              type: "text",
                              label: "Email",
                              keyName: "email",
                           },
                           {
                              type: "text",
                              label: "Age",
                              keyName: "age",
                              align: "center",
                              width: 70,
                           },
                        ]}
                        data={data}
                     />

                     <Table
                        columns={[
                           {
                              type: "text",
                              label: "ID",
                              keyName: "id",
                              width: 52,
                           },
                           {
                              type: "text",
                              label: "Name",
                              keyName: "name",
                           },
                           {
                              type: "text",
                              label: "Email",
                              keyName: "email",
                           },
                           {
                              type: "text",
                              label: "Age",
                              keyName: "age",
                              align: "center",
                              width: 70,
                           },
                        ]}
                        data={data}
                        pageSize={3}
                     />

                     <Table
                        columns={[
                           {
                              type: "expand",
                              onlyOneExpanded: true,
                              render: (item) => {
                                 return <Text>Hello there: {item.name}</Text>;
                              },
                           },
                           {
                              type: "text",
                              label: "ID",
                              keyName: "id",
                              width: 52,
                           },
                           {
                              type: "text",
                              label: "Name",
                              keyName: "name",
                           },
                           {
                              type: "text",
                              label: "Email",
                              keyName: "email",
                           },
                           {
                              type: "text",
                              label: "Age",
                              keyName: "age",
                              align: "center",
                              width: 70,
                           },
                        ]}
                        data={data}
                     />

                     <Table
                        columns={[
                           {
                              type: "expand",
                              render: () => (
                                 <Table
                                    columns={[
                                       {
                                          type: "text",
                                          label: "ID",
                                          keyName: "id",
                                          width: 52,
                                       },
                                       {
                                          type: "text",
                                          label: "Name",
                                          keyName: "name",
                                       },
                                       {
                                          type: "text",
                                          label: "Email",
                                          keyName: "email",
                                       },
                                       {
                                          type: "text",
                                          label: "Age",
                                          keyName: "age",
                                          align: "center",
                                          width: 70,
                                       },
                                    ]}
                                    data={data}
                                    isInsideTableExpandRow
                                 />
                              ),
                           },
                           {
                              type: "text",
                              label: "ID",
                              keyName: "id",
                              width: 52,
                           },
                           {
                              type: "text",
                              label: "Name",
                              keyName: "name",
                           },
                           {
                              type: "text",
                              label: "Email",
                              keyName: "email",
                           },
                           {
                              type: "text",
                              label: "Age",
                              keyName: "age",
                              align: "center",
                              width: 70,
                           },
                        ]}
                        data={data}
                     />
                  </Div.column>
               </Tabs.content>

               <Tabs.content tab="Foldable">
                  <Div.column gap={theme.styles.space}>
                     <Foldable title="Lorem ipsum dolor">
                        <Text>
                           Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, ullam, necessitatibus harum
                           error voluptas natus iste labore amet, itaque enim quae delectus exercitationem! Ullam saepe,
                           harum deserunt qui labore officiis id nisi atque nobis laudantium impedit adipisci
                           reprehenderit. Consequatur, vel.
                        </Text>
                     </Foldable>

                     <Foldable
                        icon="magnifyingGlass"
                        title="Lorem ipsum dolor"
                        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, ullam, necessitatibus harum"
                     >
                        <Text>
                           Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, ullam, necessitatibus harum
                           error voluptas natus iste labore amet, itaque enim quae delectus exercitationem! Ullam saepe,
                           harum deserunt qui labore officiis id nisi atque nobis laudantium impedit adipisci
                           reprehenderit. Consequatur, vel.
                        </Text>
                     </Foldable>

                     <Foldable
                        image="logo"
                        title="Lorem ipsum dolor"
                        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, ullam, necessitatibus harum"
                     >
                        <Text>
                           Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, ullam, necessitatibus harum
                           error voluptas natus iste labore amet, itaque enim quae delectus exercitationem! Ullam saepe,
                           harum deserunt qui labore officiis id nisi atque nobis laudantium impedit adipisci
                           reprehenderit. Consequatur, vel.
                        </Text>
                     </Foldable>

                     <Foldable.box title="Lorem ipsum dolor">
                        <Text>
                           Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, ullam, necessitatibus harum
                           error voluptas natus iste labore amet, itaque enim quae delectus exercitationem! Ullam saepe,
                           harum deserunt qui labore officiis id nisi atque nobis laudantium impedit adipisci
                           reprehenderit. Consequatur, vel.
                        </Text>
                     </Foldable.box>

                     <Foldable.box
                        icon="magnifyingGlass"
                        title="Lorem ipsum dolor"
                        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, ullam, necessitatibus harum"
                     >
                        <Text>
                           Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, ullam, necessitatibus harum
                           error voluptas natus iste labore amet, itaque enim quae delectus exercitationem! Ullam saepe,
                           harum deserunt qui labore officiis id nisi atque nobis laudantium impedit adipisci
                           reprehenderit. Consequatur, vel.
                        </Text>
                     </Foldable.box>

                     <Foldable.box
                        image="logo"
                        title="Lorem ipsum dolor"
                        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, ullam, necessitatibus harum"
                     >
                        <Text>
                           Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, ullam, necessitatibus harum
                           error voluptas natus iste labore amet, itaque enim quae delectus exercitationem! Ullam saepe,
                           harum deserunt qui labore officiis id nisi atque nobis laudantium impedit adipisci
                           reprehenderit. Consequatur, vel.
                        </Text>

                        <Button text="Change height" onClick={setBigHeight.toggle} />

                        {bigHeight && (
                           <Text>
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, ullam, necessitatibus
                              harum error voluptas natus iste labore amet, itaque enim quae delectus exercitationem!
                              Ullam saepe, harum deserunt qui labore officiis id nisi atque nobis laudantium impedit
                              adipisci reprehenderit. Consequatur, vel.
                           </Text>
                        )}
                     </Foldable.box>
                  </Div.column>
               </Tabs.content>

               <Tabs.content tab="Tooltip">
                  <Div.column gap={theme.styles.space}>
                     <Div.row gap={theme.styles.gap} flexWrap="wrap">
                        <Tooltip
                           content={<Text>This is a tooltip that appears on hover</Text>}
                           contentMinWidth={220}
                           position="top"
                           withArrow
                        >
                           <Button text="Hover me (top)" />
                        </Tooltip>

                        <Tooltip content="Hello" position="top" withArrow>
                           <Button text="Hover me (top) 2" />
                        </Tooltip>

                        <Tooltip content="Hello" position="top" withArrow isSmall>
                           <Button text="Hover me (top) 2 small" />
                        </Tooltip>

                        <Tooltip
                           content={
                              <Div.column gap={theme.styles.gap}>
                                 <Text fontWeight="bold">Rich Content Tooltip</Text>
                                 <Text>You can put any content in tooltips</Text>
                                 <Divider.horizontal />
                                 <Text color={theme.colors.textSecondary}>Including multiple elements</Text>
                              </Div.column>
                           }
                           contentMinWidth={220}
                           position="bottom"
                           withArrow
                        >
                           <Button text="Hover me (bottom)" />
                        </Tooltip>

                        <Tooltip
                           content={
                              <Text>Left positioned tooltip Left positioned tooltip Left positioned tooltip</Text>
                           }
                           contentMinWidth={220}
                           position="left"
                           withArrow
                        >
                           <Button text="Hover me (left)" />
                        </Tooltip>

                        <Tooltip
                           content={<Text>Right positioned tooltip</Text>}
                           contentMinWidth={220}
                           position="right"
                           withArrow
                        >
                           <Button text="Hover me (right)" />
                        </Tooltip>
                     </Div.row>

                     <Div.row gap={theme.styles.gap} flexWrap="wrap">
                        <Tooltip
                           content={<Text>This tooltip appears on click</Text>}
                           contentMinWidth={220}
                           position="top"
                           trigger="click"
                        >
                           <Button text="Click me (top)" />
                        </Tooltip>

                        <Tooltip
                           content={
                              <Div.column gap={theme.styles.gap}>
                                 <Text fontWeight="bold">Interactive Tooltip</Text>
                                 <Text>This tooltip stays open until you click elsewhere</Text>
                                 <Button text="A button inside tooltip" marginTop={theme.styles.gap} />
                              </Div.column>
                           }
                           contentMinWidth={220}
                           position="bottom"
                           trigger="click"
                           withArrow
                        >
                           <Button text="Click me (bottom)" />
                        </Tooltip>
                     </Div.row>

                     <Div.row gap={theme.styles.gap} flexWrap="wrap">
                        <Tooltip
                           content={<Text color={theme.colors.base}>Custom background color</Text>}
                           contentMinWidth={220}
                           backgroundColor={theme.colors.success}
                        >
                           <Button text="Custom colors" />
                        </Tooltip>

                        <Tooltip
                           content={<Text color={theme.colors.base}>Custom background color</Text>}
                           contentMinWidth={220}
                           backgroundColor={theme.colors.success}
                           withArrow
                        >
                           <Button text="Custom colors arrow" />
                        </Tooltip>

                        <Tooltip content={<Text>No arrow tooltip</Text>} contentMinWidth={220}>
                           <Button text="No arrow" />
                        </Tooltip>
                     </Div.row>

                     <Div.row gap={theme.styles.gap} flexWrap="wrap">
                        <Tooltip
                           content={
                              <>
                                 <Tooltip.sectionTitle text="Section title" />
                                 <Tooltip.item icon="filter" text="Hello there" />
                                 <Tooltip.item icon="filter" text="Hello there" isActive />
                                 <Tooltip.item icon="filter" text="Hello there" description="Something else" />
                                 <Tooltip.divider />
                                 <Tooltip.item text="Something else again" />
                                 <Tooltip.item text="A one disbaled" disabled />
                              </>
                           }
                           contentMinWidth={220}
                           asContextMenu
                           trigger="click"
                           align="left"
                           withArrow
                           isTabAccessed
                        >
                           <Image.profileImage letters="KV" cursor="pointer" />
                        </Tooltip>
                     </Div.row>
                  </Div.column>
               </Tabs.content>

               <Tabs.content tab="-">
                  <Div.column gap={theme.styles.space}></Div.column>
               </Tabs.content>
            </Tabs>
         </PageHolder>

         {/* <PageHolder.center sideImageSrc="https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png">
            <Div height={300}>Hello there</Div>
         </PageHolder.center> */}
      </>
   );
}

export default memo(App);
