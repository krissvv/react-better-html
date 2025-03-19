import { memo } from "react";

import { Div, Text, Loader, Icon, Image, Button } from "../../src";
import { useTheme } from "../../src/components/BetterHtmlProvider";

function App() {
   const theme = useTheme();

   return (
      <Div.column gap={theme.styles.space} paddingInline={theme.styles.space} paddingTop={theme.styles.gap}>
         <Text as="h1">Hello</Text>
         <Div.box>App</Div.box>
         <Loader />
         <Icon name="XMark" />
         <Image name="logo" width={300} />

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
   );
}

export default memo(App);
