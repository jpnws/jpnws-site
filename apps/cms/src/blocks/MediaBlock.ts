import type { Block } from "payload/types";

export const MediaBlock: Block = {
  slug: "media",
  fields: [
    {
      name: "media",
      relationTo: "media",
      required: true,
      type: "upload",
    },
  ],
};
