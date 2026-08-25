import { memo } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Div, useTheme, SideMenu } from "../../src";

function App() {
   const theme = useTheme();
   const location = useLocation();

   return (
      <>
         <SideMenu
            // position="right"
            items={[
               {
                  type: "divider",
                  text: "Main",
               },
               {
                  type: "item",
                  text: "Main",
                  iconName: "filter",
                  withDot: true,
                  href: "/",
               },
               {
                  type: "item",
                  text: "With submenu",
                  iconName: "filter",
                  children: [
                     {
                        type: "item",
                        text: "Submenu item 1",
                        iconName: "filter",
                        withDot: true,
                        href: "/submenu-item-1",
                     },
                     {
                        type: "item",
                        text: "Submenu item 2",
                        iconName: "filter",
                        href: "/submenu-item-2",
                     },
                  ],
               },
               {
                  type: "divider",
                  text: "My divider",
                  // shortText: "My",
               },
               {
                  type: "item",
                  text: "With onClick",
                  iconName: "filter",
                  // onClickCloseSideMenu: false,
                  onClick: () => {
                     console.log("Clicked");
                  },
               },
            ]}
            bottomItems={[
               {
                  type: "item",
                  text: "Main 2",
                  iconName: "filter",
                  href: "/main-2",
               },
            ]}
            location={location}
            // topSpace={60}
            logoAssetName="logo"
            logoText="ReactBetterHtml"
            collapsable
            withCloseButton
            widthMobileHandle
            // isLoading
            bottomItemsAdditionalComponent={
               <Div marginInline={theme.styles.space}>
                  <Div.box>Hello there</Div.box>
               </Div>
            }
            // sideBar={
            //    <Div padding={theme.styles.space}>
            //       <Div.box width="100%" aspectRatio={1} isActive>
            //          <Div.row width="100%" height="100%" alignItems="center" justifyContent="center">
            //             <Text fontWeight={700} textAlign="center">
            //                R
            //             </Text>
            //          </Div.row>
            //       </Div.box>
            //    </Div>
            // }
            // border="none"
         >
            {/* <SideMenu
            items={[
               {
                  type: "item",
                  text: "Main",
                  iconName: "filter",
                  withDot: true,
                  href: "/",
               },
               {
                  type: "item",
                  text: "With submenu",
                  iconName: "filter",
                  children: [
                     {
                        type: "item",
                        text: "Submenu item 1",
                        iconName: "filter",
                        withDot: true,
                        href: "/submenu-item-1",
                     },
                     {
                        type: "item",
                        text: "Submenu item 2",
                        iconName: "filter",
                        href: "/submenu-item-2",
                     },
                  ],
               },
               {
                  type: "item",
                  text: "With onClick",
                  iconName: "filter",
                  // onClickCloseSideMenu: false,
                  onClick: () => {
                     console.log("Clicked");
                  },
               },
            ]}
            bottomItems={[
               {
                  type: "item",
                  text: "Main 2",
                  iconName: "filter",
                  href: "/main-2",
               },
            ]}
            location={location}
            backgroundColor="transparent"
            activeItemColor="#000000"
            hoverItemColor="#ff0000"
            gap={theme.styles.gap / 2}
            paddingTop={theme.styles.gap / 2}
            paddingBottom={theme.styles.gap / 2}
            itemsAdditionalComponent={
               <Div
                  backgroundColor={theme.colors.backgroundContent}
                  borderRadius={theme.styles.borderRadius}
                  marginLeft={theme.styles.gap / 2}
                  padding={theme.styles.space}
               >
                  awd
               </Div>
            }
            renderItemsHolder={(items) => (
               <Div
                  height="100%"
                  backgroundColor={theme.colors.backgroundContent}
                  borderRadius={theme.styles.borderRadius}
                  marginLeft={theme.styles.gap / 2}
                  padding={theme.styles.space}
               >
                  {items}
               </Div>
            )}
            renderBottomItemsHolder={(items) => (
               <Div
                  backgroundColor={theme.colors.backgroundContent}
                  borderRadius={theme.styles.borderRadius}
                  marginLeft={theme.styles.gap / 2}
                  padding={theme.styles.space}
               >
                  {items}
               </Div>
            )}
            bottomItemsAdditionalComponent={
               <Div
                  backgroundColor={theme.colors.backgroundContent}
                  borderRadius={theme.styles.borderRadius}
                  marginLeft={theme.styles.gap / 2}
                  padding={theme.styles.space}
               >
                  awd
               </Div>
            }
         > */}
            <SideMenu.pageHolder>
               <Outlet />
            </SideMenu.pageHolder>

            {/* <PageHolder.center
               sideComponent={
                  <Image
                     width="100%"
                     height="100%"
                     src="https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"
                     objectFit="cover"
                  />
               }
               contentInsideBox={false}
            >
               <Div height={300}>Hello there</Div>
            </PageHolder.center> */}

            {/* <PageHolder.center
               sideComponent={
                  <Div.column
                     width="100%"
                     height="100%"
                     backgroundColor={theme.colors.primary}
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text color={theme.colors.base}>Hello there</Text>
                  </Div.column>
               }
               sideComponentPosition="left"
               behindComponent={
                  <Div.column
                     width="100%"
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                     textAlign="justify"
                  >
                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, autem ut veniam harum nobis aperiam?
                     Eveniet ipsam recusandae quasi voluptatum ipsa aliquam, quod perferendis ad error sed, asperiores
                     officiis quis!
                  </Div.column>
               }
            >
               <Div height={300}>Hello there</Div>
            </PageHolder.center> */}
         </SideMenu>
      </>
   );
}

export default memo(App);
