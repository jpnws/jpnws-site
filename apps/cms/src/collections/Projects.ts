import { CollectionConfig } from "payload/types";
import { formatDate } from "../hooks";

const Projects: CollectionConfig = {
  slug: "projects",

  upload: {
    staticURL: "/images",
    staticDir: "images",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
    ],
    mimeTypes: ["image/*"],
  },

  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "createdAt",
      type: "date",
      required: true,
      hooks: {
        afterRead: [formatDate],
      },
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
      name: "content",
      type: "richText",
      required: true,
    },
    {
      name: "projectLink",
      label: "Project Link",
      type: "array",
      labels: {
        singular: "Link",
        plural: "Links",
      },
      fields: [
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
      ],
    },
  ],
};

export default Projects;
