import path from "path";

import { payloadCloud } from "@payloadcms/plugin-cloud";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { viteBundler } from "@payloadcms/bundler-vite";
import { buildConfig } from "payload/config";
import { BlocksFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import seo from "@payloadcms/plugin-seo";

import Users from "./collections/User/Users";
import Projects from "./collections/Projects";
import { CodeBlock } from "./blocks/CodeBlock";
import Categories from "./collections/Categories";
import { Media } from "./collections/Media";
import { MediaBlock } from "./blocks/MediaBlock";
import { Pages } from "./collections/Pages";
import { Header } from "./globals/Header";
import { Footer } from "./globals/Footer";

const editor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    BlocksFeature({
      blocks: [CodeBlock, MediaBlock],
    }),
  ],
});

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: viteBundler(),
  },
  globals: [Header, Footer],
  editor,
  collections: [Users, Projects, Categories, Media, Pages],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [
    seo({
      collections: ["projects", "pages"],
      uploadsCollection: "media",
    }),
    payloadCloud(),
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
});
