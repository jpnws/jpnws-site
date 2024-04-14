import Hero from "./Hero/Hero";

import styles from "./ArticlesPage.module.css";
import FeaturedArticles from "./FeaturedArticles";

const ArticlesPage = () => {
  return (
    <>
      <Hero />
      <main className={styles.outerContainer}>
        <div className={styles.mainContainer}>
          <FeaturedArticles />
        </div>
      </main>
    </>
  );
};

export default ArticlesPage;
