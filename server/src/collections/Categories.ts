import type { CollectionConfig } from "payload/types";
import { admins } from "../access/admins";

const Category: CollectionConfig = {
  slug: "categories",
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
      label: "Category Name",
      type: "text",
      required: true,
      unique: true,
    },
  ],
};

export default Category;
