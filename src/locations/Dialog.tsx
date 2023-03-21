import React, { useEffect } from "react";
import {
  Box,
  Button,
  Paragraph,
  Stack,
  Subheading,
} from "@contentful/f36-components";
import { DialogExtensionSDK } from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";

const Dialog = () => {
  const sdk = useSDK<DialogExtensionSDK>();

  useEffect(() => {
    sdk.window.startAutoResizer();
  });

  return (
    <Box padding="spacingL">
      <Subheading>Appocalypse (App ID: {sdk.ids.app})</Subheading>
      <Paragraph>Incoming parameters:</Paragraph>
      <pre>
        <code>{JSON.stringify(sdk.parameters.invocation, null, 2)}</code>
      </pre>
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
      </Stack>
    </Box>
  );
};

export default Dialog;
