import FeaturedProjects from "../FeaturedProjects/FeaturedProjects";
import FeaturedArticles from "./FeaturedArticles";
import styles from "./HomeMain.module.css";

const HomeMain = () => {
  return (
    <div className={styles.homeMain}>
      <h2 className={styles.projectSectionTitle}>Projects</h2>
      <FeaturedProjects />
      <h2 className={styles.projectSectionTitle}>Articles</h2>
      <FeaturedArticles />
    </div>
  );
};

export default HomeMain;