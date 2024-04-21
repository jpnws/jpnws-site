import type { CollectionConfig } from "payload/types";

import { admins } from "../../access/admins";
import { ensureFirstUserIsAdmin } from "./hooks/ensureFirstUserIsAdmin";
import { checkRole } from "./checkRole";

const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  access: {
    admin: ({ req: { user } }) => checkRole(["admin"], user),
    create: admins,
    delete: admins,
  },
  admin: {
    defaultColumns: ["name", "email"],
    useAsTitle: "email",
  },
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "roles",
      access: {
        create: admins,
        read: admins,
        update: admins,
      },
      defaultValue: ["user"],
      hasMany: true,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      options: [
        {
          label: "admin",
          value: "admin",
        },
        {
          label: "user",
          value: "user",
        },
      ],
      type: "select",
    },
  ],
};

export default Users;
