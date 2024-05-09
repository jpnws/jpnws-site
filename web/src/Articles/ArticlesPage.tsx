import Hero from "./Hero";

import styles from "./ArticlesPage.module.css";
import FeaturedArticles from "./FeaturedArticles";
import OtherArticles from "./OtherArticles";
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const ArticlesPage = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <Hero />
      <main
        className={`${styles.container} ${
          theme === "dark" ? styles.containerDark : styles.containerLight
        }`}
      >
        <div className={styles.mainContainer}>
          <FeaturedArticles />
          <OtherArticles />
        </div>
      </main>
    </>
  );
};

export default ArticlesPage;
