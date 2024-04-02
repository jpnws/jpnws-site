import type { Field } from "payload/types";
import type { CollectionConfig } from "payload/types";

import { formatSlug } from "../utils";
import { admins } from "../access/admins";
import { adminsOrPublished } from "../access/adminsOrPublished";

const hero: Field = {
  name: "hero",
  type: "group",
  fields: [
    {
      name: "shortDescription",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "livedemo",
      label: "Live demo link",
      type: "text",
      validate: (value: string) => {
        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
        if (value && !urlPattern.test(value)) {
          return "Invalid URL format";
        }
      },
    },
    {
      name: "github",
      label: "GitHub repository link",
      type: "text",
      validate: (value: string) => {
        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
        if (value && !urlPattern.test(value)) {
          return "Invalid URL format";
        }
      },
    },
    {
      name: "media",
      relationTo: "media",
      type: "upload",
    },
  ],
};

const Articles: CollectionConfig = {
  slug: "articles",
  access: {
    create: admins,
    delete: admins,
    read: adminsOrPublished,
    update: admins,
  },
  admin: {
    defaultColumns: ["title", "slug"],
    useAsTitle: "title",
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "featured",
      type: "checkbox",
    },
    {
      name: "featuredPriority",
      type: "number",
      admin: {
        condition: (data) => data.featured,
        width: "25%",
      },
      required: true,
    },
    {
      name: "categories",
      admin: {
        position: "sidebar",
      },
      hasMany: true,
      relationTo: "categories",
      type: "relationship",
      required: true,
    },
    {
      name: "publishedDate",
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
              name: "content",
              type: "richText",
              required: true,
            },
          ],
          label: "Content",
        },
        {
          fields: [
            {
              name: "relatedArticles",
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                };
              },
              hasMany: true,
              relationTo: "articles",
              type: "relationship",
            },
          ],
          label: "Related Articles",
        },
      ],
    },
  ],
};

export default Articles;
