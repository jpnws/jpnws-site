import { Block } from "payload/types";

export const CodeBlock: Block = {
  slug: "code",
  interfaceName: "CodeBlock",
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
