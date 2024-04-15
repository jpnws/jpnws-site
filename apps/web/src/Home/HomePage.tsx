import FeaturedProjects from "./FeaturedProjects";
import FeaturedArticles from "./FeaturedArticles";
import styles from "./HomePage.module.css";
import Hero from "./Hero";
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const HomePage = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <Hero />
      <main
        className={`${styles.container} ${theme === "dark" ? styles.containerDark : styles.containerLight}`}
      >
        <div className={styles.main}>
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
