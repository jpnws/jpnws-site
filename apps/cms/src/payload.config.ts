import path from "path";

import { payloadCloud } from "@payloadcms/plugin-cloud";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { buildConfig } from "payload/config";
import {
  BlocksFeature,
  LinkFeature,
  lexicalEditor,
  BlockNode,
} from "@payloadcms/richtext-lexical";

import Users from "./collections/Users";
import Projects from "./collections/Projects";
import { CodeBlock } from "./blocks/CodeBlock";
import Categories from "./collections/Categories";

const editor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    LinkFeature({
      fields: [
        {
          name: "rel",
          label: "Rel Attribute",
          type: "select",
          hasMany: true,
          options: ["noopener", "noreferrer", "nofollow"],
          admin: {
            description:
              "The rel attribute defines the relationship between a linked resource and the current document. This is a custom link field.",
          },
        },
      ],
    }),
    // This is incredibly powerful. You can re-use your Payload blocks
    // directly in the Lexical editor as follows:
    BlocksFeature({
      blocks: [CodeBlock],
    }),
  ],
});

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  editor,
  collections: [Users, Projects, Categories],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [payloadCloud()],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
});
