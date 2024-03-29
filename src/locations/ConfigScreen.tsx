import React, { useCallback, useState, useEffect } from "react";
import { ConfigAppSDK, locations } from "@contentful/app-sdk";
import { Box, Subheading, Stack, Button } from "@contentful/f36-components";
import { useCMA, useSDK } from "@contentful/react-apps-toolkit";
import { DialogParams } from "./Dialog";
import Ping from "../components/Ping";

export interface AppInstallationParameters {}

const ConfigScreen = () => {
  const sdk = useSDK<ConfigAppSDK>();
  const cma = useCMA();

  const [parameters, setParameters] = useState<AppInstallationParameters>({});

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

  const updateAppInstallation = async () => {
    const appInstallation = await cma.appInstallation
      .getForOrganization({
        organizationId: sdk.ids.organization,
        appDefinitionId: sdk.ids.app,
      }).then((response) => response.items.find((appInstallation) => {
        return appInstallation.sys.environment.sys.id === sdk.ids.environment
      }));

    if (appInstallation) {
      sdk.notifier.success(
        `App Installation: ${JSON.stringify(appInstallation)}`
      );
    } else {
      sdk.notifier.error(`App Installation not found`);
    }
  }

  const getAppInstallationsForOrg = async () => {
    const appInstallations =
      await cma.appInstallation.getForOrganization({
        organizationId: sdk.ids.organization,
        appDefinitionId: sdk.ids.app,
        query: { spaceId: {} },
      });

    sdk.notifier.success(
      `App Installations: ${JSON.stringify(appInstallations.items)}`
    );
  }

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
        <Ping />
        <Button
          variant="primary"
          onClick={async () => {
            const appInstallations =
              await cma.appInstallation.getForOrganization({
                organizationId: sdk.ids.organization,
                appDefinitionId: sdk.ids.app,
              });

            const installedEnvironments = appInstallations.items.map(
              (appInstallation) => appInstallation.sys.environment.sys.id
            );

            sdk.notifier.success(
              `Installed Environments: ${installedEnvironments.join(", ")}`
            );
          }}
        >
          Get Installed Environments
        </Button>
        <Button variant="primary" onClick={updateAppInstallation}>
          Get App Installation
        </Button>
        <Button variant="primary" onClick={getAppInstallationsForOrg}>
          Get All App Installations for Org
        </Button>
      </Stack>
    </Box>
  );
};

export default ConfigScreen;
