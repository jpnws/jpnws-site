import type { Block } from "payload/types";
import richText from "../fields/richText";

export const Archive: Block = {
  fields: [
    {
      type: "richText",
      name: "content",
    },
    {
      name: "populateBy",
      defaultValue: "collection",
      options: [
        {
          label: "Collection",
          value: "collection",
        },
        {
          label: "Individual Selection",
          value: "selection",
        },
      ],
      type: "select",
    },
    {
      name: "relationTo",
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === "collection",
      },
      defaultValue: "projects",
      label: "Collections To Show",
      options: [
        {
          label: "Projects",
          value: "projects",
        },
        {
          label: "Articles",
          value: "articles",
        },
      ],
      type: "select",
    },
    {
      name: "categories",
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === "collection",
      },
      hasMany: true,
      label: "Categories To Show",
      relationTo: "categories",
      type: "relationship",
    },
    {
      name: "limit",
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === "collection",
        step: 1,
      },
      defaultValue: 10,
      label: "Limit",
      type: "number",
    },
    {
      name: "selectedDocs",
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === "selection",
      },
      hasMany: true,
      label: "Selection",
      relationTo: ["projects", "articles"],
      type: "relationship",
    },
    {
      name: "populatedDocs",
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === "collection",
        description: "This field is auto-populated after-read",
        disabled: true,
      },
      hasMany: true,
      label: "Populated Docs",
      relationTo: ["projects", "articles"],
      type: "relationship",
    },
    {
      name: "populatedDocsTotal",
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === "collection",
        description: "This field is auto-populated after-read",
        disabled: true,
        step: 1,
      },
      label: "Populated Docs Total",
      type: "number",
    },
  ],
  labels: {
    plural: "Archives",
    singular: "Archive",
  },
  slug: "archive",
};
