import type { Block } from "payload/types";

export const MediaBlock: Block = {
  slug: "media-block",
  fields: [
    {
      name: "position",
      defaultValue: "default",
      options: [
        {
          label: "Default",
          value: "default",
        },
        {
          label: "Fullscreen",
          value: "fullscreen",
        },
      ],
      type: "select",
    },
    {
      name: "media",
      relationTo: "media",
      required: true,
      type: "upload",
    },
  ],
};
