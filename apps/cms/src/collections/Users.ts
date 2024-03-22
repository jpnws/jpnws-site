import type { CollectionConfig } from "payload/types";

const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
  ],
};

export default Users;
