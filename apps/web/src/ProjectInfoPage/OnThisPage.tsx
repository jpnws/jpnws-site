import React, { useEffect, useState, useRef } from "react";
import { formatSlug } from "../utils";
import styles from "./OnThisPage.module.css";

interface OnThisPageProps {
  content: {
    root: {
      children: Array<{
        tag: string;
        children: Array<{ text: string }>;
      }>;
    };
  };
}

const OnThisPage: React.FC<OnThisPageProps> = ({ content }) => {
  const [hash, setHash] = useState<string>("");
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const h2s = content?.root.children.filter((item) => item.tag === "h2") || [];

  useEffect(() => {
    sectionRefs.current = h2s.reduce(
      (acc, item) => {
        const slug = formatSlug(item.children[0].text);
        acc[slug] = document.getElementById(slug);
        return acc;
      },
      {} as { [key: string]: HTMLElement | null },
    );

    const handleScroll = () => {
      const headerOffset = 80;
      const scrollPosition = window.scrollY + headerOffset;
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;

      const visibleSection = Object.keys(sectionRefs.current).find((slug) => {
        const element = sectionRefs.current[slug];
        return (
          element &&
          element.offsetTop <= scrollPosition &&
          element.offsetTop + element.offsetHeight > scrollPosition
        );
      });

      if (nearBottom) {
        const lastSectionSlug = formatSlug(
          h2s[h2s.length - 1].children[0].text,
        );
        setHash(`#${lastSectionSlug}`);
        window.history.replaceState(null, "", `#${lastSectionSlug}`);
      } else if (visibleSection && `#${visibleSection}` !== hash) {
        setHash(`#${visibleSection}`);
        window.history.replaceState(null, "", `#${visibleSection}`);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hash, h2s]);

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    slug: string,
  ) => {
    event.preventDefault();
    const element = document.getElementById(slug);
    if (element) {
      const headerOffset = 80;
      const elementPosition =
        window.scrollY + element.getBoundingClientRect().top - headerOffset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
      setHash(`#${slug}`);
      window.history.pushState(null, "", `#${slug}`);
    }
  };

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {h2s.map((item, idx) => {
          const slug = formatSlug(item.children[0].text);
          const isActive = `#${slug}` === hash;
          return (
            <li
              className={`${styles.item} ${isActive ? styles.active : ""}`}
              key={idx}
            >
              <a
                className={`${styles.link} ${isActive ? styles.activeLink : ""}`}
                href={`#${slug}`}
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
