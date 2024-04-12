import React, { useRef, useMemo } from "react";
import { Scrollspy } from "@makotot/ghostui";
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

  const sectionRefs = useMemo(
    () => h2s.map(() => React.createRef<HTMLDivElement>()),
    [h2s],
  );

  return (
    <nav className={styles.nav}>
      <Scrollspy sectionRefs={sectionRefs}>
        {({ currentElementIndexInViewport }) => (
          <ul className={styles.list}>
            {h2s.map((item, idx) => {
              const slug = formatSlug(item.children[0].text);
              return (
                <li
                  key={idx}
                  className={
                    currentElementIndexInViewport === idx ? styles.active : ""
                  }
                >
                  <a href={`#${slug}`} className={styles.link}>
                    {item.children[0].text}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </Scrollspy>
    </nav>
  );
};

export default OnThisPage;
