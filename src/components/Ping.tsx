import React, { useState, useEffect } from "react";
import { Button } from "@contentful/f36-components";
import { useCMA, useSDK } from "@contentful/react-apps-toolkit";
import { AppActionProps } from "contentful-management";

const Ping = () => {
  const sdk = useSDK();
  const cma = useCMA();

  const [appActions, setAppActions] = useState<AppActionProps[]>([]);
  const [loading, setLoading] = useState(false);

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

  const ping = async () => {
    setLoading(true);

    try {
      const appAction = appActions.find((x) => x.sys.id === "ping");

      if (!appAction) throw new Error("No app action found!");

      const appActionResult = await cma.appActionCall.createWithResponse(
        {
          appActionId: appAction?.sys.id,
          environmentId: sdk.ids.environment,
          spaceId: sdk.ids.space,
          appDefinitionId: sdk.ids.app!,
        },
        {
          parameters: {
            message: "Hello from the frontend!",
          },
        }
      );

      if (!appActionResult)
        throw new Error("No result returned when calling app action!");

      const message = JSON.parse(appActionResult.response.body).message;
      sdk.notifier.success(message);
    } catch (error) {
      sdk.notifier.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="positive"
      onClick={() => ping()}
      isLoading={loading}
      isDisabled={loading}
    >
      {loading ? "Loading..." : "Ping"}
    </Button>
  );
};

export default Ping;
