import type { CollectionConfig } from "payload/types";

const Category: CollectionConfig = {
  slug: "categories",
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
