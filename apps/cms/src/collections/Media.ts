import type { CollectionConfig } from "payload/types";

import { LinkFeature, lexicalEditor } from "@payloadcms/richtext-lexical";

import path from "path";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "alt",
  },
  upload: {
    staticDir: path.resolve(__dirname, "../../media"),
  },
  fields: [
    {
      name: "alt",
      required: true,
      type: "text",
    },
    {
      name: "caption",
      type: "text",
    },
  ],
};
