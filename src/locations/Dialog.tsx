import React, { useEffect } from "react";
import {
  Box,
  Button,
  Paragraph,
  Stack,
  Subheading,
} from "@contentful/f36-components";
import {
  DialogAppSDK,
  Locations,
  SerializedJSONValue,
  locations,
} from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";

export interface DialogParams {
  location: Locations[keyof Locations];
  [key: string]: SerializedJSONValue;
}

const Dialog = () => {
  const sdk = useSDK<DialogAppSDK>();
  const params = sdk.parameters.invocation as DialogParams;

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
        {params.location !== locations.LOCATION_HOME && (
          <Button variant="primary" isDisabled={true}>
            Home
          </Button>
        )}
        {params.location !== locations.LOCATION_APP_CONFIG && (
          <Button
            variant="primary"
            onClick={() => sdk.navigator.openAppConfig()}
          >
            App Config
          </Button>
        )}
        {params.location !== locations.LOCATION_PAGE && (
          <Button
            variant="primary"
            onClick={() => sdk.navigator.openCurrentAppPage()}
          >
            Page
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default Dialog;
