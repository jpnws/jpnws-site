/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import type { SerializedListItemNode, SerializedListNode } from "@lexical/list";
import type { SerializedHeadingNode } from "@lexical/rich-text";
import type {
  LinkFields,
  SerializedLinkNode,
} from "@payloadcms/richtext-lexical";
import type {
  SerializedElementNode,
  SerializedLexicalNode,
  SerializedTextNode,
} from "lexical";

import escapeHTML from "escape-html";
import { Fragment } from "react";

import { Label } from "../../Label";
import { LargeBody } from "../../LargeBody";
import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from "./nodeFormat";

import { getHighlighter } from "shiki";
import { formatSlug } from "../../../utils";

import styles from "./index.module.css";

interface Props {
  nodes: SerializedLexicalNode[];
}

const highlighter = await getHighlighter({
  themes: ["github-dark"],
  langs: ["javascript", "jsx", "typescript", "tsx", "css", "html", "bash"],
});

interface SerializedUploadNode extends SerializedLexicalNode {
  type: "upload"; // Assumed custom type identifier
  value: { url: string };
}

interface SerializedBlockNode extends SerializedLexicalNode {
  type: "block";
  fields: {
    blockType: string;
    code: string;
    language: string;
    media: {
      url: string;
      alt: string;
    };
  };
}

function isSerializedUploadNode(
  node: SerializedLexicalNode,
): node is SerializedUploadNode {
  return "value" in node;
}

function isSerializedBlockNode(
  node: SerializedLexicalNode,
): node is SerializedBlockNode {
  return "fields" in node;
}

// function isSerializedLinkNode(
//   node: SerializedLexicalNode,
// ): node is SerializedLinkNode {
//   return "fields" in node;
// }

function isSerializedTextNode(node: any): node is SerializedTextNode {
  return node.type === "text";
}

export function serializeLexical({ nodes }: Props): JSX.Element {
  return (
    <Fragment>
      {nodes?.map((_node, index): JSX.Element | null => {
        if (_node.type === "text") {
          const node = _node as SerializedTextNode;

          let text: JSX.Element | string = (
            <span
              dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }}
              key={index}
            />
          );

          if (node.format & IS_BOLD) {
            text = <strong key={index}>{text}</strong>;
          }

          if (node.format & IS_ITALIC) {
            text = <em key={index}>{text}</em>;
          }

          if (node.format & IS_STRIKETHROUGH) {
            text = (
              <span key={index} style={{ textDecoration: "line-through" }}>
                {text}
              </span>
            );
          }

          if (node.format & IS_UNDERLINE) {
            text = (
              <span key={index} style={{ textDecoration: "underline" }}>
                {text}
              </span>
            );
          }

          if (node.format & IS_CODE) {
            const highlightedHtml = highlighter.codeToHtml(node.text, {
              theme: "github-dark",
              lang: "text",
            });

            text = (
              <span
                className={styles.inlineCode}
                key={index}
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              />
            );
          }

          if (node.format & IS_SUBSCRIPT) {
            text = <sub key={index}>{text}</sub>;
          }

          if (node.format & IS_SUPERSCRIPT) {
            text = <sup key={index}>{text}</sup>;
          }

          // Return the formatted text
          return text;
        }

        if (_node == null) {
          return null;
        }

        const serializedChildrenFn = (
          node: SerializedElementNode,
        ): JSX.Element | null => {
          if (node.children == null) {
            return null;
          } else {
            if (
              node?.type === "list" &&
              (node as SerializedListNode)?.listType === "check"
            ) {
              for (const item of node.children) {
                if ("checked" in item) {
                  if (!item?.checked) {
                    item.checked = false;
                  }
                }
              }
              return serializeLexical({ nodes: node.children });
            } else {
              return serializeLexical({ nodes: node.children });
            }
          }
        };

        const serializedChildren =
          "children" in _node
            ? serializedChildrenFn(_node as SerializedElementNode)
            : "";

        switch (_node.type) {
          case "linebreak": {
            return <br key={index} />;
          }

          case "paragraph": {
            return <p key={index}>{serializedChildren}</p>;
          }

          case "upload": {
            if (isSerializedUploadNode(_node)) {
              return (
                <video
                  src={`${import.meta.env.VITE_API_URL}${_node.value.url}`}
                  key={index}
                  loop
                  autoPlay
                />
              );
            }
            return null;
          }

          case "block": {
            if (isSerializedBlockNode(_node)) {
              if (_node.fields.blockType === "code") {
                const highlightedHtml = highlighter.codeToHtml(
                  _node.fields.code,
                  {
                    theme: "github-dark",
                    lang: `${_node.fields.language}`,
                  },
                );
                return (
                  <div
                    className={styles.componentCodeBlock}
                    dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                    key={index}
                  />
                );
              }

              if (_node.fields.blockType === "media") {
                return (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${_node.fields.media.url}`}
                    alt={_node.fields.media.alt}
                    key={index}
                  />
                );
              }
            }
            return null;
          }

          case "heading": {
            const node = _node as SerializedHeadingNode;
            type Heading = Extract<
              keyof JSX.IntrinsicElements,
              "h1" | "h2" | "h3" | "h4" | "h5"
            >;
            const Tag = node?.tag as Heading;

            if (node.children[0] && isSerializedTextNode(node.children[0])) {
              return (
                <Tag key={index} id={formatSlug(node.children[0].text)}>
                  {serializedChildren}
                </Tag>
              );
            }
            return null;
          }

          case "label":
            return <Label key={index}>{serializedChildren}</Label>;

          case "largeBody": {
            return <LargeBody key={index}>{serializedChildren}</LargeBody>;
          }

          case "list": {
            const node = _node as SerializedListNode;

            type List = Extract<keyof JSX.IntrinsicElements, "ol" | "ul">;
            const Tag = node?.tag as List;
            return (
              <Tag className={node?.listType} key={index}>
                {serializedChildren}
              </Tag>
            );
          }

          case "listitem": {
            const node = _node as SerializedListItemNode;

            if (node?.checked != null) {
              return (
                <li
                  aria-checked={node.checked ? "true" : "false"}
                  className={`component--list-item-checkbox ${
                    node.checked
                      ? "component--list-item-checkbox-checked"
                      : "component--list-item-checked-unchecked"
                  }`}
                  key={index}
                  role="checkbox"
                  tabIndex={-1}
                  value={node?.value}
                >
                  {serializedChildren}
                </li>
              );
            } else {
              return (
                <li key={index} value={node?.value}>
                  {serializedChildren}
                </li>
              );
            }
          }

          case "quote": {
            return <blockquote key={index}>{serializedChildren}</blockquote>;
          }

          case "link": {
            const node = _node as SerializedLinkNode;
            const fields: LinkFields = node.fields;
            if (fields.linkType === "custom") {
              return (
                <a
                  href={escapeHTML(fields.url)}
                  key={index}
                  {...(fields?.newTab
                    ? {
                        rel: "noopener noreferrer",
                        target: "_blank",
                      }
                    : {})}
                >
                  {serializedChildren}
                </a>
              );
            } else {
              return <span key={index}>Internal link coming soon</span>;
            }
          }

          default:
            return null;
        }
      })}
    </Fragment>
  );
}
