import FeaturedProjects from "./FeaturedProjects";
import FeaturedArticles from "./FeaturedArticles";
import styles from "./HomePage.module.css";
import Hero from "./Hero";

const HomePage = () => {
  return (
    <>
      <Hero />
      <main className={styles.homeOuterContainer}>
        <div className={styles.homeMain}>
          <h2 className={styles.projectSectionTitle}>Projects</h2>
          <FeaturedProjects />
          <h2 className={styles.projectSectionTitle}>Articles</h2>
          <FeaturedArticles />
        </div>
      </main>
    </>
  );
};

export default HomePage;
