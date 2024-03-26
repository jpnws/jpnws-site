import type { CollectionConfig } from "payload/types";

import path from "path";
import { admins } from "../access/admins";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    create: admins,
    delete: admins,
    read: () => true,
    update: admins,
  },
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
