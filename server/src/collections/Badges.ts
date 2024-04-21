import type { CollectionConfig } from "payload/types";
import { admins } from "../access/admins";

const Badges: CollectionConfig = {
  slug: "badges",
  access: {
    create: admins,
    update: admins,
    delete: admins,
    read: () => true,
  },
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      label: "Badge Name",
      type: "text",
      required: true,
      unique: true,
    },
  ],
};

export default Badges;
