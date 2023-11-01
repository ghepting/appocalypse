import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Stack,
  Subheading,
} from "@contentful/f36-components";
import {
  EditorAppSDK,
  FieldAPI,
  ValidationError,
  locations,
} from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";
import { fieldTypesToEditors } from "./Field";
import { BooleanEditor } from "@contentful/field-editor-boolean";
import { CheckboxEditor } from "@contentful/field-editor-checkbox";
import { DateEditor } from "@contentful/field-editor-date";
import { DropdownEditor } from "@contentful/field-editor-dropdown";
import { JsonEditor } from "@contentful/field-editor-json";
import { ListEditor } from "@contentful/field-editor-list";
import { LocationEditor } from "@contentful/field-editor-location";
// import "codemirror/lib/codemirror.css";
import { MarkdownEditor } from "@contentful/field-editor-markdown";
import { MultipleLineEditor } from "@contentful/field-editor-multiple-line";
import { NumberEditor } from "@contentful/field-editor-number";
import { RadioEditor } from "@contentful/field-editor-radio";
import { RatingEditor } from "@contentful/field-editor-rating";
import { RichTextEditor } from "@contentful/field-editor-rich-text";
import { SingleLineEditor } from "@contentful/field-editor-single-line";
import { SlugEditor } from "@contentful/field-editor-slug";
import { TagsEditor } from "@contentful/field-editor-tags";
import { UrlEditor } from "@contentful/field-editor-url";
import {
  MultipleEntryReferenceEditor,
  MultipleMediaEditor,
  SingleEntryReferenceEditor,
  SingleMediaEditor,
} from "@contentful/field-editor-reference";
import { DialogParams } from "./Dialog";

interface FieldErrors {
  [fieldId: string]: string[];
}

const Entry = () => {
  const sdk = useSDK<EditorAppSDK>();
  const [errors, setErrors] = useState({} as FieldErrors);

  const dialogParams: DialogParams = {
    location: locations.LOCATION_ENTRY_EDITOR,
  };

  const dialogOptions = {
    title: "Appocalypse",
    minHeight: 500,
    shouldCloseOnEscapePress: true,
    shouldCloseOnOverlayClick: true,
    parameters: dialogParams,
  };

  useEffect(() => {
    Object.entries(sdk.entry.fields).forEach(([fieldId, field]) => {
      field.getForLocale(sdk.locales.default).onSchemaErrorsChanged((error) => {
        console.log(fieldId, error);
        const errorMessages = error.map(
          (e: ValidationError) =>
            e.customMessage || e.message || e.details || "Uknown error"
        );

        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldId]: errorMessages,
        }));
      });
    });
  }, [sdk.entry.fields, sdk.locales.default]);

  return (
    <Box padding="spacingL">
      <Subheading>Appocalypse (App ID: {sdk.ids.app})</Subheading>
      <Stack alignItems="flex-start" flexDirection="column" spacing="spacingS">
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
      {Object.entries(sdk.entry.fields).map(([fieldId, field]) => (
        <FormControl key={fieldId} isInvalid={false}>
          <FormControl.Label>
            {field.name} ({field.type})
          </FormControl.Label>
          {/* {React.createElement(
            sdk.parameters.instance[field.type] ||
              fieldTypesToEditors[field.type][0],
            {
              field: field as unknown as FieldAPI,
              locales: sdk.locales,
            }
          )} */}
          {errors[fieldId]?.length > 0 && (
            <FormControl.ValidationMessage>
              {errors[fieldId].join(", ")}
            </FormControl.ValidationMessage>
          )}
        </FormControl>
      ))}
    </Box>
  );
};

export default Entry;
