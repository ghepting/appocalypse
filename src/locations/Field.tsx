import React, { useEffect, useState } from "react";
import { Button, Flex, FormControl, Select } from "@contentful/f36-components";
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
import { ContentTypeField, FieldExtensionSDK } from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";
import {
  MultipleEntryReferenceEditor,
  MultipleMediaEditor,
  SingleEntryReferenceEditor,
  SingleMediaEditor,
} from "@contentful/field-editor-reference";

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();

  useEffect(() => {
    sdk.window.startAutoResizer();
  });

  const fieldTypesToEditors: any = {
    Array: {
      Asset: ["MultipleMediaEditor"],
      Entry: ["MultipleEntryReferenceEditor"],
      Symbol: ["TagsEditor", "CheckboxEditor", "ListEditor"],
    },
    Link: {
      Asset: ["SingleMediaEditor"],
      Entry: ["SingleEntryReferenceEditor"],
    },
    Symbol: [
      "SingleLineEditor",
      "SlugEditor",
      "UrlEditor",
      "DropdownEditor",
      "RadioEditor",
    ],
    Text: [
      "MultipleLineEditor",
      "MarkdownEditor",
      "DropdownEditor",
      "RadioEditor",
    ],
    RichText: ["RichTextEditor"],
    Integer: ["NumberEditor", "DropdownEditor", "RadioEditor", "RatingEditor"],
    Number: ["NumberEditor", "DropdownEditor", "RadioEditor", "RatingEditor"],
    Date: ["DateEditor"],
    Location: ["LocationEditor"],
    Boolean: ["BooleanEditor"],
    Object: ["JsonEditor"],
  };

  const fieldEditors: any = {
    BooleanEditor: {
      editor: BooleanEditor,
      props: {
        field: sdk.field,
      },
    },
    CheckboxEditor: {
      editor: CheckboxEditor,
      props: {
        field: sdk.field,
        locales: sdk.locales,
      },
    },
    DateEditor: {
      editor: DateEditor,
      props: {
        field: sdk.field,
      },
    },
    DropdownEditor: {
      editor: DropdownEditor,
      props: {
        field: sdk.field,
        locales: sdk.locales,
      },
    },
    JsonEditor: {
      editor: JsonEditor,
      props: {
        field: sdk.field,
      },
    },
    ListEditor: {
      editor: ListEditor,
      props: {
        field: sdk.field,
        locales: sdk.locales,
      },
    },
    LocationEditor: {
      editor: LocationEditor,
      props: {
        field: sdk.field,
      },
    },
    MarkdownEditor: {
      editor: MarkdownEditor,
      props: {
        sdk: sdk,
      },
    },
    MultipleLineEditor: {
      editor: MultipleLineEditor,
      props: {
        field: sdk.field,
        locales: sdk.locales,
      },
    },
    MultipleEntryReferenceEditor: {
      editor: MultipleEntryReferenceEditor,
      props: {
        sdk: sdk,
        parameters: {
          instance: sdk.field,
        },
      },
    },
    MultipleMediaEditor: {
      editor: MultipleMediaEditor,
      props: {
        sdk: sdk,
        parameters: {
          instance: sdk.field,
        },
      },
    },
    NumberEditor: {
      editor: NumberEditor,
      props: {
        field: sdk.field,
      },
    },
    RadioEditor: {
      editor: RadioEditor,
      props: {
        field: sdk.field,
        locales: sdk.locales,
      },
    },
    RatingEditor: {
      editor: RatingEditor,
      props: {
        field: sdk.field,
      },
    },
    RichTextEditor: {
      editor: RichTextEditor,
      props: {
        field: sdk.field,
      },
    },
    SingleLineEditor: {
      editor: SingleLineEditor,
      props: {
        field: sdk.field,
        locales: sdk.locales,
      },
    },
    SingleEntryReferenceEditor: {
      editor: SingleEntryReferenceEditor,
      props: {
        sdk: sdk,
        parameters: {
          instance: sdk.field,
        },
      },
    },
    SingleMediaEditor: {
      editor: SingleMediaEditor,
      props: {
        sdk: sdk,
        parameters: {
          instance: sdk.field,
        },
      },
    },
    SlugEditor: {
      editor: SlugEditor,
      props: {
        baseSdk: sdk,
        field: sdk.field,
      },
    },
    TagsEditor: {
      editor: TagsEditor,
      props: {
        field: sdk.field,
      },
    },
    UrlEditor: {
      editor: UrlEditor,
      props: {
        field: sdk.field,
      },
    },
  };

  let editors = fieldTypesToEditors[sdk.field.type];

  // Array & Link field types have different editors depending on the item type
  if (!Array.isArray(editors)) {
    let itemType = null;
    const contentType = sdk.contentType.fields.find(
      (f: ContentTypeField) => f.id === sdk.field.id
    );

    if (contentType?.items) {
      if (contentType.items.type === "Link") {
        const itemsArray = contentType.items as any;
        itemType = itemsArray.linkType; // Entry or Asset
      } else {
        itemType = contentType.items.type; // Symbol
      }
    } else if (contentType?.linkType) {
      itemType = contentType.linkType; // Entry or Asset
    }

    editors = editors[itemType];
  }

  const [editor, setEditor] = useState(editors[0]);

  const handleOnChange = (e: any) => {
    setEditor(e.target.value);
  };

  const dialogOptions = {
    title: "Appocalypse",
    minHeight: 500,
    shouldCloseOnEscapePress: true,
    shouldCloseOnOverlayClick: true,
    parameters: { foo: `Opened from: Field (${sdk.ids.field})` },
  };

  return (
    <>
      <FormControl>
        {React.createElement(
          fieldEditors[editor]["editor"],
          fieldEditors[editor]["props"]
        )}
      </FormControl>
      <FormControl>
        <FormControl.Label>Change Field Editor</FormControl.Label>
        <Flex gap="spacingS">
          <div style={{ flexGrow: 1 }}>
            <Select
              value={editor}
              onChange={handleOnChange}
              isDisabled={editors.length < 2}
            >
              {editors.map((Editor: any, index: Number) => (
                <Select.Option value={Editor}>{Editor}</Select.Option>
              ))}
            </Select>
          </div>
          <Button
            variant="primary"
            onClick={() => sdk.dialogs.openCurrentApp(dialogOptions)}
          >
            Dialog
          </Button>
        </Flex>
      </FormControl>
    </>
  );
};

export default Field;
