import React, { useEffect } from "react";
import { SidebarAppSDK } from "@contentful/app-sdk";
import { useCMA, useSDK } from "@contentful/react-apps-toolkit";
import { Button, Stack, Subheading } from "@contentful/f36-components";

const Sidebar = () => {
  const sdk = useSDK<SidebarAppSDK>();
  const cma = useCMA();

  useEffect(() => {
    sdk.window.startAutoResizer();
  });

  const dialogOptions = {
    title: "Appocalypse",
    minHeight: 500,
    shouldCloseOnEscapePress: true,
    shouldCloseOnOverlayClick: true,
    parameters: { foo: `Opened from: Sidebar` },
  };

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
