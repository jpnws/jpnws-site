import type { Field } from "payload/types";
import { CollectionConfig } from "payload/types";
import { formatSlug } from "../utils";
import { Archive } from "../blocks/Archive";
import { adminsOrPublished } from "../access/adminsOrPublished";
import { admins } from "../access/admins";

const hero: Field = {
  name: "hero",
  type: "group",
  fields: [
    {
      name: "content",
      type: "richText",
    },
    {
      name: "media",
      relationTo: "media",
      type: "upload",
    },
  ],
};

export const Pages: CollectionConfig = {
  slug: "pages",
  access: {
    create: admins,
    delete: admins,
    read: adminsOrPublished,
    update: admins,
  },
  admin: {
    useAsTitle: "title",
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: "title",
      required: true,
      type: "text",
    },
    {
      name: "publishedData",
      admin: {
        position: "sidebar",
      },
      type: "date",
    },
    {
      name: "slug",
      admin: {
        position: "sidebar",
        readOnly: true,
      },
      hooks: {
        beforeChange: [formatSlug("title")],
      },
      index: true,
      label: "Slug",
      type: "text",
    },
    {
      type: "tabs",
      tabs: [
        {
          fields: [hero],
          label: "Hero",
        },
        {
          fields: [
            {
              name: "layout",
              blocks: [Archive],
              required: false,
              type: "blocks",
            },
          ],
          label: "Content",
        },
      ],
    },
  ],
};
