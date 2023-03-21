import React from "react";
import { Box, Button, Stack, Subheading } from "@contentful/f36-components";
import { HomeExtensionSDK } from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";

const Home = () => {
  const sdk = useSDK<HomeExtensionSDK>();

  const dialogOptions = {
    title: "Appocalypse",
    minHeight: 500,
    shouldCloseOnEscapePress: true,
    shouldCloseOnOverlayClick: true,
    parameters: { foo: `Opened from: Home` },
  };

  return (
    <Box padding="spacingL">
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
    </Box>
  );
};

export default Home;