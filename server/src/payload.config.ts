import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { payloadCloud } from "@payloadcms/plugin-cloud";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
import seo from "@payloadcms/plugin-seo";
import {
  BlocksFeature,
  LexicalBlock,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload/config";
import { Archive } from "./blocks/Archive";
import { CodeBlock } from "./blocks/Code";
import { ContentMedia } from "./blocks/ContentMedia";
import { MediaBlock } from "./blocks/Media";
import Articles from "./collections/Articles";
import Badges from "./collections/Badges";
import Categories from "./collections/Categories";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import Projects from "./collections/Projects";
import Users from "./collections/User/Users";
import { Footer } from "./globals/Footer";
import { Header } from "./globals/Header";

const adapter = s3Adapter({
  config: {
    region: process.env.S3_REGION,
  },
  bucket: process.env.S3_BUCKET,
});

const editor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    BlocksFeature({
      blocks: [
        CodeBlock as LexicalBlock,
        MediaBlock as LexicalBlock,
        ContentMedia as LexicalBlock,
        Archive as LexicalBlock,
      ],
    }),
  ],
});

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  globals: [Header, Footer],
  editor,
  collections: [Pages, Projects, Articles, Categories, Media, Users, Badges],
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
    cloudStorage({
      enabled: process.env.NODE_ENV === "production",
      collections: {
        media: {
          adapter,
        },
      },
    }),
  ],
  db: mongooseAdapter({
    url:
      process.env.NODE_ENV === "production"
        ? `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:27017/cms?tls=true&tlsCAFile=global-bundle.pem&replicaSet=rs0&readPreference=primary&retryWrites=false`
        : process.env.DATABASE_URI,
  }),
  // `https://${process.env.FRONTEND_SUBDOMAIN}.${process.env.DOMAIN_NAME}`,
  cors: ["https://blogsite-frontend.jpnws.link", "http://localhost:5173"],
});
