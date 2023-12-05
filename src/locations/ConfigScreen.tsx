import React, { useCallback, useState, useEffect } from "react";
import { ConfigAppSDK, locations } from "@contentful/app-sdk";
import { Box, Subheading, Stack, Button } from "@contentful/f36-components";
import { useCMA, useSDK } from "@contentful/react-apps-toolkit";
import { DialogParams } from "./Dialog";
import { AppActionProps } from "contentful-management";

export interface AppInstallationParameters {}

const ConfigScreen = () => {
  const sdk = useSDK<ConfigAppSDK>();
  const cma = useCMA();

  const [parameters, setParameters] = useState<AppInstallationParameters>({});
  const [appActions, setAppActions] = useState<AppActionProps[]>([]);

  const onConfigure = useCallback(async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await sdk.app.getCurrentState();

    return {
      // Parameters to be persisted as the app configuration.
      parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      // Get current parameters of the app.
      // If the app is not installed yet, `parameters` will be `null`.
      const currentParameters: AppInstallationParameters | null =
        await sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }

      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      sdk.app.setReady();
    })();
  }, [sdk]);

  useEffect(() => {
    setAppActions([] as AppActionProps[]);
    cma.appAction
      .getManyForEnvironment({
        environmentId: sdk.ids.environment,
        spaceId: sdk.ids.space,
      })
      .then((appActions) => {
        setAppActions(appActions.items);
      });
  }, [cma, sdk.ids.environment, sdk.ids.space]);

  const dialogParams: DialogParams = {
    location: locations.LOCATION_APP_CONFIG,
  };

  const dialogOptions = {
    title: "Appocalypse",
    minHeight: 500,
    shouldCloseOnEscapePress: true,
    shouldCloseOnOverlayClick: true,
    parameters: dialogParams,
  };

  const ping = async () => {
    const appAction = appActions.find((x) => x.sys.id === "ping");
    if (appAction) {
      const appActionResult = await cma.appActionCall.createWithResponse(
        {
          appActionId: appAction?.sys.id,
          environmentId: sdk.ids.environment,
          spaceId: sdk.ids.space,
          appDefinitionId: sdk.ids.app,
        },
        {
          parameters: {
            message: "Hello from the frontend!",
          },
        }
      );
      if (appActionResult) {
        sdk.notifier.success(
          `Successfully called app action! Response: ${JSON.stringify(
            appActionResult
          )}`
        );
      } else {
        sdk.notifier.error("No result returned when calling app action!");
      }
    } else {
      sdk.notifier.error("No app action found!");
    }
  };

  return (
    <Box padding="spacingL">
      <Subheading>Appocalypse (App ID: {sdk.ids.app})</Subheading>
      <Stack alignItems="flex-start" flexDirection="column" spacing="spacingS">
        <Button variant="primary" isDisabled={true}>
          Home
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
        <Button variant="positive" onClick={() => ping()}>
          Ping
        </Button>
      </Stack>
    </Box>
  );
};

export default ConfigScreen;
