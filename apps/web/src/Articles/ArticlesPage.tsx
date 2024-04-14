import Hero from "./Hero";

import styles from "./ArticlesPage.module.css";
import FeaturedArticles from "./FeaturedArticles";
import OtherArticles from "./OtherArticles";

const ArticlesPage = () => {
  return (
    <>
      <Hero />
      <main className={styles.outerContainer}>
        <div className={styles.mainContainer}>
          <FeaturedArticles />
          <OtherArticles />
        </div>
      </main>
    </>
  );
};

export default ArticlesPage;
