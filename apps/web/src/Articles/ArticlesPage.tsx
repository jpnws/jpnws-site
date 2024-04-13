import Hero from "./Hero/Hero";

import styles from "./ArticlesPage.module.css";

const ArticlesPage = () => {
  return (
    <>
      <Hero />
      <main className={styles.projectsOuterContainer}>
        <div className={styles.projectsMain}></div>
      </main>
    </>
  );
};

export default ArticlesPage;
