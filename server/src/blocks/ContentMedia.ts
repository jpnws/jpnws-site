import type { Block } from "payload/types";

import richText from "../fields/richText";

export const ContentMedia: Block = {
  fields: [
    {
      name: "mediaPosition",
      options: [
        {
          label: "Left",
          value: "left",
        },
        {
          label: "Right",
          value: "right",
        },
      ],
      type: "radio",
    },
    richText(),
    {
      name: "media",
      relationTo: "media",
      required: true,
      type: "upload",
    },
  ],
  slug: "contentMedia",
};
