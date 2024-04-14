import Hero from "./Hero/Hero";

import styles from "./ArticlesPage.module.css";

const ArticlesPage = () => {
  return (
    <>
      <Hero />
      <main className={styles.outerContainer}>
        <div className={styles.mainContainer}></div>
      </main>
    </>
  );
};

export default ArticlesPage;
