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
} from "../../src";

const data: {
   id: number;
   name: string;
   age: number;
   email: string;
   image: string;
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
   },
   {
      id: 3,
      name: "Jane",
      age: 22,
      email: "jane@jane.com",
      image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
   },
   {
      id: 4,
      name: "Bob",
      age: 28,
      email: "bob@bob.com",
      image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
   },
   {
      id: 5,
      name: "Alice",
      age: 27,
      email: "alice@alice.com",
      image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
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

   const testLoaderIsLoading = useLoader("testLoader");

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
                  "icon & Image",
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
                     <Div.box>App</Div.box>
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

               <Tabs.content tab="icon & Image">
                  <Div.column gap={theme.styles.space}>
                     <Icon name="XMark" />

                     <Image name="logo" width={300} />
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
                     <Chip text="Some text" />
                     <Chip.circle text="Some text" backgroundColor="red" color="white" />
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
                  <Div.column gap={theme.styles.space}>
                     <Form form={form} gap={theme.styles.gap} submitButtonText="Create" onClickCancel={() => {}}>
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
                  </Div.column>
               </Tabs.content>

               <Tabs.content tab="Button">
                  <Div.column gap={theme.styles.space}>
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
                     <Button text="Open confirmation modal" onClick={() => confirmationModalRef.current?.open()} />
                     <Button text="Open destructive modal" onClick={() => destructiveModalRef.current?.open()} />
                  </Div.column>

                  <Modal name="awd" ref={modalRef}>
                     Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae cumque tempore qui?
                  </Modal>

                  <Modal title="My Modal" description="Lorem ipsum dolor sit amet" ref={modalWithTitleRef}>
                     Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae cumque tempore qui?
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
                              keyName: "image",
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

                     <Foldable.box
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
                  </Div.column>
               </Tabs.content>

               <Tabs.content tab="-">
                  <Div.column gap={theme.styles.space}></Div.column>
               </Tabs.content>
            </Tabs>
         </PageHolder>
      </>
   );
}

export default memo(App);
