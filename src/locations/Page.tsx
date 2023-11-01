import React from "react";
import { Box, Button, Stack, Subheading } from "@contentful/f36-components";
import { PageAppSDK, locations } from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";
import { DialogParams } from "./Dialog";

const Page = () => {
  const sdk = useSDK<PageAppSDK>();

  const dialogParams: DialogParams = {
    location: locations.LOCATION_PAGE,
  };

  const dialogOptions = {
    title: "Appocalypse",
    minHeight: 500,
    shouldCloseOnEscapePress: true,
    shouldCloseOnOverlayClick: true,
    parameters: dialogParams,
  };

  return (
    <Box padding="spacingL">
      <Subheading>Appocalypse (App ID: {sdk.ids.app})</Subheading>
      <Stack alignItems="flex-start" flexDirection="column" spacing="spacingS">
        <Button variant="primary" isDisabled={true}>
          Home
        </Button>
        <Button variant="primary" onClick={() => sdk.navigator.openAppConfig()}>
          App Config
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

export default Page;
