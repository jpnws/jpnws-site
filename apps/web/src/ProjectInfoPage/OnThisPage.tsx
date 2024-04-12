import { useEffect } from "react";
import { formatSlug } from "../utils";

import styles from "./OnThisPage.module.css";

const OnThisPage = ({ content }: { content: any }) => {
  const h2s = content?.root.children.filter((item: any) => {
    return item.tag === "h2";
  });

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    slug: string,
  ) => {
    event.preventDefault();

    const headerOffset = 80;
    const element = document.getElementById(slug);

    if (element) {
      const elementPosition =
        window.scrollY + element.getBoundingClientRect().top - headerOffset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
      window.history.pushState(null, "", `#${slug}`);
    }
  };

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {h2s &&
          h2s?.map((item: any, idx: number) => {
            const slug = formatSlug(item.children[0].text);
            return (
              <li className={styles.item} key={idx}>
                <a
                  className={styles.link}
                  href={`#${formatSlug(item.children[0].text)}`}
                  onClick={(e) => handleClick(e, slug)}
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
