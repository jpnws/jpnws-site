import { Block } from "payload/types";

export const CodeBlock: Block = {
  slug: "code", // required
  interfaceName: "CodeBlock", // optional
  fields: [
    {
      name: "language",
      type: "text",
      required: true,
    },
    {
      name: "code",
      type: "code",
    },
  ],
};
