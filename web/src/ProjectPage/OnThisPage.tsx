import React from "react";

import { formatSlug } from "../utils";

import styles from "./OnThisPage.module.css";

interface Section {
  tag: string;
  children: Array<{ text: string }>;
}

interface OnThisPageProps {
  content: {
    root: {
      children: Array<Section>;
    };
  };
}

const OnThisPage: React.FC<OnThisPageProps> = ({ content }) => {
  const h2s = content?.root.children.filter((item) => item.tag === "h2") || [];

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {h2s.map((item, idx) => {
          const slug = formatSlug(item.children[0].text);
          return (
            <li className={styles.item} key={idx}>
              <a href={`#${slug}`} className={styles.link}>
                {item.children[0].text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default OnThisPage;
