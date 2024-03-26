import type { Block } from "payload/types";

export const MediaBlock: Block = {
  slug: "media",
  fields: [
    {
      name: "size",
      defaultValue: "default",
      options: [
        {
          label: "Thumbnail",
          value: "thumbnail",
        },
        {
          label: "Large",
          value: "large",
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
