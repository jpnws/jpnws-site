import type { CollectionConfig } from "payload/types";

import type { Field } from "payload/types";
import { deepMerge, formatSlug } from "../utils";

const Projects: CollectionConfig = {
  slug: "projects",
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return {
        or: [
          {
            _status: {
              equals: "published",
            },
          },
          {
            _status: {
              exists: false,
            },
          },
        ],
      };
    },
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
    deepMerge<Field, Partial<Field>>(
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
      {},
    ),
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "livedemo",
      label: "Live demo link",
      type: "text",
      required: true,
      validate: (value: string) => {
        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
        if (!urlPattern.test(value)) {
          return "Invalid URL format";
        }
      },
    },
    {
      name: "github",
      label: "GitHub repository link",
      type: "text",
      required: true,
      validate: (value: string) => {
        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
        if (!urlPattern.test(value)) {
          return "Invalid URL format";
        }
      },
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
  ],
};

export default Projects;
