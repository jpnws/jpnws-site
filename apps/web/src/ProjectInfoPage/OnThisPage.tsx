import { formatSlug } from "../utils";

import styles from "./OnThisPage.module.css";

const OnThisPage = ({ content }: { content: any }) => {
  const h2s = content.root.children.filter((item: any) => {
    return item.tag === "h2";
  });

  return (
    <nav>
      <ul className={styles.list}>
        {h2s &&
          h2s?.map((item: any, idx: number) => {
            return (
              <li className={styles.item} key={idx}>
                <a
                  className={styles.link}
                  href={`#${formatSlug(item.children[0].text)}`}
                >
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
