import React, { useEffect } from "react";
import { SidebarAppSDK, locations } from "@contentful/app-sdk";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";
import { Button, Stack, Subheading } from "@contentful/f36-components";
// import * as contentfulManagement from "contentful-management";
import { DialogParams } from "./Dialog";

const Sidebar = () => {
  const sdk = useSDK<SidebarAppSDK>();
  // const cma = useCMA();

  useEffect(() => {
    sdk.window.startAutoResizer();
  });

  const dialogParams: DialogParams = {
    location: locations.LOCATION_ENTRY_SIDEBAR,
  };

  const dialogOptions = {
    title: "Appocalypse",
    minHeight: 500,
    shouldCloseOnEscapePress: true,
    shouldCloseOnOverlayClick: true,
    parameters: dialogParams,
  };

  console.log(sdk.user);

  // const foo = async () => {
  //   const client = contentfulManagement.createClient({
  //     accessToken: "yrLfQoPC8elqdkJCLg-99oD20xRg3oXgGy1EtxF9iU4",
  //   });

  //   const spaceId = sdk.ids.space;
  //   const environmentId = sdk.ids.environment;
  //   const appId = sdk.ids.app!;
  //   const contentTypes = [sdk.contentType.sys.id];

  //   // Get current editor sidebar for content and news and add app to the top
  //   for (let i = 0; i < contentTypes.length; i++) {
  //     await client
  //       .getSpace(spaceId)
  //       .then((space) => space.getEnvironment(environmentId))
  //       .then((environment) =>
  //         environment.getEditorInterfaceForContentType(contentTypes[i])
  //       )
  //       .then(async (editorInterface) => {
  //         let sidebarConfig =
  //           contentfulManagement.editorInterfaceDefaults.default
  //             .SidebarEntryConfiguration;
  //         if (!editorInterface.sidebar) {
  //           const sidebarDefFull = sidebarConfig.filter((sidebar) => {
  //             if (
  //               sidebar.widgetId !== "releases-widget" &&
  //               sidebar.widgetId !== "users-widget"
  //             ) {
  //               return sidebar;
  //             }
  //           });
  //           // quick and dirty because of bug in contentful - has to be changed after bugfix in contentful
  //           const sidebarDef: any = [];
  //           sidebarDefFull.forEach((item) => {
  //             let sidebar = {
  //               settings: {},
  //               widgetId: item.widgetId,
  //               widgetNamespace: item.widgetNamespace,
  //             };
  //             sidebarDef.push(sidebar);
  //           });
  //           editorInterface.sidebar = sidebarDef;
  //         }
  //         const updatedSidebar = [
  //           ...editorInterface.sidebar!,
  //           {
  //             settings: {},
  //             widgetId: appId,
  //             widgetNamespace: "app",
  //           },
  //         ];
  //         editorInterface.sidebar = updatedSidebar;
  //         return await editorInterface.update();
  //       });
  //   }
  // };

  return (
    <>
      <Subheading>Appocalypse (App ID: {sdk.ids.app})</Subheading>
      <Stack alignItems="flex-start" flexDirection="column" spacing="spacingS">
        <Button variant="primary" onClick={() => sdk.navigator.openAppConfig()}>
          App Config
        </Button>
        <Button
          variant="primary"
          onClick={() => sdk.navigator.openCurrentAppPage()}
        >
          Page
        </Button>
        <Button
          variant="primary"
          onClick={() => sdk.dialogs.openCurrentApp(dialogOptions)}
        >
          Dialog
        </Button>
      </Stack>
    </>
  );
};

export default Sidebar;
