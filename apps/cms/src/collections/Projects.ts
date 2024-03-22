import { CollectionConfig } from "payload/types";
import { FieldHookArgs } from "payload/dist/fields/config/types";

const formatDate = (args: FieldHookArgs): string => {
  const date = new Date(args.value);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

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
      // Define other image sizes as needed
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
    // {
    //   name: "category",
    //   type: "relationship",
    //   relationTo: "categories",
    //   hasMany: false,
    //   required: true,
    // },
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
          label: "github repository link",
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
