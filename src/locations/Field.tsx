import React from "react";
import { FieldExtensionSDK } from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();

  return (
    <pre>
      <code>{sdk.field.getValue()}</code>
    </pre>
  );
};

export default Field;
